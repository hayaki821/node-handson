const events= require("events");

class FizzBuzzEventEmitter extends events.EventEmitter {
    async start(until){
        this.emit('start');
        let count = 1;
        while (count <= until){
            if (count % 15 === 0) {
                this.emit('FizzBuzz',count);
            } else if (count % 3 == 0 ){
                this.emit('Fizz',count);
            } else if (count % 5 === 0) {
                this.emit('Buzz', count);
            }
            count+=1;
            await new Promise(resolve => setTimeout(resolve,100));
        }
        this.emit('end');
    }
}

function startListener(){
    console.log('start');
}
function fizzListener(count){
    console.log('fizz',count);
}
function buzzListener(count){
    console.log('buzz',count);
}
function fizzBuzzListener(count){
    console.log('fizzBuzz',count);
}
function endListener(){
    console.log('end');
    // thisはEventEmitterインスタンス
    this
    // すべてのイベントからリスナを削除する
        .off('start',startListener)// offでイベントリスナを削除する
        .off('Fizz',fizzListener)
        .off('Buzz',buzzListener)
        .off('FizzBuzz',fizzBuzzListener)
        .off('end',endListener)
}

// イベントリスナを登録する
// onで登録できる
// onceで一度きりのイベントを登録できる
new FizzBuzzEventEmitter()
    .on('start',startListener)
    .on('Fizz',fizzListener)
    .once('Buzz',buzzListener)//onceで登録 １度きり
    .on('FizzBuzz',fizzBuzzListener)
    .on('end',endListener)
    .start(20);