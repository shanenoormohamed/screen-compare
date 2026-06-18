import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

type ActionButtonProps = {
  className: string;
  onClick: (event: MouseEvent<HTMLSpanElement>) => void;
  children: ReactNode;
};

export function ActionButton({
  className,
  onClick,
  children,
}: ActionButtonProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={className}
      onClick={onClick}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event as unknown as MouseEvent<HTMLSpanElement>);
        }
      }}
    >
      {children}
    </span>
  );
}
