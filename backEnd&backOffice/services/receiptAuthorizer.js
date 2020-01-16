const afip = require('../services/afip');
//const db = require('../models');
const logger = require('../services/logger');
const BadRequest = require('../errors/badRequest');
const path = require('path');

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
    idle: 20000
  }
});
const Comprobante = sequelize.import(path.join(__dirname, '../models/receiptTesting.js')); 
const ComprobanteDetalle = sequelize.import(path.join(__dirname, '../models/receiptDetail.js')); 
const Cliente = sequelize.import(path.join(__dirname, '../models/customer.js')); 
const AFIPAlicuota = sequelize.import(path.join(__dirname, '../models/aliquotAfip.js')); 
const Moneda = sequelize.import(path.join(__dirname, '../models/currency.js')); 
Cliente.hasMany(Comprobante, {foreignKey: 'idCliente'});
Comprobante.belongsTo(Cliente,{ foreignKey: 'idCliente' });
Comprobante.hasMany(ComprobanteDetalle, {foreignKey: 'idComprobante'});
Comprobante.belongsTo(Moneda, {foreignKey: 'idMoneda'});
ComprobanteDetalle.belongsTo(Comprobante, {foreignKey: 'idComprobante'});
ComprobanteDetalle.belongsTo(AFIPAlicuota, {foreignKey: 'idAFIPAlicuota'});


const _updateReceipt = (receiptId, fields) =>
  Comprobante.update(fields, { where: { receiptId } });

// Use it very carefully
const authorize = async function(receiptId,cuitcliente) {
  console.log("Tomando datos de la base de datos de: "+receiptId, 'cuit: '+cuitcliente);
  const receipt = await Comprobante.findByPk(receiptId, {
    include: [
      {model: ComprobanteDetalle,required: true, include: [{ model: AFIPAlicuota, required: true }]},
      {model: Moneda, required: true}
    ]
  });
  receipt.cuit= cuitcliente;
  if (receipt.cae) {
    throw new BadRequest(
      `Receipt #${receiptId} is already authorized (CAE: ${receipt.cae})`
    );
  }

  if (receipt.receiptNumber && !receipt.cae) {
    console.log("Autorizando en AFIP");
    const invoice = await afip.getInvoice(receipt);
    if (invoice) {
      await _updateReceipt(receiptId, { cae: invoice.CodAutorizacion });
      return;
    }
  }

  const receiptNumber = await afip.getLastReceiptNumber(
    receipt.receiptTypeId,
    receipt.sellingPoint
  );

  await _updateReceipt(receiptId, { receiptNumber });

  let authorizationReponse;
  try {
    authorizationReponse = await afip.makeInvoice(receipt, receiptNumber);
  } catch (error) {
    await _updateReceipt(receiptId, { receiptNumber: null });
    throw error;
  }

  await _updateReceipt(receiptId, {
    cae: authorizationReponse.cae,
    date: authorizationReponse.date
  });

  logger.info(
    `FACTURADO  RECEIPT ID: ${receiptId} CAE: ${authorizationReponse.cae}`
  );
};

module.exports = {
  authorize
};
