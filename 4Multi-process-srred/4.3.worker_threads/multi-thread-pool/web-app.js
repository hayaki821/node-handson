'use strict';

const http = require('http');
const cpuCount = require('os').cpus().length;
const ThreadPool = require('./thread-pool');

// cpuコアの数と同じサイズのスレッドプールを生成
const threadPool = new ThreadPool(cpuCount, `${__dirname}/fibonacci.js`);

http.createServer(async (req, res) => {
    const n = Number(req.url.substr(1));
    if (Number.isNaN(n)) return res.end();

    const result = await threadPool.executeInThread(n);
    // res.end()で計算結果を返す
    res.end(result.toString());
}).listen(3000);

// test実行方法
//npx loadtest -c 100 -t 10 http://localhost:3000/30
// [Mon Apr 12 2021 12:35:05 GMT+0900 (日本標準時)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
// [Mon Apr 12 2021 12:35:10 GMT+0900 (日本標準時)] INFO Requests: 374, requests per second: 75, mean latency: 1174.6 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Target URL:          http://localhost:3000/30
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Max time (s):        10
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Concurrency level:   100
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Agent:               none
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Completed requests:  769
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Total errors:        0
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Total time:          10.022722005 s
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Requests per second: 77
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Mean latency:        1216.5 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO Percentage of the requests served within a certain time
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO   50%      1257 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO   90%      1322 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO   95%      1347 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO   99%      1444 ms
// [Mon Apr 12 2021 12:35:15 GMT+0900 (日本標準時)] INFO  100%      1552 ms (longest request)