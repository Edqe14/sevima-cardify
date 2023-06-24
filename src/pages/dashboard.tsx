import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { Button, LoadingOverlay } from '@mantine/core';
import Head from '@/components/Head';
import { Plus } from '@phosphor-icons/react';
import { openCreateCollectionModal } from '@/lib/helpers/openCreateCollectionModal';
import useSWR, { SWRConfig } from 'swr';
import { DefaultResponse } from '@/lib/api';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { RandomGradient } from '@/components/RandomGradient';
import { authOptions } from './api/auth/[...nextauth]';

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
        <Link key={collection.id} href={`/editor/${collection.id}`}>
          <section className="border rounded-md min-h-[4rem] h-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md">
            <RandomGradient className="w-full h-2" />
            <section className="p-6">
              <h2 className="text-xl mb-1 font-medium tracking-tight">
                {collection.name}
              </h2>
              <p className="text-sm text-zinc-400">
                Updated at{' '}
                {DateTime.fromJSDate(collection.updatedAt).toRelative()}
              </p>
            </section>
          </section>
        </Link>
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
