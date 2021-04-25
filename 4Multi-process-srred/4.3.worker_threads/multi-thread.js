// マルチスレッドで動かす

'use strict';

const {Worker, threadId} = require('worker_threads');

console.log('メインスレッド', threadId);
// return メインスレッド 0

// CPUコアの数だけスレッドを起動
const cpuCount = require('os').cpus().length;
for (let i = 0; i < cpuCount; i++){
    // サブスレッドで実行するファイルのパスを指定してWorkerをnew
    // worker_threadが生成したスレッド同士はポートを共有できない
    const worker = new Worker(`${__dirname}/web-app.js`);
    console.log('サブスレッド', worker.threadId);
}