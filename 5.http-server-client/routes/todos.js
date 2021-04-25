'use strict';
const express = require('express');
const router = express.Router();

console.log(router);
// return 
// [Function: router] {
//     params: {},
//     _params: [],
//     caseSensitive: undefined,
//     mergeParams: undefined,
//     strict: undefined,
//     stack: []
//   }

router.route('/')
    .get((req, res) => {
        // GETリクエストに関する記述
    })
    .post((req, res) => {

    })

    module.exports = router;