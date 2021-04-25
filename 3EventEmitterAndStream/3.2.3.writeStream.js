const Stream = require('stream');

class DelayLogStream extends Stream.Writable{
    constructor(options){
        // objectMode:trueを指定するとオブジェクトをデータとして渡せる
        super({objectMode:true,...options});
    }
    //各クラスを継承し必要なメソッドを実装しなければならない
    // _readの実装は必須
    _write(chunk,encoding,callback){
        console.log(this.write);
        console.log('write');
        // return [Function (anonymous)]
        const {message,delay} = chunk;
        // delay時間遅れてmessageを出力
        setTimeout(()=>{
            console.log(message);
            callback();
        },delay);
    }
}

const delayLogStream =  new DelayLogStream();
delayLogStream.write({message:'HI',delay:0});
//return HI (すぐ実行される)
delayLogStream.write({message:'tanks',delay:1000});
// return tanks (1秒後に実行)
module.exports = DelayLogStream;