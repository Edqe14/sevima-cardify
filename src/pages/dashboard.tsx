import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import type { Collection } from '@prisma/client';
import { Button } from '@mantine/core';
import Head from '@/components/Head';
import { Plus } from '@phosphor-icons/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard({
  collections,
}: {
  collections: Collection[];
}) {
  return (
    <>
      <Head title="Dashboard" />
      <Navbar />

      <main className="p-8">
        <Button leftIcon={<Plus />} className="mb-6">
          Create
        </Button>

        <section className="grid grid-cols-5">
          {collections.length === 0 && (
            <p className="text-zinc-500">Your collections will show here</p>
          )}
        </section>
      </main>
    </>
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
