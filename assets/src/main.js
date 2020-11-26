'use strict'
// Импортируем jQuery
// = ../../node_modules/jquery/dist/jquery.js

let string = 'в главном работает!';
// Импортируем другие js-файлы
//= './templates/library/blocks-library.js'
// = './templates/blocks/index/index.js'
// = './two.js'
window.onload = init

function init() {
	console.log(string);
}