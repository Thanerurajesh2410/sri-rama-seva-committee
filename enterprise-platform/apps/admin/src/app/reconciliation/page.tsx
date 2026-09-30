import React from 'react';

const mockTransactions = [
  { id: 'TXN-1001', orderId: 'order_P98234710', gatewayPaymentId: 'pay_P1008', amount: 5000, status: 'CAPTURED', gateway: 'RAZORPAY', date: '2026-09-28 17:52:00' },
  { id: 'TXN-1002', orderId: 'order_P98234711', gatewayPaymentId: 'pay_P1009', amount: 5000, status: 'CAPTURED', gateway: 'RAZORPAY', date: '2026-09-28 18:30:00' },
  { id: 'TXN-1003', orderId: 'order_P98234712', gatewayPaymentId: null, amount: 1116, status: 'FAILED', gateway: 'RAZORPAY', date: '2026-09-28 19:10:00' }
];

export default function ReconciliationPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-white/20">
        <h1 className="text-2xl sm:text-3xl font-black text-white heading-telugu">
          💳 Razorpay పేమెంట్ రీకాన్సిలియేషన్ (Payment Reconciliation)
        </h1>
        <p className="text-xs sm:text-sm text-amber-300 font-bold">
          గేట్‌వే ఆర్డర్లు, సిగ్నేచర్ హ్యాష్ ధృవీకరణ మరియు ఆన్‌లైన్ పేమెంట్ రికార్డులు.
        </p>
      </div>

      <div className="bg-[#2A060B] border-2 border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#5C121E] text-[#FFD700] font-black border-b border-amber-400/40 uppercase">
              <tr>
                <th className="p-4">ట్రాన్సాక్షన్ ఐడీ</th>
                <th className="p-4">Razorpay Order ID</th>
                <th className="p-4">Payment ID</th>
                <th className="p-4">మొత్తం</th>
                <th className="p-4">స్టేటస్</th>
                <th className="p-4">తేదీ & సమయం</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-extrabold">
              {mockTransactions.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono text-amber-300">{t.id}</td>
                  <td className="p-4 font-mono text-white">{t.orderId}</td>
                  <td className="p-4 font-mono text-emerald-300">{t.gatewayPaymentId || 'N/A'}</td>
                  <td className="p-4 font-mono text-base text-white">₹ {t.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${t.status === 'CAPTURED' ? 'bg-emerald-950 text-emerald-400 border-emerald-400/50' : 'bg-red-950 text-red-400 border-red-400/50'}`}>
                      {t.status === 'CAPTURED' ? '✓ CAPTURED (SUCCESS)' : '✗ FAILED'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
