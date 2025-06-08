import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/dataSource";
import transactionRoutes from "./routes/transaction.routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://contaai-peach.vercel.app/",
      process.env.FRONTEND_URL || "*",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADICIONE ESTA ROTA RAIZ - RESOLVE O "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    message: "Contaai Backend API",
    status: "Online",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      transactions: "/api/accounting-entries",
    },
    version: "1.0.0",
  });
});

// Rotas
app.use("/api/accounting-entries", transactionRoutes);

// Rota de teste
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? "Connected" : "Disconnected",
  });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar conexão com banco de dados
    await AppDataSource.initialize();
    console.log("Database connected successfully");
    console.log("Database host:", process.env.DB_HOST);
    console.log("Database name:", process.env.DB_NAME);

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Root URL: http://localhost:${PORT}/`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(
        `API base URL: http://localhost:${PORT}/api/accounting-entries`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    console.error("Database connection details:");
    console.error("Host:", process.env.DB_HOST);
    console.error("Port:", process.env.DB_PORT);
    console.error("Database:", process.env.DB_NAME);
    console.error("Username:", process.env.DB_USERNAME);
    // NÃO loggar a senha por segurança
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

// Tratamento de rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: "The requested endpoint does not exist",
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/accounting-entries",
      "POST /api/accounting-entries",
    ],
  });
});

startServer();

export default app;
