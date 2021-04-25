'use strict';

const fibonacci = require('../fibonacci');
// workerDataでメインスレッドから入力を受け取り
const {workerData, parentPort } = require('worker_threads');

// フィボナッチ数の計算結果をメインスレッドに送信
parentPort.postMessage(fibonacci(workerData));