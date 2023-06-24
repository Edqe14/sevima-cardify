import clsx from 'clsx';

const startClassNames = [
  'from-blue-400',
  'from-green-400',
  'from-yellow-400',
  'from-red-400',
  'from-pink-400',
  'from-purple-400',
];

const endClassNames = [
  'to-blue-400',
  'to-green-400',
  'to-yellow-400',
  'to-red-400',
  'to-pink-400',
  'to-purple-400',
];

export const RandomGradient = ({ className }: { className?: string }) => {
  const start =
    startClassNames[Math.floor(Math.random() * startClassNames.length)];
  const end = endClassNames[Math.floor(Math.random() * endClassNames.length)];

  return (
    <span className={clsx('block bg-gradient-to-br', start, end, className)} />
  );
};
