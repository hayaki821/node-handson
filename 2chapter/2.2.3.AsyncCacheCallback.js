function parseJSONAsync(json,callback){
    // setTimeoutを使うときは中にtry...catch
    setTimeout(()=>{
        try {
            callback(null,JSON.parse(json));
        } catch (error) {
            callback(error);
        }
    },1000);
}


const cache = {};

function parseJSONAsyncWithCache(json, callback){
    const cached = cache[json];
    if (cached) {
        //Node.jsで使える
        process.nextTick(() => callback(cached.err, cached.result));

        //ブラウザ環境で使う場合
        //1.queueMicrotask(() => callback(cached.err, cached.result))
        //2.Promise.resolve().then(() => callback(cached.err, cached.result))
        return
    }

    parseJSONAsync(json, (err, result) => {
        cache[json] = {err, result};
        callback(err, result);
    })
}

//1回目の実行
parseJSONAsyncWithCache(
    '{"msg":"sucsess"}',
    (err,result) => {
        console.log('1回目の結果',err,result);

        //callback中で2回目の実行
        parseJSONAsyncWithCache(
            '{"msg":"sucsess"}',
            (err,result) =>{
                console.log('2回目の結果',err,result);
            }
        )
        console.log('2回目の呼び出し完了');
    }
)
console.log('1回目の呼び出し完了');