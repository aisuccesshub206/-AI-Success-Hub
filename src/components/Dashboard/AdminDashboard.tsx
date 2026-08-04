import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  DollarSign,
  HardDrive,
  FileText,
  Tag,
  Plus,
  Activity,
  BarChart2,
  TrendingUp,
  Zap,
  Code2,
  Smartphone,
  Crown,
} from 'lucide-react';
import { AdminStats, EvcPaymentConfig, EvcPaymentRequest, PaymentAuditLog, UserProfile, PricingPlan } from '../../types';
import { EvcAdminConsole } from './EvcAdminConsole';
import { UserManagementConsole } from './UserManagementConsole';
import { SubscriptionPlansConsole } from './SubscriptionPlansConsole';
import { DatabaseConsole } from './DatabaseConsole';

interface AdminDashboardProps {
  onBack: () => void;
  evcPayments: EvcPaymentRequest[];
  evcConfig: EvcPaymentConfig;
  evcAuditLogs: PaymentAuditLog[];
  users: UserProfile[];
  plans: PricingPlan[];
  onApproveEvcPayment: (paymentId: string, durationMonths: number, adminNotes?: string) => void;
  onRejectEvcPayment: (paymentId: string, rejectionReason: string) => void;
  onUpdateEvcConfig: (newConfig: EvcPaymentConfig) => void;
  onUpdateUserRole: (userId: string, newRole: 'user' | 'admin') => void;
  onUpdateUserPlan: (userId: string, newPlan: string) => void;
  onToggleAccountStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
  onAddUser: (newUser: UserProfile) => void;
  onUpdatePlans: (updatedPlans: PricingPlan[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack,
  evcPayments,
  evcConfig,
  evcAuditLogs,
  users,
  plans,
  onApproveEvcPayment,
  onRejectEvcPayment,
  onUpdateEvcConfig,
  onUpdateUserRole,
  onUpdateUserPlan,
  onToggleAccountStatus,
  onAddUser,
  onUpdatePlans,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'users' | 'plans' | 'evc_payments' | 'database' | 'overview'>('users');

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: users.length + 18400,
    activeProSubscribers: users.filter((u) => u.plan !== 'Free').length + 2830,
    monthlyRevenueUSD: 42800,
    totalFilesProcessed: 2850000,
    serverStorageUsedGB: 384.2,
    activeServers: 12,
    conversionRatePercent: 15.4,
    customerLtvUSD: 1420,
    monthlyRecurringRevenueUSD: 42800,
    apiRequestsTotal: 1240000,
  });

  const [coupons, setCoupons] = useState<{ code: string; discount: string; uses: number }[]>([
    { code: 'SAVE50', discount: '50% OFF', uses: 480 },
    { code: 'WELCOME2026', discount: '20% OFF', uses: 1240 },
    { code: 'VIPLIFETIME', discount: '$30 OFF', uses: 310 },
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('30% OFF');

  const addCoupon = () => {
    if (!newCouponCode.trim()) return;
    setCoupons((prev) => [...prev, { code: newCouponCode.toUpperCase(), discount: newDiscount, uses: 0 }]);
    setNewCouponCode('');
  };

  const pendingCount = evcPayments.filter((p) => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 border border-purple-800/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-600/30 text-purple-300 rounded-2xl border border-purple-500/30">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>Private Admin Control Center</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Super Admin Authorized
              </span>
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              User role permissions, dynamic subscription pricing controller, Somalia EVC approvals &amp; MRR telemetry
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          Exit Admin
        </button>
      </div>

      {/* Main Tab Switcher Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveMainTab('users')}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${
            activeMainTab === 'users'
              ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-xl ring-1 ring-indigo-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>User Directory &amp; Roles</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('plans')}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${
            activeMainTab === 'plans'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-xl ring-1 ring-emerald-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 text-emerald-400" />
          <span>Subscription Plans &amp; Prices</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
            {plans.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('evc_payments')}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${
            activeMainTab === 'evc_payments'
              ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-xl ring-1 ring-cyan-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Somalia EVC &amp; Mobile Payments</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('database')}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${
            activeMainTab === 'database'
              ? 'bg-indigo-950/90 border-indigo-500 text-indigo-300 shadow-xl ring-1 ring-indigo-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>PostgreSQL &amp; Database Tables</span>
        </button>

        <button
          onClick={() => setActiveMainTab('overview')}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 ${
            activeMainTab === 'overview'
              ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-xl ring-1 ring-purple-500/40'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>Revenue Telemetry &amp; Coupons</span>
        </button>
      </div>

      {/* MAIN TAB CONTENT */}
      {activeMainTab === 'users' && (
        <UserManagementConsole
          users={users}
          onUpdateUserRole={onUpdateUserRole}
          onUpdateUserPlan={onUpdateUserPlan}
          onToggleAccountStatus={onToggleAccountStatus}
          onAddUser={onAddUser}
        />
      )}

      {activeMainTab === 'plans' && (
        <SubscriptionPlansConsole
          plans={plans}
          onUpdatePlans={onUpdatePlans}
        />
      )}

      {activeMainTab === 'evc_payments' && (
        <EvcAdminConsole
          payments={evcPayments}
          config={evcConfig}
          auditLogs={evcAuditLogs}
          onApprovePayment={onApproveEvcPayment}
          onRejectPayment={onRejectEvcPayment}
          onUpdateConfig={onUpdateEvcConfig}
        />
      )}

      {activeMainTab === 'database' && <DatabaseConsole />}

      {activeMainTab === 'overview' && (
        <div className="space-y-8">
          {/* BI Analytics Primary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#07070e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Monthly Recurring Revenue (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                ${stats.monthlyRevenueUSD.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">+24.2% YoY ARR Growth</div>
            </div>

            <div className="bg-[#07070e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Customer Lifetime Value (LTV)</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                ${stats.customerLtvUSD.toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-300 font-semibold">Net Retention: 114%</div>
            </div>

            <div className="bg-[#07070e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Paid Subscribers</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {stats.activeProSubscribers.toLocaleString()}
              </div>
              <div className="text-[11px] text-indigo-300 font-semibold">{stats.conversionRatePercent}% Conversion Rate</div>
            </div>

            <div className="bg-[#07070e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>API Requests (This Month)</span>
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {(stats.apiRequestsTotal / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-cyan-300 font-semibold">Avg 180ms Latency</div>
            </div>
          </div>

          {/* Tool Usage Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-[#07070e]/80 backdrop-blur-xl border border-white/10 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Most Popular AI &amp; PDF Tools
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Merge PDF & Universal Converter', usage: '42%', count: '1.2M files' },
                  { name: 'AI Summarizer & Document Chat', usage: '28%', count: '790k docs' },
                  { name: 'Vision OCR Extractor', usage: '18%', count: '510k pages' },
                  { name: 'AI Image Generator', usage: '12%', count: '340k images' },
                ].map((tool, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{tool.name}</div>
                      <div className="text-[10px] text-slate-400">{tool.count}</div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-400">{tool.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Coupons Manager */}
            <div className="p-6 bg-[#07070e]/80 backdrop-blur-xl border border-white/10 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                Promo Coupons Manager
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. SUMMER2026)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 flex-1"
                />
                <input
                  type="text"
                  placeholder="Discount (e.g. 30% OFF)"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 sm:w-32"
                />
                <button
                  onClick={addCoupon}
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coupons.map((c, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold font-mono text-purple-400">{c.code}</div>
                      <div className="text-[10px] text-slate-400">{c.discount}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">{c.uses} uses</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
