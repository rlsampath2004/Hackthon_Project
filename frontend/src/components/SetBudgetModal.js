import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';

const STANDARD_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Housing & Rent',
  'Shopping & Retail',
  'Transportation',
  'Utilities & Wifi',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Other Expense',
];

export default function SetBudgetModal({ isOpen, onClose, onSaveBudget, editingBudget }) {
  const [categories, setCategories] = useState(STANDARD_CATEGORIES);
  const [formData, setFormData] = useState({
    categoryName: '',
    budgetLimit: '',
    alertThreshold: 0.8, // 80%
  });

  useEffect(() => {
    let isMounted = true;
    api.getCategories().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        const names = cats.map((c) => c.categoryName);
        setCategories(Array.from(new Set([...names, ...STANDARD_CATEGORIES])));
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        categoryName: editingBudget.categoryName || '',
        budgetLimit: editingBudget.budgetLimit !== undefined ? editingBudget.budgetLimit.toString() : '',
        alertThreshold: editingBudget.alertThreshold !== undefined ? editingBudget.alertThreshold : 0.8,
      });
    } else {
      setFormData({
        categoryName: '',
        budgetLimit: '',
        alertThreshold: 0.8,
      });
    }
  }, [editingBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.budgetLimit) return;

    const parsedLimit = parseFloat(formData.budgetLimit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;

    onSaveBudget({
      id: editingBudget ? editingBudget.id : Date.now(),
      categoryName: formData.categoryName,
      monthYear: '2026-11',
      budgetLimit: parsedLimit,
      actualSpent: editingBudget ? (editingBudget.actualSpent || 0) : 0,
      alertThreshold: parseFloat(formData.alertThreshold),
    });

    onClose();
  };

  const isEditing = Boolean(editingBudget);

  // Ensure editing category exists in select options
  const categoryOptions = isEditing && !categories.includes(formData.categoryName)
    ? [formData.categoryName, ...categories]
    : categories;

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
              <i className={`bi ${isEditing ? 'bi-pencil-square text-warning' : 'bi-pie-chart-fill text-primary'}`}></i>
              <span>{isEditing ? 'Modify Category Budget Limit' : 'Configure Category Budget'}</span>
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
                  disabled={isEditing} // keep category stable when editing
                  style={{ cursor: isEditing ? 'not-allowed' : 'pointer' }}
                >
                  <option value="">-- Select Category to Cap --</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <div className="form-text small" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Category name is locked during modification. Create a new budget to add other categories.
                  </div>
                )}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-muted)' }}>
                    Monthly Cap ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
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
                    <option value={0.70}>70% of Limit</option>
                    <option value={0.75}>75% of Limit</option>
                    <option value={0.80}>80% of Limit (Default)</option>
                    <option value={0.90}>90% of Limit</option>
                    <option value={1.00}>100% of Limit</option>
                  </select>
                </div>
              </div>

              {isEditing && editingBudget && (
                <div className="p-2.5 rounded-2 border mb-3" style={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--card-border)', fontSize: '12px' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Current Actual Spend:</span>
                    <span className="fw-bold font-mono-num" style={{ color: 'var(--text-main)' }}>
                      ${(editingBudget.actualSpent || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Projected Utilization:</span>
                    <span className="fw-semibold font-mono-num" style={{ color: formData.budgetLimit ? '#0d6efd' : 'inherit' }}>
                      {formData.budgetLimit && parseFloat(formData.budgetLimit) > 0
                        ? `${(((editingBudget.actualSpent || 0) / parseFloat(formData.budgetLimit)) * 100).toFixed(1)}%`
                        : '0.0%'}
                    </span>
                  </div>
                </div>
              )}

              <div className="small text-muted p-2 rounded-2 border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--card-border)', fontSize: '11.5px' }}>
                <i className="bi bi-info-circle text-primary me-1"></i>
                The AI Pattern Analyzer monitors spending against this monthly threshold and alerts when utilization crosses {Math.round(formData.alertThreshold * 100)}%.
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary px-4 fw-semibold">
                <i className={`bi ${isEditing ? 'bi-check-circle-fill' : 'bi-check-lg'} me-1`}></i>
                {isEditing ? 'Save Changes' : 'Set Budget Limit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
