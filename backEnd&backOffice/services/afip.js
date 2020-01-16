const _ = require('lodash');
const moment = require('moment');
const http = require('http');
const async = require('async');
const soap = require('soap');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const fs = require('fs');
const config = require('../config/afip.js');
const request = require('request-promise');
//const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; //FACILITA EL USO DE OPERADORES
const sequelize = new Sequelize('interfaz', 'jromano', '20R0m@n018', {
  host: process.env.DATABASE_HOST,
  dialect:  'mssql',
  dialectOptions: {options: {encrypt: true}},
  pool: {
    max: 30,
    min: 0,
    acquire: 30000,
    idle: 20000,
    evict: 20000
  }
});

const ValidacionComprobante = sequelize.import(path.join(__dirname, '../models/receiptLog.js')); 
const constants = require('../services/constants');
const logger = require('../services/logger');


//POR LA FORMA EN LA QUE RECONVIERTE ARRAYS EN SOAP, CREA NUEVOS TAGS IVA EN LUGAR DE METERLOS BAJO UN SOLO IVA 
//QUE ES LO QUE PIDE AFIP. ESTE BLOQUE QUITA TODOS LOS TAGS INTERMEDIOS, SE EJECUTA AL FINAL DE LA SECUENCIA,
//JUSTO ANTES DE ENVIAR.
soap.WSDL.changeXML = function(xml) {
    while(xml.indexOf('</Iva><Iva>') > 0){
        xml = xml.replace('</Iva><Iva>', '');
        logger.debug('WRAP !! XML Changed !!');  
    }
    return xml;
};



soap.WSDL.prototype.objectToDocumentXML = function(
  name,
  params,
  ns,
  xmlns,
  type
) {
  const args = {};
  args[name] = params;
  const parameterTypeObj = null;
  if (this.namespaceNumber) {
    this.namespaceNumber = 0;
  }
  let wrap = this.objectToXML(
    args,
    null,
    ns,
    xmlns,
    true,
    null,
    parameterTypeObj
  );
  wrap = soap.WSDL.changeXML(wrap);
  return wrap;
};

const _getFactura = (receipt, receiptNumber) => {


  const Iva = _(receipt.receiptDetails)
    .groupBy('vatId')
    .map((objs, key) => ({
      AlicIva: {
        Id: key,
        BaseImp: parseFloat(_.sumBy(objs, 'value').toFixed(2)), //el valor total del item
        Importe: parseFloat((_.sumBy(objs, 'value') * (objs[0].aliquotAfip.percentage / 100)).toFixed(2)) //valor del impuesto sobre el total del item
      }
    }))
    .value();

    var sumaIvas = 0;
    for(i = 0; i<Iva.length; i++){
        sumaIvas +=parseFloat(Iva[i].AlicIva.Importe);
    }
    sumaIvas = parseFloat(sumaIvas.toFixed(2));

  const AlicTributos = (receipt.total - receipt.gross - sumaIvas).toFixed(2); //tributos que no sean IVA
  const Tributos = [ 
    {
      Tributo: {
        Id: constants.AFIP_IIBB_ID,
        Desc: constants.AFIP_IIBB_DESCRIPTION,
        BaseImp: receipt.gross,
        Alic: receipt.iibb,
        Importe: AlicTributos
      }
    }
  ];
  const today = moment().format('YYYYMMDD');

  return {
    Concepto: constants.AFIP_CONCEPTO_PRODUCTO,
    DocTipo: constants.AFIP_DOC_TIPO_CUIT,
    DocNro: receipt.cuit,
    CbteDesde: receiptNumber,
    CbteHasta: receiptNumber,
    CbteFch: today,
    ImpTotal: receipt.total,
    ImpTotConc: 0,
    ImpNeto: receipt.gross,
    ImpOpEx: 0,
    ImpTrib: AlicTributos, 
    ImpIVA: sumaIvas, //suma de los importes del array de IVA
    MonId: receipt.currency.idAFIPcurrency,
    MonCotiz: receipt.exchangeRate,
    Iva,
    Tributos
  };
};

const _createClientePromisified = () => {
  const options = {
    ignoredNamespaces: true
  };
  const serviceUrl = config.url + config.service;
console.log(serviceUrl);
  return new Promise((resolve, reject) => {
    soap.createClient(serviceUrl, options, function(err, client) {
      if (err) {
        logger.error(err);
        reject(err);
      }
      client.wsdl.definitions.xmlns.ns1 = config.url;
      client.wsdl.xmlnsInEnvelope = client.wsdl._xmlnsMap();
      client.on('message', function(xml) {
        logger.debug('client XML', xml);
        xml = '';
      });
      
      resolve(client);
    });
  });
};

let client = null;

const _getClient = async () => {
  if (client) {
    return client;
  }
  client = await _createClientePromisified();
  logger.debug('CLIENT CREATED');
  return client;
};

const _getAuth = async () => {

  var auth = await request({
    uri: config.uritoken,
    json: true
  });


  //ESTE BLOQUE RESUELVE SI ENCUENTRA DATOS EN FORMATO XML Y NO EN JSON
  if (!auth.Sign){
    console.log("Intentando leer XML");
    xmlAuth= JSON.stringify(auth);
    var matchToken = xmlAuth.match(/<token>([^<]*)<\/token>/);
    var matchSign = xmlAuth.match(/<sign>([^<]*)<\/sign>/);
    auth= {};
    auth.Token = matchToken[1];
    auth.Sign = matchSign[1];
  }
  if (!auth.Sign) {throw 'No se pudo leer los datos de autorizacion para AFIP'};

  const WSAfipAuth = {
    Cuit: config.cuit,
    Sign: auth.Sign,
    Token: auth.Token
  };
  logger.debug('AUTH CREATED');
  return WSAfipAuth;
};

async function getLastReceiptNumber(receiptType, sellingPoint) {
  // 1: Factura A
  // 2: Nota de Débito A
  // 3: Nota de Crédito A
  // 6: Factura B
  // 7: Nota de Débito B
  // 8: Nota de Crédito B

  const client = await _getClient();
  const auth = await _getAuth();

  const FECompUltimoAutorizadoArgs = {
    Auth: auth,
    CbteTipo: receiptType,
    PtoVta: sellingPoint
  };

  return await new Promise((resolve, reject) => {
    client.FECompUltimoAutorizado(FECompUltimoAutorizadoArgs, function(
      err,
      result
    ) {
      console.log('Factura FECompUltimoAutorizado Rta:', result);
      if (err) {
        reject(err);
      }
      if (result.FECompUltimoAutorizadoResult.Errors) {
        logger.error(
          'Factura FECompUltimoAutorizado ERR:',
          result.FECompUltimoAutorizadoResult.Errors.Err
        );
        reject(result.FECompUltimoAutorizadoResult.Errors.Err);
      } else {
        resolve(1 + result.FECompUltimoAutorizadoResult.CbteNro);
      }
    });
  });
}

async function makeInvoice(receipt, receiptNumber) {
  console.log("Make invoice...");
  const client = await _getClient();
  const auth = await _getAuth();

  const factura = _getFactura(receipt, receiptNumber);

  logger.debug('RENGLONES RESULTANTES', factura);

  const solicitarArgs = {
    Auth: auth,
    FeCAEReq: {
      FeCabReq: {
        CantReg: 1,
        CbteTipo: receipt.receiptTypeId,
        PtoVta: receipt.sellingPoint
      },
      FeDetReq: {
        FECAEDetRequest: [factura]
      }
    }
  };

  const result = await new Promise((resolve, reject) => {
    console.log("FECAESolicitar");
    client.FECAESolicitar(solicitarArgs, function(error, result) {
      ValidacionComprobante.create({
        receiptId: receipt.receiptId,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        request: JSON.stringify(client.lastRequest),
        response: JSON.stringify(client.lastResponse),
        error: error ? JSON.stringify(error) : error
      });
      if (error || result.FECAESolicitarResult.Errors) {
        reject(result.FECAESolicitarResult.Errors);
      } else {
        resolve(result);
      }
    });
  });

  if (result.FECAESolicitarResult.FeCabResp.Resultado == 'A') {
    logger.info('Factura NRO: ' + receiptNumber + ' APROBADA.');
    const response = result.FECAESolicitarResult.FeDetResp.FECAEDetResponse[0];
    return { cae: response.CAE, date: response.CbteFch };
  } else {
    logger.info('Factura NRO: ' + receiptNumber + ' RECHAZADA.');
    const message = _.map(
      result.FECAESolicitarResult.FeDetResp.FECAEDetResponse[0].Observaciones
        .Obs,
      'Msg'
    ).join(', ');
    throw new Error(message);
  }
}

async function getInvoice(receipt) {
  const client = await _getClient();
  const auth = await _getAuth();

  const solicitarArgs = {
    Auth: auth,
    FeCompConsReq: {
      CbteTipo: receipt.receiptTypeId,
      CbteNro: receipt.receiptNumber,
      PtoVta: receipt.sellingPoint
    }
  };

  return await new Promise((resolve, reject) => {
    client.FECompConsultar(solicitarArgs, function(err, result) {
      logger.debug('LAST REQUEST', client.lastRequest);
      const afipErrors = _.get(result, 'FECompConsultarResult.Errors.Err');
      if (err || afipErrors) {
        if (_.find(afipErrors, { Code: 602 })) {
          resolve(null);
        } else {
          reject(afipErrors);
        }
      } else {
        resolve(result.FECompConsultarResult.ResultGet);
      }
    });
  });
}

module.exports = {
  getLastReceiptNumber,
  makeInvoice,
  getInvoice
};
