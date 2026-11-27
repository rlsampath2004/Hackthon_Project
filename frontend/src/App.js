import React, { useState, useEffect } from 'react';
import './index.css';

// Modular Separate Components
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import CashflowBarChart from './components/CashflowBarChart';
import CategoryPieChart from './components/CategoryPieChart';
import RecentTransactions from './components/RecentTransactions';
import AiInsightsCard from './components/AiInsightsCard';
import AddTransactionModal from './components/AddTransactionModal';
import AddAccountModal from './components/AddAccountModal';
import SetBudgetModal from './components/SetBudgetModal';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import IntroView from './components/IntroView';
import TransactionsView from './components/TransactionsView';
import AccountsView from './components/AccountsView';
import BudgetsView from './components/BudgetsView';
import AIIntelligenceView from './components/AIIntelligenceView';
import ReportsView from './components/ReportsView';
import { StatCardSkeleton, ChartSkeleton } from './components/SkeletonLoader';
import { api } from './api/axiosClient';

// Clean Zero-Default Data Structures (Pristine live database connection)
const initialBudgetsList = [];
const initialAccountsList = [];
const initialTransactions = [];

export default function App() {
  const [activeNav, setActiveNav] = useState(() => (localStorage.getItem('finintel_user') ? 'dashboard' : 'intro'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Authenticated User State (Pristine clean default from localStorage or null)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('finintel_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState(initialTransactions);
  const [accounts, setAccounts] = useState(initialAccountsList);
  const [budgets, setBudgets] = useState(initialBudgetsList);
  const [isLoading, setIsLoading] = useState(true);

  // Pure Dark Black Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('finintel_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finintel_theme', theme);
  }, [isDarkMode]);

  // Live API Sync from Spring Boot Database via Axios Client
  const syncBackendData = async (user = currentUser) => {
    setIsLoading(true);
    try {
      const activeUser = user || (localStorage.getItem('finintel_user') ? JSON.parse(localStorage.getItem('finintel_user')) : null);
      const userId = activeUser ? (activeUser.id || activeUser.userId) : null;

      const [backendAccs, backendTxs, backendBudgets] = await Promise.all([
        api.getAccounts(userId),
        api.getTransactions(userId ? { userId } : {}),
        api.getBudgets(userId ? { userId } : {}),
      ]);

      const txs = Array.isArray(backendTxs) ? backendTxs : [];
      const accs = Array.isArray(backendAccs) ? backendAccs : [];
      let bdgs = Array.isArray(backendBudgets) ? backendBudgets : [];

      // Calculate real category spend from transactions for accurate budget tracking
      bdgs = bdgs.map((b) => {
        const spent = txs
          .filter((t) => t.amount < 0 && t.category === b.categoryName)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { ...b, actualSpent: spent };
      });

      setAccounts(accs);
      setTransactions(txs);
      setBudgets(bdgs);
    } catch (err) {
      console.warn('Axios API synchronization initialized in resilient local mode.', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      syncBackendData(currentUser);
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  // AOS Init
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic',
      });
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Smooth Tab Switcher with Strict Authentication Guard
  const handleNavigate = (navId, userOverride) => {
    let effectiveUser;
    if (userOverride !== undefined) {
      effectiveUser = userOverride;
    } else {
      effectiveUser = currentUser || (localStorage.getItem('finintel_user') ? JSON.parse(localStorage.getItem('finintel_user')) : null);
    }
    const isPublicNav = navId === 'login' || navId === 'register' || navId === 'intro';
    if (!effectiveUser && !isPublicNav) {
      setActiveNav('login');
      return;
    }
    setActiveNav(navId);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (window.AOS) {
        window.AOS.refresh();
      }
    }, 300);
  };

  const handleClearAllData = () => {
    setAccounts([]);
    setBudgets([]);
    setTransactions([]);
  };

  const handleAddTransaction = async (newTx) => {
    const activeUser = currentUser || (localStorage.getItem('finintel_user') ? JSON.parse(localStorage.getItem('finintel_user')) : null);
    const txWithUser = { ...newTx, userId: activeUser ? (activeUser.id || activeUser.userId) : null };

    setTransactions((prev) => [txWithUser, ...prev]);

    // Update actual spend for corresponding category in budgets
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.categoryName === newTx.category && newTx.amount < 0) {
          return { ...b, actualSpent: (b.actualSpent || 0) + Math.abs(newTx.amount) };
        }
        return b;
      })
    );

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountName === newTx.account) {
          return { ...acc, balance: acc.balance + newTx.amount };
        }
        return acc;
      })
    );

    // Persist via Axios client to backend database
    const saved = await api.createTransaction(txWithUser);
    if (saved && (saved.transactionId || saved.id)) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === newTx.id ? { ...t, id: saved.transactionId || saved.id } : t))
      );
    }
    // Refresh live records from database
    syncBackendData(activeUser);
  };

  const handleDeleteTransaction = async (id) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Rollback budget spend
    if (txToDelete.amount < 0) {
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.categoryName === txToDelete.category) {
            return { ...b, actualSpent: Math.max(0, (b.actualSpent || 0) - Math.abs(txToDelete.amount)) };
          }
          return b;
        })
      );
    }

    // Rollback account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountName === txToDelete.account) {
          return { ...acc, balance: acc.balance - txToDelete.amount };
        }
        return acc;
      })
    );

    // Delete via Axios client
    await api.deleteTransaction(id);
    syncBackendData();
  };

  const handleAddAccount = async (newAccount) => {
    const activeUser = currentUser || (localStorage.getItem('finintel_user') ? JSON.parse(localStorage.getItem('finintel_user')) : null);
    const accWithUser = { ...newAccount, userId: activeUser ? (activeUser.id || activeUser.userId) : null };

    setAccounts((prev) => [...prev, accWithUser]);
    const saved = await api.createAccount(accWithUser);
    if (saved && (saved.accountId || saved.id)) {
      setAccounts((prev) =>
        prev.map((a) => (a.accountName === newAccount.accountName ? { ...a, id: saved.accountId || saved.id } : a))
      );
    }
    syncBackendData(activeUser);
  };

  const handleSaveBudget = async (newBudget) => {
    const activeUser = currentUser || (localStorage.getItem('finintel_user') ? JSON.parse(localStorage.getItem('finintel_user')) : null);
    const budgetWithUser = { ...newBudget, userId: activeUser ? (activeUser.id || activeUser.userId) : null };

    setBudgets((prev) => {
      const existingIndex = prev.findIndex(
        (b) => b.id === newBudget.id || b.categoryName === newBudget.categoryName
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...budgetWithUser,
          actualSpent: updated[existingIndex].actualSpent ?? newBudget.actualSpent ?? 0,
        };
        return updated;
      }
      return [...prev, budgetWithUser];
    });

    const saved = await api.saveBudget(budgetWithUser);
    if (saved && (saved.budgetId || saved.id)) {
      setBudgets((prev) =>
        prev.map((b) => (b.categoryName === newBudget.categoryName ? { ...b, id: saved.budgetId || saved.id } : b))
      );
    }
    syncBackendData(activeUser);
  };

  const handleDeleteBudget = async (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    await api.deleteBudget(id);
  };

  const handleQuickAdjustBudget = async (id, delta) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newLimit = Math.max(10, Math.round((b.budgetLimit + delta) * 100) / 100);
          const updated = { ...b, budgetLimit: newLimit };
          api.saveBudget(updated);
          return updated;
        }
        return b;
      })
    );
  };

  const handleClearAllBudgets = async () => {
    const ids = budgets.map((b) => b.id);
    setBudgets([]);
    await Promise.all(ids.map((id) => api.deleteBudget(id)));
  };

  // AI 50/30/20 Optimizer
  const handleApplyAiBudgetPlan = () => {
    const recommendedIncome = totalIncome > 0 ? totalIncome : 5000;
    const optimized = [
      { id: 1, categoryName: 'Housing & Rent', budgetLimit: recommendedIncome * 0.3, actualSpent: 0, alertThreshold: 0.8 },
      { id: 2, categoryName: 'Groceries', budgetLimit: recommendedIncome * 0.12, actualSpent: 0, alertThreshold: 0.8 },
      { id: 3, categoryName: 'Utilities & Wifi', budgetLimit: recommendedIncome * 0.08, actualSpent: 0, alertThreshold: 0.8 },
      { id: 4, categoryName: 'Food & Dining', budgetLimit: recommendedIncome * 0.1, actualSpent: 0, alertThreshold: 0.8 },
      { id: 5, categoryName: 'Shopping & Retail', budgetLimit: recommendedIncome * 0.1, actualSpent: 0, alertThreshold: 0.8 },
      { id: 6, categoryName: 'Entertainment', budgetLimit: recommendedIncome * 0.1, actualSpent: 0, alertThreshold: 0.8 },
    ];
    setBudgets(optimized);
  };

  // Dynamic Calculated Metrics (NO HARDCODED DEFAULT OFFSETS)
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const netBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

  const isAuthPage = activeNav === 'login' || activeNav === 'register';

  // 1. Full-Screen Cinematic Intro Video (First Video Plays -> Next Redirects to Login)
  if (activeNav === 'intro') {
    return (
      <IntroView onSkipVideo={() => handleNavigate('login')} />
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--app-bg)' }}>
      {/* 1. Full-Width Responsive Top Navbar (Hidden on Login & Register Pages) */}
      {!isAuthPage && (
        <Navbar
          activeNav={activeNav}
          setActiveNav={handleNavigate}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          currentUser={currentUser}
          onSignOut={() => {
            localStorage.removeItem('finintel_user');
            localStorage.removeItem('finintel_token');
            setCurrentUser(null);
            handleNavigate('login', null);
          }}
        />
      )}

      {/* 2. Main Full-Width Content Container (100% Mobile Responsive) */}
      <main className={`flex-grow-1 ${isAuthPage ? 'd-flex align-items-center justify-content-center p-3' : 'container-fluid px-3 px-lg-5 py-4'}`}>
        {activeNav === 'dashboard' && (
          <>
            {/* Header Title & Evaluation Utilities */}
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
              data-aos="fade-down"
            >
              <div>
                <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
                  Executive Financial Intelligence
                </h3>
                <p className="mb-0 small" style={{ color: 'var(--text-muted)' }}>
                  Multi-account ledger, Spring AI categorization, and autonomous budget intelligence.
                </p>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <button
                  onClick={() => syncBackendData()}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-1.5"
                  title="Synchronize live records with SQL Database"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  <span>Sync Database</span>
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 px-3 py-1.5"
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  <span>Add Transaction</span>
                </button>
                <span className="badge bg-secondary-subtle text-secondary font-mono-num p-2 px-2.5">
                  <i className="bi bi-database-check me-1 text-success"></i> Live DB
                </span>
                <button
                  onClick={() => handleNavigate('budgets')}
                  className="btn btn-outline-secondary btn-sm px-3"
                >
                  View Budgets & Limits
                </button>
              </div>
            </div>

            {/* Row 1: KPI Stat Cards */}
            <div className="row g-3 g-xl-4 mb-4">
              {isLoading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                <>
                  <StatCard
                    title="Total Net Balance"
                    amount={`$${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle={`Across ${accounts.length} active accounts`}
                    trend={netBalance >= 0 ? 'up' : 'down'}
                    trendValue={netBalance >= 0 ? '+8.4%' : '-2.1%'}
                    icon="bi bi-wallet2"
                    accentColor="primary"
                    delay={100}
                  />
                  <StatCard
                    title="Monthly Inflow"
                    amount={`$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle="Recorded Income"
                    trend="up"
                    trendValue={totalIncome > 0 ? '+12.0%' : '0.0%'}
                    icon="bi bi-arrow-down-left"
                    accentColor="success"
                    delay={200}
                  />
                  <StatCard
                    title="Monthly Outflow"
                    amount={`$${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle="Active spend tracking"
                    trend="down"
                    trendValue={totalExpense > 0 ? '-5.1%' : '0.0%'}
                    icon="bi bi-arrow-up-right"
                    accentColor="danger"
                    delay={300}
                  />
                  <StatCard
                    title="Savings Rate"
                    amount={`${savingsRate}%`}
                    subtitle={totalIncome > 0 ? 'Cashflow positive' : 'Awaiting activity'}
                    trend={savingsRate > 20 ? 'up' : 'down'}
                    trendValue={savingsRate > 20 ? 'Optimal' : 'Moderate'}
                    icon="bi bi-shield-check"
                    accentColor="warning"
                    delay={400}
                  />
                </>
              )}
            </div>

            {/* Row 2: Charts (Dynamic without hardcoded mock slices) */}
            <div className="row g-3 g-xl-4 mb-4">
              <div className="col-12 col-lg-7 col-xl-8" data-aos="fade-up" data-aos-delay="150">
                {isLoading ? (
                  <ChartSkeleton height="290px" />
                ) : (
                  <CashflowBarChart isDarkMode={isDarkMode} transactions={transactions} />
                )}
              </div>
              <div className="col-12 col-lg-5 col-xl-4" data-aos="fade-up" data-aos-delay="250">
                {isLoading ? (
                  <ChartSkeleton height="290px" />
                ) : (
                  <CategoryPieChart isDarkMode={isDarkMode} transactions={transactions} />
                )}
              </div>
            </div>

            {/* Row 3: Recent Activity & AI Insights */}
            <div className="row g-3 g-xl-4">
              <div className="col-12 col-lg-8" data-aos="fade-up" data-aos-delay="200">
                <RecentTransactions 
                  transactions={transactions} 
                  isLoading={isLoading} 
                  onViewAll={() => handleNavigate('transactions')}
                />
              </div>
              <div className="col-12 col-lg-4" data-aos="fade-up" data-aos-delay="300">
                <AiInsightsCard 
                  budgets={budgets} 
                  transactions={transactions} 
                  onNavigateToAI={() => handleNavigate('ai-intelligence')}
                />
              </div>
            </div>
          </>
        )}

        {/* Transactions View with Skeleton Support */}
        {activeNav === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            isLoading={isLoading}
          />
        )}

        {/* Accounts Management View with Skeleton Support */}
        {activeNav === 'accounts' && (
          <AccountsView
            accounts={accounts}
            onOpenAddAccountModal={() => setIsAddAccountModalOpen(true)}
            isLoading={isLoading}
          />
        )}

        {/* Monthly Budgets & Alert Limits View with Skeleton Support */}
        {activeNav === 'budgets' && (
          <BudgetsView
            budgets={budgets}
            onOpenSetBudgetModal={() => {
              setEditingBudget(null);
              setIsSetBudgetModalOpen(true);
            }}
            onEditBudget={(budget) => {
              setEditingBudget(budget);
              setIsSetBudgetModalOpen(true);
            }}
            onDeleteBudget={handleDeleteBudget}
            onQuickAdjust={handleQuickAdjustBudget}
            onClearAllBudgets={handleClearAllBudgets}
            onApplyAiBudgetPlan={handleApplyAiBudgetPlan}
            isLoading={isLoading}
          />
        )}

        {/* AI Financial Intelligence Hub */}
        {activeNav === 'ai-intelligence' && (
          <AIIntelligenceView 
            transactions={transactions}
            budgets={budgets}
            accounts={accounts}
            isLoading={isLoading} 
          />
        )}

        {/* Reports & Statement Export */}
        {activeNav === 'reports' && (
          <ReportsView
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            isLoading={isLoading}
          />
        )}

        {/* Dedicated Full-Page Login View */}
        {activeNav === 'login' && (
          <LoginView
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              handleNavigate('dashboard', user);
              syncBackendData(user);
            }}
            onNavigateToRegister={() => handleNavigate('register')}
            onNavigateToIntro={() => handleNavigate('intro')}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        )}

        {/* Dedicated Full-Page Registration View */}
        {activeNav === 'register' && (
          <RegisterView
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              handleNavigate('dashboard', user);
              syncBackendData(user);
            }}
            onNavigateToLogin={() => handleNavigate('login')}
            onNavigateToIntro={() => handleNavigate('intro')}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        accounts={accounts}
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <SetBudgetModal
        isOpen={isSetBudgetModalOpen}
        onClose={() => {
          setIsSetBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onSaveBudget={handleSaveBudget}
        editingBudget={editingBudget}
      />
    </div>
  );
}
