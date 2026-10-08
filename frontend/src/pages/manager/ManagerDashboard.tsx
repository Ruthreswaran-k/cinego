import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Film, Calendar, Clock, Users, DollarSign, CheckCircle2, AlertCircle, Eye, ShieldCheck, QrCode, ScanLine, Ticket, XCircle, ArrowRight, UserCheck, Camera, CameraOff, Upload, Image as ImageIcon, HelpCircle, Utensils, Lock, Unlock, Armchair, Sparkles, Plus, Tag, Sliders, Info, ShieldAlert, TrendingUp, Percent, Coins, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { Html5Qrcode } from 'html5-qrcode';
import { CinematicBackground } from '@/components/common/CinematicBackground';

interface ManagerShow {
  id: number;
  movieTitle: string;
  screenName: string;
  time: string;
  soldSeats: number;
  totalSeats: number;
  revenue: number;
  format: string;
}

interface ManagerBooking {
  bookingId: number;
  movieTitle: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  theatreName: string;
  screenName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  numTickets: number;
  amount: number;
  posterUrl?: string;
  status: 'CONFIRMED' | 'CANCELLED';
  isUsed?: boolean;
  usedAt?: string;
}

const TODAY_SHOWS: ManagerShow[] = [
  { id: 501, movieTitle: 'Baththa', screenName: 'Screen 1', time: '10:30 AM', soldSeats: 72, totalSeats: 85, revenue: 14400, format: '2D' },
  { id: 502, movieTitle: 'Baththa', screenName: 'Screen 1', time: '01:30 PM', soldSeats: 68, totalSeats: 85, revenue: 13600, format: '2D' },
  { id: 504, movieTitle: 'Baththa', screenName: 'Screen 1', time: '07:30 PM', soldSeats: 85, totalSeats: 85, revenue: 21250, format: 'Dolby Atmos' },
  { id: 506, movieTitle: 'Yezhu Kadal Yezhu Malai', screenName: 'Audi 2', time: '10:30 AM', soldSeats: 80, totalSeats: 85, revenue: 22400, format: '2D' },
  { id: 508, movieTitle: 'Yezhu Kadal Yezhu Malai', screenName: 'Audi 2', time: '07:30 PM', soldSeats: 85, totalSeats: 85, revenue: 27200, format: '2D' },
];

const INITIAL_BOOKINGS: ManagerBooking[] = [
  {
    bookingId: 5001,
    movieTitle: 'Baththa',
    customerName: 'Ravi Kumar',
    phone: '+91 9000000011',
    theatreName: 'PVR INOX, White Town',
    screenName: 'Screen 1 (Dolby Atmos)',
    showDate: 'Today',
    showTime: '07:30 PM',
    seats: ['A4', 'A5'],
    numTickets: 2,
    amount: 620,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    status: 'CONFIRMED',
    isUsed: false,
  },
  {
    bookingId: 5002,
    movieTitle: 'Yezhu Kadal Yezhu Malai',
    customerName: 'Priya Sharma',
    phone: '+91 9884012345',
    theatreName: 'PVR INOX, White Town',
    screenName: 'Audi 2',
    showDate: 'Today',
    showTime: '01:30 PM',
    seats: ['C7'],
    numTickets: 1,
    amount: 280,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    status: 'CONFIRMED',
    isUsed: true,
    usedAt: '01:15 PM Gate 1',
  },
  {
    bookingId: 5007,
    movieTitle: 'Baththa',
    customerName: 'Karthik Raja',
    phone: '+91 9444054321',
    theatreName: 'PVR INOX, White Town',
    screenName: 'Screen 1',
    showDate: 'Today',
    showTime: '10:30 AM',
    seats: ['B10', 'B11'],
    numTickets: 2,
    amount: 560,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    status: 'CONFIRMED',
    isUsed: false,
  },
  {
    bookingId: 5009,
    movieTitle: 'Yezhu Kadal Yezhu Malai',
    customerName: 'Anand V',
    phone: '+91 9771122334',
    theatreName: 'PVR INOX, White Town',
    screenName: 'Audi 2',
    showDate: 'Today',
    showTime: '07:30 PM',
    seats: ['E1', 'E2'],
    numTickets: 2,
    amount: 500,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    status: 'CANCELLED',
    isUsed: false,
  },
];

interface LiveFoodOrder {
  orderId: string;
  customerName: string;
  screenName: string;
  showTime: string;
  seats: string;
  items: string;
  totalPrice: number;
  status: 'PREPARING' | 'READY' | 'DELIVERED';
}

interface HeldSeatItem {
  id: string;
  showId: string;
  screenName: string;
  seatId: string;
  reason: string;
  heldAt: string;
}

const DEFAULT_FOOD_ORDERS: LiveFoodOrder[] = [
  {
    orderId: 'FB-401',
    customerName: 'Ravi Kumar',
    screenName: 'Screen 1',
    showTime: '07:30 PM',
    seats: 'A4, A5',
    items: '1x Large Butter Popcorn, 2x Coca-Cola (500ml)',
    totalPrice: 360,
    status: 'READY',
  },
  {
    orderId: 'FB-402',
    customerName: 'Priya Sharma',
    screenName: 'Audi 2',
    showTime: '01:30 PM',
    seats: 'C7',
    items: '1x Cheese Nachos with Salsa, 1x Cold Coffee',
    totalPrice: 220,
    status: 'PREPARING',
  },
  {
    orderId: 'FB-403',
    customerName: 'Karthik Raja',
    screenName: 'Screen 1',
    showTime: '10:30 AM',
    seats: 'B10, B11',
    items: '2x Gourmet Combo (Popcorn + Drink)',
    totalPrice: 560,
    status: 'DELIVERED',
  },
];

const DEFAULT_HELD_SEATS: HeldSeatItem[] = [
  {
    id: 'HLD-1',
    showId: '501',
    screenName: 'Screen 1',
    seatId: 'B1',
    reason: 'VIP Administration Protocol',
    heldAt: '10:15 AM',
  },
  {
    id: 'HLD-2',
    showId: '501',
    screenName: 'Screen 1',
    seatId: 'B2',
    reason: 'VIP Administration Protocol',
    heldAt: '10:15 AM',
  },
  {
    id: 'HLD-3',
    showId: '504',
    screenName: 'Screen 1',
    seatId: 'E6',
    reason: 'Damaged Recliner Armrest Repair',
    heldAt: '11:30 AM',
  },
];

interface ManagedTheatre {
  id: string;
  name: string;
  location: string;
  screens: number;
  dutyManager: string;
}

const MANAGED_THEATRES: ManagedTheatre[] = [
  { id: 'th-1', name: 'PVR Grand Mall, Velachery', location: 'Chennai, Tamil Nadu', screens: 5, dutyManager: 'Suresh Kumar' },
  { id: 'th-2', name: 'PVR INOX, White Town', location: 'Pondicherry', screens: 4, dutyManager: 'Suresh Kumar' },
  { id: 'th-3', name: 'PVR Orion Mall, Rajajinagar', location: 'Bengaluru, Karnataka', screens: 6, dutyManager: 'Suresh Kumar' },
];

export const ManagerDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlScanId = searchParams.get('scan');
  const urlTab = searchParams.get('tab') as any;

  // Single vs Multi-Theatre Property Switching State
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('th-1');
  const currentTheatre = MANAGED_THEATRES.find((t) => t.id === selectedTheatreId) || MANAGED_THEATRES[0];

  const [activeTab, setActiveTab] = useState<'SHOWS' | 'PRICING' | 'SCANNER' | 'OCCUPANCY' | 'CONCESSIONS' | 'SEATHOLD' | 'BOOKINGS'>(
    urlTab || (urlScanId ? 'SCANNER' : 'SHOWS')
  );

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Theatre Owner / Manager Multi-Tiered Pricing Architecture State
  const [selectedPricingScreen, setSelectedPricingScreen] = useState<'Screen 1' | 'Audi 2' | 'Audi 3'>('Screen 1');
  const [pricingRules, setPricingRules] = useState<Record<string, {
    basePrice: number;
    regular: number;
    premium: number;
    executive: number;
    recliner: number;
    morningDiscount: number;
    primeEveningSurcharge: number;
    weekendSurcharge: number;
    holidaySurcharge: number;
  }>>({
    'Screen 1': {
      basePrice: 120,
      regular: 120,
      premium: 160,
      executive: 200,
      recliner: 280,
      morningDiscount: 20,
      primeEveningSurcharge: 30,
      weekendSurcharge: 40,
      holidaySurcharge: 50,
    },
    'Audi 2': {
      basePrice: 130,
      regular: 130,
      premium: 170,
      executive: 210,
      recliner: 300,
      morningDiscount: 20,
      primeEveningSurcharge: 30,
      weekendSurcharge: 40,
      holidaySurcharge: 50,
    },
    'Audi 3': {
      basePrice: 160,
      regular: 160,
      premium: 220,
      executive: 280,
      recliner: 380,
      morningDiscount: 20,
      primeEveningSurcharge: 40,
      weekendSurcharge: 60,
      holidaySurcharge: 70,
    },
  });

  const [bookingsList, setBookingsList] = useState<ManagerBooking[]>(INITIAL_BOOKINGS);
  const [scanInput, setScanInput] = useState(urlScanId || '5001');
  const [scannedResult, setScannedResult] = useState<ManagerBooking | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // F&B Live Orders
  const [foodOrders, setFoodOrders] = useState<LiveFoodOrder[]>(DEFAULT_FOOD_ORDERS);

  // Seat Hold state
  const [heldSeats, setHeldSeats] = useState<HeldSeatItem[]>(DEFAULT_HELD_SEATS);
  const [holdSeatInput, setHoldSeatInput] = useState('');
  const [holdReason, setHoldReason] = useState('VIP Protocol Hold');
  const [holdShowId, setHoldShowId] = useState('501');

  // Hardware Camera & File Scanner states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scan if query param present
  useEffect(() => {
    if (urlScanId) {
      handleVerifyTicket(urlScanId);
    } else {
      handleVerifyTicket('5001');
    }
  }, [urlScanId]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleVerifyTicket = (idToScan: string) => {
    setScanError(null);
    let cleaned = idToScan.trim();
    // Parse CineGo QR Code payload: CINEGO-TICKET:<bookingId>:<movieTitle>:<theatreName>...
    if (cleaned.includes('CINEGO-TICKET:')) {
      const match = cleaned.match(/CINEGO-TICKET:(\d+)/);
      if (match) {
        cleaned = match[1];
      }
    } else {
      const digits = cleaned.match(/\d+/);
      if (digits) {
        cleaned = digits[0];
      }
    }

    let found = bookingsList.find((b) => b.bookingId.toString() === cleaned);

    // Fallback 1: Check localStorage for real confirmed bookings created during checkout
    if (!found) {
      try {
        const storedDirect = localStorage.getItem(`cinego_booking_${cleaned}`);
        if (storedDirect) {
          const parsed = JSON.parse(storedDirect);
          found = {
            bookingId: Number(cleaned) || 5100,
            customerName: parsed.customerName || 'Cinema Customer',
            customerEmail: parsed.customerEmail || 'customer@gmail.com',
            phone: parsed.customerMobile || '+91 9597314692',
            theatreName: parsed.theatreName || currentTheatre.name,
            movieTitle: parsed.movieTitle || 'Baththa',
            screenName: parsed.screenName || 'Screen 1',
            showTime: parsed.showTime || '07:30 PM',
            showDate: parsed.showDate || new Date().toISOString().split('T')[0],
            seats: parsed.seats || ['A4', 'A5'],
            numTickets: parsed.seats?.length || 2,
            amount: parsed.totalAmount || parsed.finalPayable || 620,
            status: parsed.status || 'CONFIRMED',
            isUsed: false,
          };
        } else {
          const customerBookings = JSON.parse(localStorage.getItem('cinego_customer_bookings') || '[]');
          if (Array.isArray(customerBookings)) {
            const matchInList = customerBookings.find((b: any) => String(b.id) === String(cleaned) || String(b.bookingId) === String(cleaned));
            if (matchInList) {
              found = {
                bookingId: Number(cleaned) || 5100,
                customerName: matchInList.customerName || 'Cinema Customer',
                customerEmail: matchInList.customerEmail || 'customer@gmail.com',
                phone: matchInList.customerMobile || '+91 9597314692',
                theatreName: matchInList.theatreName || currentTheatre.name,
                movieTitle: matchInList.movieTitle || 'Baththa',
                screenName: matchInList.screenName || 'Screen 1',
                showTime: matchInList.showTime || '07:30 PM',
                showDate: matchInList.showDate || new Date().toISOString().split('T')[0],
                seats: matchInList.seats || ['A4', 'A5'],
                numTickets: matchInList.seats?.length || 2,
                amount: matchInList.totalAmount || matchInList.finalPayable || 620,
                status: matchInList.status || 'CONFIRMED',
                isUsed: false,
              };
            }
          }
        }
      } catch {}
    }

    // Fallback 2: Parse raw QR payload format CINEGO-TICKET:bookingId:movieTitle:theatreName:screenName:seats:numTickets
    if (!found && idToScan.includes('CINEGO-TICKET:')) {
      try {
        const parts = idToScan.split(':');
        if (parts.length >= 6) {
          const bId = Number(parts[1]) || Number(cleaned) || 5100;
          const movie = decodeURIComponent(parts[2] || 'Baththa');
          const theatre = decodeURIComponent(parts[3] || currentTheatre.name);
          const screen = decodeURIComponent(parts[4] || 'Screen 1');
          const seatsArr = decodeURIComponent(parts[5] || 'A4,A5').split(',').map((s) => s.trim());
          const count = Number(parts[6]) || seatsArr.length;
          found = {
            bookingId: bId,
            customerName: 'Mobile QR Guest',
            customerEmail: 'ticket@cinego.com',
            phone: '+91 9597314692',
            theatreName: theatre,
            movieTitle: movie,
            screenName: screen,
            showTime: 'Today',
            showDate: new Date().toISOString().split('T')[0],
            seats: seatsArr,
            numTickets: count,
            amount: 560,
            status: 'CONFIRMED',
            isUsed: false,
          };
        }
      } catch {}
    }

    if (found) {
      setScannedResult(found);
      setScanInput(cleaned);
      if (found.status === 'CANCELLED') {
        toast.error(`Booking #${found.bookingId} is CANCELLED / REFUNDED! Entry Denied.`);
      } else if (found.isUsed) {
        toast('⚠️ Ticket already marked as USED!', { icon: '⚠️' });
      } else {
        toast.success(`Ticket #${found.bookingId} verified! ${found.numTickets} Seats: ${found.seats.join(', ')}`);
      }
    } else {
      setScannedResult(null);
      setScanError(`No ticket record found for Reference #${idToScan}. Verify with customer.`);
      toast.error('Invalid ticket barcode / QR code');
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!qrScannerRef.current) {
        qrScannerRef.current = new Html5Qrcode('cinego-qr-reader');
      }
      setIsCameraActive(true);
      await qrScannerRef.current.start(
        { facingMode: 'user' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          handleVerifyTicket(decodedText);
          stopCamera();
        },
        () => {
          // Ignore interim frames where no QR is in view
        }
      );
    } catch (err: any) {
      console.error('Camera start error:', err);
      setIsCameraActive(false);
      const msg = err?.message || 'Unable to access laptop camera. Check browser permissions.';
      setCameraError(msg);
      toast.error('Camera access failed. Check browser permissions or use Screenshot upload.');
    }
  };

  const stopCamera = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
      } catch (err) {
        console.error('Camera stop error:', err);
      }
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const tempScanner = new Html5Qrcode('cinego-temp-reader');
      const decodedText = await tempScanner.scanFile(file, true);
      handleVerifyTicket(decodedText);
      tempScanner.clear();
      toast.success('Ticket QR successfully decoded from file!');
    } catch (err: any) {
      console.error('Image scan error:', err);
      toast.error('Could not detect a QR code in this image. Try another screenshot or enter Reference ID.');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleAdmitGuest = () => {
    if (!scannedResult) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = bookingsList.map((b) =>
      b.bookingId === scannedResult.bookingId
        ? { ...b, isUsed: true, usedAt: `${nowTime} at Turnstile Gate 2` }
        : b
    );
    setBookingsList(updated);
    setScannedResult({ ...scannedResult, isUsed: true, usedAt: `${nowTime} at Turnstile Gate 2` });
    toast.success(`Guest admitted! ${scannedResult.numTickets} ticket(s) punched.`);
  };

  const totalRevenue = TODAY_SHOWS.reduce((acc, s) => acc + s.revenue, 0);
  const totalSold = TODAY_SHOWS.reduce((acc, s) => acc + s.soldSeats, 0);
  const totalCapacity = TODAY_SHOWS.reduce((acc, s) => acc + s.totalSeats, 0);
  const overallOccupancy = Math.round((totalSold / totalCapacity) * 100);

  const handleUpdateFoodStatus = (orderId: string, nextStatus: 'READY' | 'DELIVERED') => {
    setFoodOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
    );
    toast.success(`Order #${orderId} marked as ${nextStatus === 'READY' ? 'READY FOR DELIVERY' : 'DELIVERED TO SEAT'}`);
  };

  const handlePlaceSeatHold = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSeat = holdSeatInput.trim().toUpperCase();
    if (!cleanSeat) {
      toast.error('Please enter a Seat ID (e.g. B1, B2)');
      return;
    }

    const showKey = `cinego_booked_seats_${holdShowId}`;
    try {
      const existing = JSON.parse(localStorage.getItem(showKey) || '[]');
      const updated = Array.from(new Set([...(Array.isArray(existing) ? existing : []), cleanSeat]));
      localStorage.setItem(showKey, JSON.stringify(updated));
      window.dispatchEvent(new Event('cinego_bookings_updated'));
    } catch {}

    const newHold: HeldSeatItem = {
      id: `HLD-${Date.now()}`,
      showId: holdShowId,
      screenName: holdShowId === '501' ? 'Screen 1' : 'Audi 2',
      seatId: cleanSeat,
      reason: holdReason,
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHeldSeats([newHold, ...heldSeats]);
    setHoldSeatInput('');
    toast.success(`Seat ${cleanSeat} placed on hold (${holdReason}). Disabled from customer bookings.`);
  };

  const handleReleaseSeatHold = (item: HeldSeatItem) => {
    const showKey = `cinego_booked_seats_${item.showId}`;
    try {
      const existing = JSON.parse(localStorage.getItem(showKey) || '[]');
      if (Array.isArray(existing)) {
        const freed = existing.filter((s: string) => s !== item.seatId);
        localStorage.setItem(showKey, JSON.stringify(freed));
        window.dispatchEvent(new Event('cinego_bookings_updated'));
      }
    } catch {}

    setHeldSeats((prev) => prev.filter((h) => h.id !== item.id));
    toast.success(`Seat ${item.seatId} released back to public availability.`);
  };

  return (
    <div className="min-h-screen relative text-white pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-display overflow-hidden">
      {/* Classy 3D Animated Background for Operations */}
      <CinematicBackground variant="manager" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Theatre Header */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Cinema Operations & Box Office Portal</span>
                <span className="text-zinc-500">&bull;</span>
                <span className="text-zinc-400 font-normal">Multi-Property Circuit Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">{currentTheatre.name}</h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Duty Manager: <strong>{currentTheatre.dutyManager}</strong> &bull; Screen Count: {currentTheatre.screens} &bull; Location: {currentTheatre.location}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Theatre Switcher Dropdown */}
              <div className="bg-zinc-900/90 border border-white/10 p-1.5 rounded-2xl flex items-center gap-2 shadow-inner">
                <Building2 className="w-4 h-4 text-emerald-400 ml-2" />
                <select
                  value={selectedTheatreId}
                  onChange={(e) => {
                    setSelectedTheatreId(e.target.value);
                    const selected = MANAGED_THEATRES.find((t) => t.id === e.target.value);
                    toast.success(`Switched active management terminal to ${selected?.name}`);
                  }}
                  className="bg-transparent text-xs font-bold text-white pr-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  {MANAGED_THEATRES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-zinc-950 text-white">
                      {t.name} ({t.location.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400">Terminal Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap bg-zinc-900 p-1.5 rounded-2xl border border-white/10 gap-1">
          <button
            onClick={() => setActiveTab('SHOWS')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'SHOWS'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Today's Shows & Lineup</span>
          </button>
          <button
            onClick={() => setActiveTab('PRICING')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'PRICING'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Seat Pricing & Rate Card</span>
          </button>
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'SCANNER'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Turnstile Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('OCCUPANCY')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'OCCUPANCY'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>Audi Occupancy</span>
          </button>
          <button
            onClick={() => setActiveTab('CONCESSIONS')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'CONCESSIONS'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>F&B Live Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('SEATHOLD')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'SEATHOLD'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Seat Lock & Hold</span>
          </button>
          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'BOOKINGS'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Admissions Ledger</span>
          </button>
        </div>

        {/* TAB 1: TICKET SCANNER & VERIFICATION PORTAL */}
        {activeTab === 'SCANNER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Scanner Control Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5 shadow-xl">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <QrCode className="w-4 h-4" />
                  <span>Optical Turnstile Scanner</span>
                </div>

                <h3 className="text-xl font-bold text-white">Scan Customer E-Ticket</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scan the customer's phone QR code or enter their booking reference to verify tickets, reserved seats, movie, and screen before admitting them.
                </p>

                {/* Real Live Hardware Scanner Viewfinder & Controls */}
                <div className="space-y-4">
                  {/* Viewfinder Container */}
                  <div className="relative aspect-video rounded-2xl bg-black border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center p-2 overflow-hidden shadow-inner">
                    {/* HTML5 QR Code DOM Target */}
                    <div
                      id="cinego-qr-reader"
                      className={`w-full h-full overflow-hidden rounded-xl ${isCameraActive ? 'block' : 'hidden'}`}
                    />
                    <div id="cinego-temp-reader" className="hidden" />

                    {!isCameraActive ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-emerald-400 shadow-md">
                          <Camera className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-mono text-zinc-300 font-bold">
                          Webcam Turnstile Standby
                        </span>
                        <p className="text-[11px] text-zinc-500 max-w-xs">
                          Click below to start your laptop camera and scan customer e-tickets in real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[10px] font-mono font-bold text-emerald-300">LIVE SCANNING</span>
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  {/* Camera Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {!isCameraActive ? (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Start Laptop Camera</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
                      >
                        <CameraOff className="w-4 h-4" />
                        <span>Stop Camera</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload QR Image</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Laptop Guidance Info Card */}
                  <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>How Scanning Works on a Laptop:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-400 leading-relaxed text-[10.5px]">
                      <li><strong className="text-zinc-300">Live Webcam:</strong> Hold customer phone QR code 6–10 inches in front of laptop camera.</li>
                      <li><strong className="text-zinc-300">Upload Screenshot:</strong> Drop or select a screenshot/photo of the ticket QR code.</li>
                      <li><strong className="text-zinc-300">Booking Reference:</strong> Enter the 4-digit code (<code className="text-emerald-400 font-mono">#5001</code>) displayed on the ticket.</li>
                    </ul>
                  </div>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyTicket(scanInput);
                  }}
                  className="space-y-3"
                >
                  <label className="block text-xs font-semibold text-zinc-400">
                    Booking Reference ID / Barcode:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      placeholder="Enter booking ID (5001)"
                      className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/30"
                    >
                      Verify
                    </button>
                  </div>
                </form>

                {/* Quick Simulation Tags for Evaluation */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[11px] text-zinc-400 font-bold block">
                    Quick One-Click Test Tickets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setScanInput('5001');
                        handleVerifyTicket('5001');
                      }}
                      className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-400 text-zinc-300 hover:text-white"
                    >
                      #5001 (Baththa &bull; 2 Seats)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScanInput('5002');
                        handleVerifyTicket('5002');
                      }}
                      className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-400 text-zinc-300 hover:text-white"
                    >
                      #5002 (Used Ticket)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScanInput('5009');
                        handleVerifyTicket('5009');
                      }}
                      className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-red-400 text-zinc-300 hover:text-white"
                    >
                      #5009 (Cancelled)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Scanned Ticket Manifest Details */}
            <div className="lg:col-span-7">
              {scannedResult ? (
                <div
                  className={`glass-card rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
                    scannedResult.status === 'CANCELLED'
                      ? 'border-red-500/40 bg-red-950/20'
                      : scannedResult.isUsed
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : 'border-emerald-500/40 bg-emerald-950/20'
                  }`}
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Verification Status
                      </span>
                      {scannedResult.status === 'CANCELLED' ? (
                        <div className="flex items-center text-red-400 font-black text-xl mt-0.5">
                          <XCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                          <span>ENTRY DENIED &bull; BOOKING CANCELLED</span>
                        </div>
                      ) : scannedResult.isUsed ? (
                        <div className="flex items-center text-amber-400 font-black text-xl mt-0.5">
                          <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                          <span>ALREADY ADMITTED &bull; DO NOT RE-ADMIT</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-emerald-400 font-black text-2xl mt-0.5">
                          <CheckCircle2 className="w-7 h-7 mr-2 flex-shrink-0" />
                          <span>VALID TICKET &bull; ADMISSION APPROVED</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-mono">Booking ID</span>
                      <p className="text-2xl font-black font-mono text-white">#{scannedResult.bookingId}</p>
                    </div>
                  </div>

                  {/* Movie Info with Poster */}
                  <div className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <img
                      src={scannedResult.posterUrl}
                      alt={scannedResult.movieTitle}
                      className="w-20 aspect-[2/3] object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        Feature Film
                      </span>
                      <h4 className="text-2xl font-black text-white">{scannedResult.movieTitle}</h4>
                      <p className="text-xs text-zinc-300">{scannedResult.theatreName}</p>
                      <p className="text-xs text-emerald-400 font-semibold">{scannedResult.screenName}</p>
                    </div>
                  </div>

                  {/* Crucial Verification Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                        Tickets Count
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {scannedResult.numTickets} {scannedResult.numTickets === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                        Reserved Seats
                      </span>
                      <span className="text-2xl font-black text-primary font-mono">
                        {scannedResult.seats.join(', ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                        Show Schedule
                      </span>
                      <span className="text-sm font-bold text-white block">
                        {scannedResult.showDate}
                      </span>
                      <span className="text-xs text-amber-400 font-mono font-bold">
                        {scannedResult.showTime}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Customer Name:</span>
                      <span className="text-white font-bold">{scannedResult.customerName}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Phone:</span>
                      <span className="text-white font-mono">{scannedResult.phone}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Payment Verified:</span>
                      <span className="text-emerald-400 font-bold">₹{scannedResult.amount} (Paid via UPI)</span>
                    </div>
                    {scannedResult.isUsed && scannedResult.usedAt && (
                      <div className="pt-2 border-t border-white/5 flex justify-between text-amber-300">
                        <span>Punched At:</span>
                        <span>{scannedResult.usedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Punch / Mark Admitted Action */}
                  <div className="pt-2">
                    {scannedResult.status === 'CONFIRMED' && !scannedResult.isUsed && (
                      <button
                        onClick={handleAdmitGuest}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Admit Guest & Punch Ticket ({scannedResult.numTickets} Seats: {scannedResult.seats.join(', ')})
                      </button>
                    )}

                    {scannedResult.isUsed && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-300 font-semibold">
                        This voucher was already redeemed. Turnstile remains locked.
                      </div>
                    )}

                    {scannedResult.status === 'CANCELLED' && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs text-red-300 font-semibold">
                        Admission revoked. Customer was refunded. Do not admit.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/10 text-zinc-500 space-y-3">
                  <ScanLine className="w-12 h-12 mx-auto text-zinc-600" />
                  <p className="text-sm font-semibold text-zinc-400">Awaiting Ticket Scan</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {scanError || 'Enter or scan any booking reference above to view ticket count, movie, screen, and seat assignments.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: TODAY'S SHOWS (LANDING PAGE - FEATURING BATHTHA) */}
        {activeTab === 'SHOWS' && (
          <div className="space-y-6">
            {/* FEATURED HEADLINER HERO: BATHTHA */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative w-28 h-40 sm:w-32 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80"
                      alt="Baththa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                      DOLBY ATMOS
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Today's Prime Attraction
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Screen 1 &bull; 85 Seats
                      </span>
                      <span className="text-[11px] font-bold text-amber-400">
                        UA &bull; Tamil
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-wide">
                      Baththa
                    </h2>

                    <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                      Leading cinema box office today at PVR INOX White Town. Running across 3 major daily showtimes with 88% overall day capacity sold.
                    </p>

                    {/* Today's Baththa Screenings Strip */}
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <div className="px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">10:30 AM</span>
                          <span className="text-[10px] text-zinc-400 font-mono">72/85 Sold (85%) &bull; ₹14,400</span>
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">01:30 PM</span>
                          <span className="text-[10px] text-zinc-400 font-mono">68/85 Sold (80%) &bull; ₹13,600</span>
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <div>
                          <span className="text-xs font-bold text-white block">07:30 PM (Dolby)</span>
                          <span className="text-[10px] text-primary font-mono font-bold">85/85 HOUSEFULL &bull; ₹21,250</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts for Manager */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('PRICING')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Adjust Screen 1 Pricing</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('OCCUPANCY')}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Armchair className="w-4 h-4 text-blue-400" />
                    <span>View Audi 1 Telemetry</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('SCANNER')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ScanLine className="w-4 h-4 text-emerald-400" />
                    <span>Open Gate Scanner</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daily KPI Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Today's Box Office Gross</span>
                <p className="text-3xl font-black text-emerald-400 mt-2">₹{totalRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">Baththa Gross: ₹49,250 (58% of gross)</span>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Seats Sold</span>
                <p className="text-3xl font-black text-white mt-2">{totalSold} / {totalCapacity}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">390 Total Daily Capacity across 5 shows</span>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Overall Occupancy</span>
                <p className="text-3xl font-black text-primary mt-2">{overallOccupancy}%</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">Surge Pricing Threshold: &gt;80% Active</span>
              </div>
            </div>

            {/* Full Auditorium Schedule Table */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Full Auditorium Screening Schedule</h3>
                  <p className="text-xs text-zinc-400">All screenings scheduled today at PVR INOX White Town</p>
                </div>
                <button
                  onClick={() => setActiveTab('PRICING')}
                  className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" /> Configure Rate Cards →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Movie</th>
                      <th className="p-3">Screen</th>
                      <th className="p-3">Format</th>
                      <th className="p-3">Occupancy</th>
                      <th className="p-3">Gross Revenue</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {TODAY_SHOWS.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{s.time}</td>
                        <td className="p-3 font-semibold text-primary">{s.movieTitle}</td>
                        <td className="p-3 text-zinc-300">{s.screenName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono border border-white/10">
                            {s.format}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <div className="flex items-center gap-2">
                            <span>{s.soldSeats} / {s.totalSeats}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              s.soldSeats === s.totalSeats
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {Math.round((s.soldSeats/s.totalSeats)*100)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">₹{s.revenue.toLocaleString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedPricingScreen(s.screenName.includes('Audi 2') ? 'Audi 2' : 'Screen 1');
                              setActiveTab('PRICING');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-all border border-white/10 cursor-pointer"
                          >
                            Edit Pricing
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RATE CARD & SEAT PRICING (THEATRE OWNER / MANAGER MULTI-TIER PRICING) */}
        {activeTab === 'PRICING' && (
          <div className="space-y-6">
            {/* Header & Screen Selector */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Coins className="w-5 h-5 text-amber-400 mr-2" /> Theatre Rate Card & Seat Tier Pricing
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Theatre Owner / Manager controls: Configure base prices, 4-tier seat class rates (Regular, Premium, Executive, Recliner), showtime shifts, and holiday modifiers.
                  </p>
                </div>

                {/* CinemaBook Admin Governance Policy Badge */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-purple-500/30 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div className="text-[11px]">
                    <span className="text-purple-300 font-bold block">CinemaBook Admin Policy Active</span>
                    <span className="text-zinc-400">
                      Floor: <strong className="text-white font-mono">₹60</strong> &bull; Ceiling: <strong className="text-white font-mono">₹500</strong> &bull; Fee: <strong className="text-white font-mono">₹30</strong> &bull; Tax: <strong className="text-white font-mono">18% GST</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Screen Selector Tabs */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(['Screen 1', 'Audi 2', 'Audi 3'] as const).map((screen) => (
                  <button
                    key={screen}
                    onClick={() => setSelectedPricingScreen(screen)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      selectedPricingScreen === screen
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <MonitorPlay className="w-4 h-4" />
                    <span>{screen}</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      ({screen === 'Screen 1' ? 'Dolby Atmos' : screen === 'Audi 2' ? 'Digital 4K' : 'IMAX Laser'})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 4-Tier Seat Class Pricing Setup */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-400" />
                        Multi-Tier Seat Class Pricing ({selectedPricingScreen})
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Set distinct ticket pricing per seat row tier. Changes apply to all upcoming show schedules.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Base: ₹{pricingRules[selectedPricingScreen].basePrice}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Tier 1: Regular */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Regular Class</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Rows D – H &bull; 45 Seats</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">Standard comfortable cinema seating with optimal screen view.</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-zinc-400 font-bold">₹</span>
                        <input
                          type="number"
                          min={60}
                          max={500}
                          value={pricingRules[selectedPricingScreen].regular}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPricingRules((prev) => ({
                              ...prev,
                              [selectedPricingScreen]: { ...prev[selectedPricingScreen], regular: val, basePrice: val },
                            }));
                          }}
                          className="w-20 bg-zinc-950 border border-white/20 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Tier 2: Premium */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Premium Class</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">Rows B – C &bull; 30 Seats</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">Elevated tiered rows with wider legroom and prime soundstage alignment.</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-zinc-400 font-bold">₹</span>
                        <input
                          type="number"
                          min={60}
                          max={500}
                          value={pricingRules[selectedPricingScreen].premium}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPricingRules((prev) => ({
                              ...prev,
                              [selectedPricingScreen]: { ...prev[selectedPricingScreen], premium: val },
                            }));
                          }}
                          className="w-20 bg-zinc-950 border border-white/20 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Tier 3: Executive */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Executive Class</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">Row A Prime &bull; 10 Seats</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">Center panoramic vantage point with personal cup holder consoles.</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-zinc-400 font-bold">₹</span>
                        <input
                          type="number"
                          min={60}
                          max={500}
                          value={pricingRules[selectedPricingScreen].executive}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPricingRules((prev) => ({
                              ...prev,
                              [selectedPricingScreen]: { ...prev[selectedPricingScreen], executive: val },
                            }));
                          }}
                          className="w-20 bg-zinc-950 border border-white/20 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Tier 4: Recliner VIP */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-amber-500/30 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/5 to-transparent">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-300">Recliner / VIP Lounge</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">Row J Lounge &bull; 10 Seats</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">Electronic motorized leather recliner with blanket, USB charger & in-seat food service.</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-amber-400 font-bold">₹</span>
                        <input
                          type="number"
                          min={60}
                          max={500}
                          value={pricingRules[selectedPricingScreen].recliner}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPricingRules((prev) => ({
                              ...prev,
                              [selectedPricingScreen]: { ...prev[selectedPricingScreen], recliner: val },
                            }));
                          }}
                          className="w-20 bg-zinc-950 border border-amber-500/50 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showtime & Calendar Day Modifiers */}
                <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Showtime & Calendar Day Pricing Modifiers
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Theatre Owner can create morning discounts and weekend/holiday premium surcharges.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Morning Discount */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-300">Morning Show Discount</span>
                        <span className="text-emerald-400 font-mono font-bold">-₹{pricingRules[selectedPricingScreen].morningDiscount}</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-500">Shows starting before 12:00 PM (e.g. 10:30 AM Baththa).</p>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={5}
                        value={pricingRules[selectedPricingScreen].morningDiscount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPricingRules((prev) => ({
                            ...prev,
                            [selectedPricingScreen]: { ...prev[selectedPricingScreen], morningDiscount: val },
                          }));
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Prime Evening Surcharge */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-300">Prime Evening Surcharge</span>
                        <span className="text-amber-400 font-mono font-bold">+₹{pricingRules[selectedPricingScreen].primeEveningSurcharge}</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-500">Shows starting after 06:00 PM (e.g. 07:30 PM Baththa).</p>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={5}
                        value={pricingRules[selectedPricingScreen].primeEveningSurcharge}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPricingRules((prev) => ({
                            ...prev,
                            [selectedPricingScreen]: { ...prev[selectedPricingScreen], primeEveningSurcharge: val },
                          }));
                        }}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Weekend Surcharge */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-300">Weekend Surcharge</span>
                        <span className="text-purple-400 font-mono font-bold">+₹{pricingRules[selectedPricingScreen].weekendSurcharge}</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-500">Applies to all Saturday & Sunday showtime slots.</p>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={10}
                        value={pricingRules[selectedPricingScreen].weekendSurcharge}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPricingRules((prev) => ({
                            ...prev,
                            [selectedPricingScreen]: { ...prev[selectedPricingScreen], weekendSurcharge: val },
                          }));
                        }}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Holiday Surcharge */}
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-300">Public Holiday Special</span>
                        <span className="text-rose-400 font-mono font-bold">+₹{pricingRules[selectedPricingScreen].holidaySurcharge}</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-500">Applies on festival dates (Pongal, Diwali, New Year).</p>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={10}
                        value={pricingRules[selectedPricingScreen].holidaySurcharge}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPricingRules((prev) => ({
                            ...prev,
                            [selectedPricingScreen]: { ...prev[selectedPricingScreen], holidaySurcharge: val },
                          }));
                        }}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Simulator, Policy Compliance & Save */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live Customer Fare Simulator */}
                <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Live Customer Fare Simulator
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400">Inc. 18% GST</span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Real-time calculation of what a CineGo moviegoer pays at checkout for {selectedPricingScreen}:
                  </p>

                  <div className="space-y-2.5">
                    {/* Morning Regular */}
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">Morning Show &bull; Regular Seat</span>
                        <span className="text-[10px] text-zinc-400">Base ₹{pricingRules[selectedPricingScreen].regular} - ₹{pricingRules[selectedPricingScreen].morningDiscount} discount</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-sm">
                        ₹{Math.max(60, pricingRules[selectedPricingScreen].regular - pricingRules[selectedPricingScreen].morningDiscount)}
                      </span>
                    </div>

                    {/* Evening Premium */}
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">Evening Prime &bull; Premium Seat</span>
                        <span className="text-[10px] text-zinc-400">Base ₹{pricingRules[selectedPricingScreen].premium} + ₹{pricingRules[selectedPricingScreen].primeEveningSurcharge} surcharge</span>
                      </div>
                      <span className="text-white font-mono font-bold text-sm">
                        ₹{pricingRules[selectedPricingScreen].premium + pricingRules[selectedPricingScreen].primeEveningSurcharge}
                      </span>
                    </div>

                    {/* Weekend Executive */}
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">Weekend &bull; Executive Seat</span>
                        <span className="text-[10px] text-zinc-400">Base ₹{pricingRules[selectedPricingScreen].executive} + ₹{pricingRules[selectedPricingScreen].weekendSurcharge} weekend</span>
                      </div>
                      <span className="text-purple-400 font-mono font-bold text-sm">
                        ₹{pricingRules[selectedPricingScreen].executive + pricingRules[selectedPricingScreen].weekendSurcharge}
                      </span>
                    </div>

                    {/* Holiday Recliner VIP */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-amber-300 block">Holiday &bull; Recliner Lounge VIP</span>
                        <span className="text-[10px] text-zinc-400">Base ₹{pricingRules[selectedPricingScreen].recliner} + ₹{pricingRules[selectedPricingScreen].holidaySurcharge} holiday</span>
                      </div>
                      <span className="text-amber-400 font-mono font-black text-base">
                        ₹{pricingRules[selectedPricingScreen].recliner + pricingRules[selectedPricingScreen].holidaySurcharge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Policy Compliance Audit Card */}
                <div className="p-5 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CinemaBook Governance Validation</span>
                  </div>

                  <ul className="text-[11px] text-zinc-400 space-y-1.5 leading-relaxed">
                    <li className="flex items-center justify-between">
                      <span>Price Floor Check (&ge; ₹60):</span>
                      <strong className="text-emerald-400 font-mono">PASSED ✓</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Price Ceiling Check (&le; ₹500):</span>
                      <strong className={`${
                        pricingRules[selectedPricingScreen].recliner + pricingRules[selectedPricingScreen].holidaySurcharge <= 500
                          ? 'text-emerald-400 font-mono'
                          : 'text-amber-400 font-mono'
                      }`}>
                        {pricingRules[selectedPricingScreen].recliner + pricingRules[selectedPricingScreen].holidaySurcharge <= 500
                          ? 'PASSED ✓'
                          : 'NEEDS ADMIN APPROVAL ⚠️'}
                      </strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Convenience Fee per Seat:</span>
                      <strong className="text-white font-mono">₹30 (Fixed Platform)</strong>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Tax Architecture:</span>
                      <strong className="text-white font-mono">9% CGST + 9% SGST</strong>
                    </li>
                  </ul>
                </div>

                {/* Save Rate Card Action */}
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Rate card and tiered seat pricing saved for ${selectedPricingScreen}!`);
                  }}
                  className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center transition-all cursor-pointer"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Save & Publish Rate Card for {selectedPricingScreen}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDI REAL-TIME OCCUPANCY */}
        {activeTab === 'OCCUPANCY' && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Armchair className="w-5 h-5 text-blue-400 mr-2" /> Real-Time Auditorium Seat Occupancy
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live telemetry across Screen 1, Audi 2, and Audi 3 showing ticketed seats vs available inventory.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-zinc-400">Available</span>
                  <span className="w-3 h-3 rounded-full bg-primary ml-2"></span>
                  <span className="text-zinc-400">Booked</span>
                  <span className="w-3 h-3 rounded-full bg-purple-500 ml-2"></span>
                  <span className="text-zinc-400">Staff Held</span>
                </div>
              </div>

              {/* Screens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-zinc-900/80 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">Screen 1 &bull; Dolby Atmos</h4>
                    <span className="text-xs font-mono font-bold text-emerald-400">85% Full</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '85%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Sold: <strong className="text-white">72</strong></span>
                    <span>Held: <strong className="text-purple-400">3</strong></span>
                    <span>Free: <strong className="text-emerald-400">10</strong></span>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                    Now Playing: <strong className="text-zinc-200">Baththa (Tamil - 2D)</strong>
                  </div>
                </div>

                <div className="bg-zinc-900/80 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">Audi 2 &bull; Digital 4K</h4>
                    <span className="text-xs font-mono font-bold text-emerald-400">94% Full</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '94%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Sold: <strong className="text-white">80</strong></span>
                    <span>Held: <strong className="text-purple-400">0</strong></span>
                    <span>Free: <strong className="text-emerald-400">5</strong></span>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                    Now Playing: <strong className="text-zinc-200">Yezhu Kadal Yezhu Malai</strong>
                  </div>
                </div>

                <div className="bg-zinc-900/80 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">Audi 3 &bull; IMAX Laser</h4>
                    <span className="text-xs font-mono font-bold text-blue-400">64% Full</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: '64%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Sold: <strong className="text-white">54</strong></span>
                    <span>Held: <strong className="text-purple-400">1</strong></span>
                    <span>Free: <strong className="text-emerald-400">30</strong></span>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                    Now Playing: <strong className="text-zinc-200">Digger (Tamil)</strong>
                  </div>
                </div>
              </div>

              {/* Visual Seat Map Telemetry for Screen 1 */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-zinc-300">Screen 1 Physical Seat Grid Sensor (72 / 85 Occupied)</h4>
                <div className="p-6 bg-black/60 rounded-2xl border border-white/5 flex flex-col items-center">
                  <div className="cinema-screen mb-6 max-w-sm w-full"></div>
                  <div className="space-y-2 text-center overflow-x-auto pb-2 w-full">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
                      <div key={row} className="flex justify-center items-center gap-1.5 min-w-max">
                        <span className="w-4 text-[10px] text-zinc-500 font-bold">{row}</span>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                          const id = `${row}${num}`;
                          const isHeld = ['B1', 'B2', 'E6'].includes(id);
                          const isFree = ['A1', 'A2', 'C11', 'C12', 'F1', 'F2', 'G11', 'G12'].includes(id);
                          return (
                            <div
                              key={id}
                              className={`w-6 h-5 rounded-t text-[8px] font-bold flex items-center justify-center ${
                                isHeld
                                  ? 'bg-purple-600 text-white'
                                  : isFree
                                  ? 'border border-emerald-500 text-emerald-400 bg-emerald-500/10'
                                  : 'bg-zinc-800 text-zinc-500'
                              }`}
                              title={`Seat ${id} - ${isHeld ? 'Held' : isFree ? 'Available' : 'Booked'}`}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE F&B CONCESSIONS KITCHEN QUEUE */}
        {activeTab === 'CONCESSIONS' && (
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Utensils className="w-5 h-5 text-amber-400 mr-2" /> Live Concessions & Kitchen Queue
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Track snacks and drinks pre-ordered by cinema guests with assigned seat numbers for in-theatre delivery.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {foodOrders.filter((o) => o.status !== 'DELIVERED').length} Orders Pending Prep/Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-zinc-900/90 rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-black text-amber-400">#{order.orderId}</span>
                        <h4 className="font-bold text-white mt-0.5">{order.customerName}</h4>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          order.status === 'READY'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : order.status === 'PREPARING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <p className="text-zinc-400">
                        Audi: <strong className="text-white">{order.screenName}</strong> ({order.showTime})
                      </p>
                      <p className="text-primary font-bold">
                        Delivery to Seat: {order.seats}
                      </p>
                      <p className="text-zinc-300 pt-1 border-t border-white/5">
                        Items: {order.items}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="font-bold text-white text-sm">₹{order.totalPrice}</span>
                    <div className="space-x-2">
                      {order.status === 'PREPARING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateFoodStatus(order.orderId, 'READY')}
                          className="text-xs py-1.5 rounded-xl text-amber-400 border-amber-500/30"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'READY' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateFoodStatus(order.orderId, 'DELIVERED')}
                          className="text-xs py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500"
                        >
                          Dispatch to Seat {order.seats}
                        </Button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span className="text-xs text-zinc-500 font-semibold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BOX OFFICE MAINTENANCE & VIP SEAT HOLD */}
        {activeTab === 'SEATHOLD' && (
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Lock className="w-5 h-5 text-purple-400 mr-2" /> Box Office Seat Lock & Maintenance Hold
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Temporarily lock seats for VIP protocol delegations or hardware maintenance to prevent customer booking online.
                </p>
              </div>
            </div>

            {/* Place Hold Form */}
            <form onSubmit={handlePlaceSeatHold} className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center">
                <Plus className="w-4 h-4 text-purple-400 mr-1.5" /> Place Seat Lock
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Select Show</label>
                  <select
                    value={holdShowId}
                    onChange={(e) => setHoldShowId(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="501">Screen 1 &bull; 10:30 AM (Baththa)</option>
                    <option value="504">Screen 1 &bull; 07:30 PM (Baththa)</option>
                    <option value="506">Audi 2 &bull; 10:30 AM (Yezhu Kadal)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Seat Number (e.g. B1, B2, J4)</label>
                  <input
                    type="text"
                    placeholder="e.g. B1"
                    value={holdSeatInput}
                    onChange={(e) => setHoldSeatInput(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Hold Reason</label>
                  <select
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="VIP Protocol Hold">VIP Protocol Hold</option>
                    <option value="Damaged Recliner Armrest Repair">Damaged Recliner Repair</option>
                    <option value="Defective Dolby Headphone Jack">Defective Audio Jack</option>
                    <option value="Duty Manager Operational Reserve">Duty Manager Reserve</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button type="submit" variant="primary" className="w-full bg-purple-600 hover:bg-purple-500 rounded-xl py-2 font-bold text-xs">
                    Lock Seat Immediately
                  </Button>
                </div>
              </div>
            </form>

            {/* Currently Held Seats Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-zinc-300">Currently Held / Blocked Seats ({heldSeats.length})</h4>
              <div className="overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Audi Screen</th>
                      <th className="p-3">Seat ID</th>
                      <th className="p-3">Lock Reason</th>
                      <th className="p-3">Time Held</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {heldSeats.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="p-3 font-semibold text-white">{item.screenName}</td>
                        <td className="p-3 font-mono font-bold text-purple-400 text-sm">{item.seatId}</td>
                        <td className="p-3 text-zinc-300">{item.reason}</td>
                        <td className="p-3 text-zinc-400 font-mono">{item.heldAt}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleReleaseSeatHold(item)}
                            className="text-xs text-red-400 hover:underline font-bold flex items-center justify-end ml-auto"
                          >
                            <Unlock className="w-3.5 h-3.5 mr-1" /> Release to Public
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BOOKINGS MANIFEST */}
        {activeTab === 'BOOKINGS' && (
          <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4">Cinema Admissions Manifest</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Movie</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Show</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookingsList.map((b) => (
                    <tr key={b.bookingId} className="hover:bg-white/5">
                      <td className="p-3 font-mono font-bold text-white">#{b.bookingId}</td>
                      <td className="p-3 text-zinc-300">{b.customerName}</td>
                      <td className="p-3 font-semibold text-white">{b.movieTitle}</td>
                      <td className="p-3 font-mono text-primary font-bold">{b.seats.join(', ')}</td>
                      <td className="p-3 text-zinc-400">{b.showDate} {b.showTime}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'CONFIRMED'
                              ? b.isUsed
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {b.status === 'CONFIRMED' ? (b.isUsed ? 'PUNCHED' : 'CONFIRMED') : 'CANCELLED'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setScanInput(b.bookingId.toString());
                            handleVerifyTicket(b.bookingId.toString());
                            setActiveTab('SCANNER');
                          }}
                          className="text-xs text-emerald-400 hover:underline font-bold"
                        >
                          Scan &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
