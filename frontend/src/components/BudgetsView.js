import React, { useState } from 'react';
import { BudgetCardSkeleton, StatCardSkeleton } from './SkeletonLoader';

export default function BudgetsView({ 
  budgets = [], 
  onOpenSetBudgetModal, 
  onApplyAiBudgetPlan,
  isLoading = false 
}) {
  const [aiApplying, setAiApplying] = useState(false);

  // Calculate total budget vs total spent
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.budgetLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.actualSpent, 0);
  const totalUtilization = totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(1) : 0;

  // Categories exceeding 80% threshold
  const criticalBudgets = budgets.filter(
    (b) => (b.actualSpent / b.budgetLimit) >= (b.alertThreshold || 0.8)
  );

  const handle1ClickAiRecommend = () => {
    setAiApplying(true);
    setTimeout(() => {
      onApplyAiBudgetPlan();
      setAiApplying(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div 
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        data-aos="fade-down"
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Monthly Budgets & Alert Intelligence
          </h3>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Category spending caps, &gt;80% threshold warnings, and 50/30/20 AI optimization.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* 1-Click AI Budget Planner Button */}
          <button
            onClick={handle1ClickAiRecommend}
            disabled={aiApplying}
            className="btn btn-sm btn-outline-info d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2"
            type="button"
          >
            <i className={`bi ${aiApplying ? 'bi-arrow-repeat spin-anim' : 'bi-stars'}`}></i>
            <span>{aiApplying ? 'Applying Plan...' : '1-Click AI Budget Planner'}</span>
          </button>

          {/* Set Budget Modal Trigger */}
          <button
            onClick={onOpenSetBudgetModal}
            className="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
            type="button"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Set Category Limit</span>
          </button>
        </div>
      </div>

      {/* Threshold Warning Banner (if any category exceeds 80%) */}
      {!isLoading && criticalBudgets.length > 0 && (
        <div 
          className="alert alert-danger border-danger border-opacity-50 py-3 px-4 rounded-3 d-flex align-items-center justify-content-between mb-4 shadow-sm" 
          style={{ backgroundColor: 'rgba(220, 53, 69, 0.12)', color: '#f87171' }}
          data-aos="fade-in"
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-exclamation-triangle-fill fs-4 text-danger"></i>
            <div>
              <div className="fw-bold fs-6" style={{ color: '#ef4444' }}>
                Critical Budget Alert: {criticalBudgets.length} Categories Exceeding Threshold (&gt;80%)
              </div>
              <div className="small text-danger-subtle">
                {criticalBudgets.map((b) => b.categoryName).join(', ')} require spending moderation before month-end.
              </div>
            </div>
          </div>
          <span className="badge bg-danger text-white px-2.5 py-1">Action Required</span>
        </div>
      )}

      {/* Aggregate Budget Metrics (With Skeleton Support) */}
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
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Monthly Budget Cap</div>
                <div className="fs-3 fw-bold font-mono-num" style={{ color: 'var(--text-main)' }}>
                  ${totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Across {budgets.length} active categories</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Actual Outflow</div>
                <div className="fs-3 fw-bold font-mono-num text-danger">
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>{totalUtilization}% total cap utilized</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Remaining Monthly Buffer</div>
                <div className="fs-3 fw-bold font-mono-num text-success">
                  ${Math.max(0, totalBudgeted - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Safe discretionary reserve</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Category Budget Progress Cards Grid */}
      <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
        Category Budget Allocation & Limits ({budgets.length})
      </h5>

      <div className="row g-3 g-xl-4">
        {isLoading ? (
          <>
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
          </>
        ) : (
          budgets.map((b) => {
            const ratio = (b.actualSpent / b.budgetLimit) * 100;
            const percent = Math.min(100, Math.round(ratio));
            const isOver = ratio >= 100;
            const isWarning = ratio >= 80 && ratio < 100;

            let barColor = 'bg-success';
            if (isOver) barColor = 'bg-danger';
            else if (isWarning) barColor = 'bg-warning';

            return (
              <div key={b.id} className="col-12 col-md-6 col-xl-4" data-aos="fade-up">
                <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold fs-6" style={{ color: 'var(--text-main)' }}>
                        {b.categoryName}
                      </span>
                      <span
                        className={`badge border px-2 py-1 ${
                          isOver
                            ? 'bg-danger-subtle text-danger border-danger'
                            : isWarning
                            ? 'bg-warning-subtle text-warning border-warning'
                            : 'bg-success-subtle text-success border-success'
                        }`}
                        style={{ fontSize: '10.5px' }}
                      >
                        {isOver ? 'Exceeded' : isWarning ? 'Warning >80%' : 'Healthy'}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-baseline mb-2 gap-1">
                      <span className="font-mono-num fs-5 fs-sm-4 fw-bold text-truncate" style={{ color: 'var(--text-main)' }}>
                        ${b.actualSpent.toFixed(2)}
                      </span>
                      <span className="small text-muted font-mono-num">
                        of ${b.budgetLimit.toFixed(2)} cap
                      </span>
                    </div>

                    {/* Progress Bar with Color Thresholds */}
                    <div className="progress mb-3" style={{ height: '8px', backgroundColor: 'var(--input-border)' }}>
                      <div
                        className={`progress-bar ${barColor}`}
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--card-border)' }}>
                    <span className="small text-muted">
                      {ratio.toFixed(1)}% utilized
                    </span>
                    <span className="small font-mono-num" style={{ color: isOver ? '#ef4444' : '#10b981' }}>
                      {isOver ? `Over by $${(b.actualSpent - b.budgetLimit).toFixed(2)}` : `$${(b.budgetLimit - b.actualSpent).toFixed(2)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
