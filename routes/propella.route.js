const { Router } = require('express');
const nodemailer = require("nodemailer");

const express = require('express')
const multer = require('multer');
const _ = require('lodash');
const upload = multer();

const { SuccessResponseObject } = require('../common/http');

const r = Router();

const gmailTransporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "kiimjohamorales5@gmail.com",
      pass: "aezm wvau uonz zlbj",
    },
  });

r.post('/', upload.any(), async (req, res) => {
  const formData = req.body;
  const file = req.file;
  const reqFiles = req.files;

  const filesToSent = reqFiles?.map((file) => {
    const base64Format = Buffer.from(file.buffer, 'ascii').toString('base64')
    return {
          filename: file.originalname,
          content: base64Format,
          encoding: 'base64'
        }
  })


  console.log({formData, file, reqFiles})

  const fields = Object.entries(formData)

  const list = fields.map(([key, value]) => {
    const buffer = Buffer.from(key, 'latin1');
    const correctedText = buffer.toString('utf8');
    return (`<li><b>${correctedText}:</b> ${value}</li>`)

  })

  const shouldSentFiles = _.size(filesToSent) > 0

  const info = await gmailTransporter.sendMail({
    from: '"Maddison Foo Koch 👻" <kiimjohamorales5@gmail.com>', // sender address
    to: "ol125@hotmail.es", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<ul>${list.join('')}</ul>`,
    ...shouldSentFiles ?  {attachments: filesToSent} : {}

  });

  console.log({info});
  //res.sendStatus(200);

  return res.json(new SuccessResponseObject('Ok')
)});

module.exports = r;




/**************************************************** */
// const express = require('express')
// const nodemailer = require("nodemailer");
// const cors = require('cors')
// const multer = require('multer');
// const _ = require('lodash');
// const upload = multer();
// const app = express()
// const port = 3001

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// const gmailTransporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "kiimjohamorales5@gmail.com",
//     pass: "aezm wvau uonz zlbj",
//   },
// });

// app.post('/propella', upload.any(), async (req, res) => {
//   const formData = req.body;
//   const file = req.file;
//   const reqFiles = req.files;

//   const filesToSent = reqFiles?.map((file) => {
//     const base64Format = Buffer.from(file.buffer, 'ascii').toString('base64')
//     return {
//           filename: file.originalname,
//           content: base64Format,
//           encoding: 'base64'
//         }
//   })


//   console.log({formData, file, reqFiles})

//   const fields = Object.entries(formData)

//   const list = fields.map(([key, value]) => {
//     const buffer = Buffer.from(key, 'latin1');
//     const correctedText = buffer.toString('utf8');
//     return (`<li><b>${correctedText}:</b> ${value}</li>`)

//   })

//   const shouldSentFiles = _.size(filesToSent) > 0

//   const info = await gmailTransporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <kiimjohamorales5@gmail.com>', // sender address
//     to: "ol125@hotmail.es", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: `<ul>${list.join('')}</ul>`,
//     ...shouldSentFiles ?  {attachments: filesToSent} : {}

//   });

//   console.log({info});
//   res.sendStatus(200);
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
