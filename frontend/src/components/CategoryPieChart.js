import React, { useEffect, useRef } from 'react';

export default function CategoryPieChart({ isDarkMode, transactions = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Dynamically calculate expenses by category
  const expenses = transactions.filter((t) => t.amount < 0);
  const categoryTotals = {};
  expenses.forEach((t) => {
    const cat = t.category || 'Other Expenses';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
  });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const textColor = isDarkMode ? '#cbd5e1' : '#4b5563';
    const borderColor = isDarkMode ? '#111827' : '#ffffff';

    const defaultColors = [
      '#6f42c1',
      '#198754',
      '#f59e0b',
      '#fd7e14',
      '#0d6efd',
      '#0dcaf0',
      '#d63384',
      '#8b5cf6',
      '#64748b',
    ];

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories.length > 0 ? categories : ['No Expenses Recorded'],
        datasets: [
          {
            data: amounts.length > 0 ? amounts : [1],
            backgroundColor: amounts.length > 0 ? defaultColors.slice(0, categories.length) : ['rgba(148, 163, 184, 0.2)'],
            borderColor: borderColor,
            borderWidth: 2,
            hoverOffset: amounts.length > 0 ? 6 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: textColor,
              boxWidth: 10,
              padding: 10,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11,
              },
            },
          },
          tooltip: {
            enabled: amounts.length > 0,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            titleColor: isDarkMode ? '#ffffff' : '#111827',
            bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: $${Number(ctx.raw).toFixed(2)}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isDarkMode, categories, amounts]);

  return (
    <div className="custom-card p-3 p-xl-4 h-100">
      <div className="mb-3">
        <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
          <i className="bi bi-pie-chart-fill text-warning me-2"></i>
          Category Expense Breakdown
        </h5>
        <span className="small" style={{ color: 'var(--text-muted)' }}>
          Autonomous distribution across recorded expense transactions
        </span>
      </div>

      <div style={{ height: '240px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
