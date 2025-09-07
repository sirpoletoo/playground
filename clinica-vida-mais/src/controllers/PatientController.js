/**
 * Controller de Pacientes
 * Responsável por gerenciar as requisições HTTP relacionadas aos pacientes
 */
const PatientService = require("../services/PatientService");

class PatientController {
  constructor() {
    this.patientService = new PatientService();
  }

  /**
   * Cadastra um novo paciente
   * POST /api/patients
   */
  async createPatient(req, res) {
    try {
      // Validar se foi enviado um body
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dados do paciente são obrigatórios",
          errors: ["Body da requisição não pode estar vazio"],
          data: null,
        });
      }

      // Extrair dados do body
      const { nome, idade, genero, telefone, email } = req.body;

      // Chamar o serviço para criar o paciente
      const result = await this.patientService.createPatient({
        nome,
        idade,
        genero,
        telefone,
        email,
      });

      // Determinar status HTTP baseado no resultado
      const statusCode = result.success ? 201 : 400;

      // Retornar resposta
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Erro no controller de criação de paciente:", error);

      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado"],
        data: null,
      });
    }
  }

  /**
   * Busca um paciente por ID
   * GET /api/patients/:id
   */
  async getPatientById(req, res) {
    try {
      const { id } = req.params;

      const result = await this.patientService.getPatientById(id);

      const statusCode = result.success ? 200 : 404;

      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Erro no controller de busca de paciente:", error);

      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado"],
        data: null,
      });
    }
  }

  /**
   * Lista pacientes com paginação
   * GET /api/patients
   */
  async listPatients(req, res) {
    try {
      // Extrair parâmetros de query
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const result = await this.patientService.listPatients({ page, limit });

      const statusCode = result.success ? 200 : 400;

      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Erro no controller de listagem de pacientes:", error);

      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado"],
        data: null,
      });
    }
  }

  /**
   * Busca pacientes por nome
   * GET /api/patients/search
   */
  async searchPatientsByName(req, res) {
    try {
      const { nome } = req.query;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      if (!nome) {
        return res.status(400).json({
          success: false,
          message: "Parâmetro nome é obrigatório",
          errors: ["Nome deve ser fornecido na query string"],
          data: null,
        });
      }

      const result = await this.patientService.searchPatientsByName(nome, {
        page,
        limit,
      });

      const statusCode = result.success ? 200 : 400;

      return res.status(statusCode).json(result);
    } catch (error) {
      console.error("Erro no controller de busca de pacientes:", error);

      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado"],
        data: null,
      });
    }
  }

  /**
   * Endpoint de saúde/status da API
   * GET /api/health
   */
  async healthCheck(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "API funcionando corretamente",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      });
    } catch (error) {
      console.error("Erro no health check:", error);

      return res.status(500).json({
        success: false,
        message: "Erro no health check",
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = PatientController;
