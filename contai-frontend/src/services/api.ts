import axios from "axios";
import type { Transaction } from "../types/Transaction";

const API_BASE_URL = "http://localhost:3001/api/accounting-entries";

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createTransaction = async (data: Omit<Transaction, "id">) => {
  // Converte valor para número e garante formato de data correto
  const payload = {
    ...data,
    value: Number(data.value),
    date: new Date(data.date).toISOString().split("T")[0], // Garante formato "YYYY-MM-DD"
    type: data.type === "credit" ? "credit" : "debit", // Garante valores válidos
  };
  console.log(payload);
  const response = await axios.post(API_BASE_URL, payload);
  return response.data;
};

export const updateTransaction = async (
  id: number,
  data: Omit<Transaction, "id">
) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
