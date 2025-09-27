class ContaBancaria{
    constructor(titular, saldoInicial){
        this.titular = titular;
        if (saldoInicial < 0 || isNaN(saldoInicial)) {
            this.saldo = 0;
        } else{
            this.saldo = saldoInicial;
        }
    }
    depositar(valor){
        if (valor > 0){
            this.saldo += valor
            console.log(`Depósito de valor R$ ${valor} realizado com sucesso`)
        } else {
            console.log("Valor de depósito inválido")
        }
    }
    
    verSaldo(){
        return `O saldo atual do titular ${this.titular} é de R$ ${this.saldo}`
    }
}

const contaGuilherme = new ContaBancaria("Guilherme", -500)
const contaAna = new ContaBancaria("Ana Carolina", 300)


console.log(contaGuilherme.verSaldo())
console.log(contaAna.verSaldo())

console.log("--- Teste de Depósito ---")
contaGuilherme.depositar(1500)

console.log("--- Saldo Final ---")
console.log(contaGuilherme.verSaldo());