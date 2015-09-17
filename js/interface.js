;(function(context){

  'use strict';

  function Interface() {

    this.$init = $('#init');
    this.$grid = $('#grid');
    this.$info = $('#info');
    this.dimensao = 0;
    this.addEventListeners();
  }

  Interface.fn = Interface.prototype;


  Interface.fn.addEventListeners = function () {
    var self = this;
    this.$init.on('click', '.button', function ( e ) {
      self.$init.find('.button').removeClass('button-active');
      self.dimensao = $(this).addClass('button-active').data('dimensao');
      self.inicializar();
    });
  };

  Interface.fn.inicializar = function () {
    this.app = new App(this.dimensao);
    this.app.inicializar();
    this.render();
  };


  Interface.fn.inicializarApp = function() {
    this.app.inicializar();
  };

  Interface.fn.render = function () {

    this.renderGrid();
    this.renderInfo();
  };

  Interface.fn.renderGrid = function () {
    var self = this;
    var html = [];
    var vetor = this.app.getAmbiente();
    var size = self.dimensao;
    _.each(vetor, function(x, ix){
      html.push('<div class="row">');
      _.each(x, function(y){
        html.push( '<div class="col"><span class="' + y.name + '"></div>' );
      });
      html.push('</div>');
    });
    this.$grid.removeClass("box-10 box-20 box-30").addClass("box-" + size);
    $.when( this.$grid.html( html.join("") )).then(function() {
      console.log('grid ok');
    });
  };

  Interface.fn.renderInfo = function () {
    var self = this;
    var html = [];
    var vetor = this.app.getElementos();

    var infoTr = function ( index, a, b, c ) {
      var span = index !== false ? '<span>' + index + '</span>' : '';
      return '<tr><td><strong class="' + a + '">' + span + '</strong></td><td>' + b + '</td><td>'+ c +'</td></tr>';
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
      console.log('info ok');
    });

  };

  context.Interface = Interface;

  var app = new Interface();


})(this);

