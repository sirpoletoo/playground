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
