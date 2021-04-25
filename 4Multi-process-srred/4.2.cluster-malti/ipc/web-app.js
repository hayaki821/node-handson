'use strict';

const http = require('http');
const fibonacci = require('../fibonacci');
const pid = process.pid;

// IPCでメッセージを受信して指定されたポート番号でWebサーバーを起動
process.on('message', port => {
    console.log(pid, `ポート${port}でwebサーバーを起動`);
    http.createServer((req,res) => {
        const n = Number(req.url.substr(1));
    if (Number.isNaN(n)){
        // Number.isNaN(n)で数値かどうか判定し、数値でなかったら無視する
        return res.end();
    }
    const response = fibonacci(n);
    // 結果をIPCで送信
    process.send({pid, response});
    // res.end()で計算結果を返す
    res.end(response.toString());
    }).listen(port)
})