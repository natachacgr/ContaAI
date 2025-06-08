import axios from "axios";
import type { Transaction } from "../types/Transaction";

// Configuração da URL base
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://contaai-backend.onrender.com/api/accounting-entries";

// Configurar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL.replace("/api/accounting-entries", ""), // Remove o endpoint da URL base
  timeout: 30000, // 30 segundos de timeout (importante para Render)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Para CORS simples
});

// Interceptor para logs e debug
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response Error:",
      error.response?.status,
      error.response?.data
    );

    // Tratamento específico para diferentes tipos de erro
    if (error.code === "ECONNABORTED") {
      throw new Error("Timeout: Servidor demorou para responder");
    }

    if (error.response?.status === 0) {
      throw new Error("Erro de conexão: Verifique se o backend está online");
    }

    if (error.response?.status >= 500) {
      throw new Error("Erro no servidor: Tente novamente em alguns minutos");
    }

    throw error;
  }
);

// Função para testar conectividade
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get("/health");
    console.log("✅ Backend conectado:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Backend não conectado:", error);
    return false;
  }
};

// Função para "acordar" o Render (serviços gratuitos dormem)
export const wakeUpBackend = async (): Promise<void> => {
  try {
    console.log("🔄 Acordando backend...");
    await api.get("/");
    console.log("✅ Backend acordado");
  } catch (error) {
    console.warn("⚠️ Erro ao acordar backend:", error);
  }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    // Tenta acordar o backend primeiro (para Render gratuito)
    await wakeUpBackend();

    const response = await api.get("/api/accounting-entries");

    // Validação dos dados recebidos
    if (!Array.isArray(response.data)) {
      console.warn("⚠️ Dados recebidos não são um array:", response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar transações:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao carregar transações"
    );
  }
};

export const createTransaction = async (data: Omit<Transaction, "id">) => {
  try {
    // Validação e formatação dos dados
    const payload = {
      ...data,
      value: Number(data.value),
      date: new Date(data.date).toISOString().split("T")[0],
      type: data.type === "credit" ? "credit" : "debit",
    };

    console.log("📤 Criando transação:", payload);

    const response = await api.post("/api/accounting-entries", payload);

    console.log("✅ Transação criada:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao criar transação:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar transação"
    );
  }
};

export const updateTransaction = async (
  id: number,
  data: Omit<Transaction, "id">
) => {
  try {
    const payload = {
      ...data,
      value: Number(data.value),
      date: new Date(data.date).toISOString().split("T")[0],
      type: data.type === "credit" ? "credit" : "debit",
    };

    console.log(`📝 Atualizando transação ${id}:`, payload);

    const response = await api.put(`/api/accounting-entries/${id}`, payload);

    console.log("✅ Transação atualizada:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar transação:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar transação"
    );
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    console.log(`🗑️ Deletando transação ${id}`);

    await api.delete(`/api/accounting-entries/${id}`);

    console.log("✅ Transação deletada");
  } catch (error) {
    console.error("❌ Erro ao deletar transação:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao deletar transação"
    );
  }
};

export { api };
