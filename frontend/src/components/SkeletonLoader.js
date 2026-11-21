import React from 'react';

// 1. Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="custom-card p-3 p-xl-4 h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }}></div>
          <div className="skeleton-shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px' }}></div>
        </div>
        <div className="skeleton-shimmer mb-3" style={{ width: '140px', height: '32px' }}></div>
        <div className="d-flex justify-content-between pt-2 border-top" style={{ borderColor: 'var(--card-border)' }}>
          <div className="skeleton-shimmer" style={{ width: '100px', height: '12px' }}></div>
          <div className="skeleton-shimmer" style={{ width: '50px', height: '12px' }}></div>
        </div>
      </div>
    </div>
  );
}

// 2. Chart Box Skeleton
export function ChartSkeleton({ height = '290px' }) {
  return (
    <div className="custom-card p-3 p-xl-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="skeleton-shimmer mb-2" style={{ width: '180px', height: '18px' }}></div>
          <div className="skeleton-shimmer" style={{ width: '120px', height: '12px' }}></div>
        </div>
        <div className="skeleton-shimmer" style={{ width: '70px', height: '28px', borderRadius: '6px' }}></div>
      </div>
      <div className="skeleton-shimmer w-100" style={{ height: height, borderRadius: '8px' }}></div>
    </div>
  );
}

// 3. Table Rows Skeleton
export function TableRowsSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx}>
          <td>
            <div className="d-flex align-items-center gap-2.5">
              <div className="skeleton-shimmer" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
              <div>
                <div className="skeleton-shimmer mb-1" style={{ width: '140px', height: '14px' }}></div>
                <div className="skeleton-shimmer" style={{ width: '80px', height: '11px' }}></div>
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton-shimmer" style={{ width: '90px', height: '20px', borderRadius: '6px' }}></div>
          </td>
          <td>
            <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }}></div>
          </td>
          <td>
            <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }}></div>
          </td>
          <td className="text-end">
            <div className="skeleton-shimmer ms-auto" style={{ width: '65px', height: '16px' }}></div>
          </td>
          <td className="text-center">
            <div className="skeleton-shimmer mx-auto" style={{ width: '24px', height: '24px', borderRadius: '4px' }}></div>
          </td>
        </tr>
      ))}
    </>
  );
}

// 4. Account Card Skeleton
export function AccountCardSkeleton() {
  return (
    <div className="col-12 col-md-6 col-xl-3">
      <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="skeleton-shimmer" style={{ width: '42px', height: '42px', borderRadius: '8px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '70px', height: '20px', borderRadius: '6px' }}></div>
          </div>
          <div className="skeleton-shimmer mb-2" style={{ width: '150px', height: '18px' }}></div>
          <div className="skeleton-shimmer mb-3" style={{ width: '90px', height: '12px' }}></div>
        </div>
        <div>
          <div className="skeleton-shimmer mb-1" style={{ width: '80px', height: '12px' }}></div>
          <div className="skeleton-shimmer mb-3" style={{ width: '130px', height: '24px' }}></div>
          <div className="d-flex gap-2">
            <div className="skeleton-shimmer w-100" style={{ height: '28px', borderRadius: '6px' }}></div>
            <div className="skeleton-shimmer w-100" style={{ height: '28px', borderRadius: '6px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Budget Card Skeleton
export function BudgetCardSkeleton() {
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="skeleton-shimmer" style={{ width: '110px', height: '18px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '65px', height: '18px', borderRadius: '6px' }}></div>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <div className="skeleton-shimmer" style={{ width: '90px', height: '24px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '80px', height: '16px' }}></div>
          </div>
          <div className="skeleton-shimmer mb-3" style={{ height: '8px', borderRadius: '4px' }}></div>
        </div>
        <div className="d-flex justify-content-between pt-2 border-top" style={{ borderColor: 'var(--card-border)' }}>
          <div className="skeleton-shimmer" style={{ width: '75px', height: '12px' }}></div>
          <div className="skeleton-shimmer" style={{ width: '90px', height: '12px' }}></div>
        </div>
      </div>
    </div>
  );
}

// 6. Recent Activity List Item Skeleton
export function RecentActivityItemSkeleton() {
  return (
    <div className="p-3 mb-2 rounded-3 border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--card-border)' }}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="skeleton-shimmer" style={{ width: '42px', height: '42px', borderRadius: '10px' }}></div>
          <div>
            <div className="skeleton-shimmer mb-1.5" style={{ width: '140px', height: '16px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '190px', height: '12px' }}></div>
          </div>
        </div>
        <div className="text-end">
          <div className="skeleton-shimmer mb-1 ms-auto" style={{ width: '75px', height: '18px' }}></div>
          <div className="skeleton-shimmer ms-auto" style={{ width: '60px', height: '14px', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
}
