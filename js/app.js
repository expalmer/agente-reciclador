;(function(context){

  'use strict';

  var _AMBIENTE  = [];
  var _ELEMENTOS = {}

  function inicializarVetores() {
    _AMBIENTE = [];
    _ELEMENTOS  = {
      agentes:   [],    // { name: "A", qtd_orga: 0, qtd_seco: 0, limit: 0 }
      lixeira_orga: [], // { name: "O", qtd_lixo: 0, limit: 0 }
      lixeira_seco: [], // { name: "S", qtd_lixo: 0, limit: 0 }
      lixo_orga: [],    // { name: "LO" }
      lixo_seco: []     // { name: "LS" }
    };
  };


  function App( dimensao ) {
    this.dimensao = dimensao;
  }

  App.fn = App.prototype;

  App.fn.inicializar = function () {

    inicializarVetores();
    this.criarAmbiente();
    this.criarOsElementos();
    this.colocarLixosNoAmbiente();
    this.colocarLixeirasNoAmbiente();
    this.colocarAgentesNoAmbiente();

  };


  // Ambiente
  App.fn.criarAmbiente = function () {
    // cria um ambiente vazio
    var tam = this.dimensao;
      _AMBIENTE = Array.apply(0, Array(tam) ).map( function () {
      return Array.apply(0, Array(tam) ).map( function() {
        return {
            name: null,
            index: null
          };
      });
    });
  };

  App.fn.addElementoNoAmbiente = function ( item, coordenadas ) {
    _AMBIENTE[coordenadas.x][coordenadas.y] = item;
  };

  // get
  App.fn.getAmbiente = function ( x, y ) {
    return x && y ? _AMBIENTE[x][y] : _AMBIENTE;
  };

  App.fn.getElementos = function ( name ) {
    return name ? _ELEMENTOS[name] : _ELEMENTOS;
  };

  // Cria os Elementos
  App.fn.criarOsElementos = function () {

    var x = this.dimensao >> 3;
    var totais = {
      agentes: (x*2),
      lixeiras: (x*1),
      lixos: (x*3)
    };

    // Cria os Agentes
    _.times( totais.agentes, function() {
        _ELEMENTOS[ "agentes" ].push({
          name: "a",
          qtd_orga: 0,
          qtd_seco: 0,
          limit: totais.agentes
        });
      });

    // Cria Lixeiras
    _.times( totais.lixeiras, function() {
        _ELEMENTOS[ "lixeira_orga" ].push({
          name: "o",
          qtd_lixo: 0,
          limit: totais.lixeiras
        });
        _ELEMENTOS[ "lixeira_seco" ].push({
          name: "s",
          qtd_lixo: 0,
          limit: totais.lixeiras
        });
      });

    // Cria Lixos
    _.times( totais.lixos, function() {
        _ELEMENTOS[ "lixo_orga" ].push({ name: "lo" });
        _ELEMENTOS[ "lixo_seco" ].push({ name: "ls" });
      });
  };

  // Elementos
  // App.fn.addCoordenadasNoElemento = function ( nome, index, coordenadas ) {
  //   _ELEMENTOS[nome][index].x = coordenadas.x;
  //   _ELEMENTOS[nome][index].y = coordenadas.y;
  // }

  // sujar
  App.fn.colocarLixosNoAmbiente = function () {

    var self = this;

    // Lixos
    _.each([ 'lixo_orga','lixo_seco' ], function( nome ) {

      _.each( self.getElementos(nome), function( item, index ) {
        var coordenadas = self.getLugarSeguroNoAmbiente();
        self.addElementoNoAmbiente( item, coordenadas );
      });

    });
  };

  // lixeiras
  App.fn.colocarLixeirasNoAmbiente = function () {
    var self = this;

    _.each([ 'lixeira_orga', 'lixeira_seco' ], function( nome ) {
      _.each( self.getElementos(nome), function( item, index ) {
        var coordenadas = self.getLugarSeguroNoAmbiente();
        self.addElementoNoAmbiente( item, coordenadas );
      });

    });
  };

  // agentes
  App.fn.colocarAgentesNoAmbiente = function () {
    var self = this;
    var nome = 'agentes';
    _.each( self.getElementos(nome), function( item, index ) {
      var coordenadas = self.getLugarSeguroNoAmbiente();
      self.addElementoNoAmbiente(item, coordenadas );
    });
  };

  App.fn.getLugarSeguroNoAmbiente = function ( regras ) {
    var vazio = false;
    var lugar, x, y;
    while( false === vazio ) {
      x = _.random( 0, this.dimensao - 1);
      y = _.random( 0, this.dimensao - 1);
      lugar = this.getAmbiente( x, y );
      if( !lugar.name  ) {
        vazio = true;
        return { x: x, y: y };
      }
    }
    // setTimeout(function(){ vazio = true; }, 5000);
  };


  context.App = App;



})(this);

