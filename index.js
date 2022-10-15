"use strict";
const https = require("https");
const fs = require("fs");
const FormData = require("form-data");
const httpcodes = require("./codes.json");
const default_images = require("./default.json");
const mopack = require("./package.json");

/*######################################################################################
#
# Por que fiz a linguagem em inglês?
# R: Pois eu gosto deste idioma e quis seguir o padrão como quase todos os outros devs.
#
# Esse código pode ser copiado para criar algo diferente, novo, superior ou etc?
# R: É claro! Mas você >PRECISA< manter o copyright, leia mais da licença abaixo.
#
# Por que este código parece igual ao seu outro da NASA?
# R: Por que eu quis fazer algo confortável para quem veio de outros projetos meus.
# R: Ou seja, quis manter o mesmo formato para facilitar, e vou continuar fazendo isso.
#
########################################################################################
#
#   MIT License
#
#   Copyright (c) 2022 KillovSky - Lucas R.
#
#   Permission is hereby granted, free of charge, to any person obtaining a copy
#   of this software and associated documentation files (the "Software"), to deal
#   in the Software without restriction, including without limitation the rights
#   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#   copies of the Software, and to permit persons to whom the Software is
#   furnished to do so, subject to the following conditions:
#
#   The above copyright notice and this permission notice shall be included in all
#   copies or substantial portions of the Software.
#
#   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#   SOFTWARE.
#
######################################################################################*/

/* Define os formatos aceitados */
const Accepted_Formats = ["png", "jpg", "jpeg", "mp4", "gif", "jfif", "pjepg", "pjp", "m4v"];

/* Verifica o formato utilizando as bytes de um buffer em modo Uint8Array */
function File_Type(buf, deft) {
    const File_Unit = (new Uint8Array(buf)).subarray(0, 4);
    var File_Header = "";
    for (let bbarr of File_Unit) {
        File_Header += bbarr.toString(16);
    }
    if (["ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "ffd8ffe3", "ffd8ffe8"].includes(File_Header)) {
        return "jpg";
    } else if (File_Header === "66747970") {
        return "mp4";
    } else if (File_Header === "47494638") {
        return "gif";
    } else if (File_Header === "89504e47") {
        return "png";
    } else if (File_Header.startsWith("0001c")) {
        return "m4v";
    } else {
        return deft;
    }
}

/* Cria a exports para atuar como função */
exports.upload = function (
    image = "Image_Test",
    filetp = "default"
) {

    /* Faz uma promise com a função para funcionar perfeitamente */
    return new Promise(function (resolve) {

        /* Cria a object de return em casos de erros, não afetando o usuário mas permitindo que ele saiba quando der erro */
        let response = default_images[Math.floor(Math.random() * default_images.length)];

        /* Insere a data de 'hoje' */
        let Today_Day = new Date();
        response.date = Today_Day.toLocaleString();

        /* Retorna a URL de uma imagem padrão */
        if (image === "Image_Test") {
            return resolve(response);
        }

        /* Verifica qual é o tipo da imagem | Buffer, Base64 ou Path */
        let Uploading_Image = false;
        let format = filetp;
        if (Buffer.isBuffer(image)) {
            Uploading_Image = image;
        } else if (image.startsWith("data:")) {
            const Extracted_Base64 = image.split(";base64,");
            Uploading_Image = Buffer.from(Extracted_Base64[1], "base64");
            format = Extracted_Base64.replace(/data:image\//gi, "") || filetp;
        } else if (fs.existsSync(image)) {
            Uploading_Image = fs.readFileSync(image);
            format = image.split(".").pop() || filetp;
        }

        /* Volta a mimetype ao especificado pelo usuário, caso não tenha sido detectado adequadamente */
        if (!Accepted_Formats.includes(format)) {
            format = filetp;
        }

        /* Caso tenha sido informado um formato incorreto / foi usado o formato de nome */
        if (format !== filetp) {
            response.format_msg = `A format was detected in the name, base64 or buffer, the upload will be done using the format '${format}' instead of '${filetp}'.`;
        }

        /* Faz a correção do mime-type caso seja outro */
        const Temp_Format = File_Type(Uploading_Image, format);
        if (format === "default" && Temp_Format === "default") {
            response.format_msg = "Could not detect the image format, so it will be sent as 'jpg', if you get errors try specifying manually.";
            format = "jpg";
        } else if (format !== Temp_Format || format === "default" || !Accepted_Formats.includes(format)) {
            response.format_msg = `The image format does not appear to be '${format}', the upload will be in the format '${Temp_Format}' instead of '${format}'.`;
            format = Temp_Format;
        } else if (format === Temp_Format && format !== "default") {
            format = Temp_Format;
        }

        /* Caso a imagem fornecida seja invalida */
        if (Uploading_Image === false) {
            response.error = true;
            response.code = "415";
            response.explain = httpcodes[response.code];
            response.dev_msg = "The file could not be detected, please try loading other media or check your media before trying again.";
            response.error_msg = "This is not a valid image, please insert a type of Buffer, Base64 or Image Path.";
            response.images = "https://http.cat/415.jpg";
            return resolve(response);
        }

        /* Form-Data para envio da imagem */
        const form = new FormData();
        form.append("file", Uploading_Image, `image.${format}`);

        /* Opções de acesso na API */
        const options = {
            headers: form.getHeaders(),
            hostname: "telegra.ph",
            method: "POST",
            path: "/upload"
        };

        /* Try - Catch para caso dê um erro pior */
        try {

            /* Let para obter a chunk da requisição */
            let data = "";

            /* Faz a requisição na API */
            const req = https.request(options, function (res) {

                /* Insere as informações na JSON */
                response.code = res.statusCode;
                response.explain = httpcodes[res.statusCode];
                response.headers = res.headers;

                /* Recebe a chunk da API */
                res.on("data", function (chunk) {
                    data += chunk;
                });

                /* Em caso de falhas */
                req.on("error", function (err) {
                    response.error = true;
                    response.code = err.code;
                    response.error_msg = err.message;
                    return resolve(response);
                });

                /* Finaliza pois o resultado foi recebido */
                res.on("end", function() {

                    /* Cria uma let temporariamente para filtrar o resultado */
                    let Telegraph = false;

                    /* Outro Try - Catch para checar se tudo correu bem e a resposta esta aceitável */
                    try {
                        Telegraph = JSON.parse(data);
                    } catch (error) {
                        Telegraph = false;
                        response.error_msg = error.message;
                    }

                    /* Verifica se obteve erro, se sim, não edita o JSON padrão, mas insere o erro, garantindo a funcionalidade */
                    if (response.code !== 200 || Telegraph === false) {

                        /* Refaz os parâmetros acima caso algum erro aconteça */
                        if (response.error_msg === "Unexpected end of JSON input") {
                            if (response.code === 200) {
                                response.code = 400;
                            }
                            response.explain = httpcodes[response.code];
                            response.headers = res.headers;
                        }
                        response.error = true;
                        response.dev_msg = "Maybe you got blocked by the server, make sure you're not using proxy or something and try on another machine.";

                        /* Se não tiver erros, verifica se alguma informação faltou */
                    } else {

                        /* Corrige os links da resposta, verifica se foi erro e tem um try-catch para verificar novamente, caso não for válido */
                        if (Object.keys(Telegraph).includes("error")) {
                            response.images = {
                                "src": "https://http.dog/415.jpg",
                                "error": Telegraph.error
                            };
                        } else {
                            Telegraph = Telegraph.map(function (res) {
                                try {
                                    if (res.src.includes(".")) {
                                        return `https://telegra.ph${res.src}`;
                                    } else {
                                        return "https://http.dog/400.jpg";
                                    }
                                } catch (err) {
                                    response.dev_msg += ` | ${err}`;
                                }
                            });

                            /* Formata para uma array padrão e faz flat para não dificultar mais */
                            Telegraph = (Telegraph.map(function (link) {
                                return [
                                    {
                                        "src": link
                                    }
                                ];
                            })).flat();

                            /* Caso não tenha dado erro, insere um erro com valor false para checagens */
                            Telegraph = Telegraph.map(function (res) {
                                if (!Object.keys(res).includes("error")) {
                                    res.error = false;
                                    return res;
                                } else {
                                    return res;
                                }
                            });

                            /* Finaliza o JSON */
                            response.images = Telegraph;
                        }
                    }
                });

                /* Finaliza o request e retorna o JSON */
                return resolve(response);
            });

            /* Em caso de falhas 2x */
            req.on("error", function (err) {
                response.error = true;
                response.code = err.code;
                response.error_msg = err.message;
                return resolve(response);
            });

            /* Escreve a Form-Data na request e finaliza */
            form.pipe(req);
            req.end();

            /* Caso der erro em alguma coisa, não afeta o resultado e cai no catch abaixo */
        } catch (error) {
            response.error = true;
            response.code = error.code;
            response.error_msg = error.message;
            return resolve(response);
        }
    });

};

/* Retorna o JSON da default */
exports.defaults = () => default_images;

/* Retorna os códigos HTTP */
exports.http = () => httpcodes;

/* Retorna a package.json */
exports.packages = () => mopack;

/* Retorna os formatos aceitados */
exports.formats = () => Accepted_Formats;