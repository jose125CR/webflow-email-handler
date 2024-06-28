const { Router } = require('express');
const nodemailer = require("nodemailer");
const multer = require('multer');
const _ = require('lodash');
const upload = multer();

const { SuccessResponseObject } = require('../common/http');
const formNameKey = 'herso-form-name';
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
  const reqFiles = req.files;

  const filesToSent = reqFiles?.map((file) => {
    const base64Format = Buffer.from(file.buffer, 'ascii').toString('base64')
    return {
          filename: file.originalname,
          content: base64Format,
          encoding: 'base64'
        }
  })

  const fields = Object.entries(formData)

  console.log({formData, fields})

  const list = fields
    .filter(([key]) => key !== formNameKey)
    .map(([key, value]) => {
    const buffer = Buffer.from(key, 'latin1');
    const correctedText = buffer.toString('utf8');
    return (`<li><b>${correctedText}:</b> ${value}</li>`)

  })

  const shouldSentFiles = _.size(filesToSent) > 0

  const info = await gmailTransporter.sendMail({
    from: '"Maddison Foo Koch 👻" <kiimjohamorales5@gmail.com>',
    to: "ol125@hotmail.es",
    subject: "Hello ✔",
    text: "Hello world?",
    html: `<ul>${list.join('')}</ul>`,
    ...shouldSentFiles ?  {attachments: filesToSent} : {}

  });

  console.log({info});

  return res.sendStatus(200)
});

module.exports = r;