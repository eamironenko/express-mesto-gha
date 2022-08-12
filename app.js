//const http = require('http');

//устанавливаем точку входа

const express = require('express');
const { PORT = 3000 } = process.env; //слушаем 3000 порт

const app = express();

app.listen( PORT, () =>{
  //если работает, то консоль покажет какой порт приложение слушает
  console.log (`App listening on port ${PORT}`)
});