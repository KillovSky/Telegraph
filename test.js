"use strict";
const telegraph = require('./index');

/* Simula o envio de uma imagem, não faz de verdade para evitar usos desnecessários do Telegraph */
telegraph.upload('Image_Test').then(data => console.log(data));