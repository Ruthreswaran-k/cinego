import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  CreditCard,
  Smartphone,
  Gift,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Film,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { ALL_OFFERS, OfferItem, OfferCategory } from '@/data/offersData';

export const Offers: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>('ALL');
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  // Copy coupon handler
  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied! Paste it in the Booking Summary page.`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  // Toggle Terms & Conditions
  const toggleTerms = (id: string) => {
    setExpandedOfferId((prev) => (prev === id ? null : id));
  };

  // Unique bank list for quick filter chips
  const bankList = useMemo(() => {
    const banks = new Set<string>();
    ALL_OFFERS.forEach((o) => {
      if (o.category === 'BANK_CARDS') banks.add(o.bankOrIssuer);
    });
    return Array.from(banks);
  }, []);

  // Filtered offers list
  const filteredOffers = useMemo(() => {
    return ALL_OFFERS.filter((offer) => {
      // Category filter
      if (selectedCategory !== 'ALL' && offer.category !== selectedCategory) {
        return false;
      }

      // Bank filter
      if (selectedBank !== 'ALL' && offer.bankOrIssuer !== selectedBank) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = offer.title.toLowerCase().includes(q);
        const matchSubtitle = offer.subtitle.toLowerCase().includes(q);
        const matchBank = offer.bankOrIssuer.toLowerCase().includes(q);
        const matchCode = offer.code.toLowerCase().includes(q);
        const matchCardType = offer.cardType.toLowerCase().includes(q);
        return matchTitle || matchSubtitle || matchBank || matchCode || matchCardType;
      }

      return true;
    });
  }, [selectedCategory, selectedBank, searchQuery]);

  return (
    <div className="min-h-screen bg-dark text-white font-display pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* 1. Classic Hero Header */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-950 via-red-950/30 to-zinc-950 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>CineGo Privilege Club & Partner Savings</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Exclusive Bank & Cinema Offers
              </h1>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Avail <strong>Buy 1 Get 1 Free</strong>, instant card discounts up to ₹250, and wallet cashbacks on Axis Bank, HDFC, ICICI, SBI Card, Kotak, IndusInd, PayTM, and more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/movies">
                <Button variant="primary" size="lg" className="rounded-2xl font-bold shadow-xl shadow-primary/30 flex items-center">
                  Book Movie Tickets <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Classic Filter & Search Bar */}
        <div className="glass-card p-4 sm:p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedBank('ALL');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                All Offers ({ALL_OFFERS.length})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('BANK_CARDS');
                  setSelectedBank('ALL');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'BANK_CARDS'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Credit & Debit Cards ({ALL_OFFERS.filter((o) => o.category === 'BANK_CARDS').length})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('UPI_WALLETS');
                  setSelectedBank('ALL');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'UPI_WALLETS'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                UPI & Wallets ({ALL_OFFERS.filter((o) => o.category === 'UPI_WALLETS').length})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('CINEMA_COUPONS');
                  setSelectedBank('ALL');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'CINEMA_COUPONS'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                Cinema Coupons ({ALL_OFFERS.filter((o) => o.category === 'CINEMA_COUPONS').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search bank or code (Axis, HDFC, BOGO...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Bank Filter Chips (When looking at Bank Cards or All) */}
          {(selectedCategory === 'ALL' || selectedCategory === 'BANK_CARDS') && (
            <div className="pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1 flex-shrink-0">
                Filter by Bank:
              </span>
              <button
                onClick={() => setSelectedBank('ALL')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedBank === 'ALL'
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                All Banks
              </button>
              {bankList.map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedBank === bank
                      ? 'bg-primary text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Offers Grid with Classic Perforated Ticket Aesthetic */}
        {filteredOffers.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-zinc-400 space-y-4 border border-white/10">
            <Gift className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Offers Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No offers matching "{searchQuery}". Try searching for popular banks like "Axis", "HDFC", "ICICI", or reset filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedBank('ALL');
              }}
              className="rounded-xl text-xs"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const isExpanded = expandedOfferId === offer.id;
              const isCopied = copiedCode === offer.code;

              return (
                <div
                  key={offer.id}
                  className={`rounded-3xl overflow-hidden border ${offer.borderAccent} bg-zinc-950/80 hover:border-primary/80 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-black/50 group relative`}
                >
                  <div>
                    {/* Top Brand Banner */}
                    <div className={`p-5 bg-gradient-to-br ${offer.gradient} relative overflow-hidden`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur border border-white/20 text-white shadow-sm">
                            {offer.bankOrIssuer}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                            {offer.badge}
                          </span>
                        </div>
                        <span className="text-xs font-black font-mono tracking-wider text-amber-300 bg-black/50 px-2 py-0.5 rounded-lg border border-amber-300/30">
                          {offer.discountDisplay}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white mt-3.5 tracking-tight group-hover:text-amber-200 transition-colors">
                        {offer.title}
                      </h3>
                    </div>

                    {/* Offer Body */}
                    <div className="p-5 space-y-3.5">
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {offer.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
                          {offer.cardType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
                          Min. ₹{offer.minOrder}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">Valid till {offer.validUntil}</span>
                      </div>

                      {/* Expandable Terms Drawer */}
                      {isExpanded && (
                        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-1.5 text-[11px] text-zinc-300">
                          <p className="font-bold text-white text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Info className="w-3 h-3 text-primary" /> Terms & Eligibility:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                            {offer.terms.map((term, idx) => (
                              <li key={idx}>{term}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => toggleTerms(offer.id)}
                        className="text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide terms' : 'View terms & conditions'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Classic Perforated Ticket Bottom with Cutout Notches */}
                  <div className="relative p-5 pt-0">
                    <div className="border-t border-dashed border-white/20 pt-4 flex items-center justify-between gap-3">
                      <div className="bg-zinc-900/90 border border-dashed border-white/20 rounded-xl px-3 py-1.5">
                        <span className="text-[9px] uppercase font-bold text-zinc-500 block">Coupon Code</span>
                        <span className="font-mono font-black text-sm text-primary tracking-wider">
                          {offer.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyCoupon(offer.code)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-white/10 hover:bg-primary text-white'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>

                        <Link to="/movies">
                          <button
                            title="Book tickets using this offer"
                            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Film className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Classic "How to Avail Partner Offers" Walkthrough Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>How to Claim Instant Savings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-black flex items-center justify-center flex-shrink-0 text-sm">
                1
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Pick Your Cinema & Seats</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Choose any movie and select your seats across preferred theatre screens in your city.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-black flex items-center justify-center flex-shrink-0 text-sm">
                2
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Apply Code at Summary</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Copy your bank or promo code (e.g. <strong>AXISBOGO</strong>, <strong>ICICIBOGO</strong>) and paste it into the coupon box.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <span className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-black flex items-center justify-center flex-shrink-0 text-sm">
                3
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">Pay via Eligible Bank Card</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Complete checkout using your respective credit card or UPI to enjoy instant deducted pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
