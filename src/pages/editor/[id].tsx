import { prisma } from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { Collection, Item } from '@prisma/client';
import Head from '@/components/Head';
import { Navbar } from '@/components/Navbar';
import useSWR, { SWRConfig } from 'swr';
import { fetcher, type DefaultResponse } from '@/lib/api';
import { Button, LoadingOverlay } from '@mantine/core';
import { TextEditor } from '@/components/TextEditor';
import { useRef, useState } from 'react';
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
import { CaretLeft, Share } from '@phosphor-icons/react';
import { openSharingModal } from '@/lib/helpers/openSharingModal';
import clsx from 'clsx';
import { authOptions } from '../api/auth/[...nextauth]';

interface Data {
  id: string;
  collection: Collection & {
    items: Item[];
  };
}

const EditorDisplay = ({ collectionId }: { collectionId: string }) => {
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, mutate } = useSWR<
    DefaultResponse<Data['collection']>
  >(`/api/collection/${collectionId}`);

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

    setSaving(false);
  }, 500);

  const generateFlashCard = async () => {
    if (!data) return;

    if (data.data?.items && data.data.items.length > 0) {
      const confirm = await confirmWithModal({
        title: 'Are you sure?',
        children: (
          <p>
            This action is destructive (will remove your old flash cards) and
            generate new ones.
          </p>
        ),
      });

      if (!confirm) return;
    }

    setGenerating(true);

    await fetcher(`/api/collection/${collectionId}/generate?confirm=1`, {
      method: 'POST',
    });

    setGenerating(false);

    await mutate();
  };

  const createEmptyCard = async () => {
    await fetcher(`/api/collection/${collectionId}/item`, {
      method: 'POST',
    });

    await mutate();

    if (cardsRef.current) {
      cardsRef.current.scrollTop = cardsRef.current.scrollHeight;
    }
  };

  const toggleDrawer = () => setOpenDrawer((prev) => !prev);

  const items = data?.data?.items ?? [];

  const onDragEnd: OnDragEndResponder = async (result) => {
    if (!result.destination) return;

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    newItems.forEach((item, i) => {
      // eslint-disable-next-line no-param-reassign
      item.order = i;
    });

    const changed = newItems.filter((old, i) => items[i].id !== old.id);

    setUpdating(result.draggableId);

    await fetcher(`/api/collection/${collectionId}/item/reorder`, {
      method: 'PUT',
      body: JSON.stringify(changed),
    });

    await mutate();

    setUpdating(null);
  };

  return (
    <section className="grid flex-grow grid-cols-6 overflow-hidden relative">
      {isLoading && <LoadingOverlay visible={isLoading} />}

      <section className="col-span-full lg:col-span-2 overflow-hidden flex flex-col">
        <section
          className={`flex px-6 py-[10px] h-[47px] ${
            items.length === 0 ? 'justify-between' : 'justify-end'
          } items-center border-b`}
        >
          {items.length === 0 && (
            <p className="text-zinc-500">Your flash cards will show here</p>
          )}

          <Button onClick={createEmptyCard}>Create Card</Button>
        </section>

        <section className="overflow-y-auto p-6" ref={cardsRef}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="cards">
              {(provided) => (
                <section {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, i) => (
                    <EditorCard
                      key={item.id}
                      item={item}
                      index={i}
                      collectionId={collectionId}
                      updating={updating === item.id}
                    />
                  ))}

                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      </section>

      <span
        className={clsx(
          'block bg-zinc-900 absolute inset-0 lg:hidden transition-opacity duration-200',
          openDrawer
            ? 'opacity-50 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={toggleDrawer}
      />

      <section
        className={clsx(
          'border-l col-span-4 flex flex-col overflow-hidden absolute top-0 right-0 z-10 h-full w-full md:w-[42rem] lg:w-auto lg:relative transition-all duration-300',
          openDrawer ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        )}
      >
        <LoadingOverlay visible={generating} className="pointer-events-auto" />

        <TextEditor
          className="relative"
          content={data?.data?.document as object}
          onUpdate={save}
          saving={saving}
          generating={generating}
          onGenerate={generateFlashCard}
          showGenerate
        />
      </section>

      <span
        onClick={toggleDrawer}
        className="cursor-pointer fixed rounded-full bottom-8 right-12 grid place-items-center z-50 lg:hidden lg:scale-0 bg-red-500 w-12 h-12"
      >
        <CaretLeft
          className={clsx(
            'text-white transition-all duration-200 ease-in-out',
            openDrawer && 'rotate-180',
          )}
          weight="bold"
          size={20}
        />
      </span>
    </section>
  );
};

const NavbarRight = ({ collectionId }: { collectionId: string }) => {
  return (
    <>
      <Button
        color="yellow"
        variant="outline"
        onClick={() => openSharingModal(collectionId)}
        leftIcon={<Share />}
      >
        Sharing
      </Button>
    </>
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
      <Navbar rightSide={<NavbarRight collectionId={id} />} />

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
    include: {
      items: true,
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
