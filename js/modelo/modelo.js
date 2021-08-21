/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.datosRecuperados = new Evento(this);
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.todoBorrado = new Evento(this);
  this.votoAgregado = new Evento(this);
};

Modelo.prototype = {
  //se llenan los valores del modelo con lo que había en el localStorage
  recuperarDatos: function() {
    if(localStorage.length>0){
      var claveUltimoId = localStorage.key(0);
      this.ultimoId = JSON.parse(localStorage.getItem(claveUltimoId)).id;
      for (var j = 0; j < localStorage.length; j++) {
        var clave = localStorage.key(j);
        this.preguntas.push(JSON.parse(localStorage.getItem(clave)));
      }
      console.log(this.preguntas);
      //this.datosRecuperados.notificar();
    }
  },
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    if(this.ultimoId!=0){
      var idMayor = -1;
      for (var i = 0; i < this.preguntas.length; i++) {
        if(this.preguntas[i].id>idMayor){
          idMayor = this.preguntas[i].id;
        }
      }
      this.ultimoId = idMayor;
    }
    return this.ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.ultimoId = id; //agregue esto yo
    this.preguntas.push(nuevaPregunta);
    this.guardar(nuevaPregunta);
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function(pregunta){
    var clave = JSON.stringify(pregunta.textoPregunta);
    var valor = JSON.stringify(pregunta);
    localStorage.setItem(clave, valor);
  },

  borrarPregunta: function(pregunta) {
    var pos;
    for (var i = 0; i < this.preguntas.length; i++) {
      if(pregunta==this.preguntas[i].textoPregunta){
        pos = i;
      }
    }
    //se borra del localStorage
    localStorage.removeItem('"'+this.preguntas[pos].textoPregunta+'"');
    //se borra del array de preguntas
    this.preguntas.splice(pos,1);
    this.preguntaEliminada.notificar();
  },

  borrarTodo: function() {
    //se vacían las propiedades del modelo
    this.preguntas = [];
    this.ultimoId = 0;
    //se vacía el localStorage
    localStorage.clear();
    this.todoBorrado.notificar();
  },

  editarPregunta: function(pregunta) {
    var nuevoTextoPregunta = prompt("Editar pregunta: ");
    if(nuevoTextoPregunta != null){
      var pos;
      for (var i = 0; i < this.preguntas.length; i++) {
        if(pregunta==this.preguntas[i].textoPregunta){
          pos = i;
          //se edita en el array de preguntas
          this.preguntas[i].textoPregunta = nuevoTextoPregunta;
        }
      }
      //se edita en el localStorage
      localStorage.clear();
      for (var k = 0; k < this.preguntas.length; k++) {
        this.guardar(this.preguntas[k]);
      }
      this.preguntaEditada.notificar();
    }
  },

  obtenerPregunta: function(pregunta) {
    for (var i = 0; i < this.preguntas.length; i++) {
      if(pregunta==this.preguntas[i].textoPregunta){
        return this.preguntas[i];
      }
    }
  },

  agregarVoto: function(pregunta, respuestaSeleccionada) {
    for (var i = 0; i < pregunta.cantidadPorRespuesta.length; i++) {
      if(pregunta.cantidadPorRespuesta[i].textoRespuesta==respuestaSeleccionada){
        pregunta.cantidadPorRespuesta[i].cantidad++;
      }
    }
    //se actualizan los votos en el localStorage
    localStorage.clear();
    for (var k = 0; k < this.preguntas.length; k++) {
      this.guardar(this.preguntas[k]);
    }
    this.votoAgregado.notificar();
  }
};
