import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'blue' | 'gold' | 'green';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full',
        variant === 'default' && 'bg-slate-100 text-slate-500',
        variant === 'red' && 'bg-red-50 text-med-red',
        variant === 'blue' && 'bg-blue-50 text-med-blue',
        variant === 'gold' && 'bg-amber-50 text-med-gold',
        variant === 'green' && 'bg-emerald-50 text-emerald-700',
        className,
      )}
    >
      {children}
    </span>
  );
}
