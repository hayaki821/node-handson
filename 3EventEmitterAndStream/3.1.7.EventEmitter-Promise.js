const { EventEmitter } = require("events");
const eventBEmitter = new EventEmitter();

// async いてラブルの生成
const eventBPromise = EventEmitter.once(eventBEmitter,'eventB');

console.log(eventBPromise);
// return Promise { <pending> }

// これはできない
//console.log(eventBPromise.listeners('eventB'));
// // return [ [Function: eventHandler] ]

eventBPromise.then(arg => console.log('eventB',arg));

console.log(eventBEmitter.emit('eventB','Hello','World'));
// return 
// true
// eventB [ 'Hello', 'World' ]
console.log(eventBEmitter.emit('eventB','Hello'));
// return false

