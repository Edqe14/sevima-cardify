import { prisma } from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { Collection, Item } from '@prisma/client';
import Head from '@/components/Head';
import { Navbar } from '@/components/Navbar';
import { SWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { fetcher, type DefaultResponse } from '@/lib/api';
import { Button, LoadingOverlay } from '@mantine/core';
import { TextEditor } from '@/components/TextEditor';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Editor as EditorType } from '@tiptap/react';
import { sleep } from '@/lib/helpers/sleep';
import { confirmWithModal } from '@/lib/helpers/confirmModal';
import { EditorCard } from '@/components/editor/Card';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { reorder } from '@/lib/helpers/reorder';
import { Pencil, Share, X, XCircle } from '@phosphor-icons/react';
import { openSharingModal } from '@/lib/helpers/openSharingModal';
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
  const { data, isLoading } = useSWRImmutable<
    DefaultResponse<Data['collection']>
  >(`/api/collection/${collectionId}`);

  const items = data?.data?.items;
  const picks = useRef<WrongList>([]);

  useEffect(() => {
    if (items) {
      const random = pickFlashcardByWrongPicks(items, picks.current);

      setPickedItem(random);
    }
  }, [items]);

  return (
    <section className="flex-grow flex items-center justify-center">
      <LoadingOverlay visible={isLoading} />

      {pickedItem && (
        <FlipCard question={pickedItem.question} answer={pickedItem.answer} />
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
    (session && session.user.id !== collection.userId && !collection.public) ||
    (session &&
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
