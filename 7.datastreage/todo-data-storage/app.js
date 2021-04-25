'use strict';
const express = require('express');
const {v4: uuidv4} = require('uuid');
// 実行されたスクリプトの名前に応じてデータストレージを使い分ける
// npm startで実行した場合process.env.npm_lifecycle_event=startになる
const dataStorage = require(`./${process.env.npm_lifecycle_event}`)

const app = express();

app.use(express.json());

// ToDo一覧取得
app.get('/api/todos', (req, res,next) => {
    if (!req.query.completed) {
        return dataStorage.fetchAll().then(todos => res.json(todos), next);
    }
    // compuletクエリパラメータを指定された場合はToDoをフィルタリング
    const completed = req.query.completed === 'true';
    dataStorage.fetchByCompleted(completed).then(todos => res.json(todos), next)
});


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
    const todo = {id: uuidv4() /* UUIDの生成*/ , title, completed: false };
    dataStorage.create(todo).then(() => res.status(201).json(todo), next);
});

// Completedの解除、設定の共通処理
function completedHandler(completed) {
    return (req, res, next) => 
        dataStorage.update(req.params.id, {completed})
            .then(todo => {
                if (todo) {
                    return res.json(todo);
                }
                const err = new Error('todo not found');
                err.statusCode = 404;
                next(err);
            }, next)
}

// ToDoのCompletedの設定、解除
app.route('/api/todos/:id(\\d+)/completed')
    .put(completedHandler(true))
    .delete(completedHandler(false))

app.delete('/api/todos/:id(\\d+)', (req, res, next) => 
    dataStorage.remove(req.params.id).then(id => {
        if (id !== null) {
            return res.status(204).end();
        }
    const err = new Error('ToDo not found');
    err.statusCode = 404;
    next(err);
    }, next);
)


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
