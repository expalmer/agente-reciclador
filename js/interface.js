;(function(context){

  'use strict';

  function Interface() {

    this.$info = $('#info');
    this.$init = $('#init');
    this.$start = $('#start');
    this.$ciclo = $('#ciclo');
    this.$reset = $('#reset');
    this.$grid = $('#grid');
    this.dimensao = 0;
    this.debug = true;
    this.addEventListeners();
    this.inicializar();

  }

  Interface.fn = Interface.prototype;

  Interface.fn.addEventListeners = function () {

    var self = this;

    // Escolher a Dimensao do Vetor
    this.$init.on('click', '.button', function ( e ) {
      self.dimensao = $(this).addClass('button-active').data('dimensao');
      self.inicializarApp();
    });

    // Resetar o jogo
    this.$reset.on('click', function() {
      self.inicializar();
    });

    // Novo Ciclo
    this.$ciclo.on('click', function() {
      self.app.novoCiclo();
    });

  };

  Interface.fn.inicializar = function () {

    this.$info.html('');
    this.$init.find('.button').removeClass('button-active');
    this.$init.fadeIn();
    this.$start.fadeOut();

  };

  Interface.fn.inicializarApp = function() {

    this.$init.fadeOut();
    this.$start.fadeIn();
    this.$init.find('.button').removeClass('button-active');

    this.app = new App(this.dimensao, this.callback.bind(this) );
    this.app.inicializar();
    this.render();

  };

  Interface.fn.callback = function ( args ) {
    this.render();
  };

  Interface.fn.render = function () {

    this.renderGrid();
    this.renderInfo();
  };

  Interface.fn.renderGrid = function () {

    var self = this;
    var html = [];
    var vetor = this.app.ambiente;
    var size = self.dimensao;
    _.each(vetor, function(x, ix){
      html.push('<div class="row">');
      _.each(x, function(y){
        var name = y.name ? y.name.toLowerCase() : '';
        var classe = name + ( name === "agente" ? y.index : ""  );
        var selected = y.selected ? " selected" : "";
        var debug = self.debug ? self.debugSpan(y) : '';
        html.push( '<div class="col">' + debug + '<span class="' + classe + selected +'"></div>' );
      });
      html.push('</div>');
    });
    this.$grid.removeClass("box-10 box-20 box-30").addClass("box-" + size);
    $.when( this.$grid.html( html.join("") )).then(function() {
      // console.log('grid ok');
    });

  };

  Interface.fn.debugSpan= function ( y ) {
    var res = [];
    switch(y.name){
    case AGENTE: 
      res.push( y.lixo[LIXO_ORGANICO].length); 
      res.push( y.lixo[LIXO_SECO].length); 
    break;
    case LIXEIRA_ORGANICO:
    case LIXEIRA_SECO:
      res.push( y.lixo.length ); 
    break;
    }
    res = res.map(function(x){
      return '<span>' + x + '</span>';
    });
    return res.length ? '<div class="debug">' + res.join('') + '</div>' : '';
  }

  Interface.fn.renderInfo = function () {

    var self = this;
    var html = [];
    var vetor = this.app.elementos;

    var infoTr = function ( index, name, b, c, vetor ) {
      var name = name.toLowerCase();
      var span = index !== false ? '<span>' + index + '</span>' : '';
      var classe = name + ( name === "agente" ? index : ""  );
      var selected = vetor && vetor.selected ? " selectedx" : "";
      return '<tr><td><strong class="' + classe + selected + '">' + span + '</strong></td><td>' + b + '</td><td>'+ c +'</td></tr>';
    }

    // agentes
    _.each( vetor[AGENTE], function( v, k ){
      html.push( infoTr( k, v.name, v.lixo[LIXO_ORGANICO].length, v.lixo[LIXO_SECO].length, v) );
    });

    // lixeira_orga
    _.each( vetor[LIXEIRA_ORGANICO], function( v, k ){
      html.push( infoTr( k, v.name, v.lixo.length, '-' ) );
    });

    // lixeira_seco
    _.each( vetor[LIXEIRA_SECO], function( v, k ){
      html.push( infoTr( k, v.name, '-', v.lixo.length ) );
    });

    // lixo_orga
    html.push( infoTr( false, "lixo_organico", vetor[LIXO_ORGANICO].length ,'-') );

    // lixo_seco
    html.push( infoTr( false, "lixo_seco", '-', vetor[LIXO_SECO].length) );

    $.when( this.$info.html( html.join("") )).then(function() {
      // console.log('info ok');
    });

  };

  context.Interface = Interface;

})(this);

