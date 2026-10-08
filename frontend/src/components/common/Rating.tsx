import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Rating: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={cn("flex items-center space-x-1", className)}>
    <Star className="w-4 h-4 fill-secondary text-secondary" />
    <span className="text-sm font-semibold text-white">{value.toFixed(1)}</span>
  </div>
);
