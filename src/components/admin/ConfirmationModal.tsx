'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => any;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  confirmVariant,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  const isDanger = confirmVariant === 'danger' || (isDestructive && confirmVariant !== 'primary');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDanger ? 'bg-rose-700/10 border border-rose-700/30 text-rose-800' : 'bg-emerald-700/10 border border-emerald-700/30 text-emerald-800'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202522] tracking-tight">{title}</h3>
              <div className="text-[11px] font-mono text-[#70695f] uppercase tracking-wider">Administrative Confirmation</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded text-[#70695f] hover:text-[#202522] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#202522]/80 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#b9aa95]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-[#202522] hover:bg-[#dfd4c1] bg-[#eee8dc] border border-[#b9aa95] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm ${
              isDanger
                ? 'bg-rose-700 hover:bg-rose-800 disabled:opacity-50'
                : 'bg-[#9b452f] hover:bg-[#833824] disabled:opacity-50'
            }`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
