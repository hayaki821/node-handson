// 外部モジュールで公開されたものを利用するためのimport文
import {useEffect, useState} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import 'isomorphic-fetch';

// 各ページに関する情報の定義
const pages = {
    index: {title: 'すべてのTodo' },
    active: {title: '未完のTodo', fetchQuery: '?completed=false'},
    completed: {title: '完了のTodo', fetchQuery: '?completed=true'}
};

// CSRでページを変えるためのリンク
const pageLinks = Object.keys(pages).map((page, index) => 
    <Link href={`/${page === 'index' ? '' : page}`} key={index}>
        <a style={{ marginRight: 10 }}>{pages[page].title}</a>
    </Link>
);
// Reactコンポーネントを実装し、外部のモジュールで利用可能なようexport文で公開
export default function Todos(props){
    const {title, fetchQuery} = pages[props.page];

    // コンポーネントの状態の初期化と、propsの値に応じた更新
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        // fetch(`/api/todos${fetchQuery}`)
        //     .then(async res => 
        //         res.ok
        //         ? setTodos(await res.json())
        //         : alert(await res.text())
        //     )   

        // EventSourceを使った実装に置き換え
        // コンストラクタにSSEのAPIパスを指定
        const eventSource = new EventSource('/api/todos/events');
        // SSE受診時の処理
        eventSource.addEventListener('message', e => {
            const todos = JSON.parse(e.data);
            setTodos(
                typeof completed === 'undefined'
                    ? todos
                    : todos.filter(todo => todo.completed === completed)
            );
        });
        // エラーハンドリング
        eventSource.addEventListener('error', e=> console.log('SSE error',e));
        // useEffectで関数を返すと副作用のクリーンアップとして実行される
        // ここでは、EventSourceインスタンスをクローズ
        return () => eventSource.close();
    }, [props.page]);

    // このコンポーネント描画がするUIをJSX構文で記述して返す
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            {/* TODO一覧の表示 */}
            {/* <p>{todos}</p> */}
            <ul>
                {todos.map(({id, title, completed}) => 
                    <li key={id}>
                        <span style={completed ? {textDecoration: 'line-through'} : {}}>
                            {title}
                        </span>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}