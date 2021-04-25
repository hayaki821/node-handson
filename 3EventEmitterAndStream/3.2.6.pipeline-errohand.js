const fs = require('fs');
const { Stream } = require('node:stream');

// error handling
// pipeはエラーを伝搬しない
// pipeの前にエラー処理を書いておく
fs.createReadStream('no.txt')
    .on('error',err=>console.log('error Event',err.message))
    .pipe(fs.createWriteStream('dest.txt'))
    .on('error',err=>console.log('error Event',err.message));
// return error Event ENOENT: no such file or directory, open 'no.txt'

Stream.pipeline(
    // pipe()したい2つ以上のストリームを連結
    fs.createReadStream('no.txt'),
    fs.createWriteStream('dest.txt'),
    // コールバック
    // どこかでエラーが発生したらそれを引数にコールバックが実行
    // エラーがなくても引数無しで実行される
    err => err
        ? console.log('error', err.message)
        : console.log('正常終了')
);
// 実行後にストリームは自動で削除