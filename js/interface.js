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
        var classe = y.name + ( y.name === "a" ? y.index : ""  );
        var selected = y.selected ? " selected" : "";
        html.push( '<div class="col"><span class="' + classe + selected +'"></div>' );
      });
      html.push('</div>');
    });
    this.$grid.removeClass("box-10 box-20 box-30").addClass("box-" + size);
    $.when( this.$grid.html( html.join("") )).then(function() {
      // console.log('grid ok');
    });

  };

  Interface.fn.renderInfo = function () {

    var self = this;
    var html = [];
    var vetor = this.app.elementos;

    var infoTr = function ( index, name, b, c ) {
      var span = index !== false ? '<span>' + index + '</span>' : '';
      var classe = name + ( name === "a" ? index : ""  );
      return '<tr><td><strong class="' + classe + '">' + span + '</strong></td><td>' + b + '</td><td>'+ c +'</td></tr>';
    }

    // agentes
    _.each( vetor.agentes, function( v, k ){
      html.push( infoTr( k, v.name, v.qtd_orga, v.qtd_seco ) );
    });

    // lixeira_orga
    _.each( vetor.lixeira_orga, function( v, k ){
      html.push( infoTr( k, v.name, v.qtd_lixo, '-' ) );
    });

    // lixeira_seco
    _.each( vetor.lixeira_seco, function( v, k ){
      html.push( infoTr( k, v.name, '-', v.qtd_lixo ) );
    });

    // lixo_orga
    html.push( infoTr( false, vetor.lixo_orga[0].name, vetor.lixo_orga.length ,'-') );

    // lixo_seco
    html.push( infoTr( false, vetor.lixo_seco[0].name, '-', vetor.lixo_seco.length) );

    $.when( this.$info.html( html.join("") )).then(function() {
      // console.log('info ok');
    });

  };

  context.Interface = Interface;

})(this);

