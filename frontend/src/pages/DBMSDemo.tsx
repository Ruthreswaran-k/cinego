import React from 'react';
import { Database, Server, Code, Play } from 'lucide-react';

const OPERATIONS = [
  { name: 'Register Customer', trigger: 'TRG_CUSTOMER_ID', procedure: 'PROC_REGISTER_USER' },
  { name: 'Book Tickets', trigger: 'TRG_BOOKING_ID, TRG_UPDATE_SEAT_STATUS', procedure: 'PROC_CREATE_BOOKING' },
  { name: 'Process Payment', trigger: 'TRG_PAYMENT_LOG', procedure: 'PROC_PROCESS_PAYMENT' },
  { name: 'Cancel Booking', trigger: 'TRG_REFUND_CALC, TRG_FREE_SEATS', procedure: 'PROC_CANCEL_BOOKING' }
];

export const DBMSDemo = () => {
  return (
    <div className="min-h-screen bg-dark text-white px-4 sm:px-6 md:px-8 font-display pt-32 sm:pt-36 md:pt-40 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-6 mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            <Database className="w-10 h-10 text-primary" />
            DBMS Concepts Demo
          </h1>
          <p className="text-gray-400 mt-2">Interactive demonstration of backend Oracle operations, Triggers, and Procedures.</p>
        </header>

        <div className="grid gap-6">
          {OPERATIONS.map((op, idx) => (
            <div key={idx} className="glass-card border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-black/40 p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><Code className="w-5 h-5 text-secondary" /> {op.name}</h3>
                <button className="text-sm flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"><Play className="w-4 h-4" /> Simulate</button>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6 bg-[#0a0a0a]">
                <div>
                  <h4 className="text-sm text-gray-500 font-bold mb-2 uppercase">Execution Flow</h4>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="bg-white/5 p-3 rounded border border-white/10"><span className="text-blue-400">API:</span> POST /api/{op.name.toLowerCase().replace(' ', '-')}</div>
                    <div className="flex justify-center text-gray-500">↓</div>
                    <div className="bg-white/5 p-3 rounded border border-white/10"><span className="text-green-400">Procedure:</span> {op.procedure}</div>
                    <div className="flex justify-center text-gray-500">↓</div>
                    <div className="bg-white/5 p-3 rounded border border-white/10 border-l-4 border-l-secondary"><span className="text-secondary">Triggers:</span> {op.trigger}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 font-bold mb-2 uppercase">Live Log Output</h4>
                  <div className="bg-black p-4 rounded border border-white/10 font-mono text-xs text-green-500 h-full min-h-[150px]">
                    <p>{'>'} Awaiting simulation...</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
