import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { TransactionType } from "../types/Transaction";
import { createTransaction } from "../services/api";

interface CreateTransactionPageProps {
  onNavigate: (page: string) => void;
  onTransactionCreated: () => void;
}

const CreateTransactionPage: React.FC<CreateTransactionPageProps> = ({
  onNavigate,
  onTransactionCreated,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    type: "credit" as TransactionType,
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Descrição é obrigatória" });
      return;
    }
    if (!formData.value || parseFloat(formData.value) <= 0) {
      setMessage({ type: "error", text: "Valor deve ser maior que zero" });
      return;
    }
    if (!formData.date) {
      setMessage({ type: "error", text: "Data é obrigatória" });
      return;
    }

    setLoading(true);

    try {
      await createTransaction({
        description: formData.description.trim(),
        value: parseFloat(formData.value),
        type: formData.type,
        date: new Date(formData.date).toISOString(),
      });

      setMessage({
        type: "success",
        text: "Lançamento cadastrado com sucesso!",
      });
      setFormData({ description: "", value: "", type: "credit", date: "" });
      onTransactionCreated();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao cadastrar lançamento. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao início
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Cadastrar Lançamento
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Digite a descrição do lançamento"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0,00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="credit">Crédito</option>
                  <option value="debit">Débito</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Cadastrando..." : "Cadastrar Lançamento"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionPage;
