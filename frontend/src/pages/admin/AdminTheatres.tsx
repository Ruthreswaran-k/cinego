import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Search,
  Plus,
  Filter,
  Eye,
  Check,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

export interface TheatreVerificationRecord {
  id: string;
  name: string;
  city: string;
  locationArea: string;
  address: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  licenseNumber: string;
  gstin: string;
  fireSafetyNoc: string;
  screensCount: number;
  formats: string[];
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  appliedDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

const INITIAL_THEATRES: TheatreVerificationRecord[] = [
  {
    id: '201',
    name: 'PVR Grand Mall',
    city: 'Chennai',
    locationArea: 'Velachery',
    address: 'Grand Mall, Velachery Main Road, Chennai',
    managerName: 'Karthik Subramanian',
    managerPhone: '+91 98401 23456',
    managerEmail: 'manager.grandmall@pvr.com',
    licenseNumber: 'TN-CHN-CINE-2023-8841',
    gstin: '33PVRIN1234F1Z9',
    fireSafetyNoc: 'FS-NOC-CHN-2023-9021',
    screensCount: 5,
    formats: ['2D', '3D', 'Dolby Atmos'],
    status: 'VERIFIED',
    appliedDate: '2026-01-10',
    verifiedDate: '2026-01-14',
    verifiedBy: 'State Cinema Licensing Authority & CineGo Compliance',
  },
  {
    id: '203',
    name: 'AGS Cinemas T.Nagar',
    city: 'Chennai',
    locationArea: 'T.Nagar',
    address: '24, Bazullah Road, T.Nagar, Chennai',
    managerName: 'Ramesh Sundaram',
    managerPhone: '+91 98410 56789',
    managerEmail: 'admin@agscinemas.com',
    licenseNumber: 'TN-CHN-CINE-2022-4412',
    gstin: '33AGSCN5678A1Z2',
    fireSafetyNoc: 'FS-NOC-CHN-2022-3104',
    screensCount: 4,
    formats: ['IMAX 2D', '2D'],
    status: 'VERIFIED',
    appliedDate: '2026-02-01',
    verifiedDate: '2026-02-05',
    verifiedBy: 'State Cinema Licensing Authority & CineGo Compliance',
  },
  {
    id: '208',
    name: 'Rohini Silver Screens',
    city: 'Chennai',
    locationArea: 'Koyambedu',
    address: '141, Poonamallee High Road, Koyambedu, Chennai',
    managerName: 'Nikilesh Surya',
    managerPhone: '+91 98402 77889',
    managerEmail: 'operations@rohiniscreen.com',
    licenseNumber: 'TN-CHN-CINE-2021-1190',
    gstin: '33ROHIN7890B1Z4',
    fireSafetyNoc: 'FS-NOC-CHN-2021-1092',
    screensCount: 6,
    formats: ['2D', '3D', 'RGB Laser'],
    status: 'VERIFIED',
    appliedDate: '2026-01-15',
    verifiedDate: '2026-01-18',
    verifiedBy: 'State Cinema Licensing Authority & CineGo Compliance',
  },
  {
    id: '217',
    name: 'PVR INOX, White Town',
    city: 'Puducherry',
    locationArea: 'White Town',
    address: 'Mission Street, Heritage Town, Puducherry',
    managerName: 'Anand Kumar',
    managerPhone: '+91 94432 11223',
    managerEmail: 'anand.k@pvrinox.com',
    licenseNumber: 'PY-PDY-CINE-2024-5501',
    gstin: '34PVRIN9012C1Z8',
    fireSafetyNoc: 'FS-NOC-PDY-2024-7711',
    screensCount: 3,
    formats: ['Dolby Atmos', '2D Digital 4K'],
    status: 'VERIFIED',
    appliedDate: '2026-03-01',
    verifiedDate: '2026-03-04',
    verifiedBy: 'Puducherry Municipal Licensing & CineGo Compliance',
  },
  {
    id: '219',
    name: 'SPI Palazzo, The Promenade',
    city: 'Puducherry',
    locationArea: 'Beach Road',
    address: 'Goubert Avenue, White Town, Puducherry',
    managerName: 'Selvamurugan S',
    managerPhone: '+91 94433 99881',
    managerEmail: 'selva.spi@cinemas.com',
    licenseNumber: 'PY-PDY-CINE-2023-3392',
    gstin: '34SPICN3456D1Z1',
    fireSafetyNoc: 'FS-NOC-PDY-2023-4410',
    screensCount: 5,
    formats: ['IMAX Laser', 'Dolby Atmos'],
    status: 'VERIFIED',
    appliedDate: '2026-02-12',
    verifiedDate: '2026-02-15',
    verifiedBy: 'Puducherry Municipal Licensing & CineGo Compliance',
  },
  {
    id: '299',
    name: 'Aurora Talkies & Dolby Audi',
    city: 'Chennai',
    locationArea: 'Anna Nagar',
    address: '12, 2nd Avenue, Anna Nagar West, Chennai',
    managerName: 'Venkatesh Prasad',
    managerPhone: '+91 98840 55112',
    managerEmail: 'auroratalkies@gmail.com',
    licenseNumber: 'TN-CHN-CINE-2026-9041-APP',
    gstin: '33AUROR4567E1Z3',
    fireSafetyNoc: 'FS-NOC-CHN-PENDING-411',
    screensCount: 2,
    formats: ['2D', 'Dolby Atmos'],
    status: 'PENDING_REVIEW',
    appliedDate: '2026-10-04',
  },
];

export const AdminTheatres: React.FC = () => {
  const [theatres, setTheatres] = useState<TheatreVerificationRecord[]>(INITIAL_THEATRES);
  const [filterTab, setFilterTab] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TheatreVerificationRecord | null>(null);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // New Onboarding Form State
  const [newTheatre, setNewTheatre] = useState({
    name: '',
    city: 'Chennai',
    locationArea: '',
    address: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    licenseNumber: '',
    gstin: '',
    fireSafetyNoc: '',
    screensCount: 3,
    formats: '2D, Dolby Atmos',
  });

  const handleVerify = (id: string) => {
    setTheatres((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'VERIFIED',
              verifiedDate: '2026-10-06',
              verifiedBy: 'CineGo Platform Compliance Cell (Admin Approved)',
            }
          : t
      )
    );
    toast.success(`Theatre verified successfully! Official trust badge issued and public bookings enabled.`);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please enter the reason for rejection (e.g. Invalid Cinematograph license):');
    if (!reason) return;

    setTheatres((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'REJECTED',
              rejectionReason: reason,
            }
          : t
      )
    );
    toast.error(`Theatre application rejected: ${reason}`);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleCreateOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheatre.name || !newTheatre.licenseNumber || !newTheatre.gstin) {
      toast.error('Theatre Name, Cinematograph License, and GSTIN are strictly mandatory for verification.');
      return;
    }

    const created: TheatreVerificationRecord = {
      id: String(Date.now()).slice(-4),
      name: newTheatre.name,
      city: newTheatre.city,
      locationArea: newTheatre.locationArea || 'Central',
      address: newTheatre.address,
      managerName: newTheatre.managerName,
      managerPhone: newTheatre.managerPhone,
      managerEmail: newTheatre.managerEmail,
      licenseNumber: newTheatre.licenseNumber,
      gstin: newTheatre.gstin,
      fireSafetyNoc: newTheatre.fireSafetyNoc || 'FS-NOC-SUBMITTED',
      screensCount: Number(newTheatre.screensCount) || 2,
      formats: newTheatre.formats.split(',').map((f) => f.trim()),
      status: 'PENDING_REVIEW', // Starts strictly as PENDING!
      appliedDate: '2026-10-06',
    };

    setTheatres([created, ...theatres]);
    toast.success(`Application submitted! Theatre placed into PENDING_REVIEW audit queue.`);
    setIsOnboardModalOpen(false);
    setNewTheatre({
      name: '',
      city: 'Chennai',
      locationArea: '',
      address: '',
      managerName: '',
      managerPhone: '',
      managerEmail: '',
      licenseNumber: '',
      gstin: '',
      fireSafetyNoc: '',
      screensCount: 3,
      formats: '2D, Dolby Atmos',
    });
  };

  const filtered = theatres.filter((t) => {
    if (filterTab === 'VERIFIED' && t.status !== 'VERIFIED') return false;
    if (filterTab === 'PENDING' && t.status !== 'PENDING_REVIEW') return false;
    if (filterTab === 'REJECTED' && t.status !== 'REJECTED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.licenseNumber.toLowerCase().includes(q) ||
        t.gstin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const verifiedCount = theatres.filter((t) => t.status === 'VERIFIED').length;
  const pendingCount = theatres.filter((t) => t.status === 'PENDING_REVIEW').length;
  const rejectedCount = theatres.filter((t) => t.status === 'REJECTED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compliance & Legal Audit Gateway</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Theatre Verification & KYC Hub</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Prevent unverified, illegal, or fraudulent cinemas from hosting public bookings. Inspect exhibition licenses, GSTIN, and safety certificates.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsOnboardModalOpen(true)}
          className="rounded-2xl text-xs font-bold shadow-lg shadow-primary/30 flex items-center cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Onboard New Cinema Hall
        </Button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Cinema Partners</span>
          <p className="text-2xl font-bold text-white mt-1">{theatres.length}</p>
          <span className="text-[11px] text-zinc-500 mt-2 block">Registered in CineGo Network</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Publicly Active
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{verifiedCount}</p>
          <span className="text-[11px] text-emerald-300/70 mt-2 block">100% Gov Exhibition Licenses Checked</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Verification Audit
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-300/70 mt-2 block">Blocked from public search until verified</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected / Suspended
          </span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</p>
          <span className="text-[11px] text-rose-300/70 mt-2 block">Failed compliance or license check</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-primary text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            All Cinemas ({theatres.length})
          </button>

          <button
            onClick={() => setFilterTab('PENDING')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'PENDING'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'bg-zinc-900 text-amber-400 hover:text-white border border-amber-500/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Audit ({pendingCount})
          </button>

          <button
            onClick={() => setFilterTab('VERIFIED')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'VERIFIED'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Partners ({verifiedCount})
          </button>

          <button
            onClick={() => setFilterTab('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'REJECTED'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div className="relative min-w-[250px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by cinema, license or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Theatres Compliance Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-5">Cinema Hall</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Cinematograph License No.</th>
                <th className="py-3.5 px-5">GSTIN / Tax ID</th>
                <th className="py-3.5 px-5">Verification Status</th>
                <th className="py-3.5 px-5">Screens</th>
                <th className="py-3.5 px-5 text-right">Compliance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((t) => {
                const isVerified = t.status === 'VERIFIED';
                const isPending = t.status === 'PENDING_REVIEW';
                const isRejected = t.status === 'REJECTED';

                return (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    {/* Cinema Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{t.name}</p>
                          <p className="text-[10px] text-zinc-400">{t.managerName} • {t.managerPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-5">
                      <p className="font-medium text-white">{t.locationArea}</p>
                      <p className="text-[10px] text-zinc-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-primary" /> {t.city}
                      </p>
                    </td>

                    {/* License */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-zinc-200 bg-zinc-900 px-2 py-1 rounded border border-white/10 font-bold block w-fit text-[11px]">
                        {t.licenseNumber}
                      </span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">Fire NOC: {t.fireSafetyNoc}</span>
                    </td>

                    {/* GSTIN */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-zinc-300 text-[11px]">{t.gstin}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED PARTNER
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> AUDIT PENDING
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                    </td>

                    {/* Screens */}
                    <td className="py-4 px-5">
                      <span className="text-zinc-300 font-semibold">{t.screensCount} Audis</span>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">{t.formats.join(', ')}</p>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(t.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            title="Verify and activate cinema on public site"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(t.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/10 font-bold text-xs transition-all cursor-pointer"
                            title="Reject unverified application"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : isVerified ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-emerald-400 font-mono">Publicly Active</span>
                          <button
                            onClick={() => handleReject(t.id)}
                            className="text-[10px] text-zinc-500 hover:text-rose-400 underline transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerify(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-600/30 text-zinc-300 text-xs font-semibold cursor-pointer"
                        >
                          Re-Audit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding Modal with Mandatory License & KYC Fields */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOnboardModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Govt Compliance Verification Form</span>
              </div>
              <h3 className="text-xl font-bold text-white">Register Cinema for Verification Audit</h3>
              <p className="text-xs text-zinc-400 mt-1">
                A theatre cannot be listed publicly without verifying the Cinematograph Exhibition License and GSTIN.
              </p>
            </div>

            <form onSubmit={handleCreateOnboard} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Cinema Hall Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Silver Screens"
                    value={newTheatre.name}
                    onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">City *</label>
                  <select
                    value={newTheatre.city}
                    onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Location Area & Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Feet Road, Velachery, Chennai"
                  value={newTheatre.address}
                  onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Compliance Credentials */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                <p className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Mandatory Government Verification Proofs
                </p>

                <div>
                  <label className="text-zinc-300 block mb-1 font-semibold">
                    Cinematograph Exhibition License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN-CHN-CINE-2026-9041"
                    value={newTheatre.licenseNumber}
                    onChange={(e) => setNewTheatre({ ...newTheatre, licenseNumber: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Commercial GSTIN *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 33AAAAA0000A1Z5"
                      value={newTheatre.gstin}
                      onChange={(e) => setNewTheatre({ ...newTheatre, gstin: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-semibold">Fire Safety NOC Number</label>
                    <input
                      type="text"
                      placeholder="e.g. FS-NOC-CHN-2026-11"
                      value={newTheatre.fireSafetyNoc}
                      onChange={(e) => setNewTheatre({ ...newTheatre, fireSafetyNoc: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Manager / Owner Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={newTheatre.managerName}
                    onChange={(e) => setNewTheatre({ ...newTheatre, managerName: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Manager Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98400 00000"
                    value={newTheatre.managerPhone}
                    onChange={(e) => setNewTheatre({ ...newTheatre, managerPhone: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="rounded-xl font-bold shadow-lg shadow-primary/30">
                  Submit for Admin Verification
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
