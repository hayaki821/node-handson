'use strict';

const http = require('http');
const fibonacci = require('./fibonacci');

// サーバーオブジェクトの生成とリクエストハンドラの設定
http.createServer((req,res) => {
    // http://localhost:3000/10へのリクエストではreq.urlは'/10'になるから
    // そこから1文字目を取り除きnを取得
    const n = Number(req.url.substr(1));
    if (Number.isNaN(n)){
        // Number.isNaN(n)で数値かどうか判定し、数値でなかったら無視する
        return res.end();
    }
    const result = fibonacci(n);
    // res.end()で計算結果を返す
    res.end(result.toString());
}).listen(3000)


// test実行方法
//npx loadtest -c 100 -t 10 http://localhost:3000/10
//return
// [Sun Apr 11 2021 18:28:41 GMT+0900 (日本標準時)] INFO Requests: 0, requests per second: 0, mean latency: 0 ms
// [Sun Apr 11 2021 18:28:46 GMT+0900 (日本標準時)] INFO Requests: 5946, requests per second: 1192, mean latency: 83.7 ms
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Target URL:          http://localhost:3000/10
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Max time (s):        10
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Concurrency level:   100
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Agent:               none
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Completed requests:  12821 // 処理されたリクエスト数
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Total errors:        0
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Total time:          10.001357913 s
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Requests per second: 1282
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Mean latency:        77.3 ms // 77.3 msのレスポンスの平均所要時間
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO Percentage of the requests served within a certain time
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO   50%      73 ms
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO   90%      95 ms
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO   95%      103 ms
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO   99%      115 ms
// [Sun Apr 11 2021 18:28:51 GMT+0900 (日本標準時)] INFO  100%      130 ms (longest request)