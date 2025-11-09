/**
 * Exemplo de teste manual para o endpoint de atendimento.
 * Execute este arquivo com: node teste-manual-atendimento.js
 * IMPORTANTE: Certifique-se de que o servidor (server.js) está rodando antes de executar este teste.
 */

const http = require('http');

// Dados de exemplo para enviar no corpo da requisição.
// Altere o valor de 'texto' para testar diferentes cenários.
const dadosRequisicao = {
    // Cenário 1: Pedido encontrado
    texto: "Olá, gostaria de saber o status do meu pedido 1004, por favor."

    // Cenário 2: Pedido não encontrado
    // texto: "Qual o status do pedido 9999?"

    // Cenário 3: Palavra "pedido" sem número
    // texto: "Quero saber sobre meu pedido."

    // Cenário 4: Texto sem a palavra "pedido"
    // texto: "Bom dia, tudo bem?"
};

const postData = JSON.stringify(dadosRequisicao);

// Configuração da requisição
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/atendimento',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log("🧪 Iniciando teste do endpoint de atendimento...");
console.log("💬 Enviando texto:", dadosRequisicao.texto);
console.log("\n⏳ Enviando requisição POST...\n");

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📡 Status da resposta:', res.statusCode);
        console.log('📄 Resposta do servidor:');
        try {
            console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch (error) {
            console.error("Erro ao processar a resposta JSON:", error.message);
            console.log("Resposta (texto puro):", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`\n❌ ERRO DE CONEXÃO: ${e.message}`);
    console.log("   Certifique-se de que o servidor está rodando em http://localhost:3000");
});

// Escreve os dados no corpo da requisição e a finaliza
req.write(postData);
req.end();