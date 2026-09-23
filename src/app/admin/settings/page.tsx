'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/admin/ToastNotification';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  // Settings State
  const [platformName, setPlatformName] = useState('OpenMarket365 Egypt B2B');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [supportEmail, setSupportEmail] = useState('governance@openmarket365.com');
  const [supportPhone, setSupportPhone] = useState('+20 2 2456 7890');

  // User policy state
  const [autoApproveVisitors, setAutoApproveVisitors] = useState(true);
  const [requireCrForProducts, setRequireCrForProducts] = useState(true);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState(24);

  // AI Telemetry State
  const [enableAiClassifier, setEnableAiClassifier] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [selectedAiModel, setSelectedAiModel] = useState('gemini-1.5-pro');

  // Alert State
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [wireNotificationWebhook, setWireNotificationWebhook] = useState(
    'https://api.market365.com/webhooks/fawry-cib-alerts'
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('success', 'Platform settings successfully saved and applied');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Platform Settings & Governance
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Global configuration, exporter verification policies, AI parameters, and alert webhooks.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#9b452f] px-4 py-2 text-xs font-bold text-white hover:bg-[#833824] transition-all disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Saving Changes...' : 'Save All Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: GENERAL */}
        <ScrollReveal>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-[#b9aa95]">
              <h3 className="text-base font-semibold text-[#202522]">
                General Platform Identity
              </h3>
              <p className="text-xs text-[#70695f]">
                Core branding, maintenance lockouts, and emergency administrative channels
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Platform Display Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Support Hotline
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202522]">
                  Official Governance Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#b9aa95]">
              <div>
                <span className="text-xs font-semibold text-[#202522]">
                  Maintenance Mode
                </span>
                <p className="text-[11px] text-[#70695f]">
                  Locks the public trading floor and redirects visitors to maintenance notice
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  maintenanceMode ? 'bg-[#9b452f]' : 'bg-[#b9aa95]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* SECTION 2: EXPORTER POLICIES */}
        <ScrollReveal delayMs={100}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-[#b9aa95]">
              <h3 className="text-base font-semibold text-[#202522]">
                User & Exporter Verification Governance
              </h3>
              <p className="text-xs text-[#70695f]">
                Rules governing onboarding verification, CR prerequisites, and session lifetimes
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#202522]">
                    Mandatory CR Before Commodity Publishing
                  </span>
                  <p className="text-[11px] text-[#70695f]">
                    Exporters cannot publish citrus or fresh produce lots until their Commercial Registry is approved
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireCrForProducts(!requireCrForProducts)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    requireCrForProducts ? 'bg-[#9b452f]' : 'bg-[#b9aa95]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      requireCrForProducts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-[#b9aa95] pt-4">
                <div>
                  <span className="text-xs font-semibold text-[#202522]">
                    Instant Visitor / Buyer Activation
                  </span>
                  <p className="text-[11px] text-[#70695f]">
                    Automatically grant RFQ posting privileges to newly registered foreign buyers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoApproveVisitors(!autoApproveVisitors)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    autoApproveVisitors ? 'bg-[#9b452f]' : 'bg-[#b9aa95]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      autoApproveVisitors ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-[#b9aa95] pt-4">
                <label className="block text-xs font-semibold text-[#202522]">
                  Admin Session Timeout (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={sessionTimeoutHours}
                  onChange={(e) => setSessionTimeoutHours(Number(e.target.value))}
                  className="mt-1.5 w-32 rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* SECTION 3: AI & AUTOMATION */}
        <ScrollReveal delayMs={150}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-[#b9aa95]">
              <h3 className="text-base font-semibold text-[#202522]">
                AI Intelligence & Model Telemetry
              </h3>
              <p className="text-xs text-[#70695f]">
                Configure the automated tariff classifier and multi-lingual Arabic produce spec engine
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Production AI Model Pipeline
                </label>
                <select
                  value={selectedAiModel}
                  onChange={(e) => setSelectedAiModel(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Multimodal & Arabic Spec OCR)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency Classifier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Auto-Approval Confidence Threshold: {aiConfidenceThreshold}%
                </label>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                  className="mt-3 w-full accent-[#9b452f]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#b9aa95] pt-4">
              <div>
                <span className="text-xs font-semibold text-[#202522]">
                  Enable HS Code Auto-Classifier
                </span>
                <p className="text-[11px] text-[#70695f]">
                  Automatically classify commodity specifications to 6-digit Harmonized System tariffs
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnableAiClassifier(!enableAiClassifier)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  enableAiClassifier ? 'bg-[#9b452f]' : 'bg-[#b9aa95]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    enableAiClassifier ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* SECTION 4: WEBHOOKS & SECURITY */}
        <ScrollReveal delayMs={200}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-5">
            <div className="pb-3 border-b border-[#b9aa95]">
              <h3 className="text-base font-semibold text-[#202522]">
                Security Webhooks & Real-Time Dispatch
              </h3>
              <p className="text-xs text-[#70695f]">
                External endpoints receiving signed payload notifications for bank wires and tenders
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522]">
                Payment Webhook URL (CIB / Fawry)
              </label>
              <input
                type="url"
                value={wireNotificationWebhook}
                onChange={(e) => setWireNotificationWebhook(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs font-mono text-[#202522] focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>
        </ScrollReveal>
      </form>
    </div>
  );
}
