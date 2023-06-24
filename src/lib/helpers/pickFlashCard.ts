import type { Item } from '@prisma/client';

export type WrongList = { id: string; wrongCount: number }[];

export const pickFlashcardByWrongPicks = (
  items: Item[],
  wrongList: WrongList,
) => {
  const flashcards = structuredClone(items).map((item) => ({
    ...item,
    wrongPicks:
      wrongList.find((wrong) => wrong.id === item.id)?.wrongCount ?? 0,
  }));

  const weights = flashcards.map((card) => (card.wrongPicks + 1) ** 2);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let randomWeight = Math.random() * totalWeight;
  let index = 0;

  while (randomWeight > weights[index]) {
    randomWeight -= weights[index];
    index += 1;
  }

  return flashcards[index];
};
