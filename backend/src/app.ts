import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/dataSource";
import transactionRoutes from "./routes/transaction.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  // Lista de origens permitidas
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://contaai-peach.vercel.app",
    "https://conta-ai.vercel.app",
    "https://vercel.app",
  ];

  const origin = req.headers.origin;

  // Se a origem está na lista ou é undefined (requisições do mesmo domínio)
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  // Headers CORS essenciais
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // Cache preflight por 24h

  // Resposta para preflight OPTIONS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

// CORS middleware como backup (mas o manual acima é mais confiável no Render)
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://contaai-peach.vercel.app",
        "https://conta-ai.vercel.app",
      ];

      // Permite requisições sem origin (mobile apps, etc) ou origins permitidas
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
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

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
    console.log("Database host:", process.env.DB_HOST);
    console.log("Database name:", process.env.DB_NAME);

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
