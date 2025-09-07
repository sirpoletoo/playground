/**
 * Repositório de Pacientes
 * Responsável por todas as operações de banco de dados relacionadas aos pacientes
 */
const { getInstance } = require("../config/database");
const Patient = require("../models/Patient");

class PatientRepository {
  constructor() {
    this.db = getInstance();
  }

  /**
   * Cria um novo paciente no banco de dados
   * @param {Object} patientData - Dados do paciente
   * @returns {Promise<Object>} Paciente criado com ID
   */
  async create(patientData) {
    try {
      const query = `
        INSERT INTO patients (nome, idade, genero, telefone, email)
        VALUES (?, ?, ?, ?, ?)
      `;

      const params = [
        patientData.nome,
        patientData.idade,
        patientData.genero,
        patientData.telefone,
        patientData.email,
      ];

      const result = await this.db.run(query, params);

      // Busca o paciente recém-criado
      const createdPatient = await this.findById(result.lastID);

      return createdPatient;
    } catch (error) {
      // Verifica se é erro de constraint (email duplicado)
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Email já cadastrado no sistema");
      }

      console.error("Erro ao criar paciente:", error);
      throw new Error("Erro interno do servidor ao criar paciente");
    }
  }

  /**
   * Busca um paciente por ID
   * @param {number} id - ID do paciente
   * @returns {Promise<Object|null>} Paciente encontrado ou null
   */
  async findById(id) {
    try {
      const query = "SELECT * FROM patients WHERE id = ?";
      const patient = await this.db.get(query, [id]);

      return patient || null;
    } catch (error) {
      console.error("Erro ao buscar paciente por ID:", error);
      throw new Error("Erro interno do servidor ao buscar paciente");
    }
  }

  /**
   * Busca um paciente por email
   * @param {string} email - Email do paciente
   * @returns {Promise<Object|null>} Paciente encontrado ou null
   */
  async findByEmail(email) {
    try {
      const query = "SELECT * FROM patients WHERE email = ?";
      const patient = await this.db.get(query, [email]);

      return patient || null;
    } catch (error) {
      console.error("Erro ao buscar paciente por email:", error);
      throw new Error("Erro interno do servidor ao buscar paciente");
    }
  }

  /**
   * Busca um paciente por telefone
   * @param {string} telefone - Telefone do paciente
   * @returns {Promise<Object|null>} Paciente encontrado ou null
   */
  async findByPhone(telefone) {
    try {
      const query = "SELECT * FROM patients WHERE telefone = ?";
      const patient = await this.db.get(query, [telefone]);

      return patient || null;
    } catch (error) {
      console.error("Erro ao buscar paciente por telefone:", error);
      throw new Error("Erro interno do servidor ao buscar paciente");
    }
  }

  /**
   * Lista todos os pacientes com paginação
   * @param {Object} options - Opções de paginação
   * @param {number} options.page - Página atual (padrão: 1)
   * @param {number} options.limit - Limite por página (padrão: 10)
   * @returns {Promise<Object>} Lista paginada de pacientes
   */
  async findAll({ page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;

      // Query para contar total de registros
      const countQuery = "SELECT COUNT(*) as total FROM patients";
      const totalResult = await this.db.get(countQuery);
      const total = totalResult.total;

      // Query para buscar os pacientes
      const query = `
        SELECT * FROM patients 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      const patients = await this.db.all(query, [limit, offset]);

      return {
        patients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
      throw new Error("Erro interno do servidor ao listar pacientes");
    }
  }

  /**
   * Busca pacientes por nome (busca parcial)
   * @param {string} nome - Nome para busca
   * @param {Object} options - Opções de paginação
   * @returns {Promise<Array>} Lista de pacientes encontrados
   */
  async searchByName(nome, { page = 1, limit = 10 } = {}) {
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${nome}%`;

      const query = `
        SELECT * FROM patients 
        WHERE nome LIKE ? 
        ORDER BY nome 
        LIMIT ? OFFSET ?
      `;

      const patients = await this.db.all(query, [searchTerm, limit, offset]);
      return patients;
    } catch (error) {
      console.error("Erro ao buscar pacientes por nome:", error);
      throw new Error("Erro interno do servidor ao buscar pacientes");
    }
  }

  /**
   * Verifica se um email já existe no banco
   * @param {string} email - Email para verificar
   * @returns {Promise<boolean>} True se existe, false caso contrário
   */
  async emailExists(email) {
    try {
      const patient = await this.findByEmail(email);
      return patient !== null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  }

  /**
   * Verifica se um telefone já existe no banco
   * @param {string} telefone - Telefone para verificar
   * @returns {Promise<boolean>} True se existe, false caso contrário
   */
  async phoneExists(telefone) {
    try {
      const patient = await this.findByPhone(telefone);
      return patient !== null;
    } catch (error) {
      console.error("Erro ao verificar telefone:", error);
      throw error;
    }
  }
}

module.exports = PatientRepository;
