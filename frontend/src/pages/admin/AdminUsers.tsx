import React, { useState } from 'react';
import { Users, Shield, Building2, User, Search, Key, CheckCircle2, Lock, Smartphone, Mail } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'THEATRE_MANAGER' | 'CUSTOMER';
  theatreBranch?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'USR1001',
    name: 'Chief Administrator',
    email: 'admin@cinego.com',
    phone: '+91 9000000001',
    role: 'ADMIN',
    joinedDate: '2026-01-01',
    status: 'ACTIVE',
  },
  {
    id: 'USR1002',
    name: 'Suresh Kumar (Cinema Operations)',
    email: 'manager@pvr.com',
    phone: '+91 9000000022',
    role: 'THEATRE_MANAGER',
    theatreBranch: 'PVR INOX, White Town, Puducherry',
    joinedDate: '2026-02-15',
    status: 'ACTIVE',
  },
  {
    id: 'USR1003',
    name: 'Ravi Kumar',
    email: 'ravi@gmail.com',
    phone: '+91 9876543210',
    role: 'CUSTOMER',
    joinedDate: '2026-08-10',
    status: 'ACTIVE',
  },
  {
    id: 'USR1004',
    name: 'Priya Sharma',
    email: 'priya.s@gmail.com',
    phone: '+91 9884012345',
    role: 'CUSTOMER',
    joinedDate: '2026-09-04',
    status: 'ACTIVE',
  },
  {
    id: 'USR1005',
    name: 'Karthik Raja',
    email: 'karthik@gmail.com',
    phone: '+91 9444054321',
    role: 'CUSTOMER',
    joinedDate: '2026-09-19',
    status: 'ACTIVE',
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'THEATRE_MANAGER' | 'CUSTOMER'>('ALL');

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    if (filterRole === 'ALL') return matchSearch;
    return matchSearch && u.role === filterRole;
  });

  const handleToggleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          toast.success(`User ${u.name} status updated to ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (u: UserAccount) => {
    toast.success(`Temporary security credential dispatched to ${u.email}`);
  };

  return (
    <div className="space-y-8 font-display">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Identity & Access Governance</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Staff Credentials & User Directory</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage System Administrators, Theatre Operations Managers, and registered cinema patrons.
          </p>
        </div>
      </div>

      {/* Role Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
          {(['ALL', 'ADMIN', 'THEATRE_MANAGER', 'CUSTOMER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterRole === r
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-zinc-400 font-semibold tracking-wider">
              <tr>
                <th className="p-4">Account Member</th>
                <th className="p-4">Role & Jurisdiction</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Access Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <span className="text-[10px] font-mono text-zinc-500">ID #{u.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {u.role === 'ADMIN' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Shield className="w-3.5 h-3.5 mr-1" /> System Admin
                      </span>
                    )}
                    {u.role === 'THEATRE_MANAGER' && (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Building2 className="w-3.5 h-3.5 mr-1" /> Theatre Manager
                        </span>
                        {u.theatreBranch && (
                          <p className="text-[11px] text-zinc-400 mt-1">{u.theatreBranch}</p>
                        )}
                      </div>
                    )}
                    {u.role === 'CUSTOMER' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        <User className="w-3.5 h-3.5 mr-1" /> Cinema Patron
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-xs space-y-0.5">
                    <p className="text-zinc-300 flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-zinc-500" /> {u.email}
                    </p>
                    <p className="text-zinc-400 flex items-center font-mono">
                      <Smartphone className="w-3 h-3 mr-1 text-zinc-500" /> {u.phone}
                    </p>
                  </td>

                  <td className="p-4 text-xs font-mono text-zinc-400">{u.joinedDate}</td>

                  <td className="p-4">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold inline-flex items-center ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetPassword(u)}
                      className="text-xs text-zinc-400 hover:text-white"
                      title="Send Reset Password Link"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </Button>
                    {u.role !== 'ADMIN' && (
                      <Button
                        variant={u.status === 'ACTIVE' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleSuspend(u.id)}
                        className="text-xs rounded-xl"
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
