import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { generate } from 'random-words';
import { useMemo, useState } from 'react';
import type { Collection } from '@prisma/client';
import { showNotification } from '@mantine/notifications';
import { useSWRConfig } from 'swr';
import { DefaultResponse, fetcher } from '../api';
import { confirmWithModal } from './confirmModal';

const ModalContent = ({
  modalId,
  collection,
}: {
  modalId: string;
  collection: Collection;
}) => {
  const { mutate } = useSWRConfig();
  const generatedName = useMemo(() => (generate(3) as string[]).join(' '), []);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: collection.name,
    },
    transformValues(values) {
      // eslint-disable-next-line no-param-reassign
      values.name = values.name.trim() || collection.name;

      return values;
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    setLoading(true);

    try {
      const res = await fetcher<DefaultResponse<Collection>>(
        `/api/collection/${collection.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(values),
        },
      );

      if (res.error) {
        form.setFieldError('name', 'Invalid name');
        setLoading(false);

        return;
      }

      await mutate('/api/collection');

      setLoading(false);
      closeModal(modalId);
    } catch {
      setLoading(false);

      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Something went wrong',
      });
    }
  });

  const deleteCollection = async () => {
    const confirm = await confirmWithModal({
      title: 'Are you sure?',
      children: <p>This action is irreversible.</p>,
      confirmProps: {
        color: 'red',
      },
    });

    if (!confirm) return;

    setLoading(true);

    await fetcher(`/api/collection/${collection.id}`, {
      method: 'DELETE',
    });

    await mutate('/api/collection');

    setLoading(false);
    closeModal(modalId);
  };

  return (
    <section>
      <form onSubmit={onSubmit} className="mb-4">
        <TextInput
          className="mb-2"
          label="Name"
          placeholder={generatedName}
          disabled={loading}
          {...form.getInputProps('name')}
        />

        <section className="flex justify-end gap-3">
          <Button
            type="button"
            color="red"
            variant="outline"
            disabled={loading}
            onClick={() => closeModal(modalId)}
          >
            Cancel
          </Button>

          <Button type="submit" loading={loading}>
            Edit
          </Button>
        </section>
      </form>

      <section>
        <h2 className="text-red-500 font-semibold mb-3">Danger Zone</h2>

        <Button color="red" onClick={deleteCollection}>
          Delete Collection
        </Button>
      </section>
    </section>
  );
};

export const openEditCollectionModal = (
  collection: Collection,
  id = 'create-collection',
) => {
  return openModal({
    modalId: id,
    title: 'Edit Collection',
    size: 'sm',
    children: <ModalContent modalId={id} collection={collection} />,
  });
};
