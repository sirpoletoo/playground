/**
 * Exemplo de teste para o endpoint de cadastro de pacientes
 * Execute este arquivo com: node exemplo-teste.js
 * IMPORTANTE: Certifique-se de que o servidor está rodando antes de executar este teste
 */

const http = require("http");

// Dados de exemplo para testar a listagem dos pacientes


// Configuração da requisição
const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/patients",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

console.log("🧪 Iniciando teste do endpoint de listagem...");
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
  console.log(
    "Certifique-se de que o servidor está rodando em http://localhost:3000"
  );
  console.log("Execute: npm start");
  console.log("Erro:", error.message);
});

// Enviar os dados
req.end();
