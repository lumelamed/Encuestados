/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  recuperarDatos: function() {
      this.modelo.recuperarDatos();
  },
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  borrarPregunta: function(pregunta) { //NO ESTOY USANDO EL ID? :(
      this.modelo.borrarPregunta(pregunta);
  },
  editarPregunta: function(pregunta) {
      this.modelo.editarPregunta(pregunta);
  },
  borrarTodo: function() {
      this.modelo.borrarTodo();
  },
  agregarVoto: function(pregunta, respuestaSeleccionada) {
      this.modelo.agregarVoto(pregunta, respuestaSeleccionada);
  }
};
