import React from 'react';
import { cn } from '@/utils/cn';

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode; className?: string }> = ({ icon, title, description, action, className }) => (
  <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)}>
    <div className="rounded-full bg-zinc-900 p-4 text-zinc-500">{icon}</div>
    <h3 className="text-xl font-display font-semibold text-white">{title}</h3>
    {description && <p className="text-zinc-400 max-w-sm">{description}</p>}
    {action && <div className="pt-4">{action}</div>}
  </div>
);
