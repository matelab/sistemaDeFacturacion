<template>
  <div class="centered cuerpo container">
    <h2>Crear comprobante</h2>
    <h3>Fecha de hoy: {{FechaView(new Date())}}
      <button class= "btn btn-primary btn-sm" onclick="window.location.href = '/crearcomprobante'"> Nuevo Comprobante </button></h3>
<br>
<br>
<table class="table borderless">
    <tbody>
        <tr>
            <td class="col-izq">
                <!-- <p>Entidad </p> -->
            </td>
            <td> <!-- <select id="entidad" v-model="variablesEntorno.entidad" class="dropmenu">
                    <option>El Cronista Comercial</option>
                    <option>Apertura</option>
                    <option>Infotechnology</option>
                </select> --> </td>
            <td class="col-izq">
                <p>Cliente a ser facturado </p>
            </td>
            <td v-if="!variablesEntorno.isLoading"> <button @click="buscarxcli" class="btn btn-primary">Buscar Cliente</button></td>
            <td v-if="variablesEntorno.isLoading"> <button class="btn btn-secondary">Buscando ...</button></td>
        </tr>
        <tr>
            <td class="col-izq">
                <p>Fecha de facturación</p>
            </td>
            <td>
                <datepicker :disabledDates="variablesEntorno.fechasDeshabilitadas" :format="FechaView" :bootstrap-styling="true" v-model="variablesEntorno.fechaImputable" class="datepick"></datepicker>
            </td>
            <td class="col-izq"><input class="inputs" type="number" min="0" v-model="variablesEntorno.idcliView" placeholder="Numero de cliente"></td>

            <td> <input class="inputs" v-model="variablesEntorno.razonSocialView" placeholder="Razon Social"></td>
        </tr>
        <tr>
            <td>
                <p class="col-izq">Tipo de factura</p>
            </td>
            <td> <select id="tipoComprobante" v-model="variablesEntorno.tipoComprobanteView" class="dropmenu">
                    <option v-if="variablesEntorno.facturaA">Factura A</option>
                    <option v-if="!variablesEntorno.facturaA">Factura B</option>
                    <option v-if="variablesEntorno.facturaA">Nota de credito A</option>
                    <option v-if="!variablesEntorno.facturaA">Nota de credito B</option>
                    <option v-if="variablesEntorno.facturaA">Nota de debito A</option>
                    <option v-if="!variablesEntorno.facturaA">Nota de debito B</option>

                </select></td>
            <td class="col-izq"> <input disabled class="inputs" v-model="variablesEntorno.cuitView" placeholder="Cuit"></td>
            <td> <input disabled class="inputs" v-model="variablesEntorno.condImpositivaView" placeholder="Cond Impositiva"></td>
        </tr>

        <tr>
            <td class="col-izq">
                <p>Condicion de Cobro</p>
            </td>
            <td> <select id="condicionCobro" v-model="variablesEntorno.condicionCobro" class="dropmenu">
                    <option>Canje</option>
                    <option>Pago contado</option>
                    <option>Pago cuenta corriente 15 días</option>
                    <option>Pago cuenta corriente 30 días</option>
                </select></td>
            <td class="col-izq">
                <p>Ingresos Brutos %</p>
            </td>
            <td> <select id="iibb" v-model="variablesEntorno.iibbView" class="dropmenu">
                    <option>0</option>
                    <option>4.5</option>
                    <option>5</option>
                    <option>2.76</option>
                    <option>3.30</option>
                    <option>3.60</option>
                </select></td>
        </tr>
        <tr>
            <td class="col-izq">
                <p>Moneda</p>
            </td>
            <td> <select id="moneda" v-model="variablesEntorno.monedaView" class="dropmenu">
                    <option>Pesos $</option>
                    <!-- <option>Dolares U$</option>
                    <option>Euros €</option>
                    <option>Reales R$</option> -->
                </select></td> 
            <td class="col-izq">
                <p>Cotización</p>
            </td>
            <td><input class="inputs" v-model="variablesEntorno.cotizacion" placeholder="Cotizacion"></td>
        </tr>
    </tbody>
</table>

<br>
<br>

<!--/////////////////////////////TABLA ITEMS ///////////////////////////////////////////////////////-->
       

<div class = "tabla">
  <table class = "table table-striped w-auto">
      <thead>
				  <tr>
					<th> <p>Producto</p></th>
                    <th> <p>Cuenta</p></th>
					<th> <p>Descripcion</p></th>
                    <th> <p>Precio</p></th>
                    <th> <p>IVA %</p></th>

                    <th><button @click="AgregarItem" class = "btn btn-primary btn-sm">Agregar item</button></th>
				</tr>
			</thead>

      <tbody>
        <tr v-for="(item, index) in variablesEntorno.itemsAgregados" :key="`item-${index}`">
            <td> <select id="iibb" v-model="item.tipoView" class="tabledropmenu">
                    <option>Diario</option>
                    <option>Apertura</option>
                    <option>Info Technology</option>
                    <option>Edición Electrónica</option>
                    <option>Otras publicaciones</option>
                    <option>Otros productos o servicios</option>
            </select></td>
            <td> <select id="iibb" v-model="item.cuentaView" class="tabledropmenu">
                <option>Distribución CABA</option>
                <option>Distribución Interior</option>
                <option>Bienes de uso</option>
                <option>Venta ejemplares</option>
                <option>Venta publicidad</option>
                <option>Eventos y conferencias</option>
                <option>Varios al 21%</option>
                <option>Valores rechazados</option>
                <option>Rezagos</option>
                <option>Otros</option>
            </select></td>    
            <td> <input  class="tableinput" v-model="item.descripcion" placeholder="Descripcion"> </td>
            <td> <input  class="tableinput" v-model="item.precio" placeholder="Precio" type="number" min= "0" required> </td> 
            <td> <select id="iva" v-model="item.ivaView" class="tabledropmenu">
                    <option>0</option>
                    <option>10.5</option>
                    <option>21</option>
            </select></td>
            <!--<td> <p>{{CalcularSubtotal(index)}}</p></td>-->
            <td> <button @click="QuitarItem(index)" class = "btn btn-danger btn-sm">Quitar</button> </td>
        </tr>
      </tbody>
    </table> 
</div>


<p>| Cantidad items: {{ variablesEntorno.itemsAgregados.length }} | Bruto: {{variablesEntorno.monedaView}}{{ CalcularBruto()}} | Total: {{variablesEntorno.monedaView}} {{CalcularTotal()}} |</p>
<p> Observaciones <input  class="inputs" v-model="variablesEntorno.observaciones" placeholder=""> </p>
  <button v-if="!variablesEntorno.isUploading" @click="CrearFactura" class = "btn btn-primary btn-lg">Crear Comprobante</button>
  <button v-if="variablesEntorno.isUploading"  class = "btn btn-secondary btn-lg">Creando...</button>



<!--MODAL PARA MOSTRAR LISTADO DE CLIENTES-->
<div v-if="variablesEntorno.showModal" type="text/x-template" id="modal-template">
 <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">


          <div class="modal-body">
              <h3>Clientes encontrados:</h3>
              <table class ="table table-striped w-auto">
                  <thead>
                    <tr>
                      <th>Razon Social</th>
                      <th>Nro Cliente</th>
                      <th>CUIT</th>
                      <th>Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                        <tr v-for="det in variablesEntorno.list" :key="det.businessName">
                            <td>{{ det.businessName }}</td>
                            <td>{{ det.customerId }}</td> 
                            <td>{{ det.cuit }}</td>
                            <td><button class="btn btn-primary" @click="SeleccionarCliente(det)">🡄</button></td>
                        </tr>
                  </tbody>
              </table>
          </div>
          <div class="modal-footer">
              <button class="btn btn-primary" @click="CerrarModal()">Cerrar</button>
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
import BootstrapVue from 'bootstrap-vue';
import {DevolverTexto, DevolverNumero} from '@/components/condicionimpositiva.component.js';


const link = {
    url: "http://localhost:5000/" //la direccion del backend, esto deberia sacarlo del ENV
}; 
const variablesEntorno = {
   list: null,
   isLoading: false,
   isUploading: false,
   showModal: false,
   seleccionOpcion: 'crearComprobante',
   tipoComprobante: null,
   puntoVenta: 9,
   moneda: null,
   fechaImputable: new Date(),
   fechasDeshabilitadas:{
                        to: null, //ESTE DATO LO SACA CON UN METODO
                        from: new Date() //no fechas a futuro                     
   },
   precioBruto: 0,
   precioNeto: 0,
   precioTotal: 0,
   entidad: 'El Cronista Comercial',
   idcli: null,
   razonSocialView: null,
   tipoComprobanteView: 'Factura B',
   idcliView: null,
   cuitView: null,
   iibbView: 0,
   condImpositivaView: null,
   facturaA: false, //como hay 2 grandes grupos de facturas, hice este bool para intercambiar entre A y B
   cotizacion: '',
   monedaView: 'Pesos $',
   condicionCobro: 'Pago contado', 
   condImpositiva: null,
   observaciones: null,
   IVA: null,
   IIBB: null, //FALTA
   itemsAgregados: [{
                    tipo: null,
                    tipoView: 'Diario',
                    cuenta: null,
                    cuentaView: 'Distribución CABA',
                    descripcion: null,
                    precio: 0,
                    iva: null,
                    ivaView: '21'
                    }]
};


export default {
  components:{
        Datepicker,
        moment
  },

  methods: {
      buscarxcli: function(){
        variablesEntorno.isUploading = false;
        if ((variablesEntorno.razonSocialView=== null || variablesEntorno.razonSocialView=== '')&&(variablesEntorno.idcliView === null || variablesEntorno.idcliView === '')){ //AMBOS CAMPOS NO PUEDEN SER NULL
            alert("Debe ingresar al menos un valor");
        }else{
            variablesEntorno.isLoading=true;
            //transformacion de los datos para sanitizar y volver utiles para la query
            if(variablesEntorno.razonSocialView=== ''){variablesEntorno.razonSocial = null}
            else {variablesEntorno.razonSocial = variablesEntorno.razonSocialView}
            if(variablesEntorno.idcliView == ''){variablesEntorno.idcli = null}
            else {variablesEntorno.idcli = variablesEntorno.idcliView}
            variablesEntorno.seleccionOpcion = 'clienteDatosCompletos';
            //envio
            axios.post(link.url,{
                                'razonSocial':variablesEntorno.razonSocial,
                                'idcli':variablesEntorno.idcli,
                                'seleccionOpcion':variablesEntorno.seleccionOpcion,
                                },{headers: { 'Content-Type': 'application/json'}}) 
                .then(response => {
                    if (response.data.length <1){
                      variablesEntorno.list=null;
                      variablesEntorno.isLoading=false;
                      alert("No se encontraron resultados");
                    }
                    else{
                        variablesEntorno.isLoading=false;
                        variablesEntorno.list = response.data;
                        Object.keys(variablesEntorno.list).map( d => {});
                        if (variablesEntorno.list.length==1){ //SI ENCONTRO UN SOLO CLIENTE
                        variablesEntorno.cuitView = variablesEntorno.list[0].cuit;
                        variablesEntorno.condImpositiva=variablesEntorno.list[0].customerTax.taxCondition.id; 
                        variablesEntorno.razonSocialView=variablesEntorno.list[0].businessName;
                        variablesEntorno.idcliView=variablesEntorno.list[0].id;
                        variablesEntorno.condImpositivaView = variablesEntorno.list[0].customerTax.taxCondition.description;
                        if (variablesEntorno.list[0].customerTax.taxCondition.id == 1){
                            variablesEntorno.tipoComprobanteView = 'Factura A'
                            variablesEntorno.facturaA = true;
                            } else {
                                variablesEntorno.tipoComprobanteView = 'Factura B'
                                variablesEntorno.facturaA = false;
                            }
                        } else { //SI ENCONTRO MAS DE UN CLIENTE, MUESTRA MODAL
                            variablesEntorno.showModal=true;    
                        }
                    }
                }).catch(error => {console.log(error)});
          
        }
      },
      CerrarModal(){
            variablesEntorno.showModal=false;
      },
      SeleccionarCliente(det){
            variablesEntorno.showModal=false;
            variablesEntorno.cuitView = det.cuit;
            variablesEntorno.condImpositiva=det.customerTax.taxCondition.id;
            variablesEntorno.condImpositivaView=det.customerTax.taxCondition.description;
            variablesEntorno.razonSocialView=det.businessName;
            variablesEntorno.idcliView=det.id;
            if (variablesEntorno.list[0].customerTax.taxCondition.id == 1){
                variablesEntorno.tipoComprobanteView = 'Factura A'
                variablesEntorno.facturaA = true;
                } else {
                    variablesEntorno.tipoComprobanteView = 'Factura B'
                    variablesEntorno.facturaA = false;
            }
      },
      CrearFactura: function(){

        //transformacion de los datos para query
        variablesEntorno.tipoComprobante= DevolverNumero(variablesEntorno.tipoComprobanteView)
        switch (variablesEntorno.monedaView){
            case 'Pesos $': {variablesEntorno.moneda = 1; break}
            case 'Dolares U$': {variablesEntorno.moneda = 2; break}
            case 'Euros €': {variablesEntorno.moneda = 3; break}
            case 'Reales R$': {variablesEntorno.moneda = 4; break}
        }
        
        variablesEntorno.fechaImputable= moment(variablesEntorno.fechaImputable).format();
        variablesEntorno.IIBB = variablesEntorno.iibbView;
        variablesEntorno.idcli = variablesEntorno.idcliView;
        variablesEntorno.seleccionOpcion = 'crearComprobante';

        let alerta= false; //alertar si hay items sin precio
        variablesEntorno.precioBruto=0;
        for (var i=0;i< variablesEntorno.itemsAgregados.length; i++){
          if (variablesEntorno.itemsAgregados[i].precio == null || variablesEntorno.itemsAgregados[i].precio == ''){
            alerta=true; 
          } else {
              variablesEntorno.precioBruto = parseFloat(variablesEntorno.precioBruto) + parseFloat(variablesEntorno.itemsAgregados[i].precio);
                            switch (variablesEntorno.itemsAgregados[i].tipoView){
                  case 'Diario': {
                      variablesEntorno.itemsAgregados[i].tipo = 7; break}
                  case 'Apertura': {
                      variablsesEntorno.itemsAgregados[i].tipo = 8; break}
                  case 'Info Technology': {
                      variablesEntorno.itemsAgregados[i].tipo = 3; break}
                  case 'Edición Electrónica': {
                      variablesEntorno.itemsAgregados[i].tipo = 4; break}
                  case 'Otras publicaciones': {
                      variablesEntorno.itemsAgregados[i].tipo = 5; break}
                  case 'Otros productos o servicios': {
                      variablesEntorno.itemsAgregados[i].tipo = 6; break}
              }
              switch (variablesEntorno.itemsAgregados[i].ivaView){
                  case '0': {variablesEntorno.itemsAgregados[i].iva = 3; break}
                  case '2.5': {variablesEntorno.itemsAgregados[i].iva = 9; break}
                  case '5': {variablesEntorno.itemsAgregados[i].iva = 8; break}
                  case '10.5': {variablesEntorno.itemsAgregados[i].iva = 4; break}
                  case '21': {variablesEntorno.itemsAgregados[i].iva = 5; break}
                  case '27': {variablesEntorno.itemsAgregados[i].iva = 6; break}
              }

              switch (variablesEntorno.itemsAgregados[i].cuentaView){
                  case 'Distribución CABA': {variablesEntorno.itemsAgregados[i].cuenta = '4020001-0-0000000N'; break}
                  case 'Distribución Interior': {variablesEntorno.itemsAgregados[i].cuenta = '4020004-0-0000000N'; break}
                  case 'Bienes de uso': {variablesEntorno.itemsAgregados[i].cuenta = '4030003-0-0000000C'; break}
                  case 'Venta ejemplares': {variablesEntorno.itemsAgregados[i].cuenta = '4020008-0-0000000N'; break}
                  case 'Venta publicidad': {variablesEntorno.itemsAgregados[i].cuenta = '4010017-0-0000000N'; break}
                  case 'Eventos y conferencias': {variablesEntorno.itemsAgregados[i].cuenta = '5070003-0-4000001N'; break}
                  case 'Varios al 21%': {variablesEntorno.itemsAgregados[i].cuenta = '1140024-0-0000000N'; break}
                  case 'Valores rechazados': {variablesEntorno.itemsAgregados[i].cuenta = '1130007-0-0000000N'; break}
                  case 'Rezagos': {variablesEntorno.itemsAgregados[i].cuenta = '4020009-0-0000000N'; break}
                  case 'Otros': {variablesEntorno.itemsAgregados[i].cuenta = '4030004-0-0000000N'; break}
              } 
          }
        }
        if (alerta){
            alert("Hay items sin precio");
            alerta=false;
        } else {

                //envio si esta todo ok
                variablesEntorno.precioNeto = this.CalcularNeto();
                variablesEntorno.precioTotal = this.CalcularTotal();
                variablesEntorno.isUploading = true;
                if (variablesEntorno.itemsAgregados.length >=1){
                    axios.post(link.url,{
                                        'seleccionOpcion':variablesEntorno.seleccionOpcion,
                                        'entidad': variablesEntorno.entidad,
                                        'tipoComprobante':variablesEntorno.tipoComprobante, 
                                        'idcli':variablesEntorno.idcli,
                                        'condImpositiva':variablesEntorno.condImpositiva,
                                        'puntoVenta': variablesEntorno.puntoVenta,
                                        'fechaImputable': variablesEntorno.fechaImputable,
                                        'IIBB': variablesEntorno.IIBB,
                                        'precioBruto':variablesEntorno.precioBruto,
                                        'precioNeto': variablesEntorno.precioNeto,
                                        'precioTotal': variablesEntorno.precioTotal,
                                        'cotizacion':variablesEntorno.cotizacion,
                                        'condicionCobro': variablesEntorno.condicionCobro,
                                        'observaciones': variablesEntorno.observaciones, 
                                        'moneda':variablesEntorno.moneda,
                                        'itemsAgregados':variablesEntorno.itemsAgregados,
                                        'razonSocial':variablesEntorno.razonSocialView,
                                        'cuit':variablesEntorno.cuitView
                                        },{headers: { 'Content-Type': 'application/json'}}) 
                        .then(response => {
                            variablesEntorno.isUploading = false;
                            variablesEntorno.isLoading=false;
                            if (response.length <1){
                            variablesEntorno.list=null;
                            alert("No se encontraron resultados");
                            }
                            else{
                            alert("El comprobante ha sido creado con éxito");
                            }}).catch(error => {variablesEntorno.isUploading = false; alert("Hubo un error al procesar este comprobante.");});

                } else{
                    this.AgregarItem();
                    alert("Debe completar los datos de al menos un item del comprobante");
                    variablesEntorno.isUploading = false;
                }

        } 
        },

     FechaView(date) {
      return moment(date).format('DD-MM-YYYY');
      },
      AgregarItem(){
            variablesEntorno.itemsAgregados.push({
                    tipo: null,
                    tipoView: variablesEntorno.itemsAgregados[0].tipoView,
                    cuenta: null,
                    cuentaView: variablesEntorno.itemsAgregados[0].cuentaView,
                    descripcion: null,
                    precio: 0,
                    iva: null,
                    ivaView: '21'});
              
      },
      QuitarItem(i){
          if (variablesEntorno.itemsAgregados.length > 1){
          variablesEntorno.itemsAgregados.splice(i,1);}
      },
      CalcularSubtotal(a,b,c){
        return (a*(b/100 + 1)*(c/100 + 1));
      },
      /* CalcularSubtotal(index){ //ESTE SE USABA PARA CALCULAR SUBTOTAL POR ITEM, TRAS ULTIMA REUNION QUEDO DEPRECADO
          variablesEntorno.itemsAgregados[index].subtotal= variablesEntorno.itemsAgregados[index].precio * (variablesEntorno.itemsAgregados[index].ivaView /100 +1) * (variablesEntorno.iibbView /100 +1);
          return (variablesEntorno.itemsAgregados[index].subtotal).toFixed(2);
      }, */
      CalcularBruto(){
          var suma=0;
          for (var i = 0; i<variablesEntorno.itemsAgregados.length;i++){
              if (typeof parseFloat(variablesEntorno.itemsAgregados[i].precio) === 'number'){
                suma += parseFloat(variablesEntorno.itemsAgregados[i].precio);  
              }
          }
          return suma.toFixed(2);          
      },
      CalcularNeto(){
          var suma=0;
          for (var i = 0; i<variablesEntorno.itemsAgregados.length;i++){
              if (typeof parseFloat(variablesEntorno.itemsAgregados[i].precio) === 'number'){
                suma += this.CalcularSubtotal(parseFloat(variablesEntorno.itemsAgregados[i].precio),parseFloat(variablesEntorno.iibbView),0);  
              }
          }
          return suma.toFixed(2);
      },
      CalcularTotal(){ 
          var suma=0;
          for (var i = 0; i<variablesEntorno.itemsAgregados.length;i++){
              if (typeof parseFloat(variablesEntorno.itemsAgregados[i].precio) === 'number'){
                suma += this.CalcularSubtotal(parseFloat(variablesEntorno.itemsAgregados[i].precio),parseFloat(variablesEntorno.iibbView),parseFloat(variablesEntorno.itemsAgregados[i].ivaView));  
              }
          }
          return suma.toFixed(2);
      },
      BuscarUltimaFecha(){
           axios.post(link.url,{
                                  'seleccionOpcion':'ultimoComprobante',
                                  },{headers: { 'Content-Type': 'application/json'}}) 
                  .then(response => {
                    if (response.length <1){
                        this.UltimaFechaDefault();
                    }
                    else{
                        variablesEntorno.fechasDeshabilitadas.to= new Date(response.data[0].dateImputed);
                    }}).catch(error => {this.UltimaFechaDefault()});
      },
      UltimaFechaDefault(){
            variablesEntorno.fechasDeshabilitadas.to= new Date(Date.now() - 9.504e+8); //10 DIAS CORRIDOS HACIA ATRAS
      }
  }, //FIN METHODS
  mounted(){ //UN COMPROBANTE NO PUEDE TENER FECHA ANTERIOR AL ULTIMO HECHO, POR ESO BUSCA EN LA DB ANTES.
      this.BuscarUltimaFecha();
  }, //FIN MOUNTED
    data() {return {variablesEntorno}} 
};
</script>

