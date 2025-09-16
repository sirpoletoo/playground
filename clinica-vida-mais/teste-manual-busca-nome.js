/**
 * Exemplo de teste para o endpoint de busca de pacientes por nome
 * Execute este arquivo com: node teste-manual-busca-nome.js
 * IMPORTANTE: Certifique-se de que o servidor está rodando antes de executar este teste
 */

const http = require("http");

// Nome para buscar. Altere este valor para testar diferentes buscas.
const nomeParaBuscar = "Maria";

// Configuração da requisição
const options = {
  hostname: "localhost",
  port: 3000,
  // Codifica o nome para ser usado na URL de forma segura
  path: `/api/patients/search?nome=${encodeURIComponent(nomeParaBuscar)}`,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

console.log("🧪 Iniciando teste do endpoint de busca por nome...");
console.log(`🔎 Buscando por pacientes com o nome: "${nomeParaBuscar}"`);
console.log("\n⏳ Enviando requisição...\n");

// Fazer a requisição
const req = http.request(options, (res) => {
  let data = "";

  // Coletar dados da resposta
  res.on("data", (chunk) => {
    data += chunk;
  });

  // Processar resposta completa
  res.on("end", () => {
    console.log("📡 Status da resposta:", res.statusCode);
    console.log("📄 Resposta do servidor:");

    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.log("Resposta (texto):", data);
      console.log("\n❌ Erro ao processar resposta JSON:", error.message);
    }
  });
});

// Tratar erros de conexão
req.on("error", (error) => {
  console.log("\n❌ ERRO DE CONEXÃO:");
  console.log("Certifique-se de que o servidor está rodando em http://localhost:3000");
  console.log("Execute: npm start");
  console.log("Erro:", error.message);
});

// Enviar a requisição
req.end();
