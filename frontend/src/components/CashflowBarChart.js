import React, { useEffect, useRef, useState } from 'react';

export default function CashflowBarChart({ isDarkMode, transactions = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [range, setRange] = useState('6M');

  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';

    // 6 Month Buckets (Jun 2026 - Nov 2026)
    const monthKeys = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
    const monthLabels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

    // Dynamically calculate income and expense per month from actual transactions
    const incomeData = monthKeys.map(() => 0);
    const expenseData = monthKeys.map(() => 0);

    transactions.forEach((tx) => {
      const txMonth = (tx.date || '').substring(0, 7);
      const index = monthKeys.indexOf(txMonth);
      if (index !== -1) {
        if (tx.amount > 0) {
          incomeData[index] += tx.amount;
        } else {
          expenseData[index] += Math.abs(tx.amount);
        }
      } else {
        // If date is outside range or current month Nov, allocate to Nov
        if (tx.amount > 0) {
          incomeData[5] += tx.amount;
        } else {
          expenseData[5] += Math.abs(tx.amount);
        }
      }
    });

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Inflow / Income',
            data: incomeData,
            backgroundColor: '#198754', // Solid Bootstrap Success Green
            borderRadius: 6,
            barPercentage: 0.55,
            categoryPercentage: 0.7,
          },
          {
            label: 'Outflow / Expense',
            data: expenseData,
            backgroundColor: '#dc3545', // Solid Bootstrap Danger Red
            borderRadius: 6,
            barPercentage: 0.55,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: textColor,
              boxWidth: 12,
              padding: 12,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11,
                weight: 600,
              },
            },
          },
          tooltip: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            titleColor: isDarkMode ? '#ffffff' : '#111827',
            bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: $${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
            },
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              callback: (val) => `$${val}`,
              font: { family: "'JetBrains Mono', monospace", size: 11 },
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
  }, [isDarkMode, transactions, range]);

  return (
    <div className="custom-card p-3 p-xl-4 h-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
            Cashflow Inflow vs Outflow
          </h5>
          <span className="small" style={{ color: 'var(--text-muted)' }}>
            Live aggregated monthly income against expenses
          </span>
        </div>

        <div className="btn-group btn-group-sm" role="group">
          {['1M', '3M', '6M', '1Y'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`btn ${range === item ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ fontSize: '11px', padding: '3px 10px' }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '240px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
