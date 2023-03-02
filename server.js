require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

//TODO env variables
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
