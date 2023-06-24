import {
  Badge,
  LoadingOverlay,
  MultiSelect,
  Switch,
  TextInput,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import useSWR from 'swr';
import type { Collection } from '@prisma/client';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { string } from 'zod';
import { fetcher, type DefaultResponse } from '../api';

const ModalContent = ({ collectionId }: { collectionId: string }) => {
  const { copy } = useClipboard();
  const { data, isLoading, mutate } = useSWR<DefaultResponse<Collection>>(
    `/api/collection/${collectionId}`,
  );

  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading || !data) return;

    setUsers((data.data?.accessList as string[]) ?? []);
  }, [data, isLoading]);

  const updateVisibility: ChangeEventHandler<HTMLInputElement> = async (ev) => {
    await fetcher(`/api/collection/${collectionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        public: ev.target.checked,
        accessList: users,
      }),
    });

    mutate();
  };

  const updateAccess = async (value?: string[]) => {
    await fetcher(`/api/collection/${collectionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        accessList: value ?? users,
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

      <MultiSelect
        label="Access List"
        description="User Emails"
        className="mb-3"
        clearable
        creatable
        searchable
        data={users}
        value={users}
        getCreateLabel={(query) => (
          <p>
            + Create <Badge color="teal">{query}</Badge>
          </p>
        )}
        onChange={(value) => {
          setUsers(value);
          updateAccess(value);
        }}
        onCreate={(query) => {
          if (!string().email().safeParse(query).success) {
            return;
          }

          setUsers((current) => {
            const newAccess = [...current, query];

            updateAccess(newAccess);

            return newAccess;
          });

          return query;
        }}
      />

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
