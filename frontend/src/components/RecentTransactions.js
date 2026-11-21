import React, { useState } from 'react';
import { RecentActivityItemSkeleton } from './SkeletonLoader';

export default function RecentTransactions({ transactions = [], isLoading = false, onViewAll }) {
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
    <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
      <div>
        {/* Header with Title and Filter Pills (Fully Responsive) */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
          <div className="min-w-0">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="fw-bold mb-0 text-truncate" style={{ color: 'var(--text-main)' }}>
                Recent Ledger Activity
              </h5>
              <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 py-0.5 px-2 flex-shrink-0" style={{ fontSize: '10px' }}>
                Live Synced
              </span>
            </div>
            <p className="small mb-0 mt-0.5 text-muted text-truncate" style={{ fontSize: '12px' }}>
              Real-time feed across connected financial accounts
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
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
              <span>No recent activity recorded for this view.</span>
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
                  <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0 flex-grow-1 me-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{
                        width: '38px',
                        height: '38px',
                        backgroundColor: theme.bg,
                        color: theme.color,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <i className={`bi ${theme.icon} fs-5`}></i>
                    </div>

                    <div className="min-w-0 flex-grow-1">
                      {/* Merchant Name + AI Tagged Badge */}
                      <div className="d-flex align-items-center gap-1.5 flex-wrap">
                        <span
                          className="fw-semibold text-truncate d-inline-block"
                          style={{
                            fontSize: '13.5px',
                            color: 'var(--text-main)',
                            maxWidth: 'clamp(110px, 28vw, 240px)',
                          }}
                          title={tx.merchant}
                        >
                          {tx.merchant}
                        </span>
                        {tx.isAiTagged && (
                          <span
                            className="badge bg-info-subtle text-info border border-info border-opacity-25 flex-shrink-0"
                            style={{ fontSize: '9px', padding: '1.5px 5px' }}
                          >
                            <i className="bi bi-stars me-0.5"></i> AI
                          </span>
                        )}
                      </div>

                      {/* Account & Date Metadata (Responsive Wrapping) */}
                      <div
                        className="small d-flex align-items-center flex-wrap gap-1 mt-0.5 text-muted"
                        style={{ fontSize: '11px' }}
                      >
                        <span className="text-truncate" style={{ maxWidth: '140px' }}>
                          {tx.account}
                        </span>
                        <span className="d-none d-sm-inline">•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Category Badge */}
                  <div className="text-end flex-shrink-0">
                    <div
                      className="font-mono-num fw-bold fs-6"
                      style={{ color: isIncome ? '#10b981' : '#ef4444' }}
                    >
                      {isIncome ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                    </div>
                    <span
                      className="badge rounded-pill border mt-0.5 d-inline-block text-truncate"
                      style={{
                        fontSize: '9.5px',
                        maxWidth: '120px',
                        backgroundColor: theme.bg,
                        color: theme.color,
                        borderColor: theme.border,
                        fontWeight: 600,
                      }}
                      title={tx.category}
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

      {/* Responsive Footer Navigation Link */}
      {!isLoading && transactions.length > 0 && (
        <div
          className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <span className="small text-muted" style={{ fontSize: '11.5px' }}>
            Showing {Math.min(5, filtered.length)} of {transactions.length} entries
          </span>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center gap-1"
              style={{ fontSize: '12px', color: '#0d6efd' }}
              type="button"
            >
              <span>View Full Ledger</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
