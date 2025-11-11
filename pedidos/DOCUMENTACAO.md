TESTE BRANCH
# 📦 API de Atendimento de Pedidos

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Fluxo de Funcionamento](#fluxo-de-funcionamento)
- [Exemplos de Uso](#exemplos-de-uso)
- [Testes](#testes)

---

## 📖 Sobre o Projeto

API REST desenvolvida em Node.js para automatizar o atendimento de consultas sobre status de pedidos. O sistema processa mensagens de texto dos usuários, identifica números de pedidos e retorna o status correspondente de forma automática.

### Funcionalidades Principais
- ✅ Processamento de linguagem natural para identificar pedidos
- ✅ Consulta automática de status de pedidos
- ✅ Respostas contextualizadas baseadas na entrada do usuário
- ✅ Sistema de sessão para rastreamento de conversas

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v14+): Ambiente de execução JavaScript
- **Express.js** (v4.x): Framework web para criação da API REST
- **JavaScript ES6+**: Linguagem de programação
- **HTTP Module**: Para testes manuais

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado, com camadas bem definidas:

```
┌─────────────────┐
│   Controller    │  ← Recebe requisições HTTP
└────────┬────────┘
         │
┌────────▼────────┐
│    Service      │  ← Lógica de negócios
└────────┬────────┘
         │
┌────────▼────────┐
│   Repository    │  ← Acesso aos dados
└────────┬────────┘
         │
┌────────▼────────┐
│      Data       │  ← Dados em memória
└─────────────────┘
```

### Camadas:

1. **Controller**: Gerencia requisições e respostas HTTP
2. **Service**: Contém a lógica de negócios (processamento de texto, validações)
3. **Repository**: Abstração para acesso aos dados
4. **Data**: Armazenamento em memória (simulando um banco de dados)

---

## 📥 Instalação

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Passos

1. Clone ou baixe o projeto:
```bash
cd pedidos
```

2. Instale as dependências:
```bash
npm install
```

3. Verifique se a estrutura de pastas está correta:
```
pedidos/
├── controllers/
│   └── AtendimentoController.js
├── services/
│   └── AtendimentoService.js
├── repositories/
│   └── PedidoRepository.js
├── data/
│   └── pedidosData.js
├── server.js
├── teste-manual-atendimento.js
└── package.json
```

---

## 🚀 Como Usar

### Iniciar o servidor

```bash
node server.js
```

Você verá:
```
==================================================
🤖 API de Atendimento de Pedidos
==================================================
🚀 Servidor rodando em http://localhost:3000
✅ Rota de teste: GET http://localhost:3000/
🗣️ Rota de atendimento: POST http://localhost:3000/api/atendimento
==================================================
```

### Testar se está online

Abra o navegador e acesse: `http://localhost:3000`

Deve exibir: "API de Atendimento está online!"

---

## 🌐 Endpoints da API

### 1. GET `/`
**Descrição**: Endpoint de teste para verificar se a API está online.

**Resposta**:
```
API de Atendimento está online!
```

---

### 2. POST `/api/atendimento`
**Descrição**: Processa mensagens de texto e retorna informações sobre pedidos.

**Requisição**:
```json
{
  "texto": "Olá, gostaria de saber o status do meu pedido 1001, por favor.",
  "sessionId": "opcional_id_da_sessao"
}
```

**Parâmetros**:
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| texto | string | Sim | Mensagem do usuário |
| sessionId | string | Não | ID da sessão (gerado automaticamente se não fornecido) |

**Respostas**:

#### ✅ Sucesso (200)
```json
{
  "sessionId": "nova_sessao_1699564800000",
  "resposta": "O status do seu pedido 1001 é **Em processamento**."
}
```

#### ❌ Erro - Campo obrigatório (400)
```json
{
  "erro": "O campo \"texto\" é obrigatório."
}
```

#### ❌ Erro interno (500)
```json
{
  "erro": "Ocorreu um erro interno no processamento"
}
```

---

## 📁 Estrutura do Projeto

```
pedidos/
│
├── controllers/
│   └── AtendimentoController.js    # Gerencia requisições HTTP
│
├── services/
│   └── AtendimentoService.js       # Lógica de negócios
│
├── repositories/
│   └── PedidoRepository.js         # Acesso aos dados
│
├── data/
│   └── pedidosData.js              # Dados em memória
│
├── models/
│   └── Pedido.js                   # Modelo de dados (opcional)
│
├── server.js                       # Configuração do servidor Express
├── teste-manual-atendimento.js    # Script de teste
├── package.json                    # Dependências do projeto
└── package-lock.json
```

---

## 🔄 Fluxo de Funcionamento

### Fluxograma do Processamento

```
Cliente envia POST → Controller → Service → Repository → Data
                         ↓           ↓          ↓
                    Valida req  Processa   Busca pedido
                         ↓        texto         ↓
                    Chama       Extrai ID   Retorna status
                    Service        ↓             ↓
                         ↓      Monta       Retorna dados
                    Retorna   resposta          ↑
                    JSON   ←─────┴──────────────┘
```

### Detalhamento do Fluxo

1. **Cliente** envia requisição POST com texto
2. **Controller** (`AtendimentoController.js`):
   - Valida se o campo `texto` existe
   - Cria ou utiliza `sessionId`
   - Chama o Service
3. **Service** (`AtendimentoService.js`):
   - Converte texto para minúsculas
   - Verifica se contém a palavra "pedido"
   - Usa regex para extrair número do pedido (4 dígitos)
   - Chama o Repository para buscar status
4. **Repository** (`PedidoRepository.js`):
   - Busca o pedido no array de dados
   - Retorna o status ou `null`
5. **Data** (`pedidosData.js`):
   - Array em memória com pedidos e seus status
6. **Resposta** é montada e retornada ao cliente

---

## 💡 Exemplos de Uso

### Exemplo 1: Pedido Encontrado

**Requisição**:
```bash
curl -X POST http://localhost:3000/api/atendimento \
  -H "Content-Type: application/json" \
  -d '{"texto": "Qual o status do pedido 1001?"}'
```

**Resposta**:
```json
{
  "sessionId": "nova_sessao_1699564800000",
  "resposta": "O status do seu pedido 1001 é **Em processamento**."
}
```

---

### Exemplo 2: Pedido Não Encontrado

**Requisição**:
```json
{
  "texto": "Quero saber sobre o pedido 9999"
}
```

**Resposta**:
```json
{
  "sessionId": "nova_sessao_1699564800000",
  "resposta": "Não consegui encontrar o pedido com o número 9999. Por favor, verifique o número e tente novamente."
}
```

---

### Exemplo 3: Sem Número do Pedido

**Requisição**:
```json
{
  "texto": "Quero saber sobre meu pedido"
}
```

**Resposta**:
```json
{
  "sessionId": "nova_sessao_1699564800000",
  "resposta": "Entendi que você quer saber sobre um pedido, mas não identifiquei o número. Poderia me informar o número do pedido (ex: pedido 1001)?"
}
```

---

### Exemplo 4: Mensagem Genérica

**Requisição**:
```json
{
  "texto": "Olá, bom dia!"
}
```

**Resposta**:
```json
{
  "sessionId": "nova_sessao_1699564800000",
  "resposta": "Olá! Como posso ajudar? Se quiser saber sobre um pedido, me diga o número dele."
}
```

---

## 🧪 Testes

### Teste Manual com Script

O projeto inclui um script de teste (`teste-manual-atendimento.js`) que facilita os testes.

**Como executar**:

1. Certifique-se de que o servidor está rodando:
```bash
node server.js
```

2. Em outro terminal, execute o teste:
```bash
node teste-manual-atendimento.js
```

### Modificar Cenários de Teste

Edite o arquivo `teste-manual-atendimento.js` e descomente o cenário desejado:

```javascript
const dadosRequisicao = {
    // Cenário 1: Pedido encontrado
    texto: "Olá, gostaria de saber o status do meu pedido 1001, por favor."

    // Cenário 2: Pedido não encontrado
    // texto: "Qual o status do pedido 9999?"

    // Cenário 3: Palavra "pedido" sem número
    // texto: "Quero saber sobre meu pedido."

    // Cenário 4: Texto sem a palavra "pedido"
    // texto: "Bom dia, tudo bem?"
};
```

---

## 📊 Dados Disponíveis

O sistema possui os seguintes pedidos cadastrados (em `data/pedidosData.js`):

| ID | Status |
|----|--------|
| 1001 | Em processamento |
| 1002 | Enviado |
| 1003 | Entregue |
| 1004 | Cancelado |

---

## 🔧 Adicionando Novos Pedidos

Para adicionar novos pedidos, edite o arquivo `data/pedidosData.js`:

```javascript
const pedidos = [
    { id: 1001, status: 'Em processamento' },
    { id: 1002, status: 'Enviado' },
    { id: 1003, status: 'Entregue' },
    { id: 1004, status: 'Cancelado' },
    { id: 1005, status: 'Aguardando pagamento' }, // Novo pedido
];
```

Reinicie o servidor após as alterações.

---

## 🐛 Troubleshooting (Solução de Problemas)

### Erro: "Cannot find module"
**Solução**: Verifique se todas as dependências foram instaladas com `npm install`

### Erro: "EADDRINUSE"
**Solução**: A porta 3000 já está em uso. Pare outros servidores ou altere a porta no `server.js`

### Erro 500 na API
**Solução**: Verifique os logs do servidor no terminal. Certifique-se de que:
- Todos os arquivos têm `module.exports` no final
- A estrutura de pastas está correta
- Não há erros de sintaxe

---

## 📝 Próximas Melhorias

- [ ] Conectar a um banco de dados real (MongoDB, PostgreSQL)
- [ ] Implementar autenticação de usuários
- [ ] Adicionar mais comandos além de consulta de pedidos
- [ ] Criar interface web para testes
- [ ] Implementar logs estruturados
- [ ] Adicionar testes automatizados (Jest, Mocha)
- [ ] Documentação da API com Swagger

---

## 👥 Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do repositório.

---

**Desenvolvido com ❤️ usando Node.js e Express**