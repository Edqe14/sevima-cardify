import type { Item } from '@prisma/client';

export interface EditorCardProps {
  item: Item;
  collectionId: string;
}

export const EditorCard = ({ item }: EditorCardProps) => {
  return (
    <section className="border rounded-md p-4 mb-3">
      <p className="">{item.question}</p>
      <p className="">{item.answer}</p>
    </section>
  );
};
