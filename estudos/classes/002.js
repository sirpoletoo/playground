class Carro{
    detalhes() {
        // A string inteira deve ser envolvida por crases
        console.log(`O carro da marca ${this.marca} e modelo ${this.modelo} foi fabricado no ano de ${this.ano}`)
    }
}

const meuCarro = new Carro();
meuCarro.marca = 'Ford';
meuCarro.modelo = 'Ka';
meuCarro.ano = 2023;

meuCarro.detalhes();