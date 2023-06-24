import { confirmWithModal } from '@/lib/helpers/confirmModal';
import { ActionIcon, TextInput, Textarea } from '@mantine/core';
import { Trash } from '@phosphor-icons/react';
import type { Item } from '@prisma/client';
import { Draggable } from 'react-beautiful-dnd';
import { useSWRConfig } from 'swr';

export interface EditorCardProps {
  item: Item;
  collectionId: string;
  index: number;
}

export const EditorCard = ({ item, collectionId, index }: EditorCardProps) => {
  const { mutate } = useSWRConfig();

  const deleteItem = async () => {
    const confirm = await confirmWithModal({
      title: 'Are you sure?',
      children: <p>This action is irreversible.</p>,
      confirmProps: {
        color: 'red',
      },
    });

    if (!confirm) return;

    await fetch(`/api/collection/${collectionId}/item/${item.id}`, {
      method: 'DELETE',
    });

    Promise.all([
      mutate(`/api/collection/${collectionId}`),
      mutate(`/api/collection/${collectionId}/item`),
    ]);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <section
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          id={item.id}
          className="border rounded-md p-4 mb-6 transition-all duration-200 shadow hover:shadow-md"
        >
          <section className="flex items-center justify-between mb-2">
            <h2 className="text-blue-500 font-semibold">
              Question {index + 1}
            </h2>

            <section>
              <ActionIcon onClick={deleteItem} color="red" variant="light">
                <Trash />
              </ActionIcon>
            </section>
          </section>

          <TextInput
            className="mb-3"
            classNames={{
              input: 'focus:bg-blue-50',
            }}
            value={item.question}
          />
          <Textarea
            label="Answer"
            minRows={5}
            classNames={{
              label: 'text-green-500',
              input: 'focus:border-green-500 focus:bg-green-50',
            }}
            value={item.answer}
          />
        </section>
      )}
    </Draggable>
  );
};
