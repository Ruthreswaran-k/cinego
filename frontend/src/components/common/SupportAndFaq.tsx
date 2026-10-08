import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Ticket, 
  CreditCard, 
  RefreshCw,
  Utensils
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'BOOKING' | 'REFUND' | 'OFFERS' | 'CINEMA';
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'REFUND',
    question: 'How do I cancel my booked ticket and get a refund?',
    answer:
      'You can cancel your booking up to 2 hours before the scheduled showtime from your "Bookings" tab in your profile. Once cancelled, an automated 100% refund is initiated immediately back to your original payment mode (UPI, Net Banking, or Credit/Debit Card) via our Oracle transaction refund procedure within 2 hours.',
  },
  {
    id: 'faq-2',
    category: 'BOOKING',
    question: 'Do I need a physical printout at the cinema turnstile?',
    answer:
      'No physical printout is necessary! CineGo generates a digital M-Ticket with an encrypted QR code. When you arrive at the cinema, simply open your E-Ticket on your smartphone screen and present it to the turnstile gate scanner or duty usher for immediate admission.',
  },
  {
    id: 'faq-3',
    category: 'OFFERS',
    question: 'How do I apply bank offers like Axis Bank BOGO or ICICI Gemstone?',
    answer:
      'During checkout on the Payment screen, select the "Offers & Coupons" section. Choose your applicable partner card (e.g. Axis Bank MY ZONE Buy-1-Get-1, ICICI Bank 25% off, or HDFC Millennia). Your discount will be deducted automatically from the final ticket subtotal before convenience fee calculation.',
  },
  {
    id: 'faq-4',
    category: 'CINEMA',
    question: 'Can I order Popcorn and Snacks directly to my seat?',
    answer:
      'Yes! You can add snacks, cheese popcorn, and chilled beverages during the booking process or directly inside the cinema. Live kitchen orders are dispatched right to your designated auditorium seat during the 15-minute intermission.',
  },
  {
    id: 'faq-5',
    category: 'BOOKING',
    question: 'What should I do if money was deducted but the ticket was not confirmed?',
    answer:
      'If your bank deducted money but the booking timed out due to network congestion, don\'t worry! Our automated reconciliation procedure verifies payment status within 10 minutes. If unconfirmed, an automatic full reversal is triggered. You can also call or WhatsApp our emergency helpdesk at 9597314692 for instantaneous manual ticket generation.',
  },
  {
    id: 'faq-6',
    category: 'CINEMA',
    question: 'How do I contact customer support if I am already at the cinema counter?',
    answer:
      'Our dedicated 24/7 cinema concierge desk is available at +91 9597314692. You can call or text us via WhatsApp with your 4-digit booking reference number (#5001) for immediate counter assistance.',
  },
];

export const SupportAndFaq: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs =
    activeCategory === 'ALL' ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-8 font-display">
      {/* 24/7 Dedicated Support Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-primary animate-pulse" />
              <span>24/7 CineGo Customer Concierge & Box Office Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Need Instant Help with Your Booking?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Have questions regarding seat reservations, cancellation, M-ticket entry, or payment queries? Our dedicated cinema care team is standing by 24 hours a day to assist you.
            </p>
          </div>

          {/* Quick Contact Buttons with Official Number: 9597314692 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
            {/* Click to Call */}
            <a
              href="tel:9597314692"
              className="px-5 py-3.5 rounded-2xl bg-primary hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 9597314692</span>
            </a>

            {/* Click to WhatsApp */}
            <a
              href="https://wa.me/919597314692?text=Hi%20CineGo%20Support,%20I%20need%20assistance%20with%20my%20movie%20ticket%20booking"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 9597314692</span>
            </a>
          </div>
        </div>

        {/* Support Channels 3-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 font-medium block">Dedicated Phone Helpline</span>
            <p className="text-base font-bold text-white font-mono">+91 9597314692</p>
            <span className="text-[11px] text-emerald-400 font-semibold block">Instant live representative</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 font-medium block">WhatsApp Chat Desk</span>
            <p className="text-base font-bold text-white font-mono">9597314692</p>
            <span className="text-[11px] text-emerald-400 font-semibold block">Under 2 min average reply</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1">
            <span className="text-zinc-400 font-medium block">Official Support Email</span>
            <p className="text-base font-bold text-white font-mono">support@cinego.com</p>
            <span className="text-[11px] text-zinc-400 block">Billing & corporate inquiries</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Got Questions? We've Got Answers</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Everything you need to know about booking tickets, instant cancellations, and theatre protocols.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs">
            {['ALL', 'BOOKING', 'REFUND', 'OFFERS', 'CINEMA'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/90 border-primary/40 shadow-lg shadow-primary/5'
                    : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-white hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-primary/20 text-primary' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 mt-1 pt-3">
                    <p>{faq.answer}</p>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
                      <span>Still have questions about this?</span>
                      <a
                        href="tel:9597314692"
                        className="text-primary hover:underline font-bold font-mono"
                      >
                        Call 9597314692
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
