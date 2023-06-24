export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      width="30"
      height="48"
      viewBox="0 0 30 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="24"
        height="35"
        rx="4"
        transform="matrix(0.965926 0.258819 0 1 0 0)"
        fill="#EF4444"
      />
      <rect
        width="24"
        height="35"
        rx="4"
        transform="matrix(0.965926 0.258819 0 1 6 6)"
        fill="#EFC944"
      />
    </svg>
  );
};
