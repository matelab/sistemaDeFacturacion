const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); //carga .env
const nodemailer = require("nodemailer");

var development = false;
if (process.env.NODE_ENV == 'development'){
  development = true;
}
let transporter;
if (development){
transporter = nodemailer.createTransport({
  service: 'gmail', //valido solo para gmail, obvio
  //host: "smtp.gmail.com",             //SACAR DEL ENV
  //port: 465,                          //SACAR DEL ENV
  //secure: false,                       //SACAR DEL ENV
  auth: {
    user: 'hernan.pieroni@gmail.com', //SACAR DEL ENV
    pass: 'kqjzgqkwpgkgvzdh'            //SACAR DEL ENV
  }
});
} else {
  transporter = nodemailer.createTransport({
    service: 'gmail', //valido solo para gmail, obvio
    //host: "smtp.gmail.com",             //SACAR DEL ENV
    //port: 465,                          //SACAR DEL ENV
    //secure: false,                       //SACAR DEL ENV
    auth: {
      user: 'hernan.pieroni@gmail.com', //SACAR DEL ENV
      pass: 'kqjzgqkwpgkgvzdh'            //SACAR DEL ENV
    }
  });

}
module.exports={
        mailer: async function(razonSocial, email, nroComprobante,tipoComprobante,precioTotal, res){
            let tipo;
            switch(tipoComprobante){
                case 1: {tipo= 'Factura';break}
                case 2: {tipo= 'Nota de Debito';break}
                case 3: {tipo= 'Nota de Credito';break}
                case 6: {tipo= 'Factura';break}
                case 7: {tipo= 'Nota de Debito';break}
                case 8: {tipo= 'Nota de Credito';break}
                default: {tipo = tipoComprobante}
            }  
            if (development) {email = "maxisalamone@gmail.com"; }//para pruebas.
            try{
              console.log("Enviando a: "+email);
            let info = await transporter.sendMail({
                from: '"El Cronista Comercial" <noreply@cronista.com>', // sender address
                to: email, // list of receivers
                subject: "El Cronista Comercial - "+tipo+" nro "+nroComprobante+" adjunta", // Subject line
                attachments: [{
                    filename: 'comprobante.pdf',
                    path: path.join(__dirname, '../comprobante.pdf'),
                    contentType: 'application/pdf'
                }], 
                text: "Estimados "+razonSocial+", adjunta encontrará la factura generada por el producto o servicio adquirido. Saludos cordiales. Monto total: $"+precioTotal, // plain text body
                html: "<p>Estimados "+razonSocial+", </p><p>Adjunta encontrará la factura generada por el producto o servicio adquirido.</p><p>Monto total: "+precioTotal+"</p><p> Saludos cordiales.</p><p> El Cronista Comercial</p>" // html body
            });
            console.log("Mail enviado");
            res.status(200).send({'mailer': true}); //ULTIMO PASO DE LA CADENA
            }
            catch(error){console.log(error); return error}
        },
        login: async function (email){
            if (development) {email = "maxisalamone@gmail.com"; }//para pruebas.
            try{
              console.log("Enviando a: "+email);
            let info = await transporter.sendMail({
                from: '"El Cronista Comercial" <noreply@cronista.com>', // sender address
                to: email, // list of receivers
                subject: "El Cronista Comercial - Acceso a sistema", // Subject line
                text: "Ingrese al sistema con el siguiente link: ", // plain text body
                html: "<p>Ingrese al sistema con el siguiente link: </p>" // html body
            });
            console.log("Mail enviado");
            //res.status(200).send({'mailer': true}); //ULTIMO PASO DE LA CADENA
            }
            catch(error){console.log(error); return error}
        }

}