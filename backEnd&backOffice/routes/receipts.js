const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const db = require('../models');
const Money = require('../utils/money');
const constants = require('../services/constants');
const authenticationService = require('../services/authentication');
const Unauthorized = require('../errors/unauthorized');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');

const _barcodeVerificationNumber = barcodeNumber => {
  const digits = barcodeNumber.split('');
  let step1 = 0,
    step2 = 0,
    step3 = 0,
    step4 = 0,
    step5 = 0;

  //Etapa 1:
  //Comenzar desde la izquierda, sumar todos los caracteres ubicados en las posiciones impares.
  for (i = 0; i < barcodeNumber.length; i++, i++) {
    step1 += Number(digits[i]);
  }
  //Etapa 2:
  //Multiplicar la suma obtenida en la etapa 1 por el número 3.
  step2 = step1 * 3;

  //Etapa 3:
  //Comenzar desde la izquierda, sumar todos los caracteres que están ubicados en las posiciones pares.
  for (i = 1; i < barcodeNumber.length; i++, i++) {
    step3 += Number(digits[i]);
  }

  //Etapa 4:
  //Sumar los resultados obtenidos en las etapas 2 y 3.
  step4 = step2 + step3;

  //Etapa 5: Buscar el menor número que sumado al resultado obtenido en la etapa 4 dé un número múltiplo de 10.
  //Este será el valor del dígito verificador del módulo 10.
  step5 = (10 - step4 % 10) % 10;

  return step5;
};

const _generateBarcode = receipt => {
  const barcodeNumber = `${constants.CUIT_CRONISTA}${receipt.typeCode()}${receipt.sellingPointCode()}${receipt.cae}${moment(
    receipt.expirationDate()
  ).format('YYYYMMDD')}`;

  return barcodeNumber + _barcodeVerificationNumber(barcodeNumber);
};

router.get('/:id', async (req, res) => {
  const receipt = await db.receipt.findById(req.params.id, {
    include: [
      { model: db.receiptType },
      { model: db.valorization },
      {
        model: db.subscription,
        include: [{ model: db.collectionMethod }]
      },
      {
        model: db.receiptDetail,
        include: [{ model: db.aliquotAfip }]
      },
      {
        model: db.customer,
        include: [
          { model: db.taxCondition },
          {
            model: db.customerAddress,
            as: 'addresses',
            include: [{ model: db.province }, { model: db.locality }]
          }
        ]
      }
    ]
  });

  if (!receipt) {
    throw new NotFound();
  }

  if (req.user.customer.id !== receipt.customer.id && !req.user.isAdmin) {
    throw new Forbidden();
  }

  const {
    customer,
    cae,
    receiptType,
    subscription,
    sellingPoint,
    valorization
  } = receipt;
  const address = receipt.customer.addresses[0];
  const dateFormat = 'DD/MM/YYYY';

  const items = _.map(receipt.receiptDetails, item => {
    const unitValue = new Money(
      item.unitValue + item.unitValue * item.aliquotAfip.percentage / 100
    );
    const unitValueNoTax = new Money(item.unitValue);
    const unitTaxPercentage = new Money(item.aliquotAfip.percentage);
    return {
      description: item.description,
      unitValue,
      unitValueNoTax,
      unitTaxPercentage,
      quantity: item.quantity,
      total: unitValue.multiply(item.quantity),
      totalNoTax: unitValueNoTax.multiply(item.quantity),
    };
  });

  const receiptTypeDesc = receiptType.description;
  const receiptData = {
    receiptType: receiptTypeDesc.substring(0, receiptTypeDesc.length - 2),
    receiptTypeLetter: _.upperCase(_.last(receiptTypeDesc)),
    receiptTypeCode: receipt.typeCode(),
    displayNumber: receipt.displayNumber(),
    date: moment(receipt.date).format(dateFormat),
    customer: {
      id: customer.id,
      businessName: customer.businessName,
      cuit: customer.cuit,
      taxCondition: customer.taxCondition.description,
      address: `${address.street} ${address.streetNumber} ${address.floor
        ? 'Piso ' + address.floor + '° '
        : ' '}${address.flat ? address.flat : ''} (${address.zipCode})`,
      locality: `${address.locality.name}, ${address.province.name}`
    },
    subscription: {
      id: subscription.id,
      collectionMethod: subscription.collectionMethod.description
    },
    items,
    netTaxed: new Money(receipt.net + receipt.vat),
    iibb: new Money(receipt.iibb),
    roundDifference: new Money(
      receipt.total - _.sumBy(items, i => i.total.amount) - receipt.iibb
    ),
    net: new Money(receipt.net),
    vat: new Money(receipt.vat),
    total: new Money(receipt.total),
    cae,
    expirationDate: moment(receipt.expirationDate()).format(dateFormat),
    barcode: _generateBarcode(receipt)
  };

  if (receipt.receiptTypeId === constants.RECEIPT_FACTURA_A || receipt.receiptTypeId === constants.RECEIPT_FACTURA_B) {
    receiptData.period = {
      start: moment(valorization.startDate).format(dateFormat),
      end: moment(valorization.endDate).format(dateFormat)
    };
  }

  if(receiptData.receiptTypeLetter == 'A')
    res.render('receiptA', receiptData);
  if(receiptData.receiptTypeLetter == 'B')
    res.render('receiptB', receiptData);

});

module.exports = router;
