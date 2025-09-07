/**
 * Serviço de Pacientes
 * Contém a lógica de negócio para operações relacionadas aos pacientes
 */
const Patient = require("../models/Patient");
const PatientRepository = require("../repositories/PatientRepository");

class PatientService {
  constructor() {
    this.patientRepository = new PatientRepository();
  }

  /**
   * Cadastra um novo paciente
   * @param {Object} patientData - Dados do paciente
   * @returns {Promise<Object>} Resultado da operação
   */
  async createPatient(patientData) {
    try {
      // 1. Sanitizar os dados de entrada
      const sanitizedData = Patient.sanitize(patientData);

      // 2. Validar os dados sanitizados
      const validation = Patient.validate(sanitizedData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Dados inválidos fornecidos",
          errors: validation.errors,
          data: null,
        };
      }

      // 3. Verificar duplicatas - Email
      const existingEmail = await this.patientRepository.emailExists(
        sanitizedData.email
      );
      if (existingEmail) {
        return {
          success: false,
          message: "Email já cadastrado no sistema",
          errors: ["Email já está em uso por outro paciente"],
          data: null,
        };
      }

      // 4. Verificar duplicatas - Telefone (opcional, dependendo da regra de negócio)
      const existingPhone = await this.patientRepository.phoneExists(
        sanitizedData.telefone
      );
      if (existingPhone) {
        return {
          success: false,
          message: "Telefone já cadastrado no sistema",
          errors: ["Telefone já está em uso por outro paciente"],
          data: null,
        };
      }

      // 5. Criar instância do Patient para garantir formatação correta
      const patient = new Patient(sanitizedData);

      // 6. Salvar no banco de dados
      const savedPatient = await this.patientRepository.create(
        patient.toJSON()
      );

      // 7. Retornar sucesso com dados do paciente (sem dados sensíveis se necessário)
      return {
        success: true,
        message: "Paciente cadastrado com sucesso",
        errors: [],
        data: {
          id: savedPatient.id,
          nome: savedPatient.nome,
          idade: savedPatient.idade,
          genero: savedPatient.genero,
          telefone: savedPatient.telefone,
          email: savedPatient.email,
          dataCadastro: savedPatient.created_at,
        },
      };
    } catch (error) {
      console.error("Erro no serviço de criação de paciente:", error);

      // Tratamento específico de erros conhecidos
      if (error.message === "Email já cadastrado no sistema") {
        return {
          success: false,
          message: error.message,
          errors: [error.message],
          data: null,
        };
      }

      // Erro genérico para não vazar informações sensíveis
      return {
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado ao cadastrar o paciente"],
        data: null,
      };
    }
  }

  /**
   * Busca um paciente por ID
   * @param {number} id - ID do paciente
   * @returns {Promise<Object>} Resultado da operação
   */
  async getPatientById(id) {
    try {
      // Validar ID
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return {
          success: false,
          message: "ID do paciente inválido",
          errors: ["ID deve ser um número inteiro positivo"],
          data: null,
        };
      }

      const patient = await this.patientRepository.findById(Number(id));

      if (!patient) {
        return {
          success: false,
          message: "Paciente não encontrado",
          errors: ["Nenhum paciente encontrado com o ID fornecido"],
          data: null,
        };
      }

      return {
        success: true,
        message: "Paciente encontrado",
        errors: [],
        data: {
          id: patient.id,
          nome: patient.nome,
          idade: patient.idade,
          genero: patient.genero,
          telefone: patient.telefone,
          email: patient.email,
          dataCadastro: patient.created_at,
        },
      };
    } catch (error) {
      console.error("Erro no serviço de busca de paciente:", error);

      return {
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado ao buscar o paciente"],
        data: null,
      };
    }
  }

  /**
   * Lista pacientes com paginação
   * @param {Object} options - Opções de listagem
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @returns {Promise<Object>} Resultado da operação
   */
  async listPatients({ page = 1, limit = 10 } = {}) {
    try {
      // Validar parâmetros de paginação
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (!Number.isInteger(pageNum) || pageNum <= 0) {
        return {
          success: false,
          message: "Página inválida",
          errors: ["Página deve ser um número inteiro positivo"],
          data: null,
        };
      }

      if (!Number.isInteger(limitNum) || limitNum <= 0 || limitNum > 100) {
        return {
          success: false,
          message: "Limite inválido",
          errors: ["Limite deve ser um número inteiro entre 1 e 100"],
          data: null,
        };
      }

      const result = await this.patientRepository.findAll({
        page: pageNum,
        limit: limitNum,
      });

      return {
        success: true,
        message: "Pacientes listados com sucesso",
        errors: [],
        data: {
          patients: result.patients.map((patient) => ({
            id: patient.id,
            nome: patient.nome,
            idade: patient.idade,
            genero: patient.genero,
            telefone: patient.telefone,
            email: patient.email,
            dataCadastro: patient.created_at,
          })),
          pagination: result.pagination,
        },
      };
    } catch (error) {
      console.error("Erro no serviço de listagem de pacientes:", error);

      return {
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado ao listar os pacientes"],
        data: null,
      };
    }
  }

  /**
   * Busca pacientes por nome
   * @param {string} nome - Nome para busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<Object>} Resultado da operação
   */
  async searchPatientsByName(nome, { page = 1, limit = 10 } = {}) {
    try {
      // Validar nome
      if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        return {
          success: false,
          message: "Nome para busca é obrigatório",
          errors: ["Nome deve ser fornecido para a busca"],
          data: null,
        };
      }

      // Validar parâmetros de paginação
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (!Number.isInteger(pageNum) || pageNum <= 0) {
        return {
          success: false,
          message: "Página inválida",
          errors: ["Página deve ser um número inteiro positivo"],
          data: null,
        };
      }

      if (!Number.isInteger(limitNum) || limitNum <= 0 || limitNum > 100) {
        return {
          success: false,
          message: "Limite inválido",
          errors: ["Limite deve ser um número inteiro entre 1 e 100"],
          data: null,
        };
      }

      const patients = await this.patientRepository.searchByName(nome.trim(), {
        page: pageNum,
        limit: limitNum,
      });

      return {
        success: true,
        message: "Busca realizada com sucesso",
        errors: [],
        data: patients.map((patient) => ({
          id: patient.id,
          nome: patient.nome,
          idade: patient.idade,
          genero: patient.genero,
          telefone: patient.telefone,
          email: patient.email,
          dataCadastro: patient.created_at,
        })),
      };
    } catch (error) {
      console.error("Erro no serviço de busca de pacientes:", error);

      return {
        success: false,
        message: "Erro interno do servidor",
        errors: ["Ocorreu um erro inesperado ao buscar os pacientes"],
        data: null,
      };
    }
  }
}

module.exports = PatientService;
