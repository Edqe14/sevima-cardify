import { Button } from '@mantine/core';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { noop } from 'lodash-es';
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import ReactCardFlip from 'react-card-flip';

const Card = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) => (
  <section
    {...props}
    className={clsx(
      'w-[20rem] min-h-[12rem] sm:w-[25rem] sm:min-h-[15rem] md:w-[35rem] md:min-h-[20rem]',
      'border rounded-lg flex flex-col items-center justify-center text-base sm:text-xl md:text-2xl p-8 font-semibold text-center relative',
      props.className,
    )}
  />
);

export interface FlipCardProps {
  className?: string;
  question: string;
  answer: string;
  total?: number;
  onWrong?: () => void;
  onCorrect?: () => void;
}

export const FlipCard = ({
  className,
  question,
  answer,
  total,
  onWrong = noop,
  onCorrect = noop,
}: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((prev) => !prev);

  return (
    <ReactCardFlip isFlipped={flipped} containerClassName={className}>
      <Card
        onClick={toggle}
        className="bg-blue-500 text-blue-50 border-blue-600 cursor-pointer"
      >
        <span className="absolute top-4 left-4 text-lg text-blue-300 font-medium">
          {total}
        </span>

        {question}

        <Button className="absolute -bottom-64 block md:hidden">Flip</Button>
      </Card>

      <Card
        onClick={toggle}
        className="bg-yellow-500 text-yellow-900 border-yellow-600 cursor-pointer"
      >
        {answer}

        <XCircle
          className="absolute text-red-500 -bottom-64 left-12 lg:bottom-[unset] lg:-left-32 cursor-pointer z-20"
          size={64}
          weight="fill"
          onClick={() => onWrong()}
        />

        <CheckCircle
          className="absolute text-green-500 -bottom-64 right-12 lg:bottom-[unset] lg:-right-32 cursor-pointer z-20"
          size={64}
          weight="fill"
          onClick={() => onCorrect()}
        />
      </Card>
    </ReactCardFlip>
  );
};
