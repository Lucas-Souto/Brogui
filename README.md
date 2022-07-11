# Brogui
Brogui é uma ferramenta para facilitar a criação do seu site de blogs.

## Preparando terreno
Para começar, devemos criar as tabelas e definir em que banco de dados estamos entrando:
```
const brogui = require("brogui");
const connectData = { host: 'localhost', user: 'root', database: 'my_db' };

brogui.init(connectData); // Cria as tabelas, se não existem, e define a conecção.
```
## Users
```
username VARCHAR(32),
name VARCHAR(32) NOT NULL,
email VARCHAR(150),
role VARCHAR(16) NOT NULL DEFAULT "user",
photo VARCHAR(255),
about VARCHAR(250),
password VARCHAR(255) NOT NULL,
PRIMARY KEY (username, email)
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

## posts
```
id VARCHAR(36) PRIMARY KEY,
link VARCHAR(255) NOT NULL,
author VARCHAR(32) NOT NULL,
title VARCHAR(64) NOT NULL,
content LONGTEXT NOT NULL,
cover VARCHAR(255),
date DATETIME NOT NULL,
isDraft BOOLEAN NOT NULL DEFAULT 1
```
### -insert
```
// Insere uma publicação nova.
// Parâmetros: autor, título, conteúdo, capa (null), é um rascunho (true), callback

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

### -update
```
// Atualiza o post.
// Se uma chave não for preenchida, o valor dela não mudará.
// Parâmetros: link, novos dados: { chave: valor }, callback
// Chaves: title, content, cover, isDraft

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
id VARCHAR(36) PRIMARY KEY,
author VARCHAR(32) NOT NULL,
content LONGTEXT NOT NULL,
date DATETIME NOT NULL,
postId/mainId VARCHAR(36) NOT NULL
```

### -insert
```
// Insere um comentário novo.
// Parâmetros: autor, conteúdo, id do post (null), id do comentário (null), callback
// Se o [id do post] for diferente de null, o comentário será feito no post. Se o [id do comentário] for diferente de null, o comentário será feito dentro de outro comentário (um comentário filho não pode ter outros filhos).
// Parâmetros: autor, conteúdo, id do post/comentário

brogui.comments.insert('pessoinha', 'olá', 'id');
```

### -list
```
// Retorna uma lista com os comentários de um post.
// Cada comentário terá uma propriedade 'subcomments' que terá um json com os comentários filhos.
// Parâmetros: id do post, callback

brogui.comments.list('id', (error, rows) => console.log(rows));
```

### -delete
```
// Deleta um comentário e os filhos dele.
// Parâmetros: id do comentário, é o comentário pai (true), callback

brogui.comments.delete('id', false);
```