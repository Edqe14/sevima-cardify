import { prisma } from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { Collection, Item } from '@prisma/client';
import Head from '@/components/Head';
import { Navbar } from '@/components/Navbar';
import { SWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { type DefaultResponse } from '@/lib/api';
import { Button, LoadingOverlay, Progress } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from '@/lib/helpers/sleep';
import { Pencil, XCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FlipCard } from '@/components/FlipCard';
import {
  pickFlashcardByWrongPicks,
  type WrongList,
} from '@/lib/helpers/pickFlashCard';
import { authOptions } from '../api/auth/[...nextauth]';

interface Data {
  id: string;
  forbidden?: boolean;
  collection?: Collection & {
    items: Item[];
  };
}

const FlashCard = ({ collectionId }: { collectionId: string }) => {
  const [pickedItem, setPickedItem] = useState<Item | null>(null);
  const [totalPicks, setTotalPicks] = useState(0);
  const [totalWrongPicks, setTotalWrongPicks] = useState(0);
  const { data, isLoading } = useSWRImmutable<
    DefaultResponse<Data['collection']>
  >(`/api/collection/${collectionId}`);

  const items = data?.data?.items;
  const picks = useRef<WrongList>([]);

  const incrementTotal = () => {
    setTotalPicks((prev) => prev + 1);
    setTotalWrongPicks(
      picks.current.reduce((acc, item) => acc + item.wrongCount, 0),
    );
  };
  const pickRandom = useCallback(() => {
    if (!items) return;

    const random = pickFlashcardByWrongPicks(items, picks.current);

    setPickedItem(random);

    return random;
  }, [items]);

  useEffect(() => {
    if (items) pickRandom();
  }, [items, pickRandom]);

  const markWrong = async () => {
    if (!pickedItem) return;

    const index = picks.current.findIndex((item) => item.id === pickedItem.id);

    if (index !== -1) {
      const item = picks.current[index];
      item.wrongCount += 1;
    } else {
      picks.current.push({ id: pickedItem.id, wrongCount: 1 });
    }

    await sleep(200);

    pickRandom();
    incrementTotal();
  };

  const markCorrect = async () => {
    if (!pickedItem) return;

    const index = picks.current.findIndex((item) => item.id === pickedItem.id);

    if (index !== -1) {
      const item = picks.current[index];
      item.wrongCount = Math.max(0, item.wrongCount - 1);
    }

    await sleep(200);

    pickRandom();
    incrementTotal();
  };

  return (
    <section className="flex-grow flex flex-col items-center justify-center">
      <LoadingOverlay visible={isLoading} />

      {pickedItem && (
        <>
          <FlipCard
            total={totalPicks}
            question={pickedItem.question}
            answer={pickedItem.answer}
            onWrong={markWrong}
            onCorrect={markCorrect}
            className="mb-24 -mt-16 lg:-mt-8"
          />

          <section className="w-64 sm:w-80 md:w-96 flex flex-col items-center gap-3">
            <Progress
              color="green"
              value={
                totalPicks === 0
                  ? 100
                  : ((totalPicks - totalWrongPicks) / totalPicks) * 100
              }
              className="w-full bg-red-500"
              classNames={{
                bar: 'transition-all duration-500 ease-in-out',
              }}
            />
            <p className="text-zinc-600 font-medium">Correctness %</p>
          </section>
        </>
      )}
    </section>
  );
};

const NavbarRight = ({ collection }: { collection?: Collection }) => {
  const { data } = useSession();

  return (
    <>
      {collection && data && collection?.userId === data?.user?.id && (
        <Link href={`/editor/${collection?.id}`}>
          <Button color="yellow" variant="outline" leftIcon={<Pencil />}>
            Edit
          </Button>
        </Link>
      )}
    </>
  );
};

export default function Viewer({ id, collection, forbidden }: Data) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/collection/${id}`]: { data: collection },
        },
      }}
    >
      <Head
        title={
          forbidden || !collection ? 'Oops...' : `Viewing ${collection.name}`
        }
      />
      <Navbar rightSide={<NavbarRight collection={collection} />} />

      {!forbidden && collection && <FlashCard collectionId={id} />}

      {forbidden && (
        <section className="flex items-center flex-col flex-grow justify-center -mt-48">
          <XCircle weight="fill" size={128} className="text-red-500 mb-4" />
          <h1 className="text-lg font-medium mb-8 w-72 text-center">
            You are not allowed to view this collection
          </h1>

          <Link href="/dashboard">
            <Button>Go back</Button>
          </Link>
        </section>
      )}
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const id = context.query.id as string;

  const collection = await prisma.collection.findFirst({
    where: {
      id,
    },
    include: {
      items: true,
      accessLists: true,
    },
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  if (
    (!session && !collection.public) ||
    (session &&
      session.user.id !== collection.userId &&
      !collection.accessLists.find(
        (list) => list.email === session.user.email,
      ) &&
      !collection.public)
  ) {
    return {
      props: {
        id,
        forbidden: true,
      },
    };
  }

  return {
    props: {
      id,
      session,
      collection,
      forbidden: false,
    },
  };
};
