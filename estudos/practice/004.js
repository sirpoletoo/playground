const array = [15, 8, 25, 4, 30, 12]
const maior = 0;
function encontrarMaior(number){
    let maior = array[0]
    console.log(`O número maior atual é ${maior}`);
    for(let i = 0; i < array.length; i++){
        console.log(`O atual número é ${array[i]}`)
        if(maior < array[i])
            maior = array[i]
    }
    return maior;
}

const maiorNumero = encontrarMaior(maior)
console.log(`O maior número é ${maiorNumero}`)