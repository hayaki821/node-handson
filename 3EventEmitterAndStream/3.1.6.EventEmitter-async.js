const { EventEmitter } = require("events");
const eventAEmitter = new EventEmitter();

// async いてラブルの生成
const eventAIterable = EventEmitter.on(eventAEmitter,'eventA');
const eventBIterable = EventEmitter.on(eventAEmitter,'eventB');

console.log(eventAIterable);
// return {
//     next: [Function: next],
//     return: [Function: return],
//     throw: [Function: throw],
//     [Symbol(Symbol.asyncIterator)]: [Function: [Symbol.asyncIterator]]
//   }

// リスナが一つ登録されていることを確認
console.log(eventAEmitter.listeners('eventA'));
// return [ [Function: eventHandler] ]

// eventAEmitter がemit('eventA')されたときに発行
(async () => {
    for await(const a of eventAIterable){
        // aの値はeventAをemit()したときの引数の配列
        if (a[0] === 'end'){
            break
        }
        console.log(a)
    }
})()

console.log(eventAEmitter.emit('eventA','Hello'));
// return 
// true
// [ 'Hello' ]
console.log(eventAEmitter.emit('eventB','Hello'));
// return true
console.log(eventAEmitter.emit('eventC','Hello'));
// return false

console.log(eventAEmitter.emit('eventA','Hello','World'));
// return 
// true
// [ 'Hello' ,'World']
console.log(eventAEmitter.emit('eventA','end'));
// return 
// true

// ループを抜けるとリスナの登録が解除される
console.log(eventAEmitter.listeners('eventA'));
// return [ [Function: eventHandler] ]