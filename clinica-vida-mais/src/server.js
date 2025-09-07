/**
 * Servidor Principal da API
 * Sistema de Gestão de Pacientes - Clínica Vida Mais
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { getInstance } = require("./config/database");
const patientRoutes = require("./routes/patientRoutes");
const PatientController = require("./controllers/PatientController");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.db = getInstance();

    // Inicializar middlewares
    this.setupMiddlewares();

    // Inicializar rotas
    this.setupRoutes();

    // Setup de tratamento de erros
    this.setupErrorHandling();
  }

  /**
   * Configura os middlewares da aplicação
   */
  setupMiddlewares() {
    // Segurança
    this.app.use(
      helmet({
        contentSecurityPolicy: false, // Desabilitado para desenvolvimento
      })
    );

    // CORS
    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS
          ? process.env.ALLOWED_ORIGINS.split(",")
          : "*",
        credentials: true,
      })
    );

    // Parse do body das requisições
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Log das requisições (middleware customizado)
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  /**
   * Configura as rotas da aplicação
   */
  setupRoutes() {
    const patientController = new PatientController();

    // Rota de health check
    this.app.get("/health", async (req, res) => {
      await patientController.healthCheck(req, res);
    });

    // Rotas da API
    this.app.use("/api/patients", patientRoutes);

    // Rota para a raiz
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "API Sistema de Gestão de Pacientes - Clínica Vida Mais",
        version: "1.0.0",
        endpoints: {
          health: "GET /health",
          cadastrarPaciente: "POST /api/patients",
          buscarPaciente: "GET /api/patients/:id",
          listarPacientes: "GET /api/patients",
          buscarPorNome: "GET /api/patients/search?nome=exemplo",
        },
        documentation: "Para mais informações, consulte a documentação da API",
      });
    });

    // Rota 404 - Não encontrado
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Endpoint não encontrado",
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: {
          health: "GET /health",
          root: "GET /",
          patients: "GET|POST /api/patients",
        },
      });
    });
  }

  /**
   * Configura o tratamento de erros
   */
  setupErrorHandling() {
    // Middleware de tratamento de erros
    this.app.use((error, req, res, next) => {
      console.error("Erro não tratado:", error);

      // Erro de JSON malformado
      if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
      ) {
        return res.status(400).json({
          success: false,
          message: "JSON malformado",
          errors: ["Verifique a sintaxe do JSON enviado"],
          data: null,
        });
      }

      // Erro de payload muito grande
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "Payload muito grande",
          errors: ["O tamanho da requisição excede o limite permitido"],
          data: null,
        });
      }

      // Erro genérico
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado"],
        data: null,
      });
    });

    // Tratamento de promises rejeitadas
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Promise rejeitada não tratada:", reason);
    });

    // Tratamento de exceções não capturadas
    process.on("uncaughtException", (error) => {
      console.error("Exceção não capturada:", error);
      process.exit(1);
    });
  }

  /**
   * Inicializa o banco de dados
   */
  async initializeDatabase() {
    try {
      console.log("Inicializando banco de dados...");

      await this.db.connect();
      await this.db.initializeTables();

      console.log("Banco de dados inicializado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error);
      return false;
    }
  }

  /**
   * Inicia o servidor
   */
  async start() {
    try {
      // Inicializar banco de dados
      const dbInitialized = await this.initializeDatabase();
      if (!dbInitialized) {
        console.error("Falha ao inicializar banco de dados. Encerrando...");
        process.exit(1);
      }

      // Iniciar servidor HTTP
      this.app.listen(this.port, () => {
        console.log("=".repeat(50));
        console.log("🏥 Sistema de Gestão de Pacientes - Clínica Vida Mais");
        console.log("=".repeat(50));
        console.log(`🚀 Servidor rodando na porta: ${this.port}`);
        console.log(`📡 URL local: http://localhost:${this.port}`);
        console.log(`🩺 Health check: http://localhost:${this.port}/health`);
        console.log(
          `📋 Cadastrar paciente: POST http://localhost:${this.port}/api/patients`
        );
        console.log("=".repeat(50));
        console.log(`⏰ Iniciado em: ${new Date().toLocaleString("pt-BR")}`);
        console.log("=".repeat(50));
      });
    } catch (error) {
      console.error("Erro ao iniciar servidor:", error);
      process.exit(1);
    }
  }

  /**
   * Para o servidor graciosamente
   */
  async stop() {
    try {
      console.log("Parando servidor...");

      if (this.db) {
        await this.db.disconnect();
        console.log("Banco de dados desconectado");
      }

      console.log("Servidor parado com sucesso");
      process.exit(0);
    } catch (error) {
      console.error("Erro ao parar servidor:", error);
      process.exit(1);
    }
  }
}

// Criar e iniciar o servidor se este arquivo for executado diretamente
if (require.main === module) {
  const server = new Server();

  // Tratar sinais de término
  process.on("SIGTERM", async () => {
    console.log("SIGTERM recebido, parando servidor...");
    await server.stop();
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT recebido, parando servidor...");
    await server.stop();
  });

  // Iniciar servidor
  server.start().catch((error) => {
    console.error("Falha ao iniciar servidor:", error);
    process.exit(1);
  });
}

module.exports = Server;
