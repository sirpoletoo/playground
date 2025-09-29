class Livro{
    constructor(titulo, autor, preco, estoque){
        this.titulo = titulo;
        this.autor = autor;
        this.preco = preco;
        this.estoque = estoque;
    }
    consultarLivro(){
        return`Quem escreveu o livro ${this.titulo} foi o autor ${this.autor} e está a venda por R$ ${this.preco} reais`
    }
    exibirPrecoFormatado(){
        return`O preço do livro ${this.titulo} é de R$ ${this.preco.toFixed(2)}`
    }
    vender(quantidade = 1){
        if(quantidade <= this.estoque){
            this.estoque -= quantidade;
            const mensagem = `Venda realizada! ${quantidade} unidade(s) do livro ${this.titulo} foram vendidas. Novo estoque: ${this.estoque}`;
            console.log("[LOG INTERNO] Estoque atualizado com sucesso."); // Mensagem para o desenvolvedor
            return mensagem; // Valor retornado para quem chamou o método
        } else {
            const mensagem = "Estoque insuficiente";
            console.warn("[LOG INTERNO] Tentativa de venda falhou: estoque insuficiente."); // Usando console.warn para logs de aviso
            return mensagem; // Valor retornado para quem chamou o método
        }
    }
    reporEstoque(quantidade = 1){
        this.estoque += quantidade
        const mensagem = `Estoque atualizado! ${quantidade} unidade foi adicionada`
        console.log("[INTERNO2] Estoque atualizado com sucesso. ")
        return mensagem;
    }
}


const livro1 = new Livro("Percy Jackson", "Rick Riordan", 30, 10) 
console.log("--- BEM VINDO À BIBLIOTECA SILVÉRIUS ---")

console.log(livro1.consultarLivro());
console.log(livro1.exibirPrecoFormatado());
console.log(livro1.vender())
console.log(livro1.reporEstoque())