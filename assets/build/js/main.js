'use strict'
// Импортируем jQuery
// = ../../node_modules/jquery/dist/jquery.js

let string = 'в главном работает!';
// Импортируем другие js-файлы
string = 'другое';
string = 'из индекса'
// = './templates/blocks/index/index.js'
// = './two.js'
window.onload = init

function init() {
	console.log(string);
}