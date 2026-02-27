import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all rounded-lg',
        size === 'sm' && 'px-3 py-1.5 text-[10px]',
        size === 'md' && 'px-5 py-2.5 text-xs',
        size === 'lg' && 'px-8 py-3 text-sm',
        variant === 'primary' && 'bg-med-red text-white hover:bg-red-800',
        variant === 'secondary' && 'bg-navy text-white hover:bg-navy-light',
        variant === 'outline' && 'border border-slate-300 text-slate-700 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
