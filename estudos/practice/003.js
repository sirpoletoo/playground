const meuArray = [1, 2, 3, 4, 5]
function somarArray(array){
    let soma = 0;
    for(let i = 0; i < array.length; i++){
        soma += array[i]
    }
    return soma;
}

const somaTotal = somarArray (meuArray)
console.log(`A soma do array é ${somaTotal}`)