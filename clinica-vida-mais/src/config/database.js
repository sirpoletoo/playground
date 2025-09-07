/**
 * Configuração do banco de dados SQLite
 */
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

class DatabaseConfig {
  constructor() {
    this.dbPath = path.join(__dirname, "..", "database", "clinica.db");
    this.db = null;
  }

  /**
   * Conecta ao banco de dados SQLite
   * @returns {Promise<sqlite3.Database>} Instância do banco
   */
  async connect() {
    return new Promise((resolve, reject) => {
      // Garante que o diretório existe
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error("Erro ao conectar ao banco de dados:", err);
          reject(err);
        } else {
          console.log("Conectado ao banco de dados SQLite");
          resolve(this.db);
        }
      });
    });
  }

  /**
   * Desconecta do banco de dados
   * @returns {Promise<void>}
   */
  async disconnect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error("Erro ao desconectar do banco:", err);
            reject(err);
          } else {
            console.log("Desconectado do banco de dados");
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Inicializa as tabelas do banco de dados
   * @returns {Promise<void>}
   */
  async initializeTables() {
    if (!this.db) {
      throw new Error("Banco de dados não conectado");
    }

    const createPatientsTable = `
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        genero TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createIndexes = [
      "CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email)",
      "CREATE INDEX IF NOT EXISTS idx_patients_telefone ON patients(telefone)",
      "CREATE INDEX IF NOT EXISTS idx_patients_nome ON patients(nome)",
    ];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Criar tabela de pacientes
        this.db.run(createPatientsTable, (err) => {
          if (err) {
            console.error("Erro ao criar tabela patients:", err);
            reject(err);
            return;
          }
          console.log("Tabela patients criada ou já existe");
        });

        // Criar índices
        createIndexes.forEach((indexQuery) => {
          this.db.run(indexQuery, (err) => {
            if (err) {
              console.error("Erro ao criar índice:", err);
            }
          });
        });

        console.log("Inicialização do banco concluída");
        resolve();
      });
    });
  }

  /**
   * Retorna a instância do banco de dados
   * @returns {sqlite3.Database}
   */
  getDatabase() {
    if (!this.db) {
      throw new Error(
        "Banco de dados não conectado. Execute connect() primeiro."
      );
    }
    return this.db;
  }

  /**
   * Executa uma query com parâmetros
   * @param {string} query - Query SQL
   * @param {Array} params - Parâmetros da query
   * @returns {Promise<Object>} Resultado da query
   */
  async run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Executa uma query de seleção
   * @param {string} query - Query SQL
   * @param {Array} params - Parâmetros da query
   * @returns {Promise<Array>} Resultados da query
   */
  async all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Executa uma query que retorna uma linha
   * @param {string} query - Query SQL
   * @param {Array} params - Parâmetros da query
   * @returns {Promise<Object>} Resultado da query
   */
  async get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

// Singleton para garantir uma única instância
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new DatabaseConfig();
    }
    return instance;
  },
};
