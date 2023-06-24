/* eslint-disable @next/next/no-img-element */
import Head from '@/components/Head';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
  const { data, status } = useSession();

  return (
    <main className="p-8">
      <Head />

      {status === 'loading' && <p>Loading...</p>}
      {status === 'authenticated' && (
        <>
          <section className="flex items-center gap-4 mb-3">
            <img
              src={data?.user?.image as string}
              alt="pp"
              className="w-12 rounded-full"
              referrerPolicy="no-referrer"
            />
            <p className="mb-2">
              Signed in as{' '}
              <span className="font-medium">{data?.user?.email}</span>
            </p>
          </section>

          <section className="gap-2 flex">
            <Button color="red" onClick={() => signOut()}>
              Sign out
            </Button>

            <Button
              onClick={() =>
                modals.open({
                  centered: true,
                  title: 'Shhh..',
                  children: <p>This is a secret</p>,
                })
              }
            >
              Secret Modal
            </Button>
          </section>
        </>
      )}

      {status === 'unauthenticated' && (
        <>
          <p className="mb-3">Not signed in.</p>
          <Button onClick={() => signIn('google')}>Sign in</Button>
        </>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
};
