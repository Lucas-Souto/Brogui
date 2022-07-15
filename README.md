# Brogui
Brogui é uma ferramenta para facilitar a criação do seu site de blogs.

## Preparando terreno
1º passo: Instale o pacote:
```
> npm install brogui
```
2º passo: Para começar, devemos criar as tabelas e definir em que banco de dados estamos entrando:
```
const brogui = require("brogui");
const connectData = { host: 'localhost', user: 'root', database: 'my_db' };

brogui.init(connectData); // Cria as tabelas, se não existem, e define a conexão.
```
## Usuários
```
/*
username VARCHAR(32),
name VARCHAR(32) NOT NULL,
email VARCHAR(150),
role VARCHAR(16) NOT NULL DEFAULT "user",
photo VARCHAR(255),
about VARCHAR(250),
password VARCHAR(255) NOT NULL,
PRIMARY KEY (username, email)
*/
```
### -insert
```
// Insere um usuário novo.
// Parâmetros: usuário (@pessoinha), email, senha, cargo ('user'), callback

brogui.users.insert('pessoinha', 'pessoinha123@gmail.com', 'senha_secreta');
```

### -get
```
// Retorna o usuário que tem o username ou o email pedido.
// Parâmetros: usuário/email, procurar por email (false), callback

brogui.users.get('pessoinha', false, (error, rows) => console.log("Username:", rows));
```

### -login
```
// Retorna o usuário que tem o username ou o email pedido caso a senha esteja correta.
// Parâmetros: usuário/email, senha, logar por email (false), callback

brogui.users.login('pessoinha', 'senha_secreta', false, (error, success, user) => console.log(success, user));
```

### -update
```
// Atualiza o usuário que tem o username ou email pedido.
// Se uma chave não for preenchida, o valor dela não mudará.
// Parâmetros: usuário/email, procurar por email (false), novos dados: { chave: valor }, callback
// Chaves: username, name, email, role, photo, about, password

brogui.users.update('pessoinha123@gmail.com', true, { about: 'Nova descrição.' });
```

### -delete
```
// Deleta o usuário que tem o username ou o email pedido.
// Parâmetros: usuário/email, procurar por email (false), callback

brogui.users.delete('pessoinha');
```

## Publicações
```
/*
id VARCHAR(36) PRIMARY KEY,
link VARCHAR(255) NOT NULL,
author VARCHAR(32) NOT NULL,
title VARCHAR(64) NOT NULL,
content LONGTEXT NOT NULL,
cover VARCHAR(255),
tags TEXT,
date DATETIME NOT NULL,
isDraft BOOLEAN NOT NULL DEFAULT 1
*/
```
### -insert
```
// Insere uma publicação nova.
// Parâmetros: autor, título, conteúdo, capa (null), tags (null), é um rascunho (true), callback

brogui.posts.insert('pessoinha', 'Postagem legal', 'Bem vindo ao meu blog!');
```

### -get
```
// Retorna um post pelo seu link ([autor]/[link]).
// Parâmetros: link, callback

brogui.posts.get('pessoinha/postagem_legal', (error, rows) => console.log(rows));
```

### -getId
```
// Retorna o id de um post pelo seu link ([autor]/[link]).
// Parâmetros: link, callback

brogui.posts.getId('pessoinha/postagem_legal', (error, rows) => console.log(rows));
```

### -search
```
// Retorna uma lista de 'X' publicações desde data 'Y' que tenham um termo 'Z' no seu título.
// Parâmetros: termo, data mínima (0), limite (10), callback

brogui.posts.search('legal', 0, 10, (error, rows) => console.log(rows));
```

### -searchWithTag
```
// Retorna uma lista de 'X' publicações desde data 'Y' que tenham um termo 'Z' no seu título ou tenham as tags 'W'.
// Parâmetros: termo, tags, data mínima (0), limite (10), callback

brogui.posts.search('legal', 'tecnologia', 0, 10, (error, rows) => console.log(rows));
```

### -list
```
// Retorna uma lista de 'X' publicações desde data 'Y'.
// Parâmetros: data mínima (0), limite (10), callback

brogui.posts.list(0, 10, (error, rows) => console.log(rows));
```

### -latest
```
// Retorna as últimas 'X' publicações até a data 'Y'.
// Parâmetros: limite (10), data máxima (0 = data atual), callback

brogui.posts.latest(10, 0, (error, rows) => console.log(rows));
```

### -latestByTag
```
// Retorna as últimas 'X' publicações com as tags 'Y' até a data 'Z'.
// Parâmetros: tags, limite (10), data máxima (0 = data atual), callback

brogui.posts.latestByTag('tecnologia', 10, 0, (error, rows) => console.log(rows));
```

### -byAuthor
```
// Retorna 'X' publicações de um autor 'Y' até a data 'Z'.
// Parâmetros: autor, limite (10), data máxima (0 = data atual), callback

brogui.posts.byAuthor('pessoinha', 10, 0, (error, rows) => console.log(rows));
```

### -update
```
// Atualiza o post.
// Se uma chave não for preenchida, o valor dela não mudará.
// Parâmetros: link, novos dados: { chave: valor }, callback
// Chaves: title, link, content, cover, tags, isDraft

brogui.posts.update('pessoinha/postagem_legal', { isDraft: false });
```

### -delete
```
// Deleta o post.
// Parâmetros: link, callback

brogui.posts.delete('pessoinha/postagem_legal');
```

## Comentários
```
/*
id VARCHAR(36) PRIMARY KEY,
author VARCHAR(32) NOT NULL,
content LONGTEXT NOT NULL,
date DATETIME NOT NULL,
postId VARCHAR(36) NOT NULL,
mainId VARCHAR(36) -> Comentário pai
*/
```

### -insert
```
// Insere um comentário novo.
// Parâmetros: autor, conteúdo, id do post, id do comentário pai (null), callback

brogui.comments.insert('pessoinha', 'olá', 'id');
```

### -list
```
// Retorna uma lista com os comentários de um post/comentário.
// Parâmetros: id do post, id do comentário pai (null), data mínima (0), limite (16), callback

brogui.comments.list('id', null, 0, 16, (error, rows) => console.log(rows));
```

### -delete
```
// Deleta um comentário e os filhos dele.
// Parâmetros: id do comentário, callback

brogui.comments.delete('id');
```

## Database
Caso queira fazer funções novas específicas para o seu caso, a classe Database possui o básico:
### Jeito 1 (iniciando tabelas e depois executando a função):
```
brogui.init({ host: 'localhost', user: 'root', database: 'my_db' }, () =>
{
    brogui.Database.run('SELECT * FROM posts WHERE author = ?', ['pessoinha'], callback = (error, results, fields) => console.log(error, results, fields));
});
```

### Jeito 2 (passando a conexão e depois executando a função):
```
brogui.Database.connectData = { host: 'localhost', user: 'root', database: 'my_db' };

brogui.Database.run('SELECT * FROM posts WHERE author = ?', ['pessoinha'], callback = (error, results, fields) => console.log(error, results, fields));
```

## dateToMysql
```
const date = dateToMysql(); // Retorna a data atual no padrão DATETIME UTC.
const otherDate = dateToMysql(new Date(1995, 11, 17, 3, 24, 0)); // Retorna a data no padrão DATETIME (1995-12-17 05:24:00) UTC.
```