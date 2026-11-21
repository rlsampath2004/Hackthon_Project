import React, { useState } from 'react';
import { TableRowsSkeleton } from './SkeletonLoader';

export default function TransactionsView({ 
  transactions, 
  onDeleteTransaction, 
  onOpenAddModal,
  isLoading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchesAccount = accountFilter === 'ALL' || t.account === accountFilter;
    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'INCOME' && t.amount > 0) ||
      (typeFilter === 'EXPENSE' && t.amount < 0);

    return matchesSearch && matchesCategory && matchesAccount && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Title & Action Bar */}
      <div 
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        data-aos="fade-down"
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Transaction Ledger & Intelligence
          </h3>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Full transaction lifecycle with search, categorization, and AI tags.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
            type="button"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="custom-card p-3 mb-4" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-2 align-items-center">
          {/* Keyword Search */}
          <div className="col-12 col-md-4">
            <div className="position-relative">
              <i className="bi bi-search position-absolute ms-3 top-50 translate-middle-y" style={{ color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                className="form-control-pro w-100 ps-5"
                placeholder="Search merchant, memo, tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select-pro w-100"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Groceries">Groceries</option>
              <option value="Housing & Rent">Housing & Rent</option>
              <option value="Shopping & Retail">Shopping & Retail</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities & Wifi">Utilities & Wifi</option>
              <option value="Consulting Income">Consulting Income</option>
            </select>
          </div>

          {/* Account Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select-pro w-100"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="ALL">All Accounts</option>
              <option value="Chase Checking">Chase Checking</option>
              <option value="Amex Gold">Amex Gold</option>
              <option value="Apple Wallet">Apple Wallet</option>
            </select>
          </div>

          {/* Type Toggle */}
          <div className="col-12 col-md-2">
            <select
              className="form-select-pro w-100"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="EXPENSE">Expense Only</option>
              <option value="INCOME">Income Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="custom-card p-3 p-xl-4" data-aos="fade-up" data-aos-delay="200">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small fw-semibold" style={{ color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {transactions.length} entries
          </span>
          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '11px' }}>
            <i className="bi bi-funnel me-1"></i> Real-time Synced
          </span>
        </div>

        <div className="table-responsive">
          <table className="table custom-table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Merchant / Entity</th>
                <th scope="col">Category</th>
                <th scope="col">Account</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-end">Amount</th>
                <th scope="col" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableRowsSkeleton rows={6} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2.5">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-2"
                          style={{
                            width: '34px',
                            height: '34px',
                            backgroundColor: 'var(--surface-elevated)',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-main)',
                          }}
                        >
                          <i className={`bi ${tx.icon || 'bi-receipt'}`}></i>
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                            {tx.merchant}
                          </div>
                          {tx.isAiTagged && (
                            <span className="badge bg-info-subtle text-info border border-info border-opacity-25" style={{ fontSize: '9.5px' }}>
                              <i className="bi bi-stars me-1"></i> AI Tagged
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-25" style={{ fontSize: '11px' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                      {tx.account}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                      {tx.date}
                    </td>
                    <td className="text-end font-mono-num fw-bold" style={{ fontSize: '13.5px' }}>
                      <span style={{ color: tx.amount > 0 ? '#198754' : '#dc3545' }}>
                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="btn btn-sm btn-link text-danger p-1"
                        title="Delete Transaction"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
