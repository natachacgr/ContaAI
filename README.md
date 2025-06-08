# 💰 ContAI - Sistema de Gestão Contábil

<div align="center">

Uma solução tecnológica moderna para otimizar o processo de registro e visualização de lançamentos contábeis empresariais.

[![Frontend Deploy](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://conta-ai.vercel.app/)
[![Backend Deploy](https://img.shields.io/badge/Backend-Render-green?style=flat-square&logo=render)](https://contaai-backend.onrender.com)

</div>

## 📋 Sobre o Projeto

O **ContAI** é uma plataforma web desenvolvida para  uma gestão financeira mais eficiente e organizada. O sistema permite o cadastro, visualização, edição e exclusão de lançamentos contábeis de forma intuitiva e responsiva.

### 🎯 Objetivos

- ✅ **Otimização**: Automatizar o processo de registro contábil
- ✅ **Organização**: Visualizar lançamentos organizados por mês e ano
- ✅ **Eficiência**: Interface moderna e responsiva para gestão ágil
- ✅ **Controle Total**: Funcionalidades completas de CRUD (Create, Read, Update, Delete)

## 🚀 Funcionalidades

### 💡 Core Features

- 📊 **Dashboard Interativo**: Visualização de créditos, débitos e saldo
- 📝 **Gestão de Lançamentos**: Cadastrar, editar e excluir transações
- 🗓️ **Filtros Avançados**: Organização por mês e ano
- 📱 **Design Responsivo**: Funciona perfeitamente em mobile e desktop
- ⚡ **Interface Moderna**: Design clean e intuitivo

### 🔧 Funcionalidades Técnicas

- 🔄 **API RESTful**: Backend robusto com Express.js e TypeORM
- 🎨 **UI/UX Moderna**: Interface construída com React e Tailwind CSS
- 🛡️ **Validação de Dados**: Validação completa no frontend e backend
- 📈 **Performance**: Otimizado para carregamento rápido
- 🔍 **Debug Tools**: Ferramentas integradas para monitoramento

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para requisições
- **Lucide React** - Ícones modernos e customizáveis

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **CORS** - Middleware para controle de acesso

### DevOps & Deploy
- **Vercel** - Deploy do frontend
- **Render** - Deploy do backend e banco
- **Git** - Controle de versão

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### 📦 Clonando o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/contaai.git

# Entre no diretório
cd contaai
```

### 🖥️ Configuração do Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Crie o arquivo de ambiente
echo "VITE_API_URL=http://localhost:3001" > .env

# Execute o projeto
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### ⚙️ Configuração do Backend

```bash
# Em um novo terminal, entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=contaai

# Configurações do Servidor
PORT=3001
NODE_ENV=development

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

```bash
# Execute as migrações do banco
npm run migration:run

# Inicie o servidor
npm run dev
```

O backend estará disponível em: `http://localhost:3001`

### 🐳 Executando com Docker (Opcional)

```bash
# Construir e executar com docker-compose
docker-compose up --build

# Em modo detached (background)
docker-compose up -d
```

## 📱 Como Usar

### 1. **Acessar o Sistema**
- Abra seu navegador e acesse o frontend
- A interface principal será carregada automaticamente

### 2. **Cadastrar Lançamentos**
- Clique no botão "Novo Lançamento"
- Preencha os campos obrigatórios:
  - **Descrição**: Descrição do lançamento
  - **Valor**: Valor da transação
  - **Tipo**: Crédito ou Débito
  - **Data**: Data do lançamento
- Clique em "Salvar"

### 3. **Visualizar Dashboard**
- Use os filtros de mês e ano para visualizar períodos específicos
- O dashboard mostrará:
  - Total de créditos
  - Total de débitos
  - Saldo final

### 4. **Gerenciar Lançamentos**
- **Editar**: Clique no ícone de lápis na linha da transação
- **Excluir**: Clique no ícone de lixeira na linha da transação
- **Filtrar**: Use os seletores de mês e ano para organizar a visualização

## 🔗 URLs de Deploy

### 🌐 Produção
- **Frontend**: [https://conta-ai.vercel.app/](https://conta-ai.vercel.app/)
- **Backend API**: [https://contaai-backend.onrender.com](https://contaai-backend.onrender.com)

### 🧪 Desenvolvimento
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3001`

## 📚 Documentação da API

### Endpoints Principais

#### 🔍 Listar Transações
```http
GET /api/accounting-entries
```

#### ➕ Criar Transação
```http
POST /api/accounting-entries
Content-Type: application/json

{
  "description": "Pagamento fornecedor",
  "value": 1500.00,
  "type": "debit",
  "date": "2025-06-01"
}
```

#### ✏️ Atualizar Transação
```http
PUT /api/accounting-entries/:id
Content-Type: application/json

{
  "description": "Pagamento fornecedor atualizado",
  "value": 1750.00,
  "type": "debit",
  "date": "2025-06-01"
}
```

#### 🗑️ Deletar Transação
```http
DELETE /api/accounting-entries/:id
```

#### 🏥 Health Check
```http
GET /health
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "description": "Venda de produto",
  "value": 2500.00,
  "type": "credit",
  "date": "2025-06-01",
  "createdAt": "2025-06-08T10:30:00.000Z",
  "updatedAt": "2025-06-08T10:30:00.000Z"
}
```

## 🐛 Solução de Problemas

### ❌ Erro de CORS
Se encontrar erros de CORS, verifique:
1. Se o backend está rodando
2. Se a URL da API está correta no frontend
3. Se as configurações de CORS estão adequadas

### 🔌 Erro de Conexão
Para problemas de conexão:
1. Verifique se o banco de dados está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão com `npm run test:db`

### 🐌 Backend Lento (Render)
O Render pode "dormir" serviços gratuitos:
- A primeira requisição pode demorar 30-60 segundos
- Requisições subsequentes serão rápidas


</div>
