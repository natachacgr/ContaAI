import { DataSource } from "typeorm";
import { Transaction } from "../entities/Transaction";

import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "201970@oN",
  database: process.env.DB_NAME || "contaAI",
  synchronize: process.env.NODE_ENV !== "production", // Apenas em desenvolvimento
  logging: process.env.NODE_ENV === "development",
  entities: [Transaction],
  migrations: [],
  subscribers: [],
  // Configurações adicionais para Docker
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});

// Função para inicializar a conexão
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Banco de dados conectado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    // Retry em caso de erro (útil quando o container do banco está subindo)
    setTimeout(async () => {
      console.log("🔄 Tentando reconectar...");
      await initializeDatabase();
    }, 5000);
  }
};
