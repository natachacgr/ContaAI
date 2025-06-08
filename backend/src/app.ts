import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/dataSource";
import transactionRoutes from "./routes/transaction.routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"], // Permitir frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api/accounting-entries", transactionRoutes);

// Rota de teste
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar conexão com banco de dados
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(
        `API base URL: http://localhost:${PORT}/api/accounting-entries`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Tratamento de erros globais
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", error);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
);

startServer();

export default app;
