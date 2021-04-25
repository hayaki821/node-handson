'use strict';

const fibonacci = require('../fibonacci');
// workerDataでメインスレッドから入力を受け取り
const {parentPort } = require('worker_threads');

// messageイベントの監視によりメインスレッドからのメッセージ受信を待機、
// 受信したらフィボナッチ数を計算し計算結果をメインスレッドに送信
parentPort.on('message', n => parentPort.postMessage(fibonacci(n)));