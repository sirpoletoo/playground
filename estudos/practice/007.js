class Pessoa{
    constructor(nome, idade, sexo){
        this.nome = nome;
        this.idade = idade;
        this.sexo = sexo;
    }
    consultarPessoa(){
        return `O nome é ${this.nome}, tem ${this.idade} anos e é do sexo ${this.sexo}.`;
    }
}

const pessoa1 = new Pessoa("Guilherme", "27", "Masculino")
const pessoa2 = new Pessoa("Ana Carolina", "30", "Feminina")

// Agora você chama o método e usa console.log para ver o resultado retornado.
console.log(pessoa1.consultarPessoa());
console.log(pessoa2.consultarPessoa());