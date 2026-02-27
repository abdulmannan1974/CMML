import { clsx } from 'clsx';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className={clsx('pt-20 min-h-screen', className)}>
      {children}
    </main>
  );
}
