'use me';
import React, { useState } from 'react';

interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  category: 'AUTHENTICATION' | 'FINANCIAL' | 'DEVOTEE_DATA' | 'SYSTEM_CONFIG' | 'SECURITY';
  resource: string;
  ipAddress: string;
  hash: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-884910',
    timestamp: '2026-09-30 17:42:15',
    actorName: 'Sri Rajesh (Chief Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'DONATION_80G_RECEIPT_GENERATE',
    category: 'FINANCIAL',
    resource: 'Donation #TXN-984210',
    ipAddress: '49.207.214.11',
    hash: '0x8f3a92b...e41c',
    status: 'SUCCESS',
    details: 'Issued official temple receipt #RSK-2026-881 for ₹25,000'
  },
  {
    id: 'LOG-884909',
    timestamp: '2026-09-30 16:15:02',
    actorName: 'System Security Automaton',
    actorRole: 'SYSTEM',
    action: 'RAZORPAY_WEBHOOK_RECONCILE',
    category: 'FINANCIAL',
    resource: 'Razorpay Batch #RZP-20260930',
    ipAddress: '13.235.12.89',
    hash: '0x3c1d42a...a90f',
    status: 'SUCCESS',
    details: 'Automated 100% reconciliation completed for 142 payment signatures'
  },
  {
    id: 'LOG-884908',
    timestamp: '2026-09-30 14:02:44',
    actorName: 'Anil Kumar (Accountant)',
    actorRole: 'TREASURER',
    action: 'EXPENSE_VOUCHER_CREATE',
    category: 'FINANCIAL',
    resource: 'Expense Voucher #EXP-4412',
    ipAddress: '157.48.19.201',
    hash: '0x99e1a4f...7b32',
    status: 'SUCCESS',
    details: 'Created Annadhanam Grocery Vendor Voucher for ₹45,000'
  },
  {
    id: 'LOG-884907',
    timestamp: '2026-09-30 11:20:10',
    actorName: 'Unknown IP',
    actorRole: 'ANONYMOUS',
    action: 'ADMIN_LOGIN_FAILED',
    category: 'SECURITY',
    resource: '/admin/login',
    ipAddress: '185.220.101.5',
    hash: '0x71b2d01...f098',
    status: 'ALERT',
    details: '3 consecutive invalid password attempts blocked by rate limiter'
  },
  {
    id: 'LOG-884906',
    timestamp: '2026-09-30 09:12:30',
    actorName: 'Sri Rajesh (Chief Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'ROLE_PERMISSIONS_UPDATE',
    category: 'SYSTEM_CONFIG',
    resource: 'Role #TRUSTEE',
    ipAddress: '49.207.214.11',
    hash: '0x44d18ef...c112',
    status: 'WARNING',
    details: 'Granted read-only financial audit rights to Trustee Portal'
  },
  {
    id: 'LOG-884905',
    timestamp: '2026-09-29 19:40:00',
    actorName: 'Ramesh Reddy (Volunteers Lead)',
    actorRole: 'VOLUNTEER_LEAD',
    action: 'DEVOTEE_BATCH_EXPORT',
    category: 'DEVOTEE_DATA',
    resource: 'Devotee Roster (2,400 records)',
    ipAddress: '117.216.40.88',
    hash: '0x12a938c...d774',
    status: 'WARNING',
    details: 'Encrypted export generated for Navratri Volunteer Coordination'
  }
];

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-amber-950/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-amber-950">Immutable Security & System Audit Trail</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cryptographically Verified SHA-256
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            Tamper-proof log of administrative operations, financial modifications, authentication events, and data access.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-900 transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Compliance Audit Report
          </button>
        </div>
      </div>

      {/* Security Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-amber-900/10 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Audit Records</div>
          <div className="text-2xl font-black text-amber-950 mt-1">14,892</div>
          <div className="text-xs text-stone-500 mt-1">Stored with SHA-256 Checksum</div>
        </div>
        <div className="bg-white border border-amber-900/10 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Authentication Events</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">1,240</div>
          <div className="text-xs text-stone-500 mt-1">100% MFA Enforced</div>
        </div>
        <div className="bg-white border border-amber-900/10 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Financial Ledger Operations</div>
          <div className="text-2xl font-black text-amber-800 mt-1">9,412</div>
          <div className="text-xs text-stone-500 mt-1">Dual-Authorization Verified</div>
        </div>
        <div className="bg-white border border-amber-900/10 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Security Alerts (30 Days)</div>
          <div className="text-2xl font-black text-red-600 mt-1">2</div>
          <div className="text-xs text-stone-500 mt-1">Rate-Limiter Auto-Mitigated</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Actor, Action, Log ID or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'FINANCIAL', 'AUTHENTICATION', 'SECURITY', 'DEVOTEE_DATA', 'SYSTEM_CONFIG'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-amber-900/10 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-amber-950 text-amber-100 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-3">Log ID & Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action & Category</th>
                <th className="px-4 py-3">Resource Target</th>
                <th className="px-4 py-3">SHA-256 Hash</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/40 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono text-xs font-bold text-amber-950">{log.id}</div>
                    <div className="text-xs text-stone-500">{log.timestamp}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-stone-900">{log.actorName}</div>
                    <div className="text-xs font-mono text-stone-500">{log.actorRole}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-stone-800 text-xs">{log.action}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded bg-stone-100 text-stone-700 border border-stone-200">
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-stone-700">
                    {log.resource}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-stone-500">
                    {log.hash}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {log.status === 'SUCCESS' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        SUCCESS
                      </span>
                    )}
                    {log.status === 'WARNING' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        WARNING
                      </span>
                    )}
                    {log.status === 'ALERT' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                        ALERT
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
