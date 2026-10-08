import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Tag, Ticket, Utensils, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Film, Lock, UserCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { calculateOfferDiscount } from '@/data/offersData';
import { LoginModal } from '@/components/auth/LoginModal';
import toast from 'react-hot-toast';

export const BookingSummary: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Booking details from state / session
  const [bookingData, setBookingData] = useState(() => {
    const saved = sessionStorage.getItem('cinego_current_booking');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      showId: bookingId || '501',
      movieId: 'MOV001',
      movieTitle: 'Baththa',
      theatreName: 'PVR INOX, White Town, Puducherry',
      screenName: 'Screen 1 (Dolby Atmos)',
      showDate: '2026-10-05',
      showTime: '10:30 AM',
      seats: ['A4', 'A5'],
      ticketSubtotal: 560,
      convenienceFee: 60,
      foodOrders: [
        { id: 602, name: 'Large Butter Popcorn', price: 200, quantity: 1, subtotal: 200 },
        { id: 608, name: 'Coca-Cola (500ml)', price: 80, quantity: 2, subtotal: 160 },
      ],
      foodTotal: 360,
      totalAmount: 980,
    };
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      toast.error('Please enter a coupon or bank offer code');
      return;
    }

    const result = calculateOfferDiscount(
      code,
      bookingData.ticketSubtotal || 560,
      bookingData.seats?.length || 2
    );

    if (result.valid) {
      setAppliedCoupon({ code, discount: result.discount });
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const foodTotal = bookingData.foodTotal || 0;
  const rawTotal = (bookingData.ticketSubtotal || 560) + (bookingData.convenienceFee || 60) + foodTotal;
  const finalPayable = Math.max(0, rawTotal - discountAmount);

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast('Please sign in to proceed to Payment and confirm your booking', {
        icon: '🔒',
        duration: 4000,
      });
      setIsLoginModalOpen(true);
      return;
    }

    const updated = {
      ...bookingData,
      appliedCoupon: appliedCoupon?.code,
      discountAmount,
      finalPayable,
      customerEmail: user?.email,
      customerName: user?.name,
      customerMobile: user?.phone,
    };
    sessionStorage.setItem('cinego_current_booking', JSON.stringify(updated));
    navigate(`/payment/${bookingId || '504'}`);
  };

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Step 3 of 4 — Review Reservation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Booking Summary</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie & Theatre Card */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-36 rounded-2xl bg-zinc-900 border border-white/10 p-2 flex flex-col justify-between text-center flex-shrink-0">
                <Film className="w-8 h-8 text-primary mx-auto mt-2" />
                <span className="text-xs font-bold text-white">{bookingData.movieTitle}</span>
                <span className="text-[10px] text-zinc-500">UA</span>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <h2 className="text-2xl font-bold text-white">{bookingData.movieTitle}</h2>
                  <p className="text-xs text-primary font-semibold mt-0.5">{bookingData.screenName}</p>
                  <p className="text-xs text-zinc-400">{bookingData.theatreName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-zinc-300 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-zinc-500 block">Show Schedule</span>
                    <strong className="text-white">{bookingData.showDate} • {bookingData.showTime}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Reserved Seats</span>
                    <strong className="text-primary text-sm font-mono">{bookingData.seats.join(', ')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Concessions Breakdown (if any) */}
            {bookingData.foodOrders && bookingData.foodOrders.length > 0 && (
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-bold text-base flex items-center text-white">
                    <Utensils className="w-4 h-4 text-primary mr-2" /> Pre-Ordered Concessions
                  </h3>
                  <Link to={`/food/${bookingId || '504'}`} className="text-xs text-primary hover:underline font-semibold">
                    Edit Munchies
                  </Link>
                </div>
                <div className="divide-y divide-white/5 text-xs text-zinc-300">
                  {bookingData.foodOrders.map((f: any) => (
                    <div key={f.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white">{f.name}</span>
                        <span className="text-zinc-500 text-[10px] block">Qty: {f.quantity} × ₹{f.price}</span>
                      </div>
                      <span className="font-bold text-white">₹{f.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Code / Coupon Section */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center text-white">
                  <Tag className="w-4 h-4 text-primary mr-2" /> Apply Coupon / Offer Code
                </h3>
                <Link to="/offers" className="text-xs text-primary hover:underline font-semibold">
                  Browse Offers
                </Link>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. AXISBOGO, ICICIBOGO, WELCOME100)"
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-primary font-mono"
                />
                <Button type="submit" variant="primary" size="sm" className="rounded-xl px-5 text-xs font-semibold cursor-pointer">
                  Apply
                </Button>
              </form>

              {/* Quick Suggestion Chips for Popular Bank & Coupon Deals */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-zinc-500 font-medium">Popular:</span>
                {[
                  { code: 'AXISBOGO', label: 'Axis BOGO' },
                  { code: 'ICICIBOGO', label: 'ICICI BOGO' },
                  { code: 'HDFCMILLENNIA', label: 'HDFC 20%' },
                  { code: 'WELCOME100', label: 'Flat ₹100' },
                  { code: 'PAYTM100', label: 'PayTM UPI' },
                ].map((chip) => (
                  <button
                    key={chip.code}
                    type="button"
                    onClick={() => {
                      setCouponCode(chip.code);
                      const result = calculateOfferDiscount(
                        chip.code,
                        bookingData.ticketSubtotal || 560,
                        bookingData.seats?.length || 2
                      );
                      if (result.valid) {
                        setAppliedCoupon({ code: chip.code, discount: result.discount });
                        toast.success(result.message);
                      } else {
                        toast.error(result.message);
                      }
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10 transition-colors font-mono cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {appliedCoupon && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                  <span className="flex items-center font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Coupon "{appliedCoupon.code}" applied
                  </span>
                  <span className="font-mono font-bold">-₹{appliedCoupon.discount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Price Breakdown & CTA */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 sticky top-36 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center">
                <CreditCard className="w-5 h-5 text-primary mr-2" /> Price Breakdown
              </h2>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tickets Subtotal ({bookingData.seats.length} seats)</span>
                  <span>₹{bookingData.ticketSubtotal || 560}</span>
                </div>

                {foodTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Food & Refreshments</span>
                    <span>₹{foodTotal}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-400">Convenience Fee</span>
                  <span>₹{bookingData.convenienceFee || 60}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Promotional Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline font-bold text-white">
                  <span className="text-sm">Final Amount Payable</span>
                  <span className="text-2xl text-primary font-display font-black">₹{finalPayable}</span>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                  <div className="flex items-center font-bold text-amber-400">
                    <Lock className="w-4 h-4 mr-1.5 shrink-0" />
                    <span>Guest Browsing Active</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    You can review seats and totals freely. Sign in will be required when proceeding to payment to verify your ticket and email your turnstile QR admission code.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center font-bold">
                    <UserCheck className="w-4 h-4 mr-1.5 text-emerald-400 shrink-0" />
                    <span>Signed In: {user?.name || user?.email}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                    Ready
                  </span>
                </div>
              )}

              <Button
                size="lg"
                variant="primary"
                onClick={handleProceedToPayment}
                className="w-full rounded-2xl py-4 font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center cursor-pointer"
              >
                {!isAuthenticated ? 'Sign In & Proceed to Payment' : 'Proceed to Payment'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-[11px] text-zinc-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
                100% Secure Encrypted Transaction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login / Register Modal for Checkout Gate */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};
