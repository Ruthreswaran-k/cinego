import React from 'react';
import { cn } from '@/utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-zinc-800", className)} />
);

export const SkeletonPoster = () => <Skeleton className="aspect-[2/3] w-full rounded-xl" />;
export const SkeletonText = ({ className }: { className?: string }) => <Skeleton className={cn("h-4 w-3/4", className)} />;
