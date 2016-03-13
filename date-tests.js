var date = new Date();
date.setFullYear(date.getFullYear() - 1);
var month = (date.getMonth() + 1);
var day = date.getDate();
var dateformat = date.getFullYear() + '-' + (month > 9 ? month : "0" + month) + '-' + (day > 9 ? day : "0" + day);

console.log(dateformat);

var array = [1,2];
console.log(array.length);