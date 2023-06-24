import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { ActionIcon, Button, LoadingOverlay } from '@mantine/core';
import Head from '@/components/Head';
import { DotsThree, Plus } from '@phosphor-icons/react';
import { openCreateCollectionModal } from '@/lib/helpers/openCreateCollectionModal';
import useSWR, { SWRConfig } from 'swr';
import { DefaultResponse } from '@/lib/api';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { RandomGradient } from '@/components/RandomGradient';
import { openEditCollectionModal } from '@/lib/helpers/openEditCollectionModal';
import { useInterval } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';

const Card = ({ collection }: { collection: Collection }) => {
  const date = useMemo(
    () => DateTime.fromJSDate(collection.updatedAt),
    [collection.updatedAt],
  );
  const [relative, setRelative] = useState<string | null>(date.toRelative());

  const update = useCallback(() => setRelative(date.toRelative()), [date]);

  const { start, stop } = useInterval(update, 1000);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  useEffect(() => {
    update();
  }, [update, collection.updatedAt]);

  const gradient = useMemo(() => <RandomGradient className="w-full h-2" />, []);

  return (
    <Link href={`/editor/${collection.id}`}>
      <section className="border rounded-md min-h-[4rem] h-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md">
        {gradient}

        <section className="p-6">
          <section className="flex justify-between items-center">
            <h2 className="text-xl mb-1 font-medium tracking-tight">
              {collection.name}
            </h2>

            <ActionIcon
              variant="light"
              onClickCapture={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();

                openEditCollectionModal(collection);
              }}
              color="gray"
            >
              <DotsThree size={24} />
            </ActionIcon>
          </section>

          <p className="text-sm text-zinc-400">Updated at {relative}.</p>
        </section>
      </section>
    </Link>
  );
};

const Collections = () => {
  const { data, isLoading } =
    useSWR<DefaultResponse<Collection[]>>('/api/collection');

  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative">
      {isLoading && <LoadingOverlay visible={isLoading} />}

      {data?.data?.length === 0 && (
        <p className="text-zinc-500">Your collections will show here</p>
      )}

      {data?.data?.map((collection) => (
        <Card collection={collection} key={collection.id} />
      ))}
    </section>
  );
};

export default function Dashboard({
  collections,
}: {
  collections: Collection[];
}) {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/collection': { data: collections },
        },
      }}
    >
      <Head title="Dashboard" />
      <Navbar />

      <main className="p-8">
        <Button
          onClick={() => openCreateCollectionModal()}
          leftIcon={<Plus />}
          className="mb-6"
        >
          Create
        </Button>

        <Collections />
      </main>
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return {
    props: {
      session,
      collections,
    },
  };
};
