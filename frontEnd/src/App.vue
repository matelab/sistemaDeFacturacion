<template>
  <div id="app">
    <div id="nav">
      <br>
      <button class= "btn btn-primary btn-lg mr-1" onclick="window.location.href = '/'"> Home </button>
      <button class= "btn btn-primary btn-lg mr-1" onclick="window.location.href = '/buscarcomprobante'"> Buscar Comprobante </button>
      <button class= "btn btn-primary btn-lg mr-1" onclick="window.location.href = '/crearcomprobante'"> Crear Comprobante </button>

    </div>
    <router-view/>
  </div>
</template>
