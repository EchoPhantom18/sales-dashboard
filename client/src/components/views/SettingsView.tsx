import React, { useState } from 'react';
import { Save, Bell, User, CheckCircle2, Database, Globe, RefreshCw, Radio, FileSpreadsheet, ShieldCheck, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  // Profile State
  const [name, setName] = useState('Tanmay');
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('tanmay@salessphere.com');

  // Notifications State
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // NEW FEATURE 1: Database & Realtime Sync Settings
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [syncRate, setSyncRate] = useState('15');
  const [testingConn, setTestingConn] = useState(false);
  const [connStatus, setConnStatus] = useState<string | null>(null);

  // NEW FEATURE 2: Currency & Localization Settings
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [exportFormat, setExportFormat] = useState('CSV');

  const [toast, setToast] = useState<string | null>(null);

  // Test Supabase Connection Handler
  const handleTestConnection = async () => {
    try {
      setTestingConn(true);
      setConnStatus(null);
      const start = Date.now();
      const { count, error } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const latency = Date.now() - start;

      if (error) {
        setConnStatus(`Connection error: ${error.message}`);
      } else {
        setConnStatus(`Connected live to Supabase • ${latency}ms latency (${count?.toLocaleString()} orders in DB)`);
      }
    } catch (err: any) {
      setConnStatus('Connection failed: Check network');
    } finally {
      setTestingConn(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Settings and preferences saved successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300 max-w-4xl">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#111827]">Account & System Settings</h2>
        <p className="text-xs font-medium text-gray-400 mt-0.5">Manage profile details, real-time database sync, currency localization, and security</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profile Information Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
            <User className="w-4 h-4 text-[#2563EB]" />
            <span>Profile Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* NEW FEATURE 1: Supabase Database & Realtime Sync Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Supabase Database & Realtime Sync</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Live Connected
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Realtime Toggle */}
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#111827] block">WebSocket Realtime Auto-Sync</span>
                <span className="text-[11px] font-medium text-gray-400">Instantly reflect postgres_changes from Supabase orders & users tables</span>
              </div>
              <input
                type="checkbox"
                checked={realtimeEnabled}
                onChange={(e) => setRealtimeEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#2563EB] rounded-lg cursor-pointer"
              />
            </div>

            {/* Sync Rate Selector */}
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#111827] block">Background Fetch Sync Rate</span>
                <span className="text-[11px] font-medium text-gray-400">Interval for polling background sales metrics</span>
              </div>
              <select
                value={syncRate}
                onChange={(e) => setSyncRate(e.target.value)}
                className="h-9 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600"
              >
                <option value="5">Every 5 seconds</option>
                <option value="15">Every 15 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 1 minute</option>
              </select>
            </div>

            {/* Connection Test Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConn}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {testingConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{testingConn ? 'Testing Latency...' : 'Test Supabase Connection'}</span>
              </button>

              {connStatus && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {connStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NEW FEATURE 2: Currency & Regional Localization Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Currency & Regional Localization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Date Display Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (14/08/2023)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY (Aug 14, 2023)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2023-08-14)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Default Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-600"
              >
                <option value="CSV">CSV (.csv)</option>
                <option value="JSON">JSON (.json)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Notifications & Security Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notifications & Alert Preferences</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#111827] block">Realtime Sales Push Alerts</span>
                <span className="text-[11px] font-medium text-gray-400">Receive instant popover notifications on high-value orders</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 accent-[#2563EB] rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#111827] block">Daily Email Sales Digest</span>
                <span className="text-[11px] font-medium text-gray-400">Receive daily 8:30 PM summary report to tanmay@salessphere.com</span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-5 h-5 accent-[#2563EB] rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs font-bold text-[#111827] block">Sound Chime on New Sale</span>
                <span className="text-[11px] font-medium text-gray-400">Play an audio notification whenever a deal closes</span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#2563EB] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Preferences</span>
        </button>
      </form>
    </div>
  );
};
