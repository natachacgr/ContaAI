// api-fetch.ts - Alternativa usando fetch puro (caso o Axios tenha problemas)
import type { Transaction } from "../types/Transaction";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://contaai-backend.onrender.com";

// Função auxiliar para fazer requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🚀 Request: ${options.method || "GET"} ${url}`);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // IMPORTANTE: Não inclua credentials se não precisar
    // credentials: 'omit', // Evita problemas de CORS
  };

  console.log("Request config:", config);

  try {
    const response = await fetch(url, config);

    console.log(`✅ Response: ${response.status} ${response.statusText}`);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error body:", errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("❌ Request failed:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Erro de conexão: Verifique se o backend está online");
    }

    throw error;
  }
};

// Teste de conectividade simples
export const testConnectionFetch = async () => {
  try {
    const result = await makeRequest("/test-cors");
    console.log("✅ Teste CORS bem-sucedido:", result);
    return true;
  } catch (error) {
    console.error("❌ Teste CORS falhou:", error);
    return false;
  }
};

// Buscar transações
export const fetchTransactionsFetch = async (): Promise<Transaction[]> => {
  try {
    // Primeiro, testa a conectividade
    const healthCheck = await makeRequest("/health");
    console.log("✅ Health check:", healthCheck);

    // Depois busca as transações
    const transactions = await makeRequest("/api/accounting-entries");

    if (!Array.isArray(transactions)) {
      console.warn("⚠️ Resposta não é um array:", transactions);
      return [];
    }

    return transactions;
  } catch (error) {
    console.error("❌ Erro ao buscar transações:", error);
    throw error;
  }
};

// Criar transação
export const createTransactionFetch = async (data: Omit<Transaction, "id">) => {
  const payload = {
    ...data,
    value: Number(data.value),
    date: new Date(data.date).toISOString().split("T")[0],
    type: data.type === "credit" ? "credit" : "debit",
  };

  console.log("📤 Criando transação:", payload);

  try {
    const result = await makeRequest("/api/accounting-entries", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("✅ Transação criada:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao criar transação:", error);
    throw error;
  }
};

// Atualizar transação
export const updateTransactionFetch = async (
  id: number,
  data: Omit<Transaction, "id">
) => {
  const payload = {
    ...data,
    value: Number(data.value),
    date: new Date(data.date).toISOString().split("T")[0],
    type: data.type === "credit" ? "credit" : "debit",
  };

  console.log(`📝 Atualizando transação ${id}:`, payload);

  try {
    const result = await makeRequest(`/api/accounting-entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    console.log("✅ Transação atualizada:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao atualizar transação:", error);
    throw error;
  }
};

// Deletar transação
export const deleteTransactionFetch = async (id: number) => {
  console.log(`🗑️ Deletando transação ${id}`);

  try {
    await makeRequest(`/api/accounting-entries/${id}`, {
      method: "DELETE",
    });

    console.log("✅ Transação deletada");
  } catch (error) {
    console.error("❌ Erro ao deletar transação:", error);
    throw error;
  }
};
