import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface Seat { id: string; row: string; number: number; status: 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'LOCKED'; type: 'REGULAR' | 'PREMIUM'; price: number; }

export const SeatMap: React.FC<{ onSeatSelect: (seats: Seat[]) => void }> = ({ onSeatSelect }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Mock data for UI demonstration
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  const toggleSeat = (id: string, status: string) => {
    if (status === 'BOOKED' || status === 'LOCKED') return;
    const newSelected = new Set(selected);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelected(newSelected);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 glass-card rounded-2xl">
      <div className="flex flex-col items-center mb-16">
        <div className="cinema-screen"></div>
        <span className="text-zinc-500 text-xs mt-4 tracking-[0.3em] font-medium uppercase">All eyes this way</span>
      </div>
      
      <div className="space-y-6 overflow-x-auto pb-8">
        {rows.map(row => (
          <div key={row} className="flex items-center justify-center gap-8 min-w-max">
            <span className="w-6 text-center text-sm font-semibold text-zinc-500">{row}</span>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const id = `${row}${i+1}`;
                const isSelected = selected.has(id);
                // Mock random booked seats
                const isBooked = (row === 'D' && i > 2) || (row === 'F' && i === 1);
                const status = isSelected ? 'SELECTED' : isBooked ? 'BOOKED' : 'AVAILABLE';
                return (
                  <button key={id} onClick={() => toggleSeat(id, status)} disabled={isBooked}
                    className={cn(
                      "w-8 h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-200 flex items-center justify-center",
                      status === 'AVAILABLE' && "seat-available text-transparent hover:text-green-500",
                      status === 'SELECTED' && "seat-selected",
                      status === 'BOOKED' && "seat-booked",
                    )}
                  >{i+1}</button>
                );
              })}
            </div>
            {/* Aisle */}
            <div className="w-8"></div>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const id = `${row}${i+7}`;
                const isSelected = selected.has(id);
                const status = isSelected ? 'SELECTED' : 'AVAILABLE';
                return (
                  <button key={id} onClick={() => toggleSeat(id, status)}
                    className={cn(
                      "w-8 h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-200 flex items-center justify-center",
                      status === 'AVAILABLE' && "seat-available text-transparent hover:text-green-500",
                      status === 'SELECTED' && "seat-selected",
                    )}
                  >{i+7}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-available rounded-t-sm"></div><span className="text-sm text-zinc-400">Available</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-selected rounded-t-sm"></div><span className="text-sm text-zinc-400">Selected</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-booked rounded-t-sm"></div><span className="text-sm text-zinc-400">Booked</span></div>
      </div>
    </div>
  );
};
