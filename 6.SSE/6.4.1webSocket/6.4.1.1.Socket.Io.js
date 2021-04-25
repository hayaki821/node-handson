'use strict';
const http = require('http');
const Server = require('socket.io');

const server = http.createServer((req, res) => {
    // 通常のHTTPリクエストのハンドリング
}).listen(3000);


// Serverインスタンスの作成
//オプションを指定する場合（ここでは接続を許可するオリジンを指定）
const io = Server(server/*,{origins: allowed.origin.com}*/);

// 新しいクライアントからの接続に伴うconnectionイベント
io.on('connection', socket => {
    // 任意のイベント名でクライアントにデータを送信
    socket.emit('greeting', 'Hello');
    // 任意のイベント名でクライアントからデータを受信
    socket.on('registerName', name => {
        // 接続している全クライアントに任意のイベント名でデータを送信
        io.emit('notifyNewComer', `${name} joined`);
        // またはこのSocketインスタンスを介して接続しているクライアント以外の
        // 全クライアントにデータを送信
        //socket.broadcast.emit('notifyNewComer', `${name} joined`);
    });
});
// socketが接続している個別のクライアントとの通信
// ioがサーバーと接続中の全ユーザーと通信

// namespaceを使ってその中のクライアントとのやり取り
 io.of('/namespace1').on('connection', socket => {
     // この名前空間に接続するクライアント似データを送信
     io.of('/namespace1').emit('someEvent', 'foo');
 })
 // 名前空間の中にさらにルームと呼ばれるコミュニケーションのスコープを定義
io.on('connection', socket => {
    // socketをルームAに入れる
    socket.join('roomA');
    // roomAに存在するsocketのみデータを送信する
    io.to('roomA').emit('someEvent', 'foo');
    // socketをルームAから出す
    socket.leave('roomA');
})

// ミドルウェア
// socket生成の際に適用する場合はio.use()
// socketを介したクライアントからの通信に際して適応する場合はsocket.use()
// 第2引数にnext,エラー時はエラーメッセージを渡す
io.use((socket,next) => {
    // socketが生成されるたびに呼ばれる
    // 認証を行う例
    if (isLogin(socket.request.headers)){
        next()
    } else {
        next(new Error('Need login'));
    }
})

// ミドルウェア namespace
io.of('/namespace1').use((socket,next) => {
    //
})

//クライアントからの通信のたび実行
io.on('connection', socket => {
    socket.use((packet, next) => {

    })
})

