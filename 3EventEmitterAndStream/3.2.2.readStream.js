const Stream = require('stream');

class HelloReadableStream extends Stream.Readable{
    constructor(options){
        super(options);
        this.languages = ['js','python','java','c#'];
    }
    //各クラスを継承し必要なメソッドを実装しなければならない
    // _readの実装は必須
    _read(size){
        console.log(this.push);
        console.log('_read');
        let language;

        while(language = this.languages.shift()) {
            // push でデータを流す
            // ただしpushがfalseを返したらそれ以上返さない
            //this.push(chunk)として内部で管理されているキューにプッシュ
            if (!this.push(`Hello,${language}!\n`)){
                console.log('読み込み中断');
                return;
            }
        }
        // 最後にnullを流してストリームの終了を通知
        console.log('読み込み完了');
        this.push(null)
    }
}

const helloReadableStream =  new HelloReadableStream();
helloReadableStream.on('readable',()=>{
    console.log('readable');
    let chunk;
    while((chunk = helloReadableStream.read()) !== null){
        console.log(`chunk:${chunk.toString()}`);
    }
})
.on('end',()=>console.log('end'));

// 先に_readの同期部分が実行され次にreadableが実行
// helloReadableStream._read();も同じ結果
helloReadableStream.read();
helloReadableStream.emit('readable');
// return
// [Function (anonymous)]
// 読み込み完了
// readable
// chunk:Hello,js!
// Hello,python!
// Hello,java!
// Hello,c#!

// end

module.exports = HelloReadableStream;
