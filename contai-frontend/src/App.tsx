import React, { useState, useEffect } from "react";
import type { Transaction } from "./types/Transaction";
import { fetchTransactions } from "./services/api";
import HomePage from "./pages/HomePage";
import CreateTransactionPage from "./pages/CreateTransactionPage";
import ViewTransactionsPage from "./pages/ViewTransactionsPage";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    // setLoading(true); // Remove esta linha
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      // setLoading(false); // Remove esta linha
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleTransactionCreated = () => {
    loadTransactions();
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "create":
        return (
          <CreateTransactionPage
            onNavigate={handleNavigation}
            onTransactionCreated={handleTransactionCreated}
          />
        );
      case "view":
        return (
          <ViewTransactionsPage
            onNavigate={handleNavigation}
            transactions={transactions}
            refreshTransactions={loadTransactions}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return <div className="font-sans">{renderCurrentPage()}</div>;
};

export default App;
