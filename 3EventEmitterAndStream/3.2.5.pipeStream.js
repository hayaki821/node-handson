const HelloReadableStream = require('./3.2.2.readStream');
const DelayLogStream = require('./3.2.3.writeStream');
const LineTransformStream = require('./3.2.4.duplexStream');


// new HelloReadableStream()
//     .pipe(new LineTransformStream())
//     .pipe(new DelayLogStream())
//     .on('finish',() => console.log('完了'));

// return _read
// 読み込み完了
// _trandform()
// write
// _trandform()
// _trandform()
// _trandform()
// _flush()
// HI
// write
// Hello,js!
// write
// tanks
// Hello,python!
// write
// Hello,java!
// write
// Hello,c#!
// write

// 完了

// highWaterMarkでストリームが保持できるサイズを指定する
new HelloReadableStream({highWaterMark: 0})
    .pipe(new LineTransformStream({
        // 2重ストリームのhighWaterMarkはwriteとreadそれぞれ指定必要
        writablehighWaterMark: 0,
        readablehighWaterMark: 0
    }))
    .pipe(new DelayLogStream({highWaterMark: 0}))
    .on('finish',() => console.log('完了'));

// returm _read
// 読み込み中断
// _trandform()
// _read
// 読み込み完了
// _flush()
// HI
// write
// Hello,js!
// write
// tanks
// Hello,python!
// write
// Hello,java!
// write
// Hello,c#!
// write

// 完了