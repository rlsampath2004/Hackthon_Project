import React, { useState } from 'react';
import { BudgetCardSkeleton, StatCardSkeleton } from './SkeletonLoader';

export default function BudgetsView({ 
  budgets = [], 
  onOpenSetBudgetModal, 
  onEditBudget,
  onDeleteBudget,
  onQuickAdjust,
  onClearAllBudgets,
  onApplyAiBudgetPlan,
  isLoading = false 
}) {
  const [aiApplying, setAiApplying] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Calculate total budget vs total spent
  const totalBudgeted = budgets.reduce((acc, b) => acc + (b.budgetLimit || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.actualSpent || 0), 0);
  const totalUtilization = totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(1) : 0;

  // Categories exceeding alert threshold (default 80%)
  const criticalBudgets = budgets.filter(
    (b) => b.budgetLimit > 0 && ((b.actualSpent || 0) / b.budgetLimit) >= (b.alertThreshold || 0.8)
  );

  const handle1ClickAiRecommend = () => {
    setAiApplying(true);
    setTimeout(() => {
      if (onApplyAiBudgetPlan) onApplyAiBudgetPlan();
      setAiApplying(false);
    }, 550);
  };

  const filteredBudgets = budgets.filter((b) =>
    (b.categoryName || '').toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Title & Actions Bar */}
      <div 
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        data-aos="fade-down"
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Monthly Budgets & Alert Intelligence
          </h3>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Manage category caps, thresholds, quick adjustments, and 50/30/20 AI optimization.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* 1-Click AI Budget Planner */}
          <button
            onClick={handle1ClickAiRecommend}
            disabled={aiApplying}
            className="btn btn-sm btn-outline-info d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2"
            type="button"
            title="Auto-generate optimized 50/30/20 budget allocations"
          >
            <i className={`bi ${aiApplying ? 'bi-arrow-repeat spin-anim' : 'bi-stars'}`}></i>
            <span>{aiApplying ? 'Optimizing Plan...' : '1-Click AI Budget Planner'}</span>
          </button>

          {/* Set / Create Budget Modal Trigger */}
          <button
            onClick={onOpenSetBudgetModal}
            className="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
            type="button"
            title="Create a new monthly spending limit"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Set Category Limit</span>
          </button>

          {/* Clear All Budgets Helper (if list not empty) */}
          {budgets.length > 0 && onClearAllBudgets && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all category budget limits?')) {
                  onClearAllBudgets();
                }
              }}
              className="btn btn-sm btn-outline-secondary px-2.5 py-1.5 d-flex align-items-center gap-1"
              type="button"
              title="Delete all budget limits"
            >
              <i className="bi bi-trash3"></i>
              <span className="d-none d-lg-inline">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Threshold Warning Banner (if any category exceeds threshold) */}
      {!isLoading && criticalBudgets.length > 0 && (
        <div 
          className="alert alert-danger border-danger border-opacity-50 py-3 px-4 rounded-3 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 shadow-sm gap-2" 
          style={{ backgroundColor: 'rgba(220, 53, 69, 0.12)', color: '#f87171' }}
          data-aos="fade-in"
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-exclamation-triangle-fill fs-4 text-danger flex-shrink-0"></i>
            <div>
              <div className="fw-bold fs-6" style={{ color: '#ef4444' }}>
                Critical Budget Alert: {criticalBudgets.length} {criticalBudgets.length === 1 ? 'Category' : 'Categories'} Exceeding Alert Threshold (&gt;80%)
              </div>
              <div className="small text-danger-subtle">
                {criticalBudgets.map((b) => b.categoryName).join(', ')} require immediate spending moderation.
              </div>
            </div>
          </div>
          <span className="badge bg-danger text-white px-2.5 py-1 flex-shrink-0">Action Required</span>
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
              <div className="custom-card p-3 h-100">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Monthly Cap</div>
                <div className="fs-3 fw-bold font-mono-num" style={{ color: 'var(--text-main)' }}>
                  ${totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Across {budgets.length} configured categories</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3 h-100">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total Actual Outflow</div>
                <div className="fs-3 fw-bold font-mono-num text-danger">
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>{totalUtilization}% of aggregate cap consumed</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3 h-100">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Remaining Monthly Buffer</div>
                <div className="fs-3 fw-bold font-mono-num text-success">
                  ${Math.max(0, totalBudgeted - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Safe unallocated buffer</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Subheader with Search Filter */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
        <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
          Configured Limits ({budgets.length})
        </h5>
        {budgets.length > 3 && (
          <div className="position-relative" style={{ maxWidth: '240px', width: '100%' }}>
            <i className="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-2.5 text-muted small"></i>
            <input
              type="text"
              placeholder="Filter by category..."
              className="form-control-pro w-100 py-1 ps-4 text-truncate"
              style={{ fontSize: '12px' }}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Category Budget Progress Cards Grid */}
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
        ) : budgets.length === 0 ? (
          /* Clean Zero-Data Empty State */
          <div className="col-12" data-aos="fade-up">
            <div className="custom-card p-4 p-md-5 text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3 shadow-sm"
                style={{ width: '60px', height: '60px' }}
              >
                <i className="bi bi-pie-chart-fill fs-2"></i>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>No Category Budgets Configured</h5>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '440px' }}>
                Set monthly spending caps per category to track limits, receive instant threshold alerts (&gt;80%), or let AI generate a customized 50/30/20 plan.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <button
                  onClick={onOpenSetBudgetModal}
                  className="btn btn-primary btn-sm px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                  type="button"
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>Set Category Limit</span>
                </button>
                <button
                  onClick={handle1ClickAiRecommend}
                  disabled={aiApplying}
                  className="btn btn-outline-info btn-sm px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                  type="button"
                >
                  <i className={`bi ${aiApplying ? 'bi-arrow-repeat spin-anim' : 'bi-stars'}`}></i>
                  <span>{aiApplying ? 'Applying...' : 'Auto-Generate with AI'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredBudgets.map((b) => {
            const actualSpent = b.actualSpent || 0;
            const limit = b.budgetLimit > 0 ? b.budgetLimit : 1;
            const ratio = (actualSpent / limit) * 100;
            const percent = Math.min(100, Math.round(ratio));
            const isOver = actualSpent > limit;
            const threshold = (b.alertThreshold || 0.8) * 100;
            const isWarning = !isOver && ratio >= threshold;

            let barColor = 'bg-success';
            if (isOver) barColor = 'bg-danger';
            else if (isWarning) barColor = 'bg-warning';

            return (
              <div key={b.id || b.categoryName} className="col-12 col-md-6 col-xl-4" data-aos="fade-up">
                <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between position-relative">
                  <div>
                    {/* Header: Category Name + Actions (Edit & Delete) + Status Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-bold fs-6 text-truncate" style={{ color: 'var(--text-main)' }}>
                          {b.categoryName}
                        </div>
                        <div className="d-flex align-items-center gap-1.5 mt-1">
                          <span
                            className={`badge border px-2 py-0.5 ${
                              isOver
                                ? 'bg-danger-subtle text-danger border-danger'
                                : isWarning
                                ? 'bg-warning-subtle text-warning border-warning'
                                : 'bg-success-subtle text-success border-success'
                            }`}
                            style={{ fontSize: '10px' }}
                          >
                            {isOver ? 'Exceeded' : isWarning ? `Warning >${Math.round(threshold)}%` : 'Healthy'}
                          </span>
                          <span className="small text-muted" style={{ fontSize: '11px' }}>
                            Limit: ${b.budgetLimit.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Modify & Delete Action Buttons */}
                      <div className="d-flex align-items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => onEditBudget && onEditBudget(b)}
                          className="btn btn-sm btn-outline-secondary py-1 px-2 d-flex align-items-center gap-1"
                          style={{ fontSize: '11.5px', borderRadius: '6px' }}
                          title={`Modify limit for ${b.categoryName}`}
                          type="button"
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span className="d-none d-sm-inline">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete the budget limit for "${b.categoryName}"?`)) {
                              if (onDeleteBudget) onDeleteBudget(b.id);
                            }
                          }}
                          className="btn btn-sm btn-outline-danger py-1 px-2 d-flex align-items-center"
                          style={{ fontSize: '11.5px', borderRadius: '6px' }}
                          title={`Delete limit for ${b.categoryName}`}
                          type="button"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>

                    {/* Spend Metrics */}
                    <div className="d-flex flex-wrap justify-content-between align-items-baseline mb-2 gap-1 mt-3">
                      <span className="font-mono-num fs-5 fw-bold text-truncate" style={{ color: 'var(--text-main)' }}>
                        ${actualSpent.toFixed(2)}
                      </span>
                      <span className="small text-muted font-mono-num">
                        of ${b.budgetLimit.toFixed(2)} cap
                      </span>
                    </div>

                    {/* Progress Bar with Color Thresholds */}
                    <div className="progress mb-2" style={{ height: '8px', backgroundColor: 'var(--input-border)' }}>
                      <div
                        className={`progress-bar ${barColor}`}
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    {/* Quick Adjust Operations */}
                    {onQuickAdjust && (
                      <div className="d-flex align-items-center justify-content-end gap-1 mb-2 pt-1">
                        <span className="small text-muted me-auto" style={{ fontSize: '11px' }}>Quick Adjust:</span>
                        <button
                          onClick={() => onQuickAdjust(b.id, -50)}
                          disabled={b.budgetLimit <= 50}
                          className="btn btn-xs btn-outline-secondary py-0.5 px-1.5"
                          style={{ fontSize: '10.5px', borderRadius: '4px' }}
                          title="Decrease limit by $50"
                          type="button"
                        >
                          -$50
                        </button>
                        <button
                          onClick={() => onQuickAdjust(b.id, 50)}
                          className="btn btn-xs btn-outline-secondary py-0.5 px-1.5"
                          style={{ fontSize: '10.5px', borderRadius: '4px' }}
                          title="Increase limit by $50"
                          type="button"
                        >
                          +$50
                        </button>
                        <button
                          onClick={() => onQuickAdjust(b.id, 100)}
                          className="btn btn-xs btn-outline-secondary py-0.5 px-1.5"
                          style={{ fontSize: '10.5px', borderRadius: '4px' }}
                          title="Increase limit by $100"
                          type="button"
                        >
                          +$100
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Utilization & Remaining */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2" style={{ borderColor: 'var(--card-border)' }}>
                    <span className="small text-muted">
                      {ratio.toFixed(1)}% utilized
                    </span>
                    <span className="small font-mono-num fw-semibold" style={{ color: isOver ? '#ef4444' : '#10b981' }}>
                      {isOver 
                        ? `Over by $${(actualSpent - b.budgetLimit).toFixed(2)}` 
                        : `$${(b.budgetLimit - actualSpent).toFixed(2)} remaining`}
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
