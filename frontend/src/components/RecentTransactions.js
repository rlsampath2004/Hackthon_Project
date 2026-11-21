import React, { useState } from 'react';
import { RecentActivityItemSkeleton } from './SkeletonLoader';

export default function RecentTransactions({ transactions = [], isLoading = false }) {
  const [filterType, setFilterType] = useState('ALL');

  const filtered = transactions.filter((tx) => {
    if (filterType === 'INCOME') return tx.amount > 0;
    if (filterType === 'EXPENSE') return tx.amount < 0;
    return true;
  });

  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Food & Dining':
        return { icon: 'bi-cup-hot-fill', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Groceries':
        return { icon: 'bi-cart-fill', color: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.3)' };
      case 'Housing & Rent':
        return { icon: 'bi-house-door-fill', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.14)', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Shopping & Retail':
        return { icon: 'bi-bag-fill', color: '#f97316', bg: 'rgba(249, 115, 22, 0.14)', border: 'rgba(249, 115, 22, 0.3)' };
      case 'Transportation':
        return { icon: 'bi-car-front-fill', color: '#0d6efd', bg: 'rgba(13, 110, 253, 0.14)', border: 'rgba(13, 110, 253, 0.3)' };
      case 'Utilities & Wifi':
        return { icon: 'bi-wifi', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.14)', border: 'rgba(6, 182, 212, 0.3)' };
      case 'Consulting Income':
      case 'Salary / Employment':
        return { icon: 'bi-briefcase-fill', color: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { icon: 'bi-receipt-cutoff', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.14)', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <div className="custom-card p-3 p-xl-4 h-100">
      {/* Header with Title and Filter Pills */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
              Recent Ledger Activity
            </h5>
            <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 py-0.5 px-2" style={{ fontSize: '10px' }}>
              Live Synced
            </span>
          </div>
          <p className="small mb-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Real-time feed across connected financial accounts
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="d-flex align-items-center gap-1.5">
          {['ALL', 'EXPENSE', 'INCOME'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className="btn btn-sm px-2.5 py-1 fw-semibold"
              style={{
                fontSize: '11px',
                borderRadius: '6px',
                backgroundColor: filterType === type ? '#0d6efd' : 'var(--surface-elevated)',
                color: filterType === type ? '#ffffff' : 'var(--text-muted)',
                borderColor: filterType === type ? '#0d6efd' : 'var(--card-border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                transition: 'all 0.18s ease',
              }}
            >
              {type === 'ALL' ? 'All' : type === 'EXPENSE' ? 'Outflow' : 'Inflow'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List Container */}
      <div className="space-y-2">
        {isLoading ? (
          <>
            <RecentActivityItemSkeleton />
            <RecentActivityItemSkeleton />
            <RecentActivityItemSkeleton />
            <RecentActivityItemSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-3 d-block mb-1"></i>
            No recent activity recorded for this view.
          </div>
        ) : (
          filtered.slice(0, 5).map((tx) => {
            const theme = getCategoryTheme(tx.category);
            const isIncome = tx.amount > 0;

            return (
              <div
                key={tx.id}
                className="d-flex align-items-center justify-content-between p-2.5 p-sm-3 rounded-3 mb-2 border transition-all"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--card-border)',
                }}
                data-aos="fade-up"
              >
                {/* Left: Category Icon Squircle + Details */}
                <div className="d-flex align-items-center gap-2.5 gap-sm-3 min-w-0">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: theme.bg,
                      color: theme.color,
                      border: `1px solid ${theme.bg}`,
                    }}
                  >
                    <i className={`bi ${theme.icon} fs-5`}></i>
                  </div>

                  <div className="min-w-0">
                    <div className="d-flex align-items-center gap-1.5 flex-wrap">
                      <span className="fw-semibold text-truncate d-inline-block" style={{ fontSize: '13.5px', color: 'var(--text-main)', maxWidth: 'clamp(110px, 32vw, 240px)' }}>
                        {tx.merchant}
                      </span>
                      {tx.isAiTagged && (
                        <span className="badge bg-info-subtle text-info border border-info border-opacity-25" style={{ fontSize: '9px', padding: '2px 6px' }}>
                          <i className="bi bi-stars me-1"></i> AI Tagged
                        </span>
                      )}
                    </div>

                    <div className="small d-flex align-items-center gap-2 mt-0.5" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      <span>{tx.account}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Category Badge */}
                <div className="text-end flex-shrink-0 ms-2">
                  <div className="font-mono-num fw-bold fs-6" style={{ color: isIncome ? '#198754' : '#dc3545' }}>
                    {isIncome ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                  </div>
                  <span
                    className="badge rounded-pill border mt-0.5"
                    style={{
                      fontSize: '9.5px',
                      backgroundColor: theme.bg,
                      color: theme.color,
                      borderColor: theme.border,
                      fontWeight: 600,
                    }}
                  >
                    {tx.category}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
