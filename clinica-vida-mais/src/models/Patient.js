/**
 * Modelo do Paciente
 * Representa a entidade Paciente com suas propriedades e validações
 */
class Patient {
  constructor({ nome, idade, genero, telefone, email }) {
    this.nome = nome;
    this.idade = idade;
    this.genero = genero;
    this.telefone = telefone;
    this.email = email;
    this.dataCadastro = new Date().toISOString();
  }

  /**
   * Valida os dados do paciente
   * @returns {Object} Objeto com isValid e errors
   */
  static validate(patientData) {
    const errors = [];

    // Validação do nome
    if (
      !patientData.nome ||
      typeof patientData.nome !== "string" ||
      patientData.nome.trim().length === 0
    ) {
      errors.push("Nome é obrigatório e deve ser uma string válida");
    } else if (patientData.nome.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }

    // Validação da idade
    if (
      !patientData.idade ||
      typeof patientData.idade !== "number" ||
      !Number.isInteger(patientData.idade)
    ) {
      errors.push("Idade é obrigatória e deve ser um número inteiro");
    } else if (patientData.idade < 0 || patientData.idade > 150) {
      errors.push("Idade deve estar entre 0 e 150 anos");
    }

    // Validação do gênero
    const generosValidos = ["masculino", "feminino", "outro", "não informado"];
    if (
      !patientData.genero ||
      !generosValidos.includes(patientData.genero.toLowerCase())
    ) {
      errors.push(
        `Gênero deve ser um dos seguintes: ${generosValidos.join(", ")}`
      );
    }

    // Validação do telefone
    if (!patientData.telefone || typeof patientData.telefone !== "string") {
      errors.push("Telefone é obrigatório");
    } else {
      // Remove caracteres não numéricos para validação
      const telefoneNumerico = patientData.telefone.replace(/\D/g, "");
      if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
        errors.push("Telefone deve ter 10 ou 11 dígitos");
      }
    }

    // Validação do email
    if (!patientData.email || typeof patientData.email !== "string") {
      errors.push("Email é obrigatório");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientData.email)) {
        errors.push("Email deve ter um formato válido");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitiza os dados do paciente
   * @param {Object} patientData - Dados do paciente
   * @returns {Object} Dados sanitizados
   */
  static sanitize(patientData) {
    return {
      nome: patientData.nome ? patientData.nome.trim() : "",
      idade: patientData.idade ? parseInt(patientData.idade) : null,
      genero: patientData.genero ? patientData.genero.toLowerCase().trim() : "",
      telefone: patientData.telefone ? patientData.telefone.trim() : "",
      email: patientData.email ? patientData.email.trim() : "",
    };
  }

  /**
   * Converte a instância do paciente para objeto plano
   * @returns {Object} Dados do paciente
   */
  toJSON() {
    return {
      nome: this.nome,
      idade: this.idade,
      genero: this.genero,
      telefone: this.telefone,
      email: this.email,
      dataCadastro: this.dataCadastro,
    };
  }
}

module.exports = Patient;
