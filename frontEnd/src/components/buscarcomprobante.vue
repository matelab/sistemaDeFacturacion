<!--TEMPLATE VISIBLE -->
<!--este quedo a medio transformar de ecommerce a maestros, ojo -->
<template>
  <div id="busqueda" class= "centered cuerpo">
        <h2 class="centered">Buscar por {{variablesEntorno.seleccionOpcion}} </h2>
        
        <table class=" table tablaparainputs">
        <tbody>
            <tr>
                <td><p>Por cliente</p> <input class = "check" type="radio" name= "radiobusq" v-model="variablesEntorno.seleccionOpcion" value="cliente"> </td>
                <td><p>Por comprobante</p> <input  class = "check" type="radio" name= "radiobusq" v-model="variablesEntorno.seleccionOpcion" value="comprobante"></td>
                <td><p>Por fecha</p><input  class = "check" type="radio" name= "radiobusq" v-model="variablesEntorno.seleccionOpcion" value="fecha"> </td>
            </tr>
            <tr>
                <td><p>Punto de Venta</p></td>
                <td><select id= "puntoVenta" v-model="variablesEntorno.puntoVenta" class="dropmenu">
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select></td>
                <td><p>Con CAE <input class = "check" type="checkbox" id="conCAE" v-model="variablesEntorno.conCAEView"></p></td>
            </tr>
        </tbody>
        </table>
        
  
        
        
        <div v-if="variablesEntorno.seleccionOpcion === 'cliente'">
              <input  class="inputs" v-model="variablesEntorno.razonSocialView" placeholder="Razon Social">
              <input  class="inputs" type="number" min= "0" v-model="variablesEntorno.idcliView" placeholder="Numero de cliente">
             <span v-if= "!variablesEntorno.isLoading"> <button @click="buscarxcli" class="btn btn-primary">Buscar</button></span>
              <span v-if= "variablesEntorno.isLoading"> <button class="btn btn-secondary">Buscando...</button></span>
        </div>
        <div v-if="variablesEntorno.seleccionOpcion === 'comprobante'">
              <input  class="inputs" type="number" min= "0" v-model="variablesEntorno.nrocomprobanteView" placeholder="ID de Comprobante">
              <span v-if= "!variablesEntorno.isLoading"> <button @click="buscarxcomp" class="btn btn-primary">Buscar</button></span>
              <span v-if= "variablesEntorno.isLoading"> <button class="btn btn-secondary">Buscando...</button></span>
        </div>   
        <div v-if="variablesEntorno.seleccionOpcion === 'fecha'">
          <table  class=" table tablaparainputs borderless"><tbody><tr>
              <td style="padding-left:5%"><datepicker :format="FechaView" :bootstrap-styling="true" v-model="variablesEntorno.fechadesdeView" class="inputs" ></datepicker></td>
              <td style="padding-left:5%"><datepicker :format="FechaView" :bootstrap-styling="true" v-model="variablesEntorno.fechahastaView" class="inputs" ></datepicker></td>
              <td v-if= "!variablesEntorno.isLoading"><button @click="buscarxfecha" class="btn btn-primary" style="margin:10px">Buscar</button></td>
              <td v-if= "variablesEntorno.isLoading"> <button class="btn btn-secondary" style="margin:10px">Buscando</button></td>
          </tr></tbody></table>
        </div>
 <br>
        
        <h1 v-if="variablesEntorno.isLoading">Cargando datos, espere por favor...</h1>
<br>
<br>
<br>
<br>
<br>
<br>
    <div class = "tabla">
  <table v-if="variablesEntorno.showresults" class = "table table-striped w-auto">
      		<thead>
				  <tr>
					<th><p> Cliente </p></th>
					<th><p> Nro. comprobante </p></th>
          <th><p> Tipo </p></th>
					<th><p> Fecha </p></th>
          <th><p> Precio Bruto </p></th>
          <th><p> Moneda </p></th>
          <th><p> Detalles </p></th>
				</tr>
			</thead>
            <tbody>

        <tr v-for="dat in variablesEntorno.list" :key="dat.dateDone">
      <td><p>{{ dat.customer.businessName }}</p></td>  
      <td><p>{{ dat.receiptNumber }}</p></td> 
      <td><p>{{ dat.receiptType.description }}</p></td> 
      <td><p>{{ FechaView(dat.dateDone) }}</p></td>
      <td><p>{{ dat.gross }}</p></td>      
      <td><p>{{ dat.currency.currency }}</p></td>   
       <td><button @click="MostrarDetalles(dat)" class="btn btn-primary">Detalles</button></td> 
      </tr>
      </tbody>
     </table>
    </div>



<!--MODAL PARA MOSTRAR DETALLES DE COMPROBANTE-->
<div v-if="variablesEntorno.showModal" type="text/x-template" id="modal-template">
 <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
             <h3>Mostrando detalle de {{variablesEntorno.detallesTipoComprobante}} Nro: {{variablesEntorno.detallesNroComprobante}}</h3>
          </div>
          <div class="modal-body">
              <p><b>CLIENTE: </b>{{variablesEntorno.detallesRazonSocial}}, <b>CUIT:</b> {{variablesEntorno.detallesCUIT}}</p>
              <p><b>ID: </b>{{variablesEntorno.detallesIdCliente}}, <b>Cond. Impositiva: </b>{{variablesEntorno.detallesCondImpositiva}}</p>
              <P><b>Email: </b>{{variablesEntorno.detallesEmail}}, <b>Teléfono: </b> ({{variablesEntorno.detallesPrefijo}}) {{variablesEntorno.detallesTelefono}} int {{variablesEntorno.detallesInterno}}</p>
              <br>
              <p><b>Fecha Realizado: </b>{{FechaView(variablesEntorno.detallesFechaRealizado)}}, <b>Fecha Imputable: </b>{{FechaView(variablesEntorno.detallesFechaImputable)}}</p>
              <p><b>CAE: </b>{{variablesEntorno.detallesCAE}}, <b>IIBB: </b>{{variablesEntorno.detallesIIBB}}%</p> 
              <br>
              <p v-if="variablesEntorno.detallesCotizacion != 'No aplicable'"><b>Cotización utilizada: </b>${{variablesEntorno.detallesCotizacion}}</p>
              <h3 v-if="!variablesEntorno.showDetalles">Buscando...</h3>
              <table v-if="variablesEntorno.showDetalles" class ="table table-striped w-auto">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descripcion</th>
                      <th>Precio Bruto</th>
                      <th>IVA %</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                        <tr v-for="det in variablesEntorno.listDetalles" :key="det.value">
                            <td>{{ det.TypeofProduct.description }}</td>
                            <td>{{ det.description }}</td> 
                            <td>{{ det.value }}</td>
                            <td>{{ det.aliquotAfip.percentage }}</td>
                            <td>{{ CalcularSubtotal(det.value, det.aliquotAfip.percentage, variablesEntorno.detallesIIBB).toFixed(2) }}</td>     
                            
                        </tr>
                  </tbody>
              </table>
              <h3 v-if="variablesEntorno.showDetalles">Total: {{variablesEntorno.detallesMoneda}} {{CalcularTotal.toFixed(2)}}</h3>
              <h3 v-if="variablesEntorno.detallesCotizacion != 'No aplicable' && variablesEntorno.showDetalles">Total en pesos: ${{(CalcularTotal * variablesEntorno.detallesCotizacion).toFixed(2)}}</h3>
          </div>
          <div class="modal-footer">
              <p><button class="btn btn-primary" @click="CerrarDetalles()">Cerrar</button>
              <button class="btn btn-primary" @click="MostrarComprobante(variablesEntorno.detallesIdComprobante,null)">Ver PDF</button>
              <button v-if="!variablesEntorno.envioMail" class="btn btn-danger" @click="variablesEntorno.envioMail = true">E-Mail al Cliente</button>
              <input v-if="variablesEntorno.envioMail" class="inputs" v-model="variablesEntorno.detallesEmail" placeholder= variablesEntorno.detallesEmail>
              <button v-if="variablesEntorno.envioMail" class="btn btn-danger" @click="MostrarComprobante(variablesEntorno.detallesIdComprobante,variablesEntorno.detallesEmail)">Enviar</button></p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div> <!--FIN MODAL-->
  

   </div>
</template>

<script>




//SETTINGS E INICIALIZACIONES
import Vue from 'vue';
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import {DevolverTexto, DevolverNumero} from '@/components/condicionimpositiva.component.js';

const link = {
    url: "http://localhost:5000/" //la direccion del backend, esto deberia sacarlo del ENV
}; 
const variablesEntorno = {
    isLoading: false,
    showresults: false,
    showModal: false,
    list: null,
    listDetalles: null,
    listCli: null,
    seleccionOpcion: 'cliente',
    puntoVenta: 9,
    conCAE:null,
    idcli: null,
    razonSocial: null,
    fechadesde: null,
    fechahasta: null,
    nrocomprobante: null,
    idcliView:null,   //las variables xxxView son las que ve el usuario, pero no las que se envian al backend
    razonSocialView:null,
    nrocomprobanteView:null,
    conCAEView: true,
    fechadesdeView:new Date(),
    fechahastaView:new Date(),
    //DETALLES COMPROBANTE
    showDetalles: false,
    detallesIdComprobante: null,
    detallesTipoComprobante: null,
    detallesRazonSocial: null,
    envioMail: false,
    detallesEmail: 'Ninguno',
    detallesPrefijo: null,
    detallesTelefono: null,
    detallesInterno:null,
    detallesCUIT: null,
    detallesIdCliente: null,
    detallesCondImpositiva: null,
    detallesNroComprobante: null,
    detallesFechaRealizado: null,
    detallesFechaImputable: null,
    detallesCAE: null,
    detallesPuntoVenta: null,
    detallesIIBB: null,
    detallesMoneda: null,
    detallesPrecioBruto: null,
    detallesSumarSubtotales: 0,
    detallesCotizacion: null
};






//METODOS Y COMPORTAMIENTO
//dependiendo de que opcion de busqueda haya seleccionado el usuario, envia un dato diferente al backend para su proceso
//OJO, PARA QUE FUNCIONE 'application/json' EN PRUEBAS LOCALHOST HAY QUE DESACTIVAR CORS EN EL BROWSER, POR UN TEMA DE CROSS ORIGIN QUE NO SUCEDE EN PRODUCCION
export default {
    components:{ //AQUI VAN COMPONENTES IMPORTADOS
        Datepicker,
        moment
    },
    methods:{

      FechaView(date) {
        return moment(date).format('DD-MM-YYYY');
      },
      
      buscarxcli: function(){
        if ((variablesEntorno.razonSocialView=== null || variablesEntorno.razonSocialView=== '')&&(variablesEntorno.idcliView === null || variablesEntorno.idcliView === '')){ //AMBOS CAMPOS NO PUEDEN SER NULL
          alert("Debe ingresar al menos un valor");
        }else{
        variablesEntorno.showresults=false;
        variablesEntorno.isLoading=true;
        //transformacion de los datos para sanitizar y volver utiles para la query
        if(variablesEntorno.razonSocialView=== ''){variablesEntorno.razonSocial = null}
        else {variablesEntorno.razonSocial = variablesEntorno.razonSocialView}
        if(variablesEntorno.idcliView == ''){variablesEntorno.idcli = null}
        else {variablesEntorno.idcli = variablesEntorno.idcliView}
        variablesEntorno.conCAE = variablesEntorno.conCAEView;
        //envio
        axios.post(link.url,{
                            'razonSocial':variablesEntorno.razonSocial,
                            'idcli':variablesEntorno.idcli,
                            'seleccionOpcion':variablesEntorno.seleccionOpcion,
                            'puntoVenta': variablesEntorno.puntoVenta,
                            'conCAE': variablesEntorno.conCAE,
                            },{headers: { 'Content-Type': 'application/json'}}) 
            .then(response => {
              variablesEntorno.showresults=true;
              this.responder(response.data)})
            .catch(error => {
              variablesEntorno.isLoading=false;
              alert("Ha ocurrido un error en la búsqueda")});
      
        }},

      buscarxfecha: function(){
        variablesEntorno.isLoading=true;
        variablesEntorno.showresults=false;
        //transformacion de los datos para sanitizar y volver utiles para la query
        variablesEntorno.fechadesde= moment(variablesEntorno.fechadesdeView).format();
        variablesEntorno.fechahasta= moment(variablesEntorno.fechahastaView).format();

        //envio
        axios.post(link.url,{
                            'fechadesde':variablesEntorno.fechadesde,
                            'fechahasta':variablesEntorno.fechahasta,
                            'seleccionOpcion':variablesEntorno.seleccionOpcion,
                            'puntoVenta': variablesEntorno.puntoVenta,
                            'conCAE': variablesEntorno.conCAEView,
                            },{headers: { 'Content-Type': 'application/json'}}) 
            .then(response => {
              variablesEntorno.showresults=true;
              this.responder(response.data);
              })
            .catch(error =>{variablesEntorno.isLoading=false;alert("Ha ocurrido un error en la búsqueda")})
      },
      buscarxcomp: function(){
        if(variablesEntorno.nrocomprobanteView === null || variablesEntorno.nrocomprobanteView === ''){alert("Debe ingresar un valor numerico sin simbolos");}
        else{
          variablesEntorno.showresults=false;
          variablesEntorno.isLoading=true;
          //transformacion de los datos para sanitizar y volver utiles para la query
          variablesEntorno.nrocomprobante=variablesEntorno.nrocomprobanteView;
          //envio
          axios.post(link.url,{
                              'nrocomprobante':variablesEntorno.nrocomprobante,
                              'seleccionOpcion':variablesEntorno.seleccionOpcion,
                              'puntoVenta': variablesEntorno.puntoVenta,
                              'conCAE': variablesEntorno.conCAEView,
                              },{headers: { 'Content-Type': 'application/json'}}) 
              .then(response => {
                variablesEntorno.showresults=true;
                this.responder(response.data);
                })
              .catch(error => {variablesEntorno.isLoading=false;alert("Ha ocurrido un error en la búsqueda")});
        }
      },
      responder: function(response){ //UNIFICA LAS RESPUESTAS EN UN SOLO METHOD, Y MANEJA LOS FLAGS. EN LOS CASOS QUE SON SIMILARES
              if (response.length <1){
                variablesEntorno.list=null;
                variablesEntorno.isLoading=false;
                alert("No se encontraron resultados");
              }
              else{
                variablesEntorno.isLoading=false;
                variablesEntorno.list = response;
                Object.keys(variablesEntorno.list).map( d => {});
              }
      },
      CalcularSubtotal(a,b,c){
        return (a*(b/100 + 1)*(c/100 + 1));
      },
     
      MostrarDetalles(dat){
        //PARA MOSTRAR DATOS DEL CLIENTE EN LOS DETALLES.
        axios.post(link.url,{
                              'idcli': dat.customerId,
                              'seleccionOpcion':'clienteDatosCompletos',
                              },{headers: { 'Content-Type': 'application/json'}}) 
              .then(response => {
                    if (response.data.length <1){
                      variablesEntorno.listCli=null;
                      alert("No se encontraron datos del cliente");
                    }
                    else{
                      variablesEntorno.listCli=response.data[0];
                      Object.keys(variablesEntorno.listCli).map( d => {});
                      if (variablesEntorno.listCli.email != null) {variablesEntorno.detallesEmail = variablesEntorno.listCli.email};
                      variablesEntorno.detallesPrefijo = variablesEntorno.listCli.telephonePrefix; 
                      variablesEntorno.detallesTelefono = variablesEntorno.listCli.telephone;
                      variablesEntorno.detallesInterno = variablesEntorno.listCli.telephoneIntern;
                    }
              }).catch(error => {console.log(error); alert("Ha ocurrido un error en la búsqueda datos del cliente")});
        //DETALLES DEL COMPROBANTE
        variablesEntorno.showModal = true;
        variablesEntorno.detallesIdComprobante=dat.receiptId; 
        variablesEntorno.detallesTipoComprobante= dat.receiptType.description;
        variablesEntorno.detallesRazonSocial= dat.customer.businessName;
        variablesEntorno.detallesNroComprobante = dat.receiptNumber;
        variablesEntorno.detallesFechaRealizado = dat.dateDone;
        variablesEntorno.detallesCUIT= dat.customer.cuit;
        variablesEntorno.detallesIdCliente= dat.customer.id;
        variablesEntorno.detallesCondImpositiva= DevolverTexto(dat.taxConditionId)[0];
        variablesEntorno.detallesFechaImputable= dat.dateImputed;
        variablesEntorno.detallesCAE= dat.cae;
        variablesEntorno.detallesPuntoVenta= dat.sellingPoint;
        variablesEntorno.detallesIIBB= dat.iibb;
        variablesEntorno.detallesMoneda= dat.currency.currency;
        variablesEntorno.detallesPrecioBruto= dat.gross;
        variablesEntorno.listDetalles = null;
        if (dat.exchangeRate == 0 || dat.exchangeRate == null){variablesEntorno.detallesCotizacion = 'No aplicable';}
        else {variablesEntorno.detallesCotizacion = dat.exchangeRate;} 

        axios.post(link.url,{
                              'idComprobante': dat.receiptId,
                              'seleccionOpcion':'detalles',
                              },{headers: { 'Content-Type': 'application/json'}}) 
              .then(response => {
                    if (response.data.length <1){
                      variablesEntorno.listDetalles=null;
                      variablesEntorno.showDetalles=false;
                      alert("No se encontraron resultados");
                    }
                    else{
                      variablesEntorno.showDetalles=true;
                      variablesEntorno.listDetalles=response.data;
                      Object.keys(variablesEntorno.listDetalles).map( d => {});
                    }
              }).catch(error => {alert("Ha ocurrido un error en la búsqueda de items del comprobante")});
            
      },
      CerrarDetalles(){
        variablesEntorno.envioMail = false;
          variablesEntorno.showDetalles=false;
          variablesEntorno.showModal=false;
      },
      MostrarComprobante(id,mail){
        variablesEntorno.envioMail=false;
          axios.post(link.url,{
                              'idComprobante': id,
                              'mail': mail,
                              'seleccionOpcion':'comprobanteAll',
                              },{headers: { 'Content-Type': 'application/json'}}) 
              .then(response => {
                    if (response.data.length <1){
                        alert("No se encontraron datos de este comprobante");
                    } else {
                        if (mail != null){
                            alert("Se ha enviado un mail con el comprobante a: "+mail);
                        }
                    }      
              }).catch(error => {alert("Ha ocurrido un error al intentar mostrar este comprobante")});
      }

  },//fin methods
  computed:{ 
      CalcularTotal(){
        if (variablesEntorno.listDetalles != null){
              var t = 0;
              for (var i=0; i < variablesEntorno.listDetalles.length; i++){
                t+=this.CalcularSubtotal(variablesEntorno.listDetalles[i].value, variablesEntorno.listDetalles[i].aliquotAfip.percentage,variablesEntorno.detallesIIBB);
              }
              return t;
        }
      }
  }, //FIN COMPUTED
  data() {return {variablesEntorno}} //si, en vueJS el return debe ser una funcion

};
</script>
