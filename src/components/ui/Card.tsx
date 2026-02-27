import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'highlighted';
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', accentColor, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl transition-all',
        variant === 'default' && 'bg-white border border-slate-200 shadow-sm',
        variant === 'dark' && 'bg-slate-900 border border-slate-700 text-white',
        variant === 'highlighted' && `bg-white border border-slate-200 shadow-sm border-l-4 border-l-${accentColor || 'med-red'}`,
        onClick && 'cursor-pointer hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  );
}
