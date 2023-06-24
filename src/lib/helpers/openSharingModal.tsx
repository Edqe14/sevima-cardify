import { Switch, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import useSWR from 'swr';
import type { Collection } from '@prisma/client';
import type { DefaultResponse } from '../api';

const ModalContent = ({ collectionId }: { collectionId: string }) => {
  const { data, isLoading, mutate } = useSWR<DefaultResponse<Collection>>(
    `/api/collection/${collectionId}`,
  );

  return (
    <section>
      <section className="flex justify-between mb-4">
        <p>Public collection</p>

        <Switch size="md" checked={data?.data?.public ?? false} />
      </section>

      <TextInput label="Public URL" />
    </section>
  );
};

export const openSharingModal = (collectionId: string) => {
  return openModal({
    title: 'Share collection',
    size: 'sm',
    children: <ModalContent collectionId={collectionId} />,
  });
};
