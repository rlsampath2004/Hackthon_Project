import React, { useState } from 'react';

export default function AddAccountModal({ isOpen, onClose, onAddAccount }) {
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'BANK',
    balance: '',
    currency: 'USD',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.accountName || !formData.balance) return;

    onAddAccount({
      id: Date.now(),
      accountName: formData.accountName,
      accountType: formData.accountType,
      balance: parseFloat(formData.balance),
      currency: formData.currency,
      accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      isActive: true,
    });

    onClose();
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-pro-dark p-2">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <i className="bi bi-bank2 text-primary"></i>
              Add Financial Account
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{ filter: 'var(--bs-btn-close-filter)' }}
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-3">
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                  Account Name / Institution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chase Premier Checking, Amex Platinum"
                  className="form-control-pro w-100"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                    Account Type
                  </label>
                  <select
                    className="form-select-pro w-100"
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  >
                    <option value="BANK">Bank Checking</option>
                    <option value="SAVINGS">High-Yield Savings</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="WALLET">Digital Wallet (Apple/Google)</option>
                    <option value="CASH">Physical Cash</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                    Initial Balance ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="form-control-pro w-100 font-mono-num"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary px-4 fw-semibold">
                <i className="bi bi-check-lg me-1"></i> Save Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

