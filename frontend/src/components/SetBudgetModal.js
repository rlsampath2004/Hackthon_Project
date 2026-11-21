import React, { useState } from 'react';

export default function SetBudgetModal({ isOpen, onClose, onSaveBudget, categories }) {
  const [formData, setFormData] = useState({
    categoryName: '',
    budgetLimit: '',
    alertThreshold: 0.8, // 80%
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.budgetLimit) return;

    onSaveBudget({
      id: Date.now(),
      categoryName: formData.categoryName,
      monthYear: '2026-11',
      budgetLimit: parseFloat(formData.budgetLimit),
      actualSpent: 0,
      alertThreshold: parseFloat(formData.alertThreshold),
    });

    onClose();
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
        <div className="modal-content modal-pro-dark p-2">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <i className="bi bi-pie-chart-fill text-primary"></i>
              Configure Category Budget
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
                  Target Expense Category
                </label>
                <select
                  className="form-select-pro w-100"
                  required
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                >
                  <option value="">-- Select Category to Cap --</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Shopping & Retail">Shopping & Retail</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities & Wifi">Utilities & Wifi</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other Expense">Other Expense</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                    Monthly Cap ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="e.g. 500"
                    className="form-control-pro w-100 font-mono-num"
                    value={formData.budgetLimit}
                    onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                    Alert Threshold
                  </label>
                  <select
                    className="form-select-pro w-100"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                  >
                    <option value={0.75}>75% of Limit</option>
                    <option value={0.80}>80% of Limit (Default)</option>
                    <option value={0.90}>90% of Limit</option>
                    <option value={1.00}>100% of Limit</option>
                  </select>
                </div>
              </div>

              <div className="small text-muted p-2 rounded-2 border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--card-border)', fontSize: '11.5px' }}>
                <i className="bi bi-info-circle text-primary me-1"></i>
                The AI Pattern Analyzer monitors spending against this monthly threshold and alerts when utilization crosses 80%.
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary px-4 fw-semibold">
                <i className="bi bi-check-lg me-1"></i> Set Budget Limit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
