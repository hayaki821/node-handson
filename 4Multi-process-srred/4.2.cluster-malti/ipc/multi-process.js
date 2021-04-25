'use strict';

const {fork, setupMaster} = require('cluster');

console.log('メインプロセス', process.pid);
// return メインプロセス 60714

// サブプロセスが実行するファイルの指定
//__dirnameで絶対パスを指定
setupMaster({exec:`${__dirname}/web-app`});

// CPUコアの数だけプロセスをフォークする
const cpuCount = require('os').cpus().length;
for (let i = 0; i < cpuCount; i++){
    const sub = fork();
    console.log('サブプロセス', sub.process.pid);
    // IPCでサブプロセスにポート番号を送信
    sub.send(3000);
    // IPCで受信したメッセージをハンドリング
    sub.on('message', ({pid, response}) => 
        console.log(process.pid, `${pid}が${response}を返します`)
    );
}


//return
// メインプロセス 61111
// サブプロセス 61112
// サブプロセス 61113
// サブプロセス 61114
// サブプロセス 61115
// 61112 ポート3000でwebサーバーを起動
// 61113 ポート3000でwebサーバーを起動
// 61114 ポート3000でwebサーバーを起動
// 61115 ポート3000でwebサーバーを起動
// 61111 61112が55を返します
// 61111 61114が55を返します
// 61111 61115が55を返します
// 61111 61115が55を返します