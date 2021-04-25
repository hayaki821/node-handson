const Stream = require('stream');

class LineTransformStream extends Stream.Transform{
    // 上流から受け取ったデータのうち。下流に流していない分を保持するフィールド
    remaining = '';
    constructor(options){
        // push()にオブジェクトを渡せるようにする
        super({readableObjectMode:true,...options});
    }

    _transform(chunk,encoding,callback){
        console.log("_trandform()");
        const lines = (chunk + this.remaining).split(/\n/);
        //console.log(lines);
        this.remaining = lines.pop();
        
        for (const line of lines){
            // ここではpushの戻り値は無視
            this.push({message:line,delay:line.length * 100});
        }
        callback();
    }

    // endのときに呼ばれる？
    _flush(callback) {
        console.log('_flush()');
        // 残っているデータを流し切る
        this.push({
            message: this.remaining,
            delay:this.remaining.length * 100
        });
        callback();
    }
}

const lineTransformStream =  new LineTransformStream();
lineTransformStream.on('readable', ()=>{
    let chunk;
    while((chunk = lineTransformStream.read()) !==null ){
        console.log(chunk);
    }
})

lineTransformStream.write('foo\nbar\njaa');
// return { message: 'foo', delay: 300 }
// { message: 'bar', delay: 300 }
lineTransformStream.write('baz');
// return true
lineTransformStream.end();
module.exports = LineTransformStream;