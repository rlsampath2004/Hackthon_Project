import React from 'react';

export default function AiInsightsCard({ 
  budgets = [], 
  transactions = [], 
  onNavigateToAI 
}) {
  // Dynamically calculate the highest utilized budgets
  const activeBudgetsWithUtilization = budgets
    .map((b) => ({
      ...b,
      utilization: b.budgetLimit > 0 ? (b.actualSpent / b.budgetLimit) * 100 : 0,
    }))
    .sort((a, b) => b.utilization - a.utilization);

  const topTwoBudgets = activeBudgetsWithUtilization.slice(0, 2);

  // Dynamically detect spending insight
  const expenses = transactions.filter((t) => t.amount < 0);
  const totalExpense = expenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Group by category to find highest spending category
  const categoryTotals = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;

  return (
    <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <i className="bi bi-cpu-fill text-primary fs-5"></i>
            AI Intelligence Insights
          </h5>
          <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25" style={{ fontSize: '10.5px' }}>
            Autonomous
          </span>
        </div>

        {/* Dynamic AI Anomaly Insight Box */}
        <div
          className="p-3 rounded-2 mb-3"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--card-border)',
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-1.5">
            <span className="fw-bold small" style={{ color: 'var(--text-main)' }}>
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
              {highestCategory ? 'Expense Concentration Alert' : 'Spending Pattern Analyzer'}
            </span>
            <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '9px' }}>
              PATTERN ANALYZER
            </span>
          </div>
          <p className="mb-0" style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {highestCategory && totalExpense > 0 ? (
              <>
                <strong>{highestCategory[0]}</strong> accounts for{' '}
                <span className="text-warning fw-semibold">
                  {((highestCategory[1] / totalExpense) * 100).toFixed(0)}%
                </span>{' '}
                of current monthly outflow (${highestCategory[1].toFixed(2)} of ${totalExpense.toFixed(2)}). Consider establishing a spending cap.
              </>
            ) : (
              'Autonomous anomaly detection active. Log transactions to analyze category spikes and recurring billing intervals.'
            )}
          </p>
        </div>

        {/* Budget Limit Progress Bars */}
        <h6
          className="fw-semibold text-uppercase mb-2.5"
          style={{ fontSize: '10.5px', color: 'var(--text-muted)', letterSpacing: '0.6px' }}
        >
          Active Budget Utilization (&gt;80% Alerts)
        </h6>

        {topTwoBudgets.length === 0 ? (
          <div className="p-3 text-center rounded-2 border border-dashed mb-2" style={{ borderColor: 'var(--card-border)' }}>
            <span className="small text-muted" style={{ fontSize: '11.5px' }}>
              No active budget limits configured. Add categories to track threshold limits.
            </span>
          </div>
        ) : (
          topTwoBudgets.map((b) => {
            const isDanger = b.utilization >= 80;
            const isWarning = b.utilization >= 65 && b.utilization < 80;
            const barColor = isDanger ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-success';
            const textColor = isDanger ? 'text-danger' : isWarning ? 'text-warning' : 'text-success';

            return (
              <div key={b.id || b.categoryName} className="mb-3">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{b.categoryName}</span>
                  <span className={`font-mono-num fw-bold ${textColor}`}>
                    {b.utilization.toFixed(0)}% (${b.actualSpent.toFixed(2)} / ${b.budgetLimit.toFixed(2)})
                  </span>
                </div>
                <div className="progress" style={{ height: '6px', backgroundColor: 'var(--input-border)' }}>
                  <div
                    className={`progress-bar ${barColor}`}
                    role="progressbar"
                    style={{ width: `${Math.min(100, b.utilization)}%` }}
                    aria-valuenow={b.utilization}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Trigger */}
      <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--card-border)' }}>
        <button
          onClick={onNavigateToAI}
          className="btn btn-outline-primary btn-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
          type="button"
        >
          <i className="bi bi-stars"></i>
          <span>Launch AI Financial Hub</span>
        </button>
      </div>
    </div>
  );
}
