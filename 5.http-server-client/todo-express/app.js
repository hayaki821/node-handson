'use strict';
const express = require('express');

let todos = [
    {id: 1, title: 'name', completed:false},
    {id: 2, title: '下描き', completed:true}
];

const app = express();

app.use(express.json());

// ToDo一覧取得
app.get('/api/todos', (req, res) => {
    if (!req.query.completed) {
        return res.json(todos);
    }
    console.log("res");
    // compuletクエリパラメータを指定された場合はToDoをフィルタリング
    const completed = req.query.completed === 'true';
    res.json(todos.filter(todo => todo.completed === completed));
});
// http://localhost:3000/api/todos?completed=true
// [{"id":2,"title":"下描き","completed":true}]

// TODOのIDの値を管理するための変数
let id = 2;

// TODOの新規登録
app.post('/api/todos', (req, res, next) => {
    const {title} = req.body;
    if (typeof title !=='string' || !title){
        // title がリクエストに含まれない場合はステータスコード400(Bad Request)
        const err = new Error('title is required');
        err.statusCode = 400;
        return next(err);
    }
    // todo の作成
    const todo = {id: id + 1, title, completed: false };
    todos.push(todo);
    // ステータスコード201(Created)で結果を返す
    res.status(201).json(todo);
});

app.use('/api/todos/:id(\\d+)', (req, res, next) => {
    const targetId = Number(req.param.id);
    const todo = todos.find(todo => todo.id === targetId);
    if (!todo){
        const err = new Error('todo not fond');
        err.statusCode = 404;
        return next(err);
    }
    req.todo = todo;
    next();
})

// ToDoのCompletedの設定、解除
app.route('/api/todos/:id(\\d+)/completed')
    .put((req, res) => {
        req.todo.completed = true;
        res.json(req.todo);
    })
    .delete((req, res) => {
        req.todo.completed = false;
        res.json(req.todo);
    })

app.delete('/api/todos/:id(\\d+)', (req, res) => {
    todos = todos.filter(todo => todo !== req.todo);
    // endによってからのレスポンスを返す、レスポンスが空の場合そうする
    res.status(204).end();
})


// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).json({ error: err.message });
})

app.listen(3000);

// fetch API をポリフィルする
// const isomorphic_fetch = require('isomorphic-fetch');
// console.log(isomorphic_fetch);
// return [Function (anonymous)]
// fetch();

// next.jsによるルーティングのためこれ以降を追記
const next = require('next');
// 本番環境かどうかを判定
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

nextApp.prepare().then(
    // pagesディレクトリ内の各Reactコンポーネントに対するサーバーサイドルーティング
    () => app.get('*', nextApp.getRequestHandler()),
    err => {
        console.error(err);
        process.exit(1);
    }
)
