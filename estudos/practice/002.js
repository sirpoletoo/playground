function verificarParImpar(number){
    if (number % 2 === 0){
        console.log(`O número ${number} é par`)
        return "Par";
    } else {
        console.log(`O número ${number} é ímpar`)
        return "Ímpar";
    }
}

const resultadoPar = verificarParImpar(10)
console.log("Resultado retornado para 10: ", resultadoPar)

const resultadoImpar = verificarParImpar(7);
console.log("Resultado retornado para 7:", resultadoImpar); 