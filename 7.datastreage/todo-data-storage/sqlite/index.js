'use strict';
const {promisify} = require('util');
const { join } = require('path');
const sqlite3 = process.env.NODE_ENV === 'production'
    ? require('sqlite3')
    // production以外は助長モード
    : require('sqlite3').verbose();

// todo-data-storege/sqlite/sqliteファイルにｂデータベースの状態を保持
const db = new sqlite3.Database(join(__dirname, 'sqlite'));
// コールバックパターンのメソッドをPromise化
const dbGet = promisify(db.get.bind(db))
const dbRun = function() {
    return new Promise((resolve,reject) => 
        db.run.apply(db, [
            ...arguments,
            function(err) {
                err ? reject(err) : resolve(err)
            }
        ])
    )
}
const dbAll = promisify(db.all.bind(db));

// データベースのデータをToDoオブジェクトに変換
function rowToTodo(row){
    return {...row, completed: !!row.completed}
}
exports.fetchAll = () =>
    dbAll('SELECT * FROM todo').then(row => rows.map(rowToTodo));

exports.fetchByCompleted = completed =>
    dbAll('SELECT * FROM todo WHERE completed = ?',completed)
    .then(rows => rows.map(rowToTodo));

exports.create = async todo => {
    await dbRun(
        'INSERT INTO todo VALUES (?,?,?)',
        todo.id,
        todo.title,
        todo.completed
    );
}

exports.update = (id, update) => {
    const setColumns = [];
    const values = [];

    for (const column of ['title', 'completed']) {
        if(column in update) {
            setColumns.push(`${column} = ?`);
            values.push(update[column]);
        }
    }
    values.push(id);
    return dbRun(`UPDATE todo SET ${setColumns.join()} WHERE id = ?`, values)
        .then(({changes}) => changes === 1
            ? dbGet('SELECT * FROM todo WHERE id = ?', id).then(rowToTodo)
            : null
        );
}

exports.remove = id => dbRun('DELETE FROM todo WHERE id = ?', id)
    .then(({changes}) => changes === 1 ? id : null);


