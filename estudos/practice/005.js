let cont = 0
const frase = "Casa"
function contarVogais(frase){
    const fraseMinuscula = frase.toLowerCase();
    let cont = 0;
    for(let i = 0; i < frase.length; i++){
        if("aeiou".includes(fraseMinuscula[i]))
            cont += 1
    }
    return cont; 
}

const somaVogal = contarVogais(frase)
console.log(`Tem ${somaVogal} vogais nessa frase`)