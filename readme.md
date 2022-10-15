<p align="center"><img src="https://telegra.ph/images/logo.png" width="150" height="150" alt="logo_telegraph.png"/></p>  
<h5 align="center"><a href="https://telegra.ph">[Source: Telegraph]</a></h5>  
  
## Instalação:  
- Rode o código abaixo para instalar via `NPM`:  
  
```bash  
$ npm i @killovsky/telegraph  
```  
  
- Rode o código abaixo para instalar via `GIT`:  
```bash  
$ git clone https://github.com/KillovSky/Telegraph.git  
$ npm i  
```  
  
## O que este módulo faz?  
- Ele realiza o upload de fotos no sistema do [Telegraph](https://telegra.ph) de forma ilimitada e bem simples.  
  
## O que este módulo tem de especial?  
- Assim como o da [NASA](https://github.com/KillovSky/NASA), muitas coisas, confira abaixo:  
  
------  
> 1. Neste módulo, os erros não afetam o funcionamento, o que significa que apesar de qualquer erro, os valores 'sempre' estarão lá para que você não seja afetado.  
>  
> 2. Os erros serão inseridos na resposta com uma explicação sobre o que causou eles, facilitando para você entender.  
>  
> 3. Os headers estão inseridos na resposta, facilitando para saber detalhes que podem lhe ser uteis.  
>  
> 4. Existe apenas uma dependência de módulo, sendo o [Form-Data](https://www.npmjs.com/package/form-data), o restante é feito usando o puro `Node.js`.  
>  
> 5. Cada linha do código possui uma explicação do que está rodando ou vai rodar, ou seja, o código INTEIRO é explicado, linha por linha.   
>  
> 6. E muitas outras coisas, confira o código para entender!  
------  
  
## Como testar este módulo:  
- Basta abrir um terminal na pasta do módulo e digitar:  
  
```bash  
$ npm test  
```  
  
## Como utilizar este módulo:  
- Existem diversas formas de utilizar, mas como se trata de um script que faz uso de `Promises`, irei dar dois exemplos que funcionam bem, lembrando, você pode rodar sem especificar nada pois também funciona desta forma.   
- Clique em uma das linhas/setas abaixo para exibir os detalhes!  
  
<details>  
<summary><code>Descrição de cada parâmetro da execução:</code></summary>  
  
```javascript  
// Function especificada  
upload('Imagem', 'Formato')  
  
/* ------------------------------------- *  
* 1° - Imagem  
* Valores: Buffer, Base64 ou Local  
* Padrão: 'Image_Test'  
* ---------------------------------------  
* 2° - Formato  
* Valores: Formato de Imagem  
* Padrão: 'jpg'   
* ------------------------------------- */   
  
// Function sem especificar [Modo Teste]  
upload()  
  
// Retorna o JSON padrão  
defaults()  
  
// Retorna os códigos HTTP  
http()  
  
// Retorna a package JSON  
packages()  
```  
  
</details>   
  
<details>  
<summary><code>Exemplos de uso:</code></summary>  
  
```javascript  
// Usando .then | Modo de uso padrão  
const telegraph = require('@killovsky/telegraph');  
telegraph.upload('IMAGEM', 'FORMATO').then(data => {  
	// Faça seu código baseado na object 'data' aqui  
	// Exemplo: console.log(data);  
})  
  
// Usando await [async] | Modo de uso padrão  
const telegraph = require('@killovsky/telegraph');  
const data = await telegraph.upload('IMAGEM', 'FORMATO');  
// Faça seu código aqui usando a const 'data'  
// Exemplo: console.log(data);  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [.then]:</code></summary>  
  
```javascript  
// Código usando .then  
const telegraph = require('@killovsky/telegraph');  
telegraph.upload('Image_Test', 'jpg').then(data => console.log(data));  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [async/await]:</code></summary>  
  
```javascript  
// Código usando await   
const telegraph = require('@killovsky/telegraph');  
const data = await telegraph.upload('Image_Test', 'jpg');  
console.log(data);  
  
// Se você não sabe criar uma função async ou ainda não tiver uma, use este código abaixo:  
(async () => {  
	// Cole um código com await aqui dentro  
})();  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo de resultado com explicações:</code></summary>  
  
```JSON  
{  
	"date": "String | Data [YYYY-MM-DD HH:MM:SS]",  
	"error": "true | false",  
	"dev_msg": "String / false | Mensagem adicional de erro",  
	"error_msg": "String / false | Códigos de erros de execução",   
	"code": "Number | String | Código de erro HTTP",  
	"explain": {  
		"code": "Number / String | Código escrito de HTTP",  
		"why": "String | Explicação do código HTTP"  
	},  
	"headers": {  
		"date": "String | Data escrita da requisição",  
		"content-type": "String | Tipo de resposta",  
		"content-length": "Number | Tamanho da resposta",  
		"Outros": "E vários outros headers, faça uma requisição para obter todos."  
	},  
	"images": [  
		{  
			"src": "String | URL da imagem que foi enviada ao Telegraph"  
		}  
	]  
}  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo utilizável de resultado:</code></summary>  
  
```JSON  
{  
	"date": "14/10/2022 22:55:30",  
	"error": false,  
	"dev_msg": false,  
	"error_msg": false,  
	"code": 200,  
	"explain": {  
		"code": "OK",  
		"why": "The request is OK, this response depends on the HTTP method used."  
	},  
	"headers": {  
		"server": "nginx/1.20.1",  
		"date": "Sat, 15 Oct 2022 01:55:31 GMT",  
		"content-type": "application/json; charset=utf-8",  
		"content-length": "45",  
		"connection": "close",  
		"pragma": "no-cache",  
		"cache-control": "no-store",  
		"strict-transport-security": "max-age=31536000; includeSubDomains; preload"  
	},  
	"images": [  
		{  
			"src": "https://telegra.ph/file/a5f64ece2d0ab56eab3ce.png"  
		}  
	]  
}  
```  
  
</details>   
  
## Perguntas e Respostas:  
  
- Isso é bem similar ao seu módulo do Projeto APOD da NASA, não é?  
> Sim, é por que quero criar sistemas fáceis de entender e usar, decidi que a melhor forma seria fazendo eles de forma similar, deixando o código bem simples para qualquer um que vier de outros projetos meus.  
>  
- Por que você utilizou um módulo dessa vez?  
> Não tive escolha, tentei infinitas formas de fazer em `Node.js` puro, mas todas falharam, o servidor somente aceitou com [Form-Data](https://www.npmjs.com/package/form-data), então decidi que deveria deixa-lo no módulo e terminar dessa forma.  
>  
- O que é proibido ao usar este módulo?  
> Você jamais deve abusar de qualquer programa, sempre crie um limitador de tempo ou armazene a ultima resposta se caso seja a mesma imagem e use ela, evite ficar utilizando um programa deste estilo muitas vezes seguidas sem esperar.  
  
## Suporte  
  
- Se obtiver algum problema, você pode me dizer [Reportando nas Issues](https://github.com/KillovSky/Telegraph/issues).  
- Confira outros projetos meus [Acessando Isto](https://github.com/KillovSky).  
- Se gostar, doe para me ajudar a continuar desenvolvendo, mais informações [Clicando Aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html) - [Página do Projeto Íris]  
  