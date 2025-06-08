import React, { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import type {
  Transaction,
  FilterState,
  MonthSummary,
} from "../types/Transaction";
import { updateTransaction, deleteTransaction } from "../services/api";
import DateFilter from "../components/DateFilter";
import Dashboard from "../components/Dashboard";
import TransactionTable from "../components/TransactionTable";
import EditTransactionModal from "../components/EditTransactionModal";

interface ViewTransactionsPageProps {
  onNavigate: (page: string) => void;
  transactions: Transaction[];
  refreshTransactions: () => void;
}

const ViewTransactionsPage: React.FC<ViewTransactionsPageProps> = ({
  onNavigate,
  transactions,
  refreshTransactions,
}) => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterState>({ month: "", year: "" });

  const filterTransactions = (transactions: Transaction[]): Transaction[] => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear().toString();
      const transactionMonth = String(transactionDate.getMonth() + 1).padStart(
        2,
        "0"
      );

      const yearMatch = !filter.year || transactionYear === filter.year;
      const monthMatch = !filter.month || transactionMonth === filter.month;

      return yearMatch && monthMatch;
    });
  };

  const calculateSummary = (transactions: Transaction[]): MonthSummary => {
    const filteredTransactions = filterTransactions(transactions);

    const credits = filteredTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.value, 0);

    const debits = filteredTransactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.value, 0);

    return {
      credits,
      debits,
      balance: credits - debits,
    };
  };

  const handleFilterChange = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  const handleClearFilter = () => {
    setFilter({ month: "", year: "" });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (updatedData: Omit<Transaction, "id">) => {
    if (!editingTransaction) return;

    setLoading(true);
    try {
      await updateTransaction(editingTransaction.id, updatedData);
      await refreshTransactions();
      setEditingTransaction(null);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      await refreshTransactions();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filterTransactions(transactions);
  const summary = calculateSummary(transactions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao início
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Visualizar Lançamentos
          </h1>
        </div>

        <DateFilter
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
        />

        <Dashboard summary={summary} filter={filter} />

        {editingTransaction && (
          <EditTransactionModal
            transaction={editingTransaction}
            onUpdate={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
            loading={loading}
          />
        )}

        {filteredTransactions.length > 0 ? (
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter.month || filter.year
                ? "Nenhum lançamento encontrado para o período selecionado"
                : "Nenhum lançamento encontrado"}
            </h3>
            <p className="text-gray-500">
              {filter.month || filter.year
                ? "Tente alterar os filtros ou cadastre novos lançamentos"
                : "Comece cadastrando seu primeiro lançamento contábil"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTransactionsPage;
