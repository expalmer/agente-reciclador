;(function(context){

  'use strict';

  var CICLO = 0;


  function App( dimensao, renderInterface ) {

    this.dimensao = dimensao;
    this.ambiente = [];
    this.elementos = {};
    this.renderInterface = renderInterface;

    this.agente = false; //index do agente atual
    this.lixo = false;

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

  // Cria os Elementos
  App.fn.criarOsElementos = function () {

    var self = this;
    var x = this.dimensao >> 3;
    var totais = {
      agentes: (x*2),
      lixeiras: (x*1),
      lixos: (x*4)
    };

    // Cria os Agentes
    _.times( totais.agentes, function( i ) {
        self.elementos[ "agentes" ].push({
          name: "a",
          index: i,
          qtd_orga: 0,
          qtd_seco: 0,
          selected: false,
          qtd_orga_limit: function() {
            return totais.agentes === this.qtd_orga;
          },
          qtd_seco_limit: function() {
            return totais.agentes === this.qtd_seco;
          }
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
      self.elementos[ nome ] = _.map(self.elementos[ nome ], function( item, index ) {
        var coordenadas = self.getLugarSeguroNoAmbiente();
        self.addElementoNoAmbiente( item, coordenadas );
        item.x = coordenadas.x;
        item.y = coordenadas.y;
        return item;
      });
    });
  };

  // lixeiras
  App.fn.colocarLixeirasNoAmbiente = function () {

    var self = this;
    _.each([ 'lixeira_orga', 'lixeira_seco' ], function( nome ) {
      self.elementos[ nome ] = _.map(self.elementos[ nome ], function( item, index ) {
        var coordenadas = self.getLugarSeguroNoAmbiente();
        self.addElementoNoAmbiente( item, coordenadas );
        item.x = coordenadas.x;
        item.y = coordenadas.y;
        return item;
      });
    });
  };

  // agentes
  App.fn.colocarAgentesNoAmbiente = function () {

    var self = this;
    this.elementos.agentes = _.map( this.elementos.agentes, function( item ) {
        var coordenadas = self.getLugarSeguroNoAmbiente();
        self.addElementoNoAmbiente( item, coordenadas );
        item.x = coordenadas.x;
        item.y = coordenadas.y;
        return item;
      });
  };

  App.fn.getLugarSeguroNoAmbiente = function ( regras ) {
    var vazio = false;
    var lugar, x, y;
    while( false === vazio ) {
      x = _.random( 0, this.dimensao - 1);
      y = _.random( 0, this.dimensao - 1);
      lugar = this.ambiente[x][y];
      if( !lugar.name  ) {
        vazio = true;
        return { x: x, y: y };
      }
    }

  };
  // ==========================================================================
  // FUNCOES AUXILIARES PARA ACESSAR OS ELEMENTOS
  // ==========================================================================

  App.fn.getAgenteAtual = function () {
    return this.elementos.agentes[this.agente];
  };

  App.fn.getAgenteAtualCoordenadasNoAmbiente = function () {
    var agente = this.getAgenteAtual();
    _.each(this.ambiente, function( items, x ) {
      _.each( items, function( item, y ) {
        if( item.name === agente.name && +item.index === +agente.index ) {
          return [ x, y ];
        }
      })
    });
    return [];
  };

  App.fn.selecionarElementosNoAmbiente = function ( vetor ) {
    // limpa
    var self = this;

    this.ambiente = _.map( this.ambiente, function( x ) {
      return _.map( x, function ( y ) {
        y.selected = false;
        return y;
      });
    });

    _.each( vetor, function( item ) {
      self.ambiente[item[0]][item[1]].selected = true;
    });



  };

  App.fn.getRange = function (x, y) {
    // [ T0, T1, R0, R1, B0, B1, L0, L1 ] Top, Right, Bottom, Left
    var indexes = [
      [ (x-1), y ],  // top
      [ (x-2), y ],  // top
      [ x, (y+1) ],  // right
      [ x, (y+2) ],  // right
      [ (x+1), y ],  // bottom
      [ (x+2), y ],  // bottom
      [ x, (y-1) ],  // left
      [ x, (y-2) ]   // left
    ];
    var amb = this.ambiente;
    return _.map( indexes, function( i ) {
      return amb[i[0]] && amb[i[0]][i[1]] ? amb[i[0]][i[1]] : false;
    });

  };

  // ==========================================================================
  // ACOES DO JOGO
  // ==========================================================================

  App.fn.novoCiclo = function () {

    ++CICLO;

    console.log('Ciclo', CICLO );

    if( this.osAgentesELixeirasEstaoComTotalDeLixo() ) {
      console.log('FINAL DO PROGRAMA');
      return false;
    }

    this.selecionarUmAgente();

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

    var lixoA = this.elementos.agentes.reduce( function( acc, curr ) {
      return acc + curr.qtd_orga + curr.qtd_seco;
    }, 0 );

    var lixoO = this.elementos.lixeira_orga.reduce( function(acc, curr) {
      return acc + curr.qtd_lixo;
    }, 0);

    var lixoS = this.elementos.lixeira_seco.reduce( function(acc, curr) {
      return acc + curr.qtd_lixo;
    }, 0);

    var lixoTotal = this.elementos.lixo_orga.length + this.elementos.lixo_seco.length;

    return ( lixoA + lixoO + lixoS ) === lixoTotal;

  };

  App.fn.selecionarUmAgente = function () {

    console.log('selecionarUmAgente');

    var idx = _.random(0, this.elementos.agentes.length - 1);

    this.agente = idx;
    this.elementos.agentes = this.elementos.agentes.map(function( i ) {
      i.selected = false;
      return i;
    });
    this.elementos.agentes[idx].selected = true;

    var agente = this.getAgenteAtual();

    this.selecionarElementosNoAmbiente( [ [ agente.x, agente.y ] ] );

    this.renderInterface();

  };

  App.fn.oAgenteEstaComAlgumSacoDeLixoCheio = function () {
    console.log('oAgenteEstaComAlgumSacoDeLixoCheio');

    var agente = this.getAgenteAtual();
    return agente.qtd_orga_limit() || agente.qtd_seco_limit();

  };

  App.fn.levarAgenteAteALixeiraParaEsvaziar = function () {
    console.log('levarAgenteAteALixeiraParaEsvaziar');

  };



  App.fn.temLixoNoRangeDoAgente = function () {

    console.log('temLixoNoRangeDoAgente');

    var self = this;
    var agente = this.getAgenteAtual();
    var ranges = this.getRange( agente.x, agente.y );
    var temLixo = function ( a, b ) {
      if( a && a.name === 'lo' || a.name === 'ls' ) {
        return [ 0, a ];
      }
      if ( a && a.name === null && b.name === 'lo' || b.name === 'ls' ) {
        return [ 1, b ];
      }
      return false;
    }

    //        top   right  bottom left
    var lixo = [ [0,1] ,[2,3] ,[4,5] ,[6,7] ]
            .map(function ( idx ) {
              return temLixo( ranges[idx[0]], ranges[idx[1]] );
            })
            .filter(function( i ) {
              return i;
            })
            .reduce( function( acc, curr ) {
              return acc[0] < curr[0] ? acc : curr;
            },[])
            .reduce( function( acc, curr ) {
              return [curr];
            },[]);

     return this.lixo = lixo.shift();

  };

  App.fn.irAteOLixoEColocarNoSacoDeLixo = function () {

    var agente = this.getAgenteAtual();
    var lixo   = this.lixo;
    this.selecionarElementosNoAmbiente( [ [ agente.x, agente.y ], [ lixo.x, lixo.y ] ] );
    this.renderInterface();

  };

  App.fn.andarAleatorioEVerificaSeEhATerceiraVez = function () {
    // console.log('andarAleatorioEVerificaSeEhATerceiraVez');
  };

  App.fn.caminhaAleatorioDireitaEsquerda = function () {
    // console.log('caminhaAleatorioDireitaEsquerda');
  };

  context.App = App;


})(this);

