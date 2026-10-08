import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Percent, IndianRupee, Clock, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface CouponItem {
  id: string;
  code: string;
  discountType: 'FLAT' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  description: string;
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    id: 'CPN1',
    code: 'WELCOME100',
    discountType: 'FLAT',
    discountValue: 100,
    minOrderAmount: 300,
    maxDiscount: 100,
    expiryDate: '2026-12-31',
    usageCount: 428,
    usageLimit: 1000,
    isActive: true,
    description: 'Flat ₹100 instant discount on bookings above ₹300 for new customers.',
  },
  {
    id: 'CPN2',
    code: 'CINEGO20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 400,
    maxDiscount: 200,
    expiryDate: '2026-11-30',
    usageCount: 890,
    usageLimit: 2000,
    isActive: true,
    description: '20% discount up to ₹200 on all prime weekend shows.',
  },
  {
    id: 'CPN3',
    code: 'FIRST50',
    discountType: 'FLAT',
    discountValue: 50,
    minOrderAmount: 200,
    maxDiscount: 50,
    expiryDate: '2026-12-15',
    usageCount: 312,
    usageLimit: 500,
    isActive: true,
    description: 'Flat ₹50 savings on any movie ticket.',
  },
  {
    id: 'CPN4',
    code: 'BLOCKBUSTER',
    discountType: 'FLAT',
    discountValue: 150,
    minOrderAmount: 500,
    maxDiscount: 150,
    expiryDate: '2026-10-31',
    usageCount: 654,
    usageLimit: 800,
    isActive: true,
    description: 'Flat ₹150 off for bulk/family reservations above ₹500.',
  },
  {
    id: 'CPN5',
    code: 'MOVIE10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 250,
    maxDiscount: 100,
    expiryDate: '2026-10-20',
    usageCount: 210,
    usageLimit: 1000,
    isActive: false,
    description: '10% discount up to ₹100 across participating single screens.',
  },
];

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinego_admin_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_COUPONS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'FLAT' as 'FLAT' | 'PERCENTAGE',
    discountValue: 100,
    minOrderAmount: 300,
    maxDiscount: 100,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    description: '',
  });

  const saveCoupons = (updated: CouponItem[]) => {
    setCoupons(updated);
    try {
      localStorage.setItem('cinego_admin_coupons', JSON.stringify(updated));
    } catch {}
  };

  const handleToggleStatus = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
    const toggled = updated.find((c) => c.id === id);
    toast.success(`Coupon ${toggled?.code} is now ${toggled?.isActive ? 'ACTIVE' : 'INACTIVE'}`);
  };

  const handleDeleteCoupon = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    const updated = coupons.filter((c) => c.id !== id);
    saveCoupons(updated);
    toast.success(`Coupon ${target?.code} deleted successfully.`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const codeClean = newCoupon.code.trim().toUpperCase();
    if (!codeClean) {
      toast.error('Coupon code is required');
      return;
    }

    if (coupons.some((c) => c.code === codeClean)) {
      toast.error(`Coupon code ${codeClean} already exists`);
      return;
    }

    const created: CouponItem = {
      id: `CPN_${Date.now()}`,
      code: codeClean,
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderAmount: Number(newCoupon.minOrderAmount),
      maxDiscount: Number(newCoupon.maxDiscount),
      expiryDate: newCoupon.expiryDate,
      usageCount: 0,
      usageLimit: Number(newCoupon.usageLimit),
      isActive: true,
      description: newCoupon.description || `${newCoupon.discountType === 'FLAT' ? `₹${newCoupon.discountValue} Flat` : `${newCoupon.discountValue}%`} discount offer.`,
    };

    saveCoupons([created, ...coupons]);
    setIsAddModalOpen(false);
    setNewCoupon({
      code: '',
      discountType: 'FLAT',
      discountValue: 100,
      minOrderAmount: 300,
      maxDiscount: 100,
      expiryDate: '2026-12-31',
      usageLimit: 1000,
      description: '',
    });
    toast.success(`Coupon ${codeClean} created and published to checkout engine!`);
  };

  return (
    <div className="space-y-8 font-display">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Promotion & Checkout Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Coupons & Discount Rules</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Configure promotional discount codes, validity dates, minimum order limits, and customer usage caps.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="rounded-xl flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Create New Coupon
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Active Promotional Codes</p>
          <p className="text-3xl font-bold mt-2 text-emerald-400">
            {coupons.filter((c) => c.isActive).length} Active
          </p>
          <span className="text-xs text-zinc-500 mt-2 block">{coupons.length} total coupons configured</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Customer Redemptions</p>
          <p className="text-3xl font-bold mt-2 text-white">
            {coupons.reduce((sum, c) => sum + c.usageCount, 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-400/80 mt-2 block">High-converting checkout incentive</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Gross Savings Granted</p>
          <p className="text-3xl font-bold mt-2 text-amber-400">₹ 2,48,600</p>
          <span className="text-xs text-zinc-500 mt-2 block">Calculated discount subtractions</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-zinc-400 font-semibold tracking-wider">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Type & Value</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Usage (Used / Cap)</th>
                <th className="p-4">Valid Until</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-white text-base px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10">
                        {c.code}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs">{c.description}</p>
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {c.discountType === 'FLAT' ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold">
                        Flat ₹{c.discountValue} Off
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-blue-400 font-bold">
                        {c.discountValue}% Off (Max ₹{c.maxDiscount})
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono">₹{c.minOrderAmount}</td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-zinc-200">
                        {c.usageCount} / {c.usageLimit}
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, Math.round((c.usageCount / c.usageLimit) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-xs font-mono text-zinc-400">{c.expiryDate}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 cursor-pointer transition-all ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {c.isActive ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      <span>{c.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-white/20 animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Tag className="w-5 h-5 text-primary mr-2" /> Create New Discount Code
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI100"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Min. Order Amount (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description / Customer Banner</label>
                <input
                  type="text"
                  placeholder="e.g. Festive discount for family weekend screenings"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save & Publish Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
