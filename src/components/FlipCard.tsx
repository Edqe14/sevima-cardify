import clsx from 'clsx';
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import ReactCardFlip from 'react-card-flip';

const Card = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) => (
  <section
    {...props}
    className={clsx('w-[32rem] h-[18rem] border rounded-lg', props.className)}
  />
);

export interface FlipCardProps {
  question: string;
  answer: string;
}

export const FlipCard = ({ question, answer }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  return (
    <ReactCardFlip isFlipped={flipped} containerClassName="-mt-16">
      <Card onClick={toggle} className="bg-blue-400">
        {question}
      </Card>
      <Card onClick={toggle}>{answer}</Card>
    </ReactCardFlip>
  );
};
