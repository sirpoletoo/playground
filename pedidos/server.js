const express = require('express')
const AtendimentoController = require('./controllers/AtendimentoController');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/atendimento', AtendimentoController.executarAtendimento);

// Testar o servidor

app.get('/', (req, res) => {
    res.send('API de Atendimento está online!');
})

app.listen(port, () => {
    const separador = "=".repeat(50);
    console.log(separador);
    console.log("🤖 API de Atendimento de Pedidos");
    console.log(separador);
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`✅ Rota de teste: GET http://localhost:${port}/`);
    console.log(`🗣️ Rota de atendimento: POST http://localhost:${port}/api/atendimento`);
    console.log(separador);
    console.log(`⏰ Iniciado em: ${new Date().toLocaleString("pt-BR")}`);
});
