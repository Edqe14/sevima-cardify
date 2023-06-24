/* eslint-disable @next/next/no-img-element */
import Head from '@/components/Head';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Gradient } from '@/components/Gradient';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  return (
    <>
      <Head />
      <Navbar authenticated={status === 'authenticated'} />

      <section className="flex flex-col flex-grow items-center pt-36 relative">
        <h1 className="text-4xl md:text-6xl font-semibold w-80 md:w-[40rem] text-center leading-normal tracking-tight mb-8 text-zinc-800">
          <span className="bg-yellow-300">AI.</span> Powered{' '}
          <span className="bg-yellow-300 text-red-500">Flash Card</span>{' '}
          Generator
          <span className="text-red-500">.</span>
        </h1>

        <p className="text-center text-zinc-500 mb-16">
          Generate flash cards from your content.
        </p>

        <Button
          onClick={() => {
            if (status === 'authenticated') return router.push('/dashboard');

            return signIn('google');
          }}
        >
          Get Started
        </Button>

        <Gradient className="absolute bottom-0 z-[-1] h-2/4 opacity-50" />
      </section>
    </>
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
