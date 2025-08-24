# Flora Dictionary

Um aplicativo para listar palavras em inglês, utilizando como base a **Free Dictionary API**.

## Descrição

O **Flora Dictionary** permite que usuários realizem login, consultem palavras no dicionário, vejam detalhes de cada palavra, guardem palavras visualizadas no histórico e gerenciem uma lista de palavras favoritas.

### Funcionalidades principais

- Login com usuário e senha
- Visualizar lista de palavras do dicionário
- Visualizar detalhes de uma palavra
- Guardar no histórico palavras já visualizadas
- Visualizar histórico de palavras consultadas
- Guardar palavras como favoritas
- Apagar palavras favoritas

---

## Tecnologias utilizadas

- **Linguagem**: TypeScript
- **Runtime**: Node.js
- **Framework**: NestJS
- **Banco de dados**: PostgreSQL
- **Cache**: Redis
- **Testes**: Jest
- **Containerização**: Docker & Docker Compose

---

## Como instalar e rodar o projeto

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto seguindo o .env.example localizado na raiz do projeto

3. **Subir containers com Docker Compose**

   ```bash
   docker compose up -d
   ```

4. **Rodar o script para inserir os registros no banco**

   ```bash
   npm run populate-db
   ```

5. **Rodar o projeto em modo desenvolvimento**

   ```bash
   npm run start:dev
   ```

6. **Importar a collection do postman localizada na raiz do projeto**

7. **Rodar testes**
   ```bash
   npm run test
   ```
