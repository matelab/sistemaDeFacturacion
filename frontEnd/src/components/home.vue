<template>
  <div class="hello">

    <h2>Paswordless LOGIN</h2>
<p>
  <input  class="inputs" v-model="variablesEntorno.email" placeholder="Email">
  <button id="show-modal" @click="login">Enviar</button>
</p>


  </div>
</template>

<script>
import styles from '../css/styles.css'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import axios from 'axios';


const link = {
    url: "http://localhost:5000/" //la direccion del backend, esto deberia sacarlo del ENV
}; 

const variablesEntorno = {
  email: null
};
export default {
  components:{
    
  },
  methods:{

       login: function(){
        if (variablesEntorno.email=== null || variablesEntorno.email=== ''){ 
          alert("Debe ingresar su direccion de email");
        }else{

        //envio
        axios.post(link.url,{
                            'email':variablesEntorno.email,
                            'seleccionOpcion':'login'
                            },{headers: { 'Content-Type': 'application/json'}}) 
            .then(response => {
              switch(response.data.value){
                case 1: {alert("Acceso exitoso. Encontrará un link para acceder en su cuenta de email.");break}
                case 2: {alert("Error: Por favor verifique que la dirección este bien escrita");break}
                case 3: {alert("Usuario no encontrado");break}
              }
              })
            .catch(error => {
              alert("Hubo un error al intentar login")});
      
        }},
  },

    data () {
        return {
        variablesEntorno
        }
    }
}
</script>
