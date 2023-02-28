# NODEMAILER SERVER

## Clone Repo

<br>
<br>

```
git clone https://github.com/DavidMorgade/Nodemailer-Server.git
```

## Run Locally

<br>

```
npm install
npm run dev
```

## Config your Email

- Go to .example.env
- Rename it to .env
- Change the variables to your email and your 2 step auth password

```
MAIL=YOUR EMAIL
MAIL_PASSWORD=YOUR EMAIL 2 STEP PASSWORD
```

<br>

## Change the req parameters

Depending on what type of POST request you are building in your form, you should set the different parameters on your POST function, defaults are name, email and message with simple express-validators checkers

```
app.post(
  '/',
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('message').isLength({ min: 1, max: 500 }),
  (req, res) => {
```

Remember that you will have to use 2 step authentication for a google email to work. 

## Working on nextjs version
