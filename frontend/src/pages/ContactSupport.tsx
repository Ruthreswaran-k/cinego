import React from 'react';
import { SupportAndFaq } from '@/components/common/SupportAndFaq';
import { PhoneCall, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

export const ContactSupport: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
            Customer Care & Emergency Concierge
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Contact & Support Center
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Need immediate help with a ticket, refund, turnstile gate pass, or cinema amenities? Our 24/7 dedicated support desk is always at your service.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Direct Phone Helpline</span>
              <p className="text-xl font-black text-white font-mono mt-1">+91 9597314692</p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Call us directly for urgent box office and turnstile entry inquiries. Available 24/7.
            </p>
            <a
              href="tel:9597314692"
              className="inline-block text-xs font-bold text-primary hover:underline"
            >
              Click to Call Now →
            </a>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">WhatsApp Concierge</span>
              <p className="text-xl font-black text-white font-mono mt-1">9597314692</p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Send your booking reference #5001 on WhatsApp for instant receipt resend and seat changes.
            </p>
            <a
              href="https://wa.me/919597314692?text=Hi%20CineGo%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-emerald-400 hover:underline"
            >
              Open WhatsApp Chat →
            </a>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 hover:border-blue-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Corporate & Billing Email</span>
              <p className="text-lg font-bold text-white font-mono mt-1">support@cinego.com</p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For corporate bulk bookings, brand advertising, and GST invoice inquiries.
            </p>
            <a
              href="mailto:support@cinego.com"
              className="inline-block text-xs font-bold text-blue-400 hover:underline"
            >
              Email Support Team →
            </a>
          </div>
        </div>

        {/* Support & FAQ Component */}
        <SupportAndFaq />
      </div>
    </div>
  );
};
