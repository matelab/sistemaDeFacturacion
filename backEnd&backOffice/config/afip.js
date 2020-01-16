const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    cuit: process.env.AFIP_CUIT,
    url: process.env.AFIP_URL,
    service: '/service.asmx?WSDL',
    ptovta: process.env.AFIP_PTOVTA,
    uritoken: process.env.AFIP_URITOKEN
  },
  test: {
    cuit: 20262602819,
    url: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
    service: '/service.asmx?WSDL',
    ptovta: 1,
    uritoken: 'http://192.168.0.9/wsafip/Service1.svc/GetToken'
  },
  production: {
    cuit: process.env.AFIP_CUIT,
    url: process.env.AFIP_URL,
    service: process.env.AFIP_SERVICE,
    ptovta: process.env.AFIP_PTOVTA,
    uritoken: process.env.AFIP_URITOKEN
  }
};

module.exports = config[env];
