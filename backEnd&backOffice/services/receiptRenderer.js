// ESTE MODULO TOMA DATOS PARA EL COMPROBANTE, LO PASA AL PRECOMPILADO PUG, 
// ARMA UN HTML Y LO ABRE EN UNA PESTAÑA DEL NAVEGADOR DEFAULT

const path = require('path');
const renderUrl = "http://localhost:3000/comprobante.html";
const fs = require('fs').promises;
const pug = require('pug');
const open = require('open');
const moment = require('moment');
const constants= require(path.join(__dirname,'./constants.js'));
const templateCompilerA= pug.compileFile(path.join(__dirname,'../templates/receiptA.pug'));
const templateCompilerB= pug.compileFile(path.join(__dirname,'../templates/receiptB.pug'));
const wkhtmltopdf = require('wkhtmltopdf');
wkhtmltopdf.command = path.join(__dirname,'../services/wkhtmltox/bin/wkhtmltopdf.exe');  //ESTE ES IMPORTANTE! ARMA EL PDF, Y SI, ES UN EJECUTABLE

module.exports={

        renderer: async function(jdatos, option, res){
            Object.keys(jdatos).map( d => {});
            
            //PREPARACION DE DATOS PARA EL COMPILADOR

            var customer= {
                businessName: jdatos.customer.businessName,
                cuit: jdatos.customer.cuit,
                address: null, 
                locality: 'Desconocido', //PLACEHOLDER
                id: jdatos.customer.id,
                taxCondition: 'Desconocido' //PLACEHOLDER
            }
            if (jdatos.customerAddress.floor == null){
                jdatos.customerAddress.floor = ' - '
            }
            if (jdatos.customerAddress.flat == null){
                jdatos.customerAddress.flat = ' - '
            }

            if (jdatos.customerAddress.locality.id == 5001){
                customer.locality= jdatos.customerAddress.locality.name;//ESTO SE RESUELVE ASI PORQUE EN BASE DE DATOS REPITE LOCALIDAD Y PROVINCIA CON EL MISMO NOMBRE EN EL CASO DE CABA, QUEDA FEO EN PANTALLA
            }
            else{
                customer.locality= jdatos.customerAddress.locality.name+ ', '+jdatos.customerAddress.province.name;
            } 

            customer.address= jdatos.customerAddress.street+' '+jdatos.customerAddress.streetNumber+' Piso '+jdatos.customerAddress.floor+jdatos.customerAddress.flat;

            switch(jdatos.customer.taxConditionId){
                case 1: {customer.taxCondition = 'IVA RESPONSABLE INSCRIPTO'; break}
                case 2: {customer.taxCondition = 'IVA RESPONSABLE NO INSCRIPTO'; break}
                case 3: {customer.taxCondition = 'CONSUMIDOR FINAL'; break}
                case 4: {customer.taxCondition = 'RESPONSABLE MONOTRIBUTO'; break}
                case 5: {customer.taxCondition = 'IVA NO RESPONSABLE'; break}
                case 6: {customer.taxCondition = 'IVA EXENTO'; break}
                case 7: {customer.taxCondition = 'PEQUEÑO CONTRIBUYENTE EVENTUAL'; break}
                case 8: {customer.taxCondition = 'SUJETO NO CATEGORIZADO'; break}    
              }  

            var items= [];
            var calculaIIBB=0;
            var calculaIVA=0;
            for (let i = 0; i< jdatos.receiptDetails.length; i++){
                items[i] = {
                    description: jdatos.receiptDetails[i].description,
                    unitValueNoTax: jdatos.receiptDetails[i].value,
                    unitTaxPercentage: jdatos.receiptDetails[i].aliquotAfip.percentage,
                    total: parseFloat((jdatos.receiptDetails[i].value * (jdatos.receiptDetails[i].aliquotAfip.percentage/100+1)).toFixed(2)),
                    quantity: '1', //siempre 1
                    totalNoTax: jdatos.receiptDetails[i].value //en el facturador manual la cantidad es siempre 1 item, por eso este subtotal no se calcula
                }
                calculaIIBB += items[i].total;
                calculaIVA += items[i].total - items[i].totalNoTax;
            }

            var exchangeRate;
            if (jdatos.exchangeRate == null){
                exchangeRate = 'No aplicable';
            } else {exchangeRate = jdatos.exchangeRate;}

            var observations;
            if (jdatos.observations == null){
                observations = 'Ninguna';
            } else {observations = jdatos.observations;}

            var receiptType = jdatos.receiptType.description; 
            var net= jdatos.gross; //la suma de los items con su IIBB.
            var vatAmount= calculaIVA.toFixed(2); //La suma de todos los IVAs aplicados a cada item
            var iibbAmount= (jdatos.total - calculaIIBB).toFixed(2);; //Al total le resto la suma de los items con sus ivas, lo que queda es IIBB
            var iibb = jdatos.iibb; //el porcentaje que se esta aplicando
            var cae = jdatos.cae;
            var roundDifference = 'XXX' //como lo calculo??? FALTA
            var dateDone= moment(jdatos.dateDone).format('DD-MM-YYYY');; //fecha de emision
            var dateImputed= moment(jdatos.dateImputed).format('DD-MM-YYYY');; //fecha imputada 
            var displayNumber = jdatos.receiptNumber; //numero de factura
            var receiptTypeCode = this.pad_with_zeroes(jdatos.receiptTypeId,2);
            var total = jdatos.total;
            var collectionMethod = jdatos.payCondition;
            var barcode = this._generateBarcode(jdatos.receiptTypeId, jdatos.sellingPoint, jdatos.cae, jdatos.dateDone);
            var currency = jdatos.currency.currency;
            //FIN DE PREPARACION DE DATOS PARA PRECOMPILADO

            //SELECCION DE TIPO DE FACTURA. LA MAYOR DIFERENCIA ES QUE UNA DISCRIMINA IVA Y LA OTRA NO.
            
            if (jdatos.customer.taxConditionId == 1){
                var receiptTypeLetter = 'A';
                await fs.writeFile("comprobante.html", templateCompilerA({ customer, items, roundDifference, cae, dateDone, dateImputed, receiptTypeLetter,receiptType,exchangeRate,displayNumber,receiptTypeCode,net,iibb, vatAmount, iibbAmount, total,collectionMethod, observations,barcode, currency}))
                return await this.crearPDF(option, res);
            }
            else{
                var receiptTypeLetter = 'B';
                await fs.writeFile("comprobante.html", templateCompilerB({ customer, items, roundDifference, cae, dateDone, dateImputed, receiptTypeLetter,receiptType,exchangeRate,displayNumber,receiptTypeCode,net,iibb, vatAmount, iibbAmount, total,collectionMethod, observations,barcode, currency}))
                return await this.crearPDF(option,res);
            }
        }, 
        
        crearPDF: function(option,res) { //HAY UNA FORMA DE QUE WKHTMLTOPDF ENVIE UNA SEÑAL DE FINALIZADO, O AWAIT?
            wkhtmltopdf(renderUrl, {output: 'comprobante.pdf',pageSize: 'letter'});
            console.log("PDF generado");
            if (option == 'verPDF-sinEnvio' || option == 'verPDF-conEnvio') {
                setTimeout(function(){ //LO SIENTO, WKHTMLTOPDF HACE EL ARCHIVO SILENCIOSAMENTE Y NO AVISA QUE ESTA LISTO.
                        console.log("abriendo en browser");
                        open('comprobante.pdf');
                      }, 2000);
                      
            }
            if (option == 'verPDF-sinEnvio') {res.status(200).send({'createPDF': true})}; //DEVUELVE PORQUE NO HAY MAS PASOS A CUMPLIR
            return true;
            
        },

        _generateBarcode: function(receiptTypeId, sellingPoint, cae, expirationDate) {
            //SEGUN AFIP EL CODIGO DE BARRAS SE COMPONE: CUIT (11 CHARS), TIPO DE COMPROBANTE (3 CHARS), PUNTO DE VENTA (5 CHARS), CAE (14 CHARS), FECHA DE VENCIMIENTO (8 CHARS), DIGITO VERIFICADOR (1 CHAR)

            expirationDate = moment(expirationDate).format('YYYYMMDD'); //de donde saldra este valor? 
            receiptTypeId = this.pad_with_zeroes(receiptTypeId,3);
            sellingPoint = this.pad_with_zeroes(receiptTypeId,5);
            const barcodeNumber = `${constants.CUIT_CRONISTA}${receiptTypeId}${sellingPoint}${cae}${expirationDate}`;
          
            return barcodeNumber + this._barcodeVerificationNumber(barcodeNumber);
        },

        _barcodeVerificationNumber: function(barcodeNumber){
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
          },
          pad_with_zeroes: function(number, length) {
                var my_string = '' + number;
                while (my_string.length < length) {
                    my_string = '0' + my_string;
                }

          return my_string;

          }

    
}