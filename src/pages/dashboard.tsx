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
import { authOptions } from './api/auth/[...nextauth]';

const Collections = () => {
  const { data, isLoading } =
    useSWR<DefaultResponse<Collection[]>>('/api/collection');

  return (
    <section className="grid grid-cols-5 gap-3 relative">
      {isLoading && <LoadingOverlay visible={isLoading} />}

      {data?.data?.length === 0 && (
        <p className="text-zinc-500">Your collections will show here</p>
      )}

      {data?.data?.map((collection) => (
        <Link key={collection.id} href={`/editor/${collection.id}`}>
          <section className="border rounded-md flex items-center justify-center min-h-[4rem] cursor-pointer transition-all duration-200 hover:shadow-md">
            {collection.name}
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
