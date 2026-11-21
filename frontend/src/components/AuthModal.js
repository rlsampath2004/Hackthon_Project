import React from 'react';
import AuthCard from './AuthCard';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 1070,
        overflowY: 'auto',
      }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '440px',
          margin: '1.5rem auto',
          padding: '0 12px',
        }}
      >
        <AuthCard
          isModal={true}
          onDismiss={onClose}
          onAuthSuccess={(user) => {
            onAuthSuccess(user);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
