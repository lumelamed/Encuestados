/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.datosRecuperados.suscribir();
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.todoBorrado.suscribir(function() {
    contexto.reconstruirLista();
  });
  //no lo suscribi a votoAgregado
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.controlador.recuperarDatos();
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    nuevoItem = ($("<li>", {"class": "list-group-item", "id": pregunta.id, "text": pregunta.textoPregunta}));
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      var cant = 0;
      var lasRespuestas;
      $('[name="option[]"]').each(function() {
        var resp = this.value;
        lasRespuestas = {'textoRespuesta': resp, 'cantidad': cant};
        respuestas.push(lasRespuestas);
      })
      respuestas.pop();
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    e.botonBorrarPregunta.click(function() { 
      var preg = contexto.verPreguntaSeleccionada();
      contexto.controlador.borrarPregunta(preg);
    });
    e.botonEditarPregunta.click(function() {
      var preg = contexto.verPreguntaSeleccionada();
      contexto.controlador.editarPregunta(preg);
    });
    e.borrarTodo.click(function() {
      contexto.controlador.borrarTodo();
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },

  verPreguntaSeleccionada: function() {
    return $(".list-group-item.active h5").text();
  }
};
