import React from 'react';
import {
  UserProfile,
  ProcessedFile,
  ToolItem,
} from '../../types';
import {
  LayoutDashboard,
  HardDrive,
  FileCheck,
  Crown,
  Star,
  Download,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  recentFiles: ProcessedFile[];
  tools: ToolItem[];
  onSelectTool: (toolId: string) => void;
  onOpenPricing: () => void;
  onOpenSubscriptionManagement?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  recentFiles,
  tools,
  onSelectTool,
  onOpenPricing,
  onOpenSubscriptionManagement,
}) => {
  const favoriteTools = tools.filter((t) => user.favorites.includes(t.id));

  // Defaults for usage
  const usage = user.usage || {
    aiRequestsToday: 8,
    aiRequestsLimitDaily: user.plan === 'Free' ? 10 : -1,
    aiRequestsThisMonth: user.plan.includes('Pro') ? 180 : 8,
    aiRequestsLimitMonthly: user.plan.includes('Pro') ? 500 : user.plan === 'Enterprise' ? -1 : 300,
    pdfOpsToday: 3,
    pdfOpsLimitDaily: user.plan === 'Free' ? 5 : -1,
    storageUsedMB: user.storageUsedMB || 120,
    storageLimitMB: user.storageLimitMB || 500,
    maxFileSizeMB: user.plan === 'Free' ? 10 : user.plan.includes('Pro') ? 500 : 5120,
    apiRequestsThisMonth: user.plan === 'Enterprise' ? 12400 : 0,
    apiRequestsLimitMonthly: user.plan === 'Enterprise' ? 50000 : 0,
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>Welcome back, {user.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {user.plan} Plan
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenSubscriptionManagement && (
            <button
              onClick={onOpenSubscriptionManagement}
              className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-2xl border border-indigo-500/40 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Manage Subscription &amp; Limits</span>
            </button>
          )}

          {user.plan === 'Free' && (
            <button
              onClick={onOpenPricing}
              className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <Crown className="w-4 h-4 text-slate-900" />
              <span>Upgrade to Pro Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Limits & Usage Tracker Card Row */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            <span>Active Subscription Limits &amp; Daily Tracking</span>
          </h3>

          {onOpenSubscriptionManagement && (
            <button
              onClick={onOpenSubscriptionManagement}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full Tier Matrix &rarr;
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* AI Usage */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
              <span>AI Tools Requests</span>
              <span className="text-[10px] text-indigo-500 font-bold">
                {user.plan === 'Free' ? '10 / day' : user.plan.includes('Pro') ? '500 / mo' : 'Unlimited'}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {usage.aiRequestsLimitDaily > 0
                ? `${usage.aiRequestsToday} / ${usage.aiRequestsLimitDaily} used today`
                : `${usage.aiRequestsThisMonth} / 500 used`}
            </div>
            {usage.aiRequestsLimitDaily > 0 && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    usage.aiRequestsToday >= usage.aiRequestsLimitDaily ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, (usage.aiRequestsToday / usage.aiRequestsLimitDaily) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* PDF Ops */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
              <span>PDF Operations</span>
              <span className="text-[10px] text-emerald-500 font-bold">
                {user.plan === 'Free' ? '5 / day' : 'Unlimited'}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {usage.pdfOpsLimitDaily > 0
                ? `${usage.pdfOpsToday} / ${usage.pdfOpsLimitDaily} used today`
                : 'Unlimited Processing'}
            </div>
            {usage.pdfOpsLimitDaily > 0 && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (usage.pdfOpsToday / usage.pdfOpsLimitDaily) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Storage Used */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
              <span>Cloud Storage</span>
              <span className="text-[10px] text-amber-500 font-bold">
                {user.plan === 'Free' ? '500 MB' : user.plan.includes('Pro') ? '50 GB' : '1 TB+'}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {user.storageUsedMB.toFixed(1)} MB / {user.storageLimitMB} MB
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (user.storageUsedMB / user.storageLimitMB) * 100)}%` }}
              />
            </div>
          </div>

          {/* Max File Upload Limit */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
              <span>Max File Size</span>
              <span className="text-[10px] text-cyan-500 font-bold">Upload Cap</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {usage.maxFileSizeMB >= 1024 ? `${usage.maxFileSizeMB / 1024} GB` : `${usage.maxFileSizeMB} MB`}
            </div>
            <div className="text-[10px] text-slate-400">
              {user.plan === 'Free' ? 'Auto-deleted in 30 days' : 'Permanent cloud history'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Cloud Storage Used</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.storageUsedMB.toFixed(1)} MB / {user.storageLimitMB} MB
            </div>
            <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (user.storageUsedMB / user.storageLimitMB) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Files Processed</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {recentFiles.length + user.filesProcessedCount} Files
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              +100% Privacy Protected
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Favorite Tools</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {user.favorites.length} Saved
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Quick 1-Click Launch
            </div>
          </div>
        </div>

      </div>

      {/* Favorite Tools Quick Launcher */}
      {favoriteTools.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Your Favorite Shortcuts</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {favoriteTools.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className="p-3 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {t.name}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Files Processed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span>Recent File Activity & History</span>
        </h3>

        {recentFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">File Name</th>
                  <th className="p-3">Tool Used</th>
                  <th className="p-3">Original Size</th>
                  <th className="p-3">Processed Size</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {file.fileName}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                        {file.toolUsed}
                      </span>
                    </td>
                    <td className="p-3">{(file.originalSize / 1024).toFixed(1)} KB</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {(file.processedSize / 1024).toFixed(1)} KB
                    </td>
                    <td className="p-3 text-slate-400">{file.createdAt}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Downloading ${file.fileName}...`)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No recent files processed yet. Try running a PDF merge, split, or AI summarizer tool!
          </div>
        )}
      </div>

    </div>
  );
};
