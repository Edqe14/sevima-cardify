import { prisma } from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { Collection } from '@prisma/client';
import Head from '@/components/Head';
import { Navbar } from '@/components/Navbar';
import useSWR, { SWRConfig } from 'swr';
import { fetcher, type DefaultResponse } from '@/lib/api';
import { LoadingOverlay } from '@mantine/core';
import { TextEditor } from '@/components/TextEditor';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { Editor as EditorType } from '@tiptap/react';
import { sleep } from '@/lib/helpers/sleep';
import { authOptions } from '../api/auth/[...nextauth]';

interface Data {
  id: string;
  collection: Collection;
}

const EditorDisplay = ({ collectionId }: { collectionId: string }) => {
  const [saving, setSaving] = useState(false);
  const { data, isLoading } = useSWR<DefaultResponse<Collection>>(
    `/api/collection/${collectionId}`,
  );

  const save = useDebouncedCallback(async (editor: EditorType) => {
    setSaving(true);

    await Promise.all([
      fetcher(`/api/collection/${collectionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          document: editor.getJSON(),
        }),
      }),
      sleep(300),
    ]);

    console.log('save to db', editor);
    setSaving(false);
  }, 500);

  return (
    <section className="grid flex-grow grid-cols-5 overflow-hidden">
      {isLoading && <LoadingOverlay visible={isLoading} />}

      <section className="col-span-2">one</section>
      <section className="border-l col-span-3 flex flex-col overflow-hidden">
        <TextEditor
          content={data?.data?.document as object}
          onUpdate={save}
          saving={saving}
          onGenerate={() => console.log('generate')}
          showGenerate
        />
      </section>
    </section>
  );
};

export default function Editor({ id, collection }: Data) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/collection/${id}`]: { data: collection },
        },
      }}
    >
      <Head title={`Editing ${collection.name}`} />
      <Navbar />

      <EditorDisplay collectionId={id} />
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  const id = context.query.id as string;

  const collection = await prisma.collection.findFirst({
    where: {
      id,
    },
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  if (session.user.id !== collection.userId) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: true,
      },
    };
  }

  return {
    props: {
      id,
      session,
      collection,
    },
  };
};
