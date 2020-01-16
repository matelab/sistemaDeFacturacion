//ESTE MODULO ES EL PRINCIPAL DEL BACKEND DE FACTURACION MANUAL
//Creado por: Maximiliano A. Salamone
//mail: msalamone@cronista.com,  maxisalamone@gmail.com

//EL FRONT DEBE COMUNICARSE CON ESTE MODULO.
//LAS DEPENDENCIAS PRINCIPALES DE ESTE SON: MAILER, RECEIPTAUTHORIZER Y RECEIPTRENDERER
//RECEIPTAUTHORIZER TIENE ADEMAS SERVICES/AFIP.JS
//CONSTANTS Y LOGGER SON SECUNDARIOS.

// ESTA VERSION SE MANEJA CON BASE DE CLIENTES DE ECOMMERCE
const dotenv = require('dotenv');
dotenv.config(); //carga .env
const path = require('path');
const exec = require('child_process').exec;
var express = require('express');
var moment = require('moment');
const mailer = require('./services/mailer.js'); //MANEJA ENVIO DE MAILS AL CLIENTE
const receiptRenderer= require('./services/receiptRenderer.js'); //MANEJA LA CREACION DEL PDF Y MUESTRA EN PANTALLA
const receiptAuthorizer = require('./services/receiptAuthorizer.js'); //MANEJA ENVIO A AFIP
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const Sequelize = require('sequelize');
const Op = Sequelize.Op; //FACILITA EL USO DE OPERADORES


try{
  exec("npm run dev"); //EJECUTA AUTOMATICAMENTE EL SERVIDOR PARA RENDEREAR LOS PDF
  }
  catch(err){console.log(err)}

const sequelize = new Sequelize(process.env.DATABASE_DATABASENAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect:  'mssql',
  dialectOptions: {options: {encrypt: true}},
  pool: {    max: 30,    min: 0,    acquire: 30000,    idle: 20000  }
});


//POR ALGUNA RAZON LAS PRIMERAS 5 LINEAS DE CONSOLA NO SE PUEDEN VER, DE AHI ESTE RELLENO
console.log(" ");
console.log(" ");
console.log(" ");
console.log(" ");
console.log(" ");

//PRUEBA DE AUTENTICACION EN EL SERVIDOR USANDO SEQUELIZE
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexion exitosa: Azure');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    sequelize.close();
  });


  var development = false;
  if (process.env.NODE_ENV == 'development'){
    development = true;
  }
  console.log("environment: "+process.env.NODE_ENV);

//CARGA DE MODELS EN TANDA. PARA PROXIMAS EDICIONES

/* const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== 'index.js';
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
 */


//USUARIOS
const Usuario = sequelize.import(path.join(__dirname, './models/users.js')); 

//CARGA DE MODELS DE CLIENTE
const Cliente = sequelize.import(path.join(__dirname, './models/customer.js')); 
const ClienteDomicilio = sequelize.import(path.join(__dirname, './models/customerAddress.js')); 
const ClienteContacto = sequelize.import(path.join(__dirname, './models/customerContact.js')); 


//CARGA DE MODELS DE COMPROBANTE
const Comprobante = sequelize.import(path.join(__dirname, './models/receiptTesting.js')); 
const TipoComprobante = sequelize.import(path.join(__dirname, './models/receiptType.js')); 
const Moneda = sequelize.import(path.join(__dirname, './models/currency.js')); 
const ComprobanteDetalle = sequelize.import(path.join(__dirname, './models/receiptDetail.js')); 
const TipoProducto = sequelize.import(path.join(__dirname, './models/productType.js')); 
const AFIPAlicuota = sequelize.import(path.join(__dirname, './models/aliquotAfip.js')); 
const Localidad = sequelize.import(path.join(__dirname, './models/locality.js')); 
const Provincia = sequelize.import(path.join(__dirname, './models/province.js'));


//RELACIONES

Cliente.hasMany(Comprobante, {foreignKey: 'idCliente'});
Cliente.hasMany(ClienteDomicilio, {foreignKey: 'idCliente'});
Comprobante.belongsTo(Cliente,{ foreignKey: 'idCliente' });
Comprobante.belongsTo(TipoComprobante,{ foreignKey: 'idTipoComprobante' });
Comprobante.belongsTo(Moneda, {foreignKey: 'idMoneda'});
Comprobante.hasMany(ComprobanteDetalle, {foreignKey: 'idComprobante'});
ComprobanteDetalle.belongsTo(Comprobante, {foreignKey: 'idComprobante'});
ComprobanteDetalle.belongsTo(AFIPAlicuota, {foreignKey: 'idAFIPAlicuota'});
ComprobanteDetalle.belongsTo(TipoProducto, {foreignKey: 'idTipoProducto'});
ClienteDomicilio.belongsTo(Cliente, {foreignKey: 'idCliente'});
ClienteContacto.belongsTo(Cliente, {foreignKey: 'idCliente'});
Comprobante.belongsTo(ClienteDomicilio, {through: Cliente.ClienteDomicilio,foreignKey: 'idCliente', targetKey: 'idCliente'});
ClienteDomicilio.hasMany(Comprobante, {through: Cliente.Comprobante, foreignKey: 'idCliente'});
ClienteDomicilio.belongsTo(Localidad,{foreignKey: 'idLocalidad'}); //tecnicamente la relacion deberia ser HASONE en lugar de BELONGSTO, pero solo funciona asi.
ClienteDomicilio.belongsTo(Provincia,{foreignKey: 'idProvincia'});

                    ////////////////////////////////
                    //            FUNCIONES        //
                    ////////////////////////////////


//SANITIZADORES
function sanitizeString(str){
  if (str !== null  && !str == ''){
    str = String(str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,""));
  return str.trim();
  } else return null;
}

function sanitizeDecimal(n) {
  if (n !== null || n !== ''){
    if(!isNaN(parseFloat(n)) && isFinite(n)){
      return n;
    } else return null;
  } else return null;
}


function testEmail(email){
  if(email !== null || email !== ''){
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase())
  }

}

//ESTE MODULO GESTIONA LA MUESTRA Y ENVIO DEL COMPROBANTE COMO PDF EN PANTALLA LLAMANDO A RECEIPTRENDERER Y MAILER
async function comprobanteAll(idComprobante, mail, option, res){
      var jdatos;
      Comprobante.findAll({ include: 
        [{model: Cliente, required: true},
        {model: TipoComprobante, required: true},
        {model: Moneda, required: true},
        {model: ComprobanteDetalle, required: true, include: [{model: AFIPAlicuota, required:true}]},
        {model: ClienteDomicilio, required: true, include: [{model: Localidad, required: true},{model: Provincia, required: true}]},
        ],
        where: {receiptId: idComprobante} 
    })
    .spread(async (r)=> { //SPREAD EN COMBINACION CON .GET DEVUELVEN UN OBJETO JSON MAS SENCILLO PARA OPERAR
              jdatos = await r.get({plain: true}); 
    })
    .then (async (call)=> {
              if (option == 'verPDF-sinEnvio'){
              console.log('verPDF-sinEnvio');
              return await receiptRenderer.renderer(jdatos,option, res); //PASO RES PARA QUE PUEDA CONTESTARLE AL BROWSER
            }
            else{ 
              await receiptRenderer.renderer(jdatos,option, res);
              //DATOS PARA EL EMAIL
              let razonSocial =jdatos.customer.businessName;
              let nroComprobante = jdatos.receiptNumber;
              let tipoComprobante = jdatos.receiptType.description;
              let precioTotal = jdatos.currency.currency+" "+jdatos.total;
              setTimeout(function() {return mailer.mailer(razonSocial,mail,nroComprobante,tipoComprobante,precioTotal, res);},6000);                
            }           
     })
     .catch(err => {
      if (development){
      return { message: "Hubo un error al mostrar este comprobante "+err}
      } else { return {message: "Hubo un error al mostrar este comprobante "}};
    });
} //FIN COMPROBANTEALL


                        ////////////////////////
                        //        MAIN        //
                        ////////////////////////


app.post('/', async function (req, res) {


        //LOGIN
        if(req.body.seleccionOpcion == 'login'){
          //SANITIZACION DE DATOS ANTES DE QUERY
          let e;
          if (testEmail(req.body.email)){
            e= req.body.email
            Usuario.findOne({where: {email: e}})
            .then(r => {
              if (r == null){console.log("3");
                return res.json({value: 3}); //NO ENCONTRADO
              }
              if (e == r.email){console.log("1");
                mailer.login(e);
                return res.json({value: 1}); //ACCEDE

              }
            })
          } 
          else {console.log("2"); return res.json({value: 2});} //MAL ESCRITO EL EMAIL
          //FIN SANITIZACION 
          
        }   

        //BUSQUEDA POR NUMERO DE COMPROBANTE
        if(req.body.seleccionOpcion == 'comprobante'){
          //SANITIZACION DE DATOS ANTES DE QUERY
          var puntoVenta = sanitizeDecimal(req.body.puntoVenta); 
          let nrocomprobante = sanitizeDecimal(req.body.nrocomprobante);
          //FIN SANITIZACION  
          Comprobante.findAll({ include: //INCLUDE SON LOS INNER JOIN. UN MODELO INCLUIDO A SU VEZ PUEDE TENER SUS PROPIOS INCLUDE
            [{model: Cliente, required: true},
              {model: TipoComprobante, required: true},
              {model: Moneda, required: true}],
            where: {
              receiptNumber: nrocomprobante,
              cae: (req.body.conCAE ? {[Op.ne]: null} : null),
              sellingPoint: puntoVenta
            }
          }).then(r =>{return res.json(r);}) 
          
          .catch(err => {
                if (development){res.status(500).send({ message: "Hubo un error en la búsqueda " +err})
                } else {res.status(500).send({ message: "Hubo un error en la búsqueda"})}
            });
      }  //FIN BUSQUEDA POR NUMERO DE COMPROBANTE


      //BUSQUEDA POR CLIENTE
      if(req.body.seleccionOpcion == 'cliente'){
        //SANITIZACION DE DATOS ANTES DE QUERY
        var puntoVenta = sanitizeDecimal(req.body.puntoVenta); 
        let razonSocial = sanitizeString(req.body.razonSocial);
        let idcli = sanitizeDecimal(req.body.idcli);
        //FIN SANITIZACION  
        Comprobante.findAll({ include: 
          [{model: Cliente, required: true},
            {model: TipoComprobante, required: true},
            {model: Moneda, required: true}],
          where: {
            [Op.or]: [{'$customer.razonSocial$' : {[Op.like]: '%'+razonSocial+'%'}}, {customerId : idcli}], //PARECE QUE SEQUELIZE NO TIENE UNA FORMA ELEGANTE DE CONSULTAR EN OTRA TABLA.
            cae: (req.body.conCAE ? {[Op.ne]: null} : null),
            sellingPoint: puntoVenta
          }
        }).then(r =>{return res.json(r);})
        .catch(err => {
          if (development){res.status(500).send({ message: "Hubo un error en la búsqueda " +err})
          } else {res.status(500).send({ message: "Hubo un error en la búsqueda"})}
      });
      }  //FIN BUSQUEDA POR CLIENTE


      //BUSQUEDA POR FECHA
      if(req.body.seleccionOpcion == 'fecha'){
        //SANITIZACION DE DATOS ANTES DE QUERY
        var puntoVenta = sanitizeDecimal(req.body.puntoVenta); 
        let fechadesde = req.body.fechadesde;
        let fechahasta = req.body.fechahasta;
        //FIN SANITIZACION  
        Comprobante.findAll({ include: 
          [{model: Cliente, required: true},
            {model: TipoComprobante, required: true},
            {model: Moneda, required: true}],
          where: {
            dateDone: {[Op.between]: [fechadesde,fechahasta]},
            cae: (req.body.conCAE ? {[Op.ne]: null} : null),
            sellingPoint: puntoVenta
          }
        }).then(r =>{return res.json(r);})
        .catch(err => {
          if (development){res.status(500).send({ message: "Hubo un error en la búsqueda " +err})
          } else {res.status(500).send({ message: "Hubo un error en la búsqueda"})}
      });
      }  //FIN BUSQUEDA POR FECHA


      //BUSQUEDA DE DETALLES DEL COMPROBANTE
      if(req.body.seleccionOpcion == 'detalles'){
        //SANITIZACION DE DATOS ANTES DE QUERY
        let idcomp = sanitizeDecimal(req.body.idComprobante);
        //FIN SANITIZACION  
        ComprobanteDetalle.findAll({ include: 
          [{model: TipoProducto, required: true},{model: AFIPAlicuota, required: true}],
          where: {receiptId: idcomp}
        }).then(r =>{return res.json(r);})
        .catch(err => {
          if (development){res.status(500).send({ message: "Hubo un error en la búsqueda de items del comprobante " +err})
          } else {res.status(500).send({ message: "Hubo un error en la búsqueda de items del comprobante"})}
      });
      }  //FIN BUSQUEDA DE DETALLES DEL COMPROBANTE


      //BUSQUEDA DE DATOS DEL CLIENTE
      if(req.body.seleccionOpcion == 'clienteDatosCompletos'){
        //SANITIZACION DE DATOS ANTES DE QUERY
        let idcli = sanitizeDecimal(req.body.idcli);
        let razonSocial = sanitizeString(req.body.razonSocial);
        //FIN SANITIZACION  
        ClienteContacto.findAll({ 
          include: [{model: Cliente, required: true}],
          where: {[Op.or]: [{'$customer.razonSocial$' : {[Op.like]: '%'+razonSocial+'%'}}, {customerId : idcli}]}
        }).then(r =>{return res.json(r);})
        .catch(err => {
          if (development){res.status(500).send({ message: "Hubo un error en la búsqueda de datos del cliente " +err})
          } else {res.status(500).send({ message: "Hubo un error en la búsqueda de datos del cliente"})}
      });
      }  //FIN BUSQUEDA DE DATOS DEL CLIENTE


     //BUSQUEDA DE ULTIMO COMPROBANTE PARA DESCUBRIR SU FECHA
     if(req.body.seleccionOpcion == 'ultimoComprobante'){
        Comprobante.findAll({ limit: 1, 
        order:[['dateImputed', 'DESC']]
      }).then(r =>{return res.json(r);})
      .catch(err => {
        if (development){res.status(500).send({ message: "Hubo un error en la búsqueda del ultimo comprobante " +err})
        } else {res.status(500).send({ message: "Hubo un error en la búsqueda del ultimo comprobante "})}
    });
    }  //FIN BUSQUEDA DE DATOS DEL CLIENTE


     //BUSQUEDA DE TODOS LOS DATOS QUE VAN INCLUIDOS EN UN COMPROBANTE PARA SU IMPRESION
     if(req.body.seleccionOpcion == 'comprobanteAll'){
        let idComprobante = sanitizeDecimal(req.body.idComprobante);
        let mail = req.body.mail;
        let option;
        if (mail == null){option = 'verPDF-sinEnvio'}
        else{ option = 'soloEnvio'}
        let ret = await comprobanteAll(idComprobante, mail, option, res);


      }  //FIN BUSQUEDA DE TODOS LOS DATOS QUE VAN INCLUIDOS EN UN COMPROBANTE PARA SU IMPRESION
 

      //CREAR COMPROBANTE
      if(req.body.seleccionOpcion == 'crearComprobante'){
        //SANITIZACION DE DATOS ANTES DE QUERY
        let mail = req.body.email;  //ESTE LO USA SOLO PARA MANDAR MAIL
        let cuit = sanitizeDecimal(req.body.cuit); //ESTE NO QUEDA EN LA TABLA, PERO SE USA PARA AUTORIZAR EN AFIP (Y AHORRAR UN QUERY)
        let tipoComprobante = sanitizeDecimal(req.body.tipoComprobante);
        let idcli= sanitizeDecimal(req.body.idcli);
        var puntoVenta = sanitizeDecimal(req.body.puntoVenta); 
        let condImpositiva = sanitizeDecimal(req.body.condImpositiva);
        let fechahoy =  moment(new Date()).format('YYYYMMDD');
        let fechaImputable= moment(req.body.fechaImputable).format('YYYYMMDD');
        let precioBruto = sanitizeDecimal(req.body.precioBruto);
        let precioNeto = sanitizeDecimal(req.body.precioNeto);
        let precioTotal = sanitizeDecimal(req.body.precioTotal);
        let cotizacion = sanitizeDecimal(req.body.cotizacion);
        if (cotizacion == null) {cotizacion = 1};
        let iibb= sanitizeDecimal(req.body.IIBB);
        let condicionCobro= sanitizeString(req.body.condicionCobro);
        let entidad = sanitizeString(req.body.entidad);
        let moneda = sanitizeDecimal(req.body.moneda);
        let observaciones = sanitizeString(req.body.observaciones);
        let receiptId;
        
        //FIN SANITIZACION 
        return sequelize.transaction(t => {
              return Comprobante.create({ 
      
                receiptTypeId: tipoComprobante,
                taxConditionId: condImpositiva,
                customerId: idcli,
                sellingPoint: puntoVenta,
                receiptNumber: null,
                cae: null,
                dateDone: fechahoy,
                dateImputed: fechaImputable,
                gross: precioBruto,
                net: precioNeto,
                total: precioTotal,
                iibb: iibb,
                payCondition: condicionCobro,
                entity: entidad,
                currencyId: moneda,
                exchangeRate: cotizacion,
                observations: observaciones  
      
              }, {transaction: t}).then(r2 => {
                Object.keys(req.body.itemsAgregados).map( d => {}); 
                var arr=[];
                receiptId = r2.receiptId;
                for (var i=0; i< req.body.itemsAgregados.length; i++){
                    var item={
                        receiptId: receiptId,
                        description: sanitizeString(req.body.itemsAgregados[i].descripcion),
                        productType: sanitizeDecimal(req.body.itemsAgregados[i].tipo),
                        value: sanitizeDecimal(req.body.itemsAgregados[i].precio),
                        vatId: sanitizeDecimal(req.body.itemsAgregados[i].iva)
                    }
                    arr.push(item);
                }
                return ComprobanteDetalle.bulkCreate(arr, {transaction: t}); //NO PONER RETURNING:TRUE, CAUSA CONFLICTO DE FOREIGN KEY
              });
              
            }).then(async (r4) => {
              await receiptAuthorizer.authorize(receiptId,cuit);
              await comprobanteAll(receiptId, mail, 'verPDF-conEnvio',res);

            })
            .catch(err => {
              if (development){res.status(500).send({ message: "Hubo un error " +err})
              } else {res.status(500).send({ message: "Hubo un error "})}
          });
      }  //FIN CREAR COMPROBANTE


}); //FIN APP POST


var server = app.listen(5000, function () {
  console.log('Server is running...');
}); 

