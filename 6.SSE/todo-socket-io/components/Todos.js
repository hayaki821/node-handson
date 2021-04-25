// 外部モジュールで公開されたものを利用するためのimport文
import {useEffect, useState} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import io from 'socket.io-client';

// 各ページに関する情報の定義
const pages = {
    index: {title: 'すべてのTodo'},
    active: {title: '未完のTodo', completed: false},
    completed: {title: '完了のTodo', completed: true}
};

// CSRでページを変えるためのリンク
const pageLinks = Object.keys(pages).map((page, index) => 
    <Link href={`/${page === 'index' ? '' : page}`} key={index}>
        <a style={{ marginRight: 10 }}>{pages[page].title}</a>
    </Link>
);

// Reactコンポーネントを実装し、外部のモジュールで利用可能なようexport文で公開
export default function Todos(props){
    const {title, completed} = pages[props.page];

    // コンポーネントの状態の初期化と、propsの値に応じた更新
    const [todos, setTodos] = useState([]);
    // socketをstateとして保持
    const [socket, setSocket] = useState([]);

    
    useEffect(() => {
        // socketを生成
        // /todos名前空間を指定
        const socket = io('/todos');
        socket.on('todos', todos => {
            setTodos(
                typeof completed === 'undefined'
                ? todos
                : todos.filter(todo => todo.completed === completed )
            );
            setSocket(socket);
        })
        // コンポーネントのクリーンアップ時にsocketをクローズ
        return () => socket.close();
    }, [props.page]);
    console.log(todos);

    // このコンポーネント描画がするUIをJSX構文で記述して返す
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <label>
                新しいTODOを入力
                <input onKeyPress={e => {
                    // Enterキーが押されたらTodoを登録する
                    const title = e.target.value;
                    if (e.key !== 'Enter' || !title){
                        return;
                    }
                    e.target.value = '';
                    socket.emit('createTodo', title);
                }}/>
            </label>
            {/* TODO一覧の表示 */}
            <ul>
                {todos.map(({id, title, completed}) => 
                    <li key={id}>
                        <label style={completed ? {textDecoration: 'line-through'} : {}}>
                        <input 
                            type="checkbox"
                            checked={completed}
                            onChange={e => 
                                socket.emit('updateCompleted', id, e.target.checked)
                                //console.log(e.target.checked,id)
                            }
                        />
                            {title}
                        <button onClick={() => socket.emit('deleteTodo', id)}>削除</button>
                        </label>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}