<a name="readme-top"></a>

<br />

<br />

<div align="center">
  <a href="https://github.com/DavidMorgade/Web-Empresa-SIMIXM12">
    <img src="./screenshots/Logo.jpg" alt="Logo" height="100">
  </a>
  
<br />

<h1 align="center">MICROSERVICIO DE CORREO SINGETEC</h1>

<br />

  <h2 align="center">
    David Morgade - Jorge Arrebola - Oscar Villén
  </h2>
  
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li><a href="#introduccion">Introducción</a></li>
    <li><a href="#funcionalidad">¿Cómo Funciona?</a></li>
    <li><a href="#nodemailer">Nodemailer</a></li>
    <li><a href="#variables">Variables de Entorno</a></li>
    <li><a href="#creditos">Creditos</a></li>
  </ol>
</details>

<br/>
<br/>

## Introduccion

   <br/>
    <p>Este proyecto está creado para suplir a la Web SINGETEC de un servicio nodemailer que permite redirigir correos directamente a la cuenta de la empresa</p>
   <br/>
    <p>Para navegar por este archivo README utilize la tabla de contenidos situada en la parte superior del mismo documento</p>
   <br/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Funcionalidad

<p>Este sevidor web funciona con NodeJS y está completamente escrito en JAVASCRIPT</p>
</br>
</br>
</br>
<p>Utilizaremos Express para crear el servidor con mayor facilidad</p>

```js
const express = require('express');
```

<p>Creamos nuestra App llamando la funcion de Express y almacenandolo en una variable para posteriormente agregarle el POST:</p>

```js
const app = express();
app.post(
  '/',
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('message').isLength({ min: 1, max: 500 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.send(
        `Not a valid request, please send the correct parameters`
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: req.body.email,
      to: process.env.MAIL,
      subject: `Mensaje de: ${req.body.name} con el email: ${req.body.email}`,
      text: req.body.message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500);
        res.send(
          `Oops, hubo un error al contactar con el servidor, porfavor contacte con nososotros a: ${mailOptions.to}`
        );
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200);
        res.send(
          `Gracias ${req.body.name}, tu mensaje se mandó correctamente a: ${mailOptions.to}. ¡Intentaremos ponernos en contacto contigo lo más pronto posible!`
        );
      }
    });
  }
);
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Validaciones

<p>Utilizaremos diferentes tipos de validaciones con Express Validator, para validar la información en el lado de servidor, sanitizar y evitar posibles ataques por inyección de código</p>

```js
const { body, validationResult } = require('express-validator');
```

<p>Para ello utilizaremos los distintos metodos que nos ofrece Express validator como isEmail (comprobar que es un email) e isLength (configurable el minimo y maximo pasandole un objeto literal de Javascript)</p>

```js
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('message').isLength({ min: 1, max: 500 }),
```

<p>Una vez que pasamos las validaciones pasaremos el metodo validationResults() a la request, este comprobara si la variable de errores se encuentra vacía, en caso de que esto sea correcto pararemos la petición POST y mandaremos al cliente un status 400 diciendo que su request no fué válida y debe mandar los parametros correctos</p>

```js
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.send(
        `Not a valid request, please send the correct parameters`
      );
    }
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Nodemailer

<p>Una vez realizamos la validación del lado del servidor pasaremos a la funcionalidad de Nodemailer, este es un paquete externo también creado en Node que nos permite reenviar correos de nuestro servidor a nuestra cuenta de correo principal</p>

```js
const nodemailer = require('nodemailer');
```

<p>Crearemos un transpoerter con el metodo createTransport(), el cual realizará la autenticación, para ello necesitaremos 2 variables de entorno, el correo eletrónico y la contraseña de la verificación en 2 pasos:</p>

```js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
```

<p>También crearemos un objeto mailOptions que pasaremos al transporter, este llevará el email que vendrá de la request, nuestro email, el asunto que lo formaremos con un template string y el texto que será mensaje que viene en la request:</p>

```js
const mailOptions = {
  from: req.body.email,
  to: process.env.MAIL,
  subject: `Mensaje de: ${req.body.name} con el email: ${req.body.email}`,
  text: req.body.message,
};
```

<p>Pasaremos nuestro objeto mailOptions al transporter mediante el metodo sendMail, este metodo se forma por el objeto mailOptions y un callback, en este callback comprobamos si existe un error o si todo salió correctamente, completando la funcionalidad de nuestro nodemailer:</p>

```js
transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500);
        res.send(
          `Oops, hubo un error al contactar con el servidor, porfavor contacte con nososotros a: ${mailOptions.to}`
        );
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200);
        res.send(
          `Gracias ${req.body.name}, tu mensaje se mandó correctamente a: ${mailOptions.to}. ¡Intentaremos ponernos en contacto contigo lo más pronto posible!`
        );
      }
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Variables

<p>Utilizaremos variables de entorno para almacenar la información sensible en un archivo .env, como ejemplo en este repositorio tenemos el archivo .example.env con las diferentes variables de entorno que se necesitan.</p>

</br>
</br>

<p>Primero tendremos el mail donde queremos que llege el email:</p>

```
MAIL=TU EMAIL
```

<p>Y como segunda variable tendremos la contraseña de la verificación en dos pasos</p>

```
MAIL_PASSWORD=CONTRASEÑA 2 STEP DE GOOGLE
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Creditos

<p>Este proyecto está creado por completo por Jorge Arrebola, Oscar Villén Pergrina y David Morgade Gil, alumnos del modulo M12 (proyecto) de SIMIX</p>
