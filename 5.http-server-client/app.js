'use strict';
const express = require('express');
const app = express();

// /api/todos以下のパスに対するリクエストのハンドリングを
// ./routes/todosモジュールに委譲
app.use('/api/todos', require('./routes/todos'));

app.listen(3000);