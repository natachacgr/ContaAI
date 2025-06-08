import { DataSource } from "typeorm";
import { Transaction } from "../entities/Transaction";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // CUIDADO: Em produção considere usar migrations
  logging: process.env.NODE_ENV === "development",
  entities: [Transaction],
  migrations: [],
  subscribers: [],
  // CONFIGURAÇÃO SSL OBRIGATÓRIA PARA O RENDER
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  // Configurações adicionais para produção
  extra:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
});
