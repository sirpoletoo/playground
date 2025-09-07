# 🏥 Sistema de Gestão de Pacientes - Clínica Vida Mais

Sistema profissional para cadastro e gestão de pacientes desenvolvido em JavaScript/Node.js seguindo os princípios de Clean Code e arquitetura em camadas.

## 📋 Funcionalidades

- ✅ Cadastro de pacientes
- ✅ Validação completa de dados
- ✅ Prevenção de duplicatas (email e telefone)
- ✅ Busca por ID
- ✅ Listagem paginada
- ✅ Busca por nome
- ✅ API RESTful
- ✅ Banco SQLite integrado

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
src/
├── controllers/     # Camada de controle (HTTP)
├── services/        # Camada de lógica de negócio
├── repositories/    # Camada de acesso a dados
├── models/          # Entidades e validações
├── config/          # Configurações do sistema
├── database/        # Banco de dados SQLite
└── routes/          # Definição das rotas
```

### Camadas:

1. **Controller**: Gerencia requisições HTTP e respostas
2. **Service**: Contém a lógica de negócio e validações
3. **Repository**: Responsável pelas operações de banco de dados
4. **Model**: Define entidades e suas validações

## 🚀 Como executar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor:
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

### Endpoints disponíveis

O servidor rodará na porta `3000` por padrão.

- **Health Check**: `GET http://localhost:3000/health`
- **Cadastrar Paciente**: `POST http://localhost:3000/api/patients`
- **Buscar Paciente**: `GET http://localhost:3000/api/patients/:id`
- **Listar Pacientes**: `GET http://localhost:3000/api/patients`
- **Buscar por Nome**: `GET http://localhost:3000/api/patients/search?nome=exemplo`

## 📝 Exemplo de Uso

### Cadastrar um Paciente

**Requisição:**
```bash
curl -X POST http://localhost:3000/api/patients \\
  -H "Content-Type: application/json" \\
  -d '{
    "nome": "João Silva",
    "idade": 35,
    "genero": "masculino",
    "telefone": "11999887766",
    "email": "joao.silva@email.com"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Paciente cadastrado com sucesso",
  "errors": [],
  "data": {
    "id": 1,
    "nome": "João Silva",
    "idade": 35,
    "genero": "masculino",
    "telefone": "11999887766",
    "email": "joao.silva@email.com",
    "dataCadastro": "2024-01-15T10:30:00.000Z"
  }
}
```

**Resposta de Erro (dados inválidos):**
```json
{
  "success": false,
  "message": "Dados inválidos fornecidos",
  "errors": [
    "Nome deve ter pelo menos 2 caracteres",
    "Email deve ter um formato válido"
  ],
  "data": null
}
```

### Estrutura do Paciente

Cada paciente deve ter os seguintes campos obrigatórios:

- **nome**: String (mínimo 2 caracteres)
- **idade**: Número inteiro (entre 0 e 150)
- **genero**: String ("masculino", "feminino", "outro", "não informado")
- **telefone**: String (10 ou 11 dígitos)
- **email**: String (formato de email válido e único no sistema)

### Validações Implementadas

1. **Nome**: Obrigatório, mínimo 2 caracteres
2. **Idade**: Número inteiro entre 0 e 150 anos
3. **Gênero**: Deve ser uma das opções válidas
4. **Telefone**: 10 ou 11 dígitos, únicos no sistema
5. **Email**: Formato válido e único no sistema

## 🗃️ Banco de Dados

O sistema usa SQLite como banco de dados, que é criado automaticamente na primeira execução. O arquivo do banco fica em `src/database/clinica.db`.

### Estrutura da Tabela Patients

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  idade INTEGER NOT NULL,
  genero TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **SQLite3**: Banco de dados
- **Helmet**: Segurança HTTP
- **CORS**: Cross-Origin Resource Sharing

## 📊 Exemplos de Teste

### Teste com dados válidos:
```json
{
  "nome": "Maria Santos",
  "idade": 28,
  "genero": "feminino",
  "telefone": "11987654321",
  "email": "maria.santos@gmail.com"
}
```

### Teste com dados inválidos:
```json
{
  "nome": "A",
  "idade": 200,
  "genero": "inválido",
  "telefone": "123",
  "email": "email-inválido"
}
```

## 🔧 Desenvolvimento

### Estrutura de Resposta Padrão

Todas as respostas da API seguem o padrão:

```json
{
  "success": boolean,
  "message": string,
  "errors": array,
  "data": object|array|null
}
```

### Códigos de Status HTTP

- `200`: Sucesso (GET)
- `201`: Criado com sucesso (POST)
- `400`: Dados inválidos
- `404`: Não encontrado
- `500`: Erro interno do servidor

## 📄 Licença

ISC License

---

**Desenvolvido seguindo os princípios de Clean Code e boas práticas de desenvolvimento.**
