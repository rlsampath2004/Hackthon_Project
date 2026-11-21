-- ============================================================================
-- VCUBE Hack Quest 1.0 (Problem 5: Personal Finance & Expense Intelligence System)
-- Production MySQL 8.0+ Database Schema DDL Script
-- Tables: users, accounts, categories, transactions, budgets
-- ============================================================================

CREATE DATABASE IF NOT EXISTS finintel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finintel_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    role VARCHAR(30) DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. ACCOUNTS TABLE (Bank, Credit Card, Cash, Wallets)
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type ENUM('BANK', 'CREDIT_CARD', 'CASH', 'WALLET', 'SAVINGS') NOT NULL,
    account_number VARCHAR(50),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_account_user (user_id)
) ENGINE=InnoDB;

-- 3. CATEGORIES TABLE (Expense & Income Categories)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL, -- NULL implies global default category
    name VARCHAR(80) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    icon VARCHAR(60) DEFAULT 'bi-receipt',
    color VARCHAR(30) DEFAULT '#0d6efd',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category_name (name)
) ENGINE=InnoDB;

-- 4. TRANSACTIONS TABLE (Core Ledger with AI Tagging)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    merchant_name VARCHAR(150) NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL, -- Negative for expenses, positive for income
    transaction_date DATE NOT NULL,
    is_ai_tagged BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(5, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_tx_user_date (user_id, transaction_date),
    INDEX idx_tx_account (account_id),
    INDEX idx_tx_category (category_id)
) ENGINE=InnoDB;

-- 5. BUDGETS TABLE (Monthly Threshold Limits & Warnings)
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    budget_limit DECIMAL(15, 2) NOT NULL,
    alert_threshold DECIMAL(3, 2) DEFAULT 0.80, -- 80% default threshold warning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_category_month (user_id, category_id, month_year),
    INDEX idx_budget_lookup (user_id, month_year)
) ENGINE=InnoDB;

-- ============================================================================
-- INITIAL SEED DATA FOR DEMO & TESTING
-- ============================================================================

-- Seed Default Categories
INSERT INTO categories (id, user_id, name, type, icon, color) VALUES
(1, NULL, 'Food & Dining', 'EXPENSE', 'bi-cup-hot-fill', '#ffc107'),
(2, NULL, 'Groceries', 'EXPENSE', 'bi-cart-fill', '#198754'),
(3, NULL, 'Housing & Rent', 'EXPENSE', 'bi-house-door-fill', '#6f42c1'),
(4, NULL, 'Shopping & Retail', 'EXPENSE', 'bi-bag-fill', '#fd7e14'),
(5, NULL, 'Transportation', 'EXPENSE', 'bi-car-front-fill', '#0d6efd'),
(6, NULL, 'Utilities & Wifi', 'EXPENSE', 'bi-wifi', '#0dcaf0'),
(7, NULL, 'Entertainment', 'EXPENSE', 'bi-film', '#d63384'),
(8, NULL, 'Consulting Income', 'INCOME', 'bi-briefcase-fill', '#198754'),
(9, NULL, 'Salary / Employment', 'INCOME', 'bi-cash-coin', '#20c997')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Demo User (BCrypt password: Password123!)
INSERT INTO users (id, email, password_hash, full_name, currency, role) VALUES
(1, 'demo@finintel.ai', '$2a$12$e8Y6l9fIeqdJdF6X7b/B9eG8Wk21W.Z78Kq/5yvO9l.O2wU6r57vK', 'Alex Vance', 'USD', 'ROLE_USER')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Accounts for Demo User
INSERT INTO accounts (id, user_id, account_name, account_type, account_number, balance) VALUES
(1, 1, 'Chase Premier Checking', 'BANK', '•••• 4128', 6420.50),
(2, 1, 'Amex Gold Rewards', 'CREDIT_CARD', '•••• 9832', -1124.30),
(3, 1, 'Apple Wallet / Cash', 'WALLET', '•••• 1204', 450.00),
(4, 1, 'Emergency High-Yield Savings', 'SAVINGS', '•••• 7741', 14800.00)
ON DUPLICATE KEY UPDATE balance=VALUES(balance);

-- Seed Budgets for November 2026
INSERT INTO budgets (id, user_id, category_id, month_year, budget_limit, alert_threshold) VALUES
(1, 1, 1, '2026-11', 400.00, 0.80),
(2, 1, 2, '2026-11', 550.00, 0.80),
(3, 1, 3, '2026-11', 1500.00, 0.80),
(4, 1, 4, '2026-11', 250.00, 0.80),
(5, 1, 5, '2026-11', 200.00, 0.80),
(6, 1, 7, '2026-11', 120.00, 0.80)
ON DUPLICATE KEY UPDATE budget_limit=VALUES(budget_limit);

-- Seed Transactions
INSERT INTO transactions (id, user_id, account_id, category_id, merchant_name, description, amount, transaction_date, is_ai_tagged, confidence_score) VALUES
(1, 1, 2, 1, 'Starbucks Coffee', 'Morning latte and breakfast muffin', -18.75, '2026-11-18', TRUE, 0.99),
(2, 1, 1, 8, 'Freelance Payout (Stripe #412)', 'FinTech architecture consulting contract', 1200.00, '2026-11-16', FALSE, NULL),
(3, 1, 2, 4, 'Nike Official Store', 'Running shoes and training apparel', -129.90, '2026-11-14', TRUE, 0.96),
(4, 1, 1, 3, 'Apartment Rent (Avalon Estates)', 'Monthly residential lease payment', -1450.00, '2026-11-02', FALSE, NULL),
(5, 1, 3, 5, 'Uber Airport Express', 'Rideshare from SFO terminal to downtown', -28.50, '2026-11-08', TRUE, 0.99)
ON DUPLICATE KEY UPDATE amount=VALUES(amount);

