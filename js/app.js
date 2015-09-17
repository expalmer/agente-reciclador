;(function(context){

  'use strict';

  var _AMBIENTE  = [];
  var _ELEMENTOS = {}

  function inicializarVetores() {
    _AMBIENTE = [];
    _ELEMENTOS  = {
      agentes:   [],    // { name: "A", index: 0,  qtd_orga: 0, qtd_seco: 0, limit: 0 }
      lixeira_orga: [], // { name: "O", index: 0,  qtd_lixo: 0, limit: 0 }
      lixeira_seco: [], // { name: "S", index: 0,  qtd_lixo: 0, limit: 0 }
      lixo_orga: [],    // { name: "LO"  }
      lixo_seco: []     // { name: "LS"  }
    };
  };


  function App( dimensao ) {

    this.dimensao = dimensao;
    this.ambiente = [];
    this.elementos = {};
  }

  App.fn = App.prototype;

  App.fn.inicializar = function () {

    this.inicializarVetores();
    this.criarAmbiente();
    this.criarOsElementos();
    this.colocarLixosNoAmbiente();
    this.colocarLixeirasNoAmbiente();
    this.colocarAgentesNoAmbiente();

  };

  // Inicializar Vetor
  App.fn.inicializarVetores = function () {
    this.ambiente = [];
    this.elementos = {
      agentes:   [],    // { name: "A", qtd_orga: 0, qtd_seco: 0, limit: 0 }
      lixeira_orga: [], // { name: "O", qtd_lixo: 0, limit: 0 }
      lixeira_seco: [], // { name: "S", qtd_lixo: 0, limit: 0 }
      lixo_orga: [],    // { name: "LO" }
      lixo_seco: []     // { name: "LS" }
    };
  };

  // Ambiente
  App.fn.criarAmbiente = function () {
    // cria um ambiente vazio
    var tam = this.dimensao;
    this.ambiente = Array.apply(0, Array(tam) ).map( function () {
      return Array.apply(0, Array(tam) ).map( function() {
        return {
            name: null,
            index: null
          };
        });
      });
  };

  App.fn.addElementoNoAmbiente = function ( item, coordenadas ) {
    this.ambiente[coordenadas.x][coordenadas.y] = item;
  };

  // get
  App.fn.getAmbiente = function ( x, y ) {
    return x && y ? this.ambiente[x][y] : this.ambiente;
  };

  App.fn.getElementos = function ( name ) {
    return name ? this.elementos[name] : this.elementos;
  };

  // Cria os Elementos
  App.fn.criarOsElementos = function () {

    var self = this;
    var x = this.dimensao >> 3;
    var totais = {
      agentes: (x*2),
      lixeiras: (x*1),
      lixos: (x*3)
    };

    // Cria os Agentes
    _.times( totais.agentes, function( i ) {
        self.elementos[ "agentes" ].push({
          name: "a",
          index: i,
          qtd_orga: 0,
          qtd_seco: 0,
          limit: totais.agentes
        });
      });

    // Cria Lixeiras
    _.times( totais.lixeiras, function( i ) {
        self.elementos[ "lixeira_orga" ].push({
          name: "o",
          index: i,
          qtd_lixo: 0,
          limit: totais.lixeiras
        });
        self.elementos[ "lixeira_seco" ].push({
          name: "s",
          index: i,
          qtd_lixo: 0,
          limit: totais.lixeiras
        });
      });

    // Cria Lixos
    _.times( totais.lixos, function() {
        self.elementos[ "lixo_orga" ].push({ name: "lo" });
        self.elementos[ "lixo_seco" ].push({ name: "ls" });
      });
  };


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

  };

  // ==========================================================================
  // ACOES DO JOGO
  // ==========================================================================


  App.fn.novoCiclo = function () {

    console.log('Novo Ciclo');

    if( this.osAgentesELixeirasEstaoComTotalDeLixo() ) {
      console.log('FINAL');
      return false;
    }

    this.selecinarUmAgente();

    if( this.oAgenteEstaComAlgumSacoDeLixoCheio() ) {
      this.levarAgenteAteALixeiraParaEsvaziar();
      return false;
    }

    if ( this.temLixoNoRangeDoAgente() ) {
      this.irAteOLixoEColocarNoSacoDeLixo();
      return false;
    }

    if( this.andarAleatorioEVerificaSeEhATerceiraVez() ) {
      this.caminhaAleatorioDireitaEsquerda();
      return false;
    }

  };

  App.fn.osAgentesELixeirasEstaoComTotalDeLixo = function () {

  };

  App.fn.selecinarUmAgente = function () {

  };

  App.fn.oAgenteEstaComAlgumSacoDeLixoCheio = function () {

  };

  App.fn.levarAgenteAteALixeiraParaEsvaziar = function () {

  };

  App.fn.temLixoNoRangeDoAgente = function () {

  };

  App.fn.irAteOLixoEColocarNoSacoDeLixo = function () {

  };

  App.fn.andarAleatorioEVerificaSeEhATerceiraVez = function () {

  };

  App.fn.caminhaAleatorioDireitaEsquerda = function () {

  };


  context.App = App;


})(this);

