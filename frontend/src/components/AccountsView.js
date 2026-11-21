import React from 'react';
import { AccountCardSkeleton, StatCardSkeleton } from './SkeletonLoader';

export default function AccountsView({ 
  accounts = [], 
  onOpenAddAccountModal,
  isLoading = false 
}) {
  const getAccountIcon = (type) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'bi-credit-card-2-front text-warning';
      case 'WALLET':
        return 'bi-phone text-info';
      case 'SAVINGS':
        return 'bi-piggy-bank text-success';
      default:
        return 'bi-bank text-primary';
    }
  };

  const getAccountBadge = (type) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'bg-warning-subtle text-warning border-warning';
      case 'WALLET':
        return 'bg-info-subtle text-info border-info';
      case 'SAVINGS':
        return 'bg-success-subtle text-success border-success';
      default:
        return 'bg-primary-subtle text-primary border-primary';
    }
  };

  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="space-y-4">
      {/* Title & Quick Actions Header */}
      <div 
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        data-aos="fade-down"
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Account Management & Ledger Balances
          </h3>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Multi-account management (Bank, Credit Card, Digital Wallets, Cash)
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={onOpenAddAccountModal}
            className="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
            type="button"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add New Account</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner for Accounts (With Skeleton Support) */}
      <div className="row g-3 mb-4" data-aos="fade-up" data-aos-delay="100">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Assets (Liquid)</div>
                <div className="fs-3 fw-bold font-mono-num text-success">
                  ${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Checking, Savings & Digital Wallets</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Liabilities / Debt</div>
                <div className="fs-3 fw-bold font-mono-num text-danger">
                  ${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Active Credit Card Balance</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Net Worth</div>
                <div className="fs-3 fw-bold font-mono-num text-primary">
                  ${(totalAssets - totalLiabilities).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Aggregated FinTech Balance</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Account Cards Grid */}
      <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
        Active Financial Accounts ({accounts.length})
      </h5>

      <div className="row g-3 g-xl-4 mb-4">
        {isLoading ? (
          <>
            <AccountCardSkeleton />
            <AccountCardSkeleton />
            <AccountCardSkeleton />
            <AccountCardSkeleton />
          </>
        ) : accounts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="custom-card p-5">
              <i className="bi bi-wallet2 fs-1 text-secondary mb-2 d-block"></i>
              <h5 className="mb-1 fw-bold" style={{ color: 'var(--text-main)' }}>No Accounts Connected</h5>
              <p className="text-muted small mb-3">Add your first checking, savings, or credit card account to track ledger balances.</p>
              <button onClick={onOpenAddAccountModal} className="btn btn-primary btn-sm px-3">
                <i className="bi bi-plus-circle me-1"></i> Add Account
              </button>
            </div>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="col-12 col-md-6 col-xl-3" data-aos="fade-up">
              <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between position-relative">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--card-border)',
                        fontSize: '1.25rem',
                      }}
                    >
                      <i className={`bi ${getAccountIcon(acc.accountType)}`}></i>
                    </div>
                    <span className={`badge border ${getAccountBadge(acc.accountType)} px-2 py-1`}>
                      {acc.accountType}
                    </span>
                  </div>

                  <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-main)' }} title={acc.accountName}>
                    {acc.accountName}
                  </h6>
                  <div className="font-mono-num small mb-3" style={{ color: 'var(--text-muted)' }}>
                    {acc.accountNumber || `•••• ${Math.floor(1000 + Math.random() * 9000)}`}
                  </div>
                </div>

                <div>
                  <div className="small mb-1" style={{ color: 'var(--text-muted)' }}>Current Balance</div>
                  <h4 className={`font-mono-num fw-bold mb-3 text-truncate ${acc.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    {acc.balance >= 0 ? `$${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-$${Math.abs(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </h4>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary w-100 py-1" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-clock-history me-1"></i> Statement
                    </button>
                    <button className="btn btn-sm btn-outline-primary w-100 py-1" style={{ fontSize: '11.5px' }}>
                      <i className="bi bi-arrow-left-right me-1"></i> Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
