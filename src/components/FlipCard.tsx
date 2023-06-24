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
      'w-[35rem] min-h-[20rem] border rounded-lg flex flex-col items-center justify-center text-2xl p-8 font-semibold text-center relative',
      props.className,
    )}
  />
);

export interface FlipCardProps {
  className?: string;
  question: string;
  answer: string;
  onWrong?: () => void;
  onCorrect?: () => void;
}

export const FlipCard = ({
  className,
  question,
  answer,
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
        {question}
      </Card>

      <Card
        onClick={toggle}
        className="bg-yellow-500 text-yellow-900 border-yellow-600 cursor-pointer"
      >
        {answer}

        <XCircle
          className="absolute text-red-500 -left-32 cursor-pointer z-20"
          size={64}
          weight="fill"
          onClick={() => onWrong()}
        />

        <CheckCircle
          className="absolute text-green-500 -right-32 cursor-pointer z-20"
          size={64}
          weight="fill"
          onClick={() => onCorrect()}
        />
      </Card>
    </ReactCardFlip>
  );
};
