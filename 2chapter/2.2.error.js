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
// sucsess
parseJSONAsync('{"msg":"sucsess"}',(err,result) =>{
    console.log('parse',err,result);
})

// error
parseJSONAsync('不正json',(err,result) =>{
    console.log('parse',err,result);
})

