const { EventEmitter } = require("events");

function createFizzBuzzEventEmitter(until){
    const eventEmitter = new EventEmitter();
    // 動機関数で実行するとうまく行かない、処理が非同期だから最初に実行されてしまう箇所が出てくる
    //_emitFizzBuzz(eventEmitter,until);

    // 非同期でうまくいく
    process.nextTick(() => _emitFizzBuzz(eventEmitter,until));
    return eventEmitter;
}

async function _emitFizzBuzz(eventEmitter,until){
    // start eventの発行
    eventEmitter.emit('start');
    let count = 1;
    while (count <= until){
        await new Promise(resolve => setTimeout(resolve,100));
        if (count % 15 === 0) {
            eventEmitter.emit('FizzBuzz',count);
        } else if (count % 3 == 0 ){
            eventEmitter.emit('Fizz',count);
        } else if (count % 5 === 0) {
            eventEmitter.emit('Buzz', count);
        }
        count+=1;
    }
    eventEmitter.emit('end');
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
createFizzBuzzEventEmitter(40)
    .on('start',startListener)
    .on('Fizz',fizzListener)
    .once('Buzz',buzzListener)//onceで登録 １度きり
    .on('FizzBuzz',fizzBuzzListener)
    .on('end',endListener)