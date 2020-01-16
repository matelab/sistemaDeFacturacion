import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import BuscarComprobante from '@/components/buscarcomprobante';
import CrearComprobante from '@/components/crearcomprobante';
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/buscarcomprobante',
      name: 'buscarcomprobante',
      component: BuscarComprobante,
    },
    {
      path: '/crearcomprobante',
      name: 'crearcomprobante',
      component: CrearComprobante,
    }
  ]
})
