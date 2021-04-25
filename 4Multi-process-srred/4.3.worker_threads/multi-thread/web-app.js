'use strict';

const http = require('http');
const {Worker} = require('worker_threads');

http.createServer((req,res) => {
    const n = Number(req.url.substr(1));
    if (Number.isNaN(n)){
        // Number.isNaN(n)で数値かどうか判定し、数値でなかったら無視する
        return res.end();
    }
    // コンストラクタの第二引数で値を渡しつつサブスレッドを生成
    new Worker(`${__dirname}/fibonacci.js`,{workerData : n})
        // サブスレットから受け取った結果をレスポンスとして返す
        .on('message', result => res.end(result.toString()))
}).listen(3000)

// return
// [Mon Apr 12 2021 01:00:07 GMT+0900 (日本標準時)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
// [Mon Apr 12 2021 01:00:12 GMT+0900 (日本標準時)] INFO Requests: 106, requests per second: 20, mean latency: 3304.3 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Target URL:          http://localhost:3000/10
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Max time (s):        10
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Concurrency level:   100
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Agent:               none
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Completed requests:  305
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Total errors:        0
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Total time:          10.280428976 s
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Requests per second: 30
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Mean latency:        3039.8 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO Percentage of the requests served within a certain time
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO   50%      2997 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO   90%      4047 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO   95%      4567 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO   99%      5195 ms
// [Mon Apr 12 2021 01:00:17 GMT+0900 (日本標準時)] INFO  100%      5227 ms (longest request)

// 結果はリクエストのたびに新しいスレッドを生成してしまうことによるオーバーヘッドがマルチスレッド化を上回ってしまうためパフォーマンスが悪化する

