class Cachorro{
 latir(){
    console.log(`O cachorro ${this.nome} da raça ${this.raca} diz: au au!`)
 }
}

const meuCachorro = new Cachorro;
meuCachorro.nome = 'Silvério';
meuCachorro.raca = 'Border Collie';
meuCachorro.latir();

const outroCachorro = new Cachorro;
outroCachorro.nome = 'Ted';
outroCachorro.raca = 'Lasha Apso'
outroCachorro.latir()