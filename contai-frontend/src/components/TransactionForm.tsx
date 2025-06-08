import { useState, useEffect } from "react";
import type { Transaction } from "../types/Transaction";

interface Props {
  onSubmit: (transaction: Omit<Transaction, "id">, id?: number) => void;
  editingTransaction?: Transaction;
  onCancelEdit?: () => void;
  onTransactionAdded: () => void;
}

const TransactionForm = ({
  onSubmit,
  editingTransaction,
  onCancelEdit,
  onTransactionAdded,
}: Props) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState<number>(0);
  const [type, setType] = useState<"credit" | "debit">("credit"); // Tipo específico
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setValue(editingTransaction.value);
      setType(editingTransaction.type);
      setDate(editingTransaction.date.split("T")[0]);
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!description.trim()) {
      alert("Descrição é obrigatória");
      return;
    }
    if (value <= 0) {
      alert("Valor deve ser maior que zero");
      return;
    }
    if (!date) {
      alert("Data é obrigatória");
      return;
    }

    try {
      await onSubmit(
        {
          description: description.trim(),
          value: Number(value),
          type,
          date,
        },
        editingTransaction?.id
      );

      resetForm();
      onTransactionAdded(); // Callback adicional se necessário
    } catch (error) {
      console.error("Erro ao submeter transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    }
  };

  const resetForm = () => {
    setDescription("");
    setValue(0);
    setType("credit");
    setDate("");
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingTransaction ? "Edit Transaction" : "New Transaction"}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Value"
          value={value || ""} // Evita problema com 0
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          required
          min={0.01}
          step={0.01}
        />
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value as "credit" | "debit")}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          className="border p-2 rounded"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingTransaction ? "Update" : "Add"}
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
