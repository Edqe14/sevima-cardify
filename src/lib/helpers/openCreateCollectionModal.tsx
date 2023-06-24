import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { generate } from 'random-words';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { Collection } from '@prisma/client';
import { showNotification } from '@mantine/notifications';
import { DefaultResponse, fetcher } from '../api';

const ModalContent = ({ modalId }: { modalId: string }) => {
  const router = useRouter();
  const generatedName = useMemo(() => generate(3).join(' '), []);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
    },
    transformValues(values) {
      // eslint-disable-next-line no-param-reassign
      values.name = values.name.trim() || generatedName;

      return values;
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    setLoading(true);

    try {
      const res = await fetcher<DefaultResponse<Collection>>(
        '/api/collection',
        {
          method: 'POST',
          body: JSON.stringify(values),
        },
      );

      setLoading(false);

      if (res.error || !res.data) {
        form.setFieldError('name', 'Invalid name');
        return;
      }

      router.push(`/editor/${res.data.id}`);
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

  return (
    <section>
      <form onSubmit={onSubmit}>
        <TextInput
          className="mb-2"
          label="Name"
          placeholder={generatedName}
          disabled={loading}
          {...form.getInputProps('name')}
        />

        <section className="flex justify-end">
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </section>
      </form>
    </section>
  );
};

export const openCreateCollectionModal = (id = 'create-collection') => {
  return openModal({
    modalId: id,
    title: 'Create Collection',
    size: 'sm',
    children: <ModalContent modalId={id} />,
  });
};
