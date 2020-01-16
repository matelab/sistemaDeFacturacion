#!/usr/bin/php
<?php
#==============================================================================
define ("WSDL", "wsaa.wsdl");     # The WSDL corresponding to WSAA
define ("CERT", "AmbienteDesarrollo.crt");       # The X.509 certificate in PEM format
define ("PRIVATEKEY", "AmbienteDesarrollo.key"); # The private key correspoding to CERT (PEM)
define ("PASSPHRASE", "AmbienteDesarrollo.key"); # The passphrase (if any) to sign
define ("PROXY_HOST", "proxyiplan"); # Proxy IP, to reach the Internet
define ("PROXY_PORT", "8080");            # Proxy TCP port
define ("URL", "https://wsaahomo.afip.gov.ar/ws/services/LoginCms");
#define ("URL", "https://wsaa.afip.gov.ar/ws/services/LoginCms"); #este es para produccion de afip, mucho cuidado
#==============================================================================
function CreateTRA($SERVICE)
{
  $TRA = new SimpleXMLElement(
    '<?xml version="1.0" encoding="UTF-8"?>' .
    '<loginTicketRequest version="1.0">'.
    '</loginTicketRequest>');
  $TRA->addChild('header');
  $TRA->header->addChild('uniqueId',date('U'));
  $TRA->header->addChild('generationTime',date('c',date('U')-60));
  $TRA->header->addChild('expirationTime',date('c',date('U')+600));
  $TRA->addChild('service',$SERVICE);
  $TRA->asXML('TRA.xml');
}
#==============================================================================
function SignTRA()
{
  $pri = 'file://'.realpath('C:\xamp-php-5.4\htdocs\AmbienteDesarrollo.key');
  $cer = 'file://'.realpath('C:\xamp-php-5.4\htdocs\AmbienteDesarrollo.crt');
  $STATUS=openssl_pkcs7_sign("C:\\xamp-php-5.4\\htdocs\\TRA.xml", "C:\\xamp-php-5.4\\htdocs\\TRA.tmp", $cer,
    array($pri, PASSPHRASE),
    array(),
    !PKCS7_DETACHED
    );
  if (!$STATUS) {exit("ERROR generating PKCS#7 signature\n");}
  $inf=fopen("TRA.tmp", "r");
  $i=0;
  $CMS="";
  while (!feof($inf)) 
    { 
      $buffer=fgets($inf);
      if ( $i++ >= 4 ) {$CMS.=$buffer;}
    }
  fclose($inf);
  unlink("TRA.tmp");
  return $CMS;
}
#==============================================================================
function CallWSAA($CMS)
{
  $client=new SoapClient(WSDL, array(
          'proxy_host'     => PROXY_HOST,
          'proxy_port'     => PROXY_PORT,
          'soap_version'   => SOAP_1_2,
          'location'       => URL,
          'trace'          => 1,
          'exceptions'     => 0
          )); 
  $results=$client->loginCms(array('in0'=>$CMS));
  file_put_contents("request-loginCms.xml",$client->__getLastRequest());
  file_put_contents("response-loginCms.xml",$client->__getLastResponse());
  if (is_soap_fault($results)) 
    {exit("SOAP Fault: ".$results->faultcode."\n".$results->faultstring."\n");}
  return $results->loginCmsReturn;
}
#==============================================================================
ini_set("soap.wsdl_cache_enabled", "0");
$argv =[];
$argv[1] = 'wsfe'; //wsfe para factura, ws_sr_padron_a5 para consulta de padron, wsrgiva para condicion de iva
if (!file_exists(CERT)) {exit("Failed to open ".CERT."\n");}
if (!file_exists(PRIVATEKEY)) {exit("Failed to open ".PRIVATEKEY."\n");}
if (!file_exists(WSDL)) {exit("Failed to open ".WSDL."\n");}
$SERVICE=$argv[1];
CreateTRA($SERVICE);
$CMS=SignTRA();
$TA=CallWSAA($CMS);
if (!file_put_contents("TA.xml", $TA)) {exit();}
