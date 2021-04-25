const http = require('http');
const fs = require('fs');
// npm install ejs
const ejs = require('ejs');
// npm install moment
const moment = require('moment');
const url = require('url');
const qs = require('querystring');
// 日本語表記に変える
moment.locale('ja');
let datetoday = moment().format('LL');


// ejsファイルを同期で読み込み
const index = fs.readFileSync('./index.ejs','utf8');
const sample = fs.readFileSync('./sample.ejs','utf8');
const form = fs.readFileSync('./form.ejs','utf8');
const style_css = fs.readFileSync('./style.css','utf8');

let server = http.createServer(getFromClient);
server.listen(3000);
console.log("server start");
console.log(datetoday);

function getFromClient(req,res){
    // urlのparse
    // object
    var url_parts = url.parse(req.url,true);
    console.log(url_parts);
    switch(url_parts.pathname){
        case '/':
            response_index(req,res);
            break;
        case '/sample':
            response_sample(req,res);
            break;
        case '/form':
            response_form(req,res);
            break;
        case '/style.css':
            res.writeHead(200,{'Content-Type':'text/css'});
            res.write(style_css);
            res.end();
            break
        default:
            res.writeHead(404,{'Content-Type':'text/plain'});
            res.end('no pages ... ');
            break;
    }
}

function response_index(req,res){
    // ejsファイルをhtmlにレンダーする
    // 第２引数はejsに渡すデータ
    var message = "index";
    var content = ejs.render(index,{
        title:'hayaki',
        today:datetoday,
        message: message,
    });

    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(content);
    res.end();
}

function response_sample(req,res){
    var message = "sample";
    var content = ejs.render(sample,{
        title:'introduction',
        today:datetoday,
        messaeg: message,
    });

    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(content);
    res.end();
}

function response_form(req,res){
    var message = "form";
    // post通信の制御
    if(req.method == "POST"){
        var body = '';

        req.on('data',(data) => {
            // data, msg=...という形
            body += data;
            // parseしないと日本語など文字化けする
            // 一度エンコードしている
            console.log(body,qs.parse(body));
        });
        req.on('end', () => {
            var post_data = qs.parse(body);
            msg = 'You said to me, "' + post_data.msg + '."';
            var content = ejs.render(form,{
                title:"Thanks",
                message:msg,
            })
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(content);
            res.end();
        });
    } else {
        var msg = "頁がありません";
        var content = ejs.render(form,{
            title:"thanks",
            message:msg,
        });
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(content);
        res.end();
    }
}