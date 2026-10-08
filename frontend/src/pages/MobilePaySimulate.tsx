import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ShieldCheck, Smartphone, Film, ArrowRight, Building2, Ticket, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const MobilePaySimulate: React.FC = () => {
  const { bookingId = '5001' } = useParams<{ bookingId?: string }>();
  const [searchParams] = useSearchParams();

  const amount = searchParams.get('amount') || '620';
  const movie = searchParams.get('movie') || 'Baththa';
  const theatre = searchParams.get('theatre') || 'PVR Grand Mall, Velachery';
  const seats = searchParams.get('seats') || 'A4, A5';

  const [decision, setDecision] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinStep, setPinStep] = useState(false);
  const [upiPin, setUpiPin] = useState(['4', '8', '2', '9']);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await fetch(`/api/payments/mobile-approval/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
    } catch (err) {
      console.warn('Network sync notice:', err);
    }

    const approvalPayload = {
      bookingId,
      status: 'APPROVED',
      amount,
      timestamp: Date.now(),
    };
    localStorage.setItem(`cinego_pay_approval_${bookingId}`, JSON.stringify(approvalPayload));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      setIsProcessing(false);
      setDecision('approved');
    }, 1000);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await fetch(`/api/payments/mobile-approval/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DECLINED' }),
      });
    } catch (err) {
      console.warn('Network sync notice:', err);
    }

    const declinePayload = {
      bookingId,
      status: 'DECLINED',
      amount,
      timestamp: Date.now(),
    };
    localStorage.setItem(`cinego_pay_approval_${bookingId}`, JSON.stringify(declinePayload));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      setIsProcessing(false);
      setDecision('declined');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 font-display">
      {/* Mobile Device Container Mockup */}
      <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Status Bar Mock */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/5">
          <span className="font-semibold text-white">UPI SafePay 2.0</span>
          <span className="flex items-center text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 256-bit Encrypted
          </span>
        </div>

        {/* Brand Merchant Header */}
        <div className="p-6 text-center bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-primary/30">
            <Film className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-white flex items-center justify-center">
            CineGo Entertainment (P) Ltd
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1.5 inline flex-shrink-0" />
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">UPI ID: cinego.pay@icici</p>

          <div className="mt-4">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Total Payable</span>
            <div className="text-4xl font-black text-white mt-0.5">₹{amount}</div>
          </div>
        </div>

        {/* Main Interactive Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {decision === 'pending' && !isProcessing && (
            <>
              {/* Order Info Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Booking Reference:</span>
                  <span className="text-white font-mono font-bold">#{bookingId}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Movie:</span>
                  <span className="text-white font-bold">{movie}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Cinema:</span>
                  <span className="text-white">{theatre}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Reserved Seats:</span>
                  <span className="text-primary font-bold">{seats}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between text-[11px] text-zinc-400">
                  <span>Debited From:</span>
                  <span className="text-zinc-200">State Bank of India (••4291)</span>
                </div>
              </div>

              {/* Decision Prompt: YES or NO */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-center text-zinc-400 font-medium">
                  Do you approve this payment request from CineGo?
                </p>

                {/* YES Option */}
                <button
                  onClick={handleApprove}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-all cursor-pointer transform active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  YES — Authorize & Pay ₹{amount}
                </button>

                {/* NO Option */}
                <button
                  onClick={handleDecline}
                  className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-red-500/20 font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  NO — Decline Payment
                </button>
              </div>
            </>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="text-base font-bold text-white">Communicating with Banking Gateway...</h3>
              <p className="text-xs text-zinc-400">Verifying UPI credentials with NPCI</p>
            </div>
          )}

          {/* APPROVED State */}
          {decision === 'approved' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-emerald-400">Payment Successful!</h3>
                <p className="text-xs text-zinc-400 mt-1">₹{amount} paid to CineGo Entertainment</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-xs text-left space-y-1.5 text-zinc-300">
                <p className="text-emerald-400 font-semibold flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Desktop Screen Automatically Confirmed
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Your computer browser has just received the approval signal. You can now look at your desktop screen or view the admission ticket right here.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link to={`/ticket/${bookingId}`}>
                  <Button variant="primary" className="w-full rounded-2xl py-3 text-xs font-bold shadow-lg shadow-primary/30">
                    <Ticket className="w-4 h-4 mr-1.5" /> View Admission Ticket on Mobile
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="w-full text-zinc-400 text-xs">
                    Back to CineGo Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* DECLINED State */}
          {decision === 'declined' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-red-400">Payment Declined</h3>
                <p className="text-xs text-zinc-400 mt-1">You declined the payment of ₹{amount}</p>
              </div>

              <p className="text-xs text-zinc-500">
                The CineGo checkout screen has been updated. No money was debited from your account.
              </p>

              <button
                onClick={() => setDecision('pending')}
                className="w-full py-3 rounded-2xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-900/50 border-t border-white/5 text-center text-[10px] text-zinc-500 flex items-center justify-center space-x-1">
          <Lock className="w-3 h-3 text-zinc-500" />
          <span>NPCI Unified Payments Interface &bull; CineGo 2026</span>
        </div>
      </div>
    </div>
  );
};
