// マルチプロセスで動かす

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
}

// return
// サブプロセス 60715
// サブプロセス 60716
// サブプロセス 60717
// サブプロセス 60718


// test実行方法
//npx loadtest -c 100 -t 10 http://localhost:3000/10
// return 
// [Sun Apr 11 2021 18:41:43 GMT+0900 (日本標準時)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
// [Sun Apr 11 2021 18:41:48 GMT+0900 (日本標準時)] INFO Requests: 4293, requests per second: 861, mean latency: 115.6 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Target URL:          http://localhost:3000/10
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Max time (s):        10
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Concurrency level:   100
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Agent:               none
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Completed requests:  8925 
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Total errors:        0
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Total time:          10.000735635 s
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Requests per second: 892
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Mean latency:        110.9 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO Percentage of the requests served within a certain time
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO   50%      109 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO   90%      126 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO   95%      131 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO   99%      172 ms
// [Sun Apr 11 2021 18:41:53 GMT+0900 (日本標準時)] INFO  100%      200 ms (longest request)