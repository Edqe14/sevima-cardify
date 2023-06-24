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

  // Calculate the weights based on the wrong picks count
  const weights = flashcards.map((card) => 1 / (card.wrongPicks + 1) ** 2);

  // Calculate the sum of all weights
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Generate a random number between 0 and the total weight
  const randomWeight = Math.random() * totalWeight;

  // Find the index corresponding to the random weight
  let cumulativeWeight = 0;
  let index = -1;

  while (cumulativeWeight < randomWeight && index < flashcards.length - 1) {
    index += 1;
    cumulativeWeight += weights[index];
  }

  // If all weights are zero, return the first flashcard
  if (index === -1) {
    return flashcards[0];
  }

  // Return the flashcard at the selected index
  return flashcards[index];
};
