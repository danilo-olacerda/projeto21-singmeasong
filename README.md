# <p align = "center"> Projeto Sing Me a Song </p>

<p align="center">
   <img src="https://images.emojiterra.com/google/noto-emoji/v2.034/share/1f3a4.jpg"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-danilo-olacerda?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/danilo-olacerda/projeto21-singmeasong?color=4dae71&style=flat-square" />
</p>


##  Descrição

O objetivo desse projeto é a impletamentação de testes e2e e testes unitarios.

***

## Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript
- PostgresSQL
- Prisma
- Jest
- Supertest
- Cypress

***

## Rotas

```yml
POST /recommendations
    - Rota para cadastrar uma nova recomendação
    - headers: {}
    - body:{
        "name": "Música que eu gosto",
        "youtubeLink": "https://youtu.be/4Ukh9aQBzWc"
    }
```
    
```yml 
GET /recomendations
    - Rota para listar todas as ultimas 10 recomendações
    - headers: {}
    - body: {}
```
    
```yml 
GET /recomendations/random
    - Rota para receber uma recomendação aleatória (quanto maior o score maior a chance)
    - headers: {}
    - body: {}
```

```yml
GET /recomendations/top/:amout
    - Rota para listar as recomenção com maior score com quantidade (:amout) limitada
    - headers: {}
    - body: {}
``` 

```yml
GET /recomendations/:id
    - Rota para receber uma recomendação com id especifico
    - headers: {}
    - body: {}
```

```yml
POST /recomendations/:id/upvote
    - Rota para adicionar 1 de score a recomedação (:id)
    - headers: {}
    - body: {}
```

```yml
POST /recomendations/:id/downvote
    - Rota para remover 1 de score da recomedação (:id)
    - headers: {}
    - body: {}
```
***

## 🏁 Rodando a aplicação

Este projeto foi inicializado com o [Create React App](https://github.com/facebook/create-react-app), então certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/luanalessa/projeto-backend.git
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```

Faço o mesmo para a pasta do back-end

Não esqueça de repetir os passos acima com o [repositório](https://github.com/luanalessa/projeto-frontend.git) que contem a interface da aplicação, para testar o projeto por completo.