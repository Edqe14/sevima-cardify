import { LoadingOverlay, Switch, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import useSWR from 'swr';
import type { Collection } from '@prisma/client';
import { ChangeEventHandler } from 'react';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { fetcher, type DefaultResponse } from '../api';

const ModalContent = ({ collectionId }: { collectionId: string }) => {
  const { copy } = useClipboard();
  const { data, isLoading, mutate } = useSWR<DefaultResponse<Collection>>(
    `/api/collection/${collectionId}`,
  );

  const updateVisibility: ChangeEventHandler<HTMLInputElement> = async (ev) => {
    await fetcher(`/api/collection/${collectionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        public: ev.target.checked,
      }),
    });

    mutate();
  };

  const viewUrl = new URL(
    `/view/${collectionId}`,
    // eslint-disable-next-line no-restricted-globals
    location.origin,
  ).toString();

  return (
    <section className="relative">
      <LoadingOverlay visible={isLoading} />

      <section className="flex justify-between mb-4">
        <p>Public collection</p>

        <Switch
          size="md"
          checked={data?.data?.public ?? false}
          onChange={updateVisibility}
        />
      </section>

      <TextInput
        label="Viewer URL"
        value={viewUrl}
        onClick={(ev) => {
          ev.currentTarget.select();

          copy(viewUrl);

          showNotification({
            title: 'Copied to clipboard',
            message: 'Collection URL copied to clipboard',
            color: 'yellow',
          });
        }}
        classNames={{
          input: 'text-zinc-500',
          label: 'text-red-500',
        }}
      />
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
