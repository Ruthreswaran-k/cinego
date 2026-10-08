import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, Smartphone, Landmark, Wallet, ShieldCheck, Clock, ArrowRight, Lock, QrCode, ExternalLink, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import toast from 'react-hot-toast';

export const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [bookingData] = useState(() => {
    const saved = sessionStorage.getItem('cinego_current_booking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.id && !parsed.bookingId) {
          parsed.id = String(Math.floor(5100 + Math.random() * 3800));
        }
        return parsed;
      } catch {}
    }
    return {
      id: String(Math.floor(5100 + Math.random() * 3800)),
      showId: bookingId || '501',
      movieTitle: 'Baththa',
      theatreName: 'PVR INOX, White Town, Puducherry',
      screenName: 'Screen 1 - Dolby Atmos',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '07:30 PM',
      seats: ['A4', 'A5'],
      finalPayable: 620,
    };
  });

  const [method, setMethod] = useState<'upi' | 'card' | 'net' | 'wallet'>('upi');
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes timer
  const [networkIp, setNetworkIp] = useState('192.168.0.104');

  useEffect(() => {
    fetch('/api/payments/network-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip && data.ip !== '127.0.0.1') {
          setNetworkIp(data.ip);
        }
      })
      .catch(() => {});
  }, []);

  const amount = bookingData.finalPayable || bookingData.totalAmount || 620;
  const currentBookingId = bookingData.id || bookingData.bookingId || bookingId || '5101';

  // Construct mobile approval URL accessible by real in-hand mobile phone
  const effectiveHost =
    window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? window.location.host
      : `${networkIp}:${window.location.port || '5173'}`;

  const mobileSimulateUrl = `${window.location.protocol}//${effectiveHost}/pay-simulate/${currentBookingId}?amount=${amount}&movie=${encodeURIComponent(bookingData.movieTitle)}&theatre=${encodeURIComponent(bookingData.theatreName)}&seats=${encodeURIComponent(bookingData.seats.join(', '))}`;

  // Persist confirmed booking and lock seats globally across accounts
  const persistConfirmedBooking = () => {
    const nowIso = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: String(currentBookingId),
      showId: String(bookingData.showId || '501'),
      movieTitle: bookingData.movieTitle || 'Baththa',
      posterGradient: 'from-red-900 to-black',
      theatreName: bookingData.theatreName || 'PVR INOX, White Town',
      screenName: bookingData.screenName || 'Screen 1 - Dolby Atmos',
      showDate: bookingData.showDate || nowIso,
      showTime: bookingData.showTime || '07:30 PM',
      seats: bookingData.seats || ['A4', 'A5'],
      totalAmount: amount,
      status: 'CONFIRMED' as const,
      bookingDate: nowIso,
      customerEmail: user?.email || bookingData.customerEmail || 'customer@gmail.com',
      customerName: user?.name || bookingData.customerName || 'Cinema Guest',
      customerMobile: user?.phone || bookingData.customerMobile || '9876543210',
    };

    // 1. Update customer bookings list in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cinego_customer_bookings') || '[]');
      const filtered = Array.isArray(existing) ? existing.filter((b: any) => String(b.id) !== String(currentBookingId)) : [];
      const updated = [newRecord, ...filtered];
      localStorage.setItem('cinego_customer_bookings', JSON.stringify(updated));
    } catch {
      localStorage.setItem('cinego_customer_bookings', JSON.stringify([newRecord]));
    }

    // 2. Lock/Book seats in localStorage for this show so subsequent users/gmails see them disabled
    try {
      const showKey = `cinego_booked_seats_${bookingData.showId || '501'}`;
      const existingSeats = JSON.parse(localStorage.getItem(showKey) || '[]');
      const mergedSeats = Array.from(new Set([...(Array.isArray(existingSeats) ? existingSeats : []), ...(bookingData.seats || [])]));
      localStorage.setItem(showKey, JSON.stringify(mergedSeats));
    } catch {}

    // 3. Save single booking record for direct ticket lookup
    localStorage.setItem(`cinego_booking_${currentBookingId}`, JSON.stringify(newRecord));

    // 4. Update sessionStorage for current ticket page
    sessionStorage.setItem('cinego_current_booking', JSON.stringify({ ...bookingData, ...newRecord }));

    // 5. Notify all listeners
    window.dispatchEvent(new Event('cinego_bookings_updated'));
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for mobile approval via real-time backend API & localStorage
  useEffect(() => {
    let isHandled = false;

    const checkApproval = async () => {
      if (isHandled) return;

      // 1. Check Backend Network API (works across real mobile phone & laptop)
      try {
        const res = await fetch(`/api/payments/mobile-approval/${currentBookingId}`);
        const data = await res.json();
        if (data.status === 'APPROVED') {
          isHandled = true;
          persistConfirmedBooking();
          toast.success('🎉 Payment Approved from mobile phone! Booking confirmed.');
          setStatus('success');
          return;
        } else if (data.status === 'DECLINED') {
          isHandled = true;
          toast.error('❌ Payment was DECLINED on your phone. Ticket not booked.');
          return;
        }
      } catch (err) {
        // Fallback to local storage if offline
      }

      // 2. Check localStorage (same-device fallback)
      const raw = localStorage.getItem(`cinego_pay_approval_${currentBookingId}`);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.status === 'APPROVED') {
            isHandled = true;
            localStorage.removeItem(`cinego_pay_approval_${currentBookingId}`);
            persistConfirmedBooking();
            toast.success('🎉 Payment Approved! Your booking is confirmed.');
            setStatus('success');
          } else if (parsed.status === 'DECLINED') {
            isHandled = true;
            localStorage.removeItem(`cinego_pay_approval_${currentBookingId}`);
            toast.error('❌ Payment request was declined on your mobile device.');
          }
        } catch {}
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === `cinego_pay_approval_${currentBookingId}`) {
        checkApproval();
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    const poller = setInterval(checkApproval, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(poller);
    };
  }, [currentBookingId]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      persistConfirmedBooking();
      setStatus('success');
      toast.success('Payment completed! Your booking is confirmed.');
    }, 1800);
  };

  const handleOpenMobileSimulator = () => {
    window.open(mobileSimulateUrl, '_blank', 'width=420,height=750');
  };

  const handleViewTicket = () => {
    navigate(`/ticket/${currentBookingId}`);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6 text-white text-center font-display">
        <div className="glass-card p-8 sm:p-10 rounded-3xl max-w-md w-full border-emerald-500/30 border shadow-2xl shadow-emerald-500/10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Payment Confirmed!</h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Your admission voucher and seat tickets are confirmed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-xs text-left space-y-1.5 text-zinc-300">
            <p><strong className="text-zinc-500">Booking ID:</strong> #{currentBookingId}</p>
            <p><strong className="text-zinc-500">Movie:</strong> {bookingData.movieTitle}</p>
            <p><strong className="text-zinc-500">Cinema:</strong> {bookingData.theatreName}</p>
            <p><strong className="text-zinc-500">Seats:</strong> {bookingData.seats.join(', ')}</p>
            <p><strong className="text-zinc-500">Total Paid:</strong> ₹{amount}</p>
            <p><strong className="text-zinc-500">Gateway Status:</strong> <span className="text-emerald-400 font-mono font-bold">TRANSACTION COMPLETED (NPCI / 256-BIT SECURE)</span></p>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={handleViewTicket}
            className="w-full rounded-2xl py-3.5 font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center cursor-pointer"
          >
            View E-Admission Ticket <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Mandatory Authentication Gate: if user is not signed in, payment gateway will not display!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                <Lock className="w-4 h-4" />
                <span>Security Checkpoint &bull; Sign-In Required</span>
              </div>
              <h1 className="text-3xl font-bold">Sign In to Complete Payment</h1>
            </div>
            <Link
              to={`/booking/summary/${bookingId || '504'}`}
              className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
            >
              &larr; Back to Summary
            </Link>
          </div>

          {/* Gate Card */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
              <Lock className="w-10 h-10" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Login Required for Payment</h2>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                You are currently browsing as a <strong className="text-amber-400">Guest</strong>. To securely complete payment, allocate your seats, and receive your <strong>Turnstile-Scannable QR E-Ticket</strong> on your registered email, please sign in or register.
              </p>
            </div>

            {/* Held Reservation Snapshot */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Your Held Reservation</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Seats Temporarily Held
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Movie</span>
                  <span className="font-bold text-white text-sm">{bookingData.movieTitle}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Cinema & Screen</span>
                  <span className="font-semibold text-white truncate block">{bookingData.theatreName}</span>
                  <span className="text-zinc-400 text-[11px] block">{bookingData.screenName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Seats Reserved</span>
                  <span className="font-black text-primary font-mono text-base">
                    {bookingData.seats.join(', ')} ({bookingData.seats.length} Tickets)
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total Amount Payable</span>
                  <span className="font-black text-emerald-400 font-display text-lg">₹{amount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full rounded-2xl py-4 font-bold text-base shadow-xl shadow-primary/30 flex items-center justify-center cursor-pointer"
              >
                Sign In / Register to Unlock Payment <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                <span>Instant Login via Mobile SMS, Gmail OTP, or Google Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>Step 4 of 4 — Final Payment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Checkout & Payment</h1>
          </div>

          <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-semibold self-start sm:self-auto">
            <Clock className="w-4 h-4" />
            <span>Complete in: <strong>{formatTimer(secondsLeft)}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Snapshot */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 sticky top-36 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Amount Summary</h3>
              <p className="text-xs text-zinc-400">Total Payable for {bookingData.movieTitle}</p>
              <p className="text-4xl font-black font-display text-primary">₹{amount}</p>
              <div className="text-xs text-zinc-400 pt-2 border-t border-white/5 space-y-1">
                <p>Cinema: <strong>{bookingData.theatreName}</strong></p>
                <p>Seats: <strong className="text-primary">{bookingData.seats.join(', ')}</strong></p>
                <p>Booking Ref: <strong className="font-mono text-zinc-300">#{currentBookingId}</strong></p>
              </div>

              {/* Live Signal Indicator */}
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Live Mobile Listener Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Tabs & Form */}
          <div className="lg:col-span-2 glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-col sm:flex-row relative">
            {status === 'processing' && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-30 backdrop-blur-sm space-y-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-base font-bold text-white">Communicating with Payment Gateway...</p>
                <span className="text-xs text-zinc-400 font-mono">256-Bit Encrypted Bank Authorization</span>
              </div>
            )}

            {/* Methods Sidebar */}
            <div className="w-full sm:w-48 bg-zinc-950/80 p-3 sm:border-r border-b sm:border-b-0 border-white/10 flex flex-row sm:flex-col gap-1.5 overflow-x-auto">
              <button
                onClick={() => setMethod('upi')}
                className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap w-full cursor-pointer ${
                  method === 'upi' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> <span>UPI / QR Scan</span>
              </button>
              <button
                onClick={() => setMethod('card')}
                className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap w-full cursor-pointer ${
                  method === 'card' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> <span>Credit/Debit Card</span>
              </button>
              <button
                onClick={() => setMethod('net')}
                className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap w-full cursor-pointer ${
                  method === 'net' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Landmark className="w-4 h-4" /> <span>Net Banking</span>
              </button>
              <button
                onClick={() => setMethod('wallet')}
                className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap w-full cursor-pointer ${
                  method === 'wallet' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4" /> <span>Wallets</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-xl font-bold text-white capitalize">
                  {method === 'upi' ? 'UPI & Mobile QR Scanner' : `Pay via ${method.toUpperCase()}`}
                </h3>
                <span className="text-[10px] text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full">256-Bit SSL Secure Gateway</span>
              </div>

              {/* UPI METHOD: Dynamic Scannable QR Code & Simulator */}
              {method === 'upi' && (
                <div className="space-y-6">
                  {/* Sub-tabs: QR Scanner vs UPI ID */}
                  <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 max-w-xs">
                    <button
                      onClick={() => setUpiSubTab('qr')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        upiSubTab === 'qr' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Scan QR Code (Mobile)
                    </button>
                    <button
                      onClick={() => setUpiSubTab('id')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        upiSubTab === 'id' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Enter UPI ID
                    </button>
                  </div>

                  {upiSubTab === 'qr' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                      {/* High-Resolution QR Code */}
                      <div className="p-3 bg-white rounded-2xl shadow-xl flex-shrink-0 flex flex-col items-center">
                        <QRCodeSVG
                          value={mobileSimulateUrl}
                          size={150}
                          level="H"
                          includeMargin={false}
                        />
                        <span className="text-[9px] font-bold text-zinc-800 mt-1 uppercase tracking-wider">
                          Scan to Pay ₹{amount}
                        </span>
                      </div>

                      {/* Real In-Hand Mobile Instructions */}
                      <div className="space-y-3.5 text-left flex-1 min-w-0">
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                            <QrCode className="w-4 h-4 text-primary flex-shrink-0" />
                            Scan with Google Lens / Phone Camera
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Point your real phone camera or <strong>Google Lens</strong> at this QR code. The payment prompt will open directly on your in-hand smartphone.
                          </p>
                        </div>

                        {/* Real-time Mobile Beacon Indicator */}
                        <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-2">
                          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span>Waiting for Phone Authorization...</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 space-y-1">
                            <p className="flex items-center gap-1.5">
                              <span className="text-emerald-400 font-bold">✓ YES</span> : Confirms booking instantly on laptop.
                            </p>
                            <p className="flex items-center gap-1.5">
                              <span className="text-rose-400 font-bold">✕ DECLINE</span> : Rejects transaction. No ticket booked.
                            </p>
                          </div>
                        </div>

                        <div className="text-[10px] text-zinc-500 font-mono truncate">
                          Mobile Link: <span className="text-zinc-400">{mobileSimulateUrl}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">Enter UPI VPA ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter UPI VPA (mobile@upi or name@okhdfcbank)"
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="px-2 py-1 bg-white/5 rounded-md">Google Pay</span>
                        <span className="px-2 py-1 bg-white/5 rounded-md">PhonePe</span>
                        <span className="px-2 py-1 bg-white/5 rounded-md">Paytm UPI</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CARD METHOD */}
              {method === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING */}
              {method === 'net' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Select Bank</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                      <button key={b} className="p-3 rounded-xl border border-white/10 bg-zinc-900 text-xs font-semibold text-white hover:border-primary text-left cursor-pointer">
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* WALLETS */}
              {method === 'wallet' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Select Wallet</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'PhonePe Wallet'].map((w) => (
                      <button key={w} className="p-3 rounded-xl border border-white/10 bg-zinc-900 text-xs font-semibold text-white hover:border-primary text-left cursor-pointer">
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Direct Authorize Button */}
              <Button
                size="lg"
                variant="primary"
                onClick={handlePay}
                className="w-full rounded-2xl py-4 font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center mt-6 cursor-pointer"
              >
                Direct Authorize & Pay ₹{amount}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};
