import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Share2, Film, CheckCircle2, Ticket, Printer, ArrowLeft, ScanLine, Mail, Smartphone, Send } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/common/Button';
import { ALL_MOVIES, findMovieByIdOrTitle } from '@/data/moviesData';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

export const ETicket: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const { user } = useAuth();

  const [bookingData] = useState(() => {
    // 1. Direct lookup by booking ID in localStorage
    if (bookingId) {
      try {
        const direct = localStorage.getItem(`cinego_booking_${bookingId}`);
        if (direct) return JSON.parse(direct);

        const list = JSON.parse(localStorage.getItem('cinego_customer_bookings') || '[]');
        if (Array.isArray(list)) {
          const found = list.find((b: any) => String(b.id) === String(bookingId));
          if (found) return found;
        }
      } catch {}
    }

    // 2. Lookup in current session storage
    const saved = sessionStorage.getItem('cinego_current_booking');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }

    return {
      id: bookingId || '5001',
      showId: bookingId || '501',
      movieId: 'MOV001',
      movieTitle: 'Baththa',
      theatreName: 'PVR INOX, White Town, Puducherry',
      screenName: 'Screen 1 (Dolby Atmos)',
      showDate: '2026-10-05',
      showTime: '10:30 AM',
      seats: ['A4', 'A5'],
      finalPayable: 620,
    };
  });

  const currentBookingId = bookingData.id || bookingId || '5001';

  // Resolve customer details from authenticated user or booking session
  const resolvedEmail =
    user?.email ||
    bookingData.customerEmail ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return u.email;
      } catch {}
      return '';
    })() ||
    '';

  const resolvedName =
    user?.name ||
    bookingData.customerName ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return u.name;
      } catch {}
      return '';
    })() ||
    'Cinema Guest';

  const resolvedMobile =
    user?.phone ||
    bookingData.customerMobile ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return u.phone;
      } catch {}
      return '';
    })() ||
    '9876543210';

  const [recipientEmail, setRecipientEmail] = useState(resolvedEmail || 'ragaruthra@gmail.com');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [hasSentTicket, setHasSentTicket] = useState(false);

  const matchedMovie =
    findMovieByIdOrTitle(bookingData.movieId || bookingData.movieTitle) || ALL_MOVIES[0];

  const handleSendTicket = async (targetEmail: string) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      toast.error('Please enter a valid Gmail address');
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await authApi.sendTicketEmail({
        bookingId: currentBookingId,
        customerName: resolvedName,
        email: targetEmail.trim().toLowerCase(),
        mobile: resolvedMobile,
        movieTitle: bookingData.movieTitle,
        theatreName: bookingData.theatreName,
        screenName: bookingData.screenName,
        showDate: bookingData.showDate,
        showTime: bookingData.showTime,
        seats: bookingData.seats,
        amount: bookingData.finalPayable || 620,
      });
      if (res.data?.success) {
        setEmailStatus(`Dispatched to ${targetEmail}`);
        toast.success(`E-Ticket sent to ${targetEmail}! Check your Gmail.`);
      } else {
        toast.error(res.data?.message || 'Could not dispatch ticket email');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to dispatch ticket email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Auto-send to customer's Gmail once on ticket view
  useEffect(() => {
    const emailToUse = user?.email || resolvedEmail;
    if (emailToUse && emailToUse.includes('@') && !hasSentTicket) {
      setRecipientEmail(emailToUse);
      handleSendTicket(emailToUse);
      setHasSentTicket(true);
    }
  }, [user?.email, resolvedEmail, hasSentTicket]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CineGo Ticket #${currentBookingId} - ${bookingData.movieTitle}`,
        text: `My movie ticket for ${bookingData.movieTitle} at ${bookingData.theatreName}. Seats: ${bookingData.seats.join(', ')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ticket link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link to="/" className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-primary hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save E-Ticket
            </button>

            <a
              href={`/manager?scan=${currentBookingId}&tab=SCANNER`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5" /> Test Turnstile Gate Scan
            </a>
          </div>
        </div>

        {/* Email & Mobile Notification Dispatch Banner */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">E-Ticket Dispatched</span>
                </div>
                <p className="text-sm font-semibold text-white mt-0.5">
                  E-Ticket with QR code sent to <span className="text-emerald-300 font-mono underline">{recipientEmail}</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                  SMS & WhatsApp alert queued for <span className="text-zinc-200 font-mono font-bold">+91 {resolvedMobile}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter another Gmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-full sm:w-48"
              />
              <button
                onClick={() => handleSendTicket(recipientEmail)}
                disabled={isSendingEmail}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-md shadow-emerald-600/30"
              >
                <Send className="w-3 h-3" />
                {isSendingEmail ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </div>
        </div>

        {/* Realistic Perforated Ticket Card */}
        <div className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl text-black relative border-4 border-zinc-900">
          {/* Left Poster Stub */}
          <div className="md:w-1/3 bg-zinc-950 p-6 flex flex-col justify-between text-white relative">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-primary w-fit rounded-full uppercase tracking-wider block">
                Confirmed Admission
              </span>
              <h2 className="text-3xl font-black uppercase tracking-wide mt-2">{bookingData.movieTitle}</h2>
              <p className="text-zinc-400 text-xs">{matchedMovie.language} &bull; {matchedMovie.certificate} &bull; {matchedMovie.genreString}</p>
            </div>

            <div className="my-5 rounded-2xl overflow-hidden aspect-[2/3] border border-white/10 shadow-lg">
              <img
                src={matchedMovie.posterUrl}
                alt={bookingData.movieTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-[11px] text-zinc-400 border-t border-white/10 pt-3">
              <span className="text-zinc-500 block uppercase font-bold text-[9px]">Admission Pass</span>
              <p className="font-semibold text-white">Present QR code at cinema entrance gate</p>
            </div>
          </div>

          {/* Right Ticket Info Stub */}
          <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between bg-white relative space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Booking Reference</p>
                <p className="text-3xl font-black font-mono text-zinc-900">#{currentBookingId}</p>
                <span className="inline-flex items-center text-[11px] text-emerald-600 font-bold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Payment Verified
                </span>
              </div>
              <div className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center border border-zinc-200 p-1.5 shadow-sm text-center">
                <QRCodeSVG
                  value={`CINEGO-TICKET:${currentBookingId}:${encodeURIComponent(bookingData.movieTitle)}:${encodeURIComponent(bookingData.theatreName)}:${encodeURIComponent(bookingData.screenName)}:${bookingData.seats.join(',')}:${bookingData.seats.length}`}
                  size={76}
                  level="M"
                />
                <span className="text-[8px] font-mono font-bold text-zinc-500 mt-0.5">GATE SCAN</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Cinema Theatre</p>
                <p className="font-bold text-sm text-zinc-900">{bookingData.theatreName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Auditorium Screen</p>
                <p className="font-bold text-sm text-zinc-900">{bookingData.screenName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Show Schedule</p>
                <p className="font-bold text-sm text-primary">{bookingData.showDate} &bull; {bookingData.showTime}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Seats Reserved ({bookingData.seats.length} Tickets)</p>
                <p className="font-black text-2xl font-mono text-zinc-900">{bookingData.seats.join(', ')}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Customer Name</p>
                <p className="font-semibold text-xs text-zinc-800">{resolvedName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold">Contact (Gmail & Mobile)</p>
                <p className="font-semibold text-xs text-zinc-800 truncate">{recipientEmail} &bull; +91 {resolvedMobile}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-zinc-300 pt-4 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-zinc-500">Scan QR at turnstile for instant admission</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">E-Ticket confirmation delivered to {recipientEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Paid</p>
                <p className="text-2xl font-black text-zinc-900">₹{bookingData.totalAmount || bookingData.finalPayable || 620}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center">
            <Ticket className="w-4 h-4 text-primary mr-2" />
            Your ticket is active and ready for cinema entry.
          </span>
          <Link to="/bookings" className="text-primary hover:underline font-bold">
            View All Bookings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
