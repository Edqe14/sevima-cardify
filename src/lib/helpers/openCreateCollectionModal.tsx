import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { generate } from 'random-words';
import { useMemo, useState } from 'react';

const ModalContent = () => {
  const generatedName = useMemo(() => generate(3).join('-'), []);
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

  const onSubmit = form.onSubmit((values) => {
    console.log(values);
    setLoading(true);
  });

  return (
    <section>
      <form onSubmit={onSubmit}>
        <TextInput
          className="mb-4"
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

export const openCreateCollectionModal = (id?: string) => {
  return openModal({
    modalId: id ?? 'create-collection',
    title: 'Create Collection',
    size: 'sm',
    children: <ModalContent />,
  });
};
