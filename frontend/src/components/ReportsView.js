import React, { useState } from 'react';
import { StatCardSkeleton, TableRowsSkeleton } from './SkeletonLoader';

export default function ReportsView({ 
  transactions, 
  accounts, 
  budgets, 
  isLoading = false 
}) {
  const [reportRange, setReportRange] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);

  // Filter transactions for report
  const filteredTxs = transactions.filter((tx) => {
    if (reportRange === '30D') {
      const txDate = new Date(tx.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return txDate >= thirtyDaysAgo;
    }
    return true;
  });

  const totalInflow = filteredTxs
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = filteredTxs
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // 1. Download CSV Export Function
  const handleExportCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      const headers = ['Transaction ID', 'Merchant / Memo', 'Category', 'Account', 'Date', 'Type', 'Amount (USD)', 'AI Categorized'];
      const rows = filteredTxs.map((t) => [
        t.id,
        `"${t.merchant.replace(/"/g, '""')}"`,
        `"${t.category}"`,
        `"${t.account}"`,
        t.date,
        t.amount > 0 ? 'INCOME' : 'EXPENSE',
        t.amount.toFixed(2),
        t.isAiTagged ? 'YES' : 'NO',
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `FinIntel_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 450);
  };

  // 2. Download / Print PDF Statement Function
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Title & Header */}
      <div 
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
        data-aos="fade-down"
      >
        <div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Financial Reports & Ledger Export
          </h3>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Generate compliant downloadable financial statements in CSV and PDF formats.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="btn btn-sm btn-primary px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
            type="button"
          >
            <i className={`bi ${isExporting ? 'bi-arrow-repeat spin-anim' : 'bi-filetype-csv'}`}></i>
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn btn-sm btn-outline-secondary px-3 py-1.5 d-flex align-items-center gap-1.5"
            type="button"
          >
            <i className="bi bi-printer"></i>
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Filter & Configuration Toolbar */}
      <div className="custom-card p-3 mb-4" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Statement Period</label>
            <select
              className="form-select-pro w-100"
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value)}
            >
              <option value="ALL">All Recorded Activity (YTD)</option>
              <option value="30D">Last 30 Days (November 2026)</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Export Target Format</label>
            <select
              className="form-select-pro w-100"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="CSV">Comma Separated Values (.CSV)</option>
              <option value="PDF">Printable Statement Document (.PDF)</option>
            </select>
          </div>

          <div className="col-12 col-md-4 d-flex align-items-end">
            <button
              onClick={selectedFormat === 'CSV' ? handleExportCSV : handleExportPDF}
              disabled={isExporting}
              className="btn btn-primary w-100 py-2 fw-semibold"
              type="button"
            >
              <i className="bi bi-download me-1.5"></i>
              <span>Download {selectedFormat} Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="row g-3 mb-4" data-aos="fade-up" data-aos-delay="150">
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
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Selected Period Outflow</div>
                <div className="fs-3 fw-bold font-mono-num text-danger">
                  ${totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>{filteredTxs.filter((t) => t.amount < 0).length} expense line items</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Selected Period Inflow</div>
                <div className="fs-3 fw-bold font-mono-num text-success">
                  ${totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>{filteredTxs.filter((t) => t.amount > 0).length} deposit entries</div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="custom-card p-3">
                <div className="small fw-semibold text-uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Period Net Surplus</div>
                <div className="fs-3 fw-bold font-mono-num text-primary">
                  ${(totalInflow - totalOutflow).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small" style={{ color: 'var(--text-muted)' }}>Net cashflow delta</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Statement Preview Document */}
      <div className="custom-card p-4" data-aos="fade-up" data-aos-delay="200">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 pb-3 border-bottom gap-2" style={{ borderColor: 'var(--card-border)' }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-white px-2 py-0.5" style={{ fontSize: '9px' }}>STATEMENT</span>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>FinIntel Formal Financial Statement</h5>
            </div>
            <div className="small" style={{ color: 'var(--text-muted)' }}>
              Certified Ledger Generated on <span className="font-mono-num" style={{ color: 'var(--text-main)' }}>{new Date().toLocaleDateString()}</span> &bull; Account: <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>Alex Vance</span>
            </div>
          </div>
          <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
            <i className="bi bi-shield-check"></i>
            <span>Certified Ledger</span>
          </span>
        </div>

        <div className="table-responsive">
          <table className="table custom-table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description / Entity</th>
                <th scope="col">Category</th>
                <th scope="col">Account</th>
                <th scope="col" className="text-end">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableRowsSkeleton rows={6} />
              ) : filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                    No transactions available for the selected period.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono-num small" style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                    <td>
                      <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{tx.merchant}</span>
                      {tx.isAiTagged && (
                        <span className="badge bg-info-subtle text-info border border-info border-opacity-25 ms-2" style={{ fontSize: '9px' }}>
                          <i className="bi bi-stars me-0.5"></i> AI Categorized
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-25" style={{ fontSize: '11px' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="small" style={{ color: 'var(--text-muted)' }}>{tx.account}</td>
                    <td className="text-end font-mono-num fw-bold small">
                      <span style={{ color: tx.amount > 0 ? '#198754' : '#dc3545' }}>
                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
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

