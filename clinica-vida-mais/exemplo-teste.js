/**
 * Exemplo de teste para o endpoint de cadastro de pacientes
 * Execute este arquivo com: node exemplo-teste.js
 * IMPORTANTE: Certifique-se de que o servidor está rodando antes de executar este teste
 */

const http = require("http");

// Dados de exemplo para testar o cadastro
const pacienteExemplo = {
  nome: "Maria Silva Santos",
  idade: 32,
  genero: "feminino",
  telefone: "11987654322",
  email: "maria.santos2@email.com",
};

// Configuração da requisição
const postData = JSON.stringify(pacienteExemplo);
const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/patients",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

console.log("🧪 Iniciando teste do endpoint de cadastro...");
console.log("📋 Dados do paciente a ser cadastrado:");
console.log(JSON.stringify(pacienteExemplo, null, 2));
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
req.write(postData);
req.end();
