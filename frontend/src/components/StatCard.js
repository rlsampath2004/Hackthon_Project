import React from 'react';

export default function StatCard({ 
  title, 
  amount, 
  subtitle, 
  trend, 
  trendValue, 
  icon: iconClass, 
  delay = 100,
  accentColor = 'primary'
}) {
  const isPositive = trend === 'up';

  const colorConfig = {
    primary: { iconBg: 'bg-primary text-white', trendColor: 'text-success' },
    success: { iconBg: 'bg-success text-white', trendColor: 'text-success' },
    danger: { iconBg: 'bg-danger text-white', trendColor: 'text-danger' },
    warning: { iconBg: 'bg-warning text-dark fw-bold', trendColor: 'text-warning' },
  };

  const config = colorConfig[accentColor] || colorConfig.primary;

  return (
    <div className="col-12 col-sm-6 col-xl-3" data-aos="fade-up" data-aos-delay={delay}>
      <div className="custom-card p-3 p-xl-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span
              className="text-uppercase fw-semibold"
              style={{ fontSize: '11px', letterSpacing: '0.6px', color: 'var(--text-muted)' }}
            >
              {title}
            </span>
            <div
              className={`d-flex align-items-center justify-content-center rounded-2 ${config.iconBg}`}
              style={{ width: '36px', height: '36px' }}
            >
              <i className={iconClass}></i>
            </div>
          </div>

          <h3
            className="font-mono-num fw-bold mb-1 fs-3 fs-sm-2 text-truncate"
            style={{ color: 'var(--text-main)', letterSpacing: '-0.5px' }}
            title={amount}
          >
            {amount}
          </h3>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top" style={{ borderColor: 'var(--card-border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
          {trendValue && (
            <span
              className={`font-mono-num fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}
              style={{ fontSize: '12px' }}
            >
              {isPositive ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
