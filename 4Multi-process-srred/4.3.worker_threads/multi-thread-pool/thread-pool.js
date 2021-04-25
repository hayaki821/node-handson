'use strict';

const {Worker} = require('worker_threads');

module.exports = class ThreadPool {
    // 空きスレッド、キューを初期化
    availableWorkers = [];
    queue = [];
    constructor(size, filePath, options) {
        // 引数で指定されたとおりにスレッドを生成してプール
        for (let i = 0; i < size; i++){
            this.availableWorkers.push(new Worker(filePath, options))
        }
    }

    // 外部からの要求処理を受け取るメソッド
    executeInThread(arg) {
        return new Promise(resolve => {
            const request = {resolve, arg};
            // 空きスレッドがあればリクエスト処理、なければキューに積む
            const worker = this.availableWorkers.pop();
            worker ? this._process(worker, request) : this.queue.push(request);
        })
    }

    // 実際にスレッドで処理を実行するprivateメソッド
    _process(worker, {resolve, arg}) {
        worker.once('message', result => {
            // リクエスト元に結果を返す
            resolve(result);

            // キューに積まれたリクエストが有れば処理し、なければ空きスレッドに戻す
            const request = this.queue.shift();
            request ? this._process(worker, request)
                    : this.availableWorkers.push(worker);
        })
        worker.postMessage(arg);
    }
}