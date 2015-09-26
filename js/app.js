;(function(context){

  'use strict';

  var CICLO = 0;

  function App( dimensao, renderInterface ) {

    this.dimensao = dimensao;
    this.ambiente = [];
    this.elementos = {};
    this.renderInterface = renderInterface;

    this.agenteINDEX = null; //index do agente atual
    this.lixo = false;

    this.emitirEVENTO = 'onSelecionarAgente';
    this.eventosDosCiclos();
    this.contaAleatorio = 0;
    this.contaLateral = 0;

    this.lixeirasParaVisitar = [];

  }


  App.fn = App.prototype;

  jQuery.extend(App.prototype, EventEmitter.prototype);

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
    this.elementos = {};
    this.elementos[AGENTE] = [];
    this.elementos[LIXEIRA_ORGANICO] = [];
    this.elementos[LIXEIRA_SECO] = [];
    this.elementos[LIXO_ORGANICO] = [];
    this.elementos[LIXO_SECO] = [];
  };

  // Ambiente
  App.fn.criarAmbiente = function () {
    // cria um ambiente vazio
    var tam = this.dimensao;
    this.ambiente = Array.apply(0, Array(tam) ).map( function ( a, x ) {
      return Array.apply(0, Array(tam) ).map( function( b, y ) {
        return {
            name: null,
            index: null,
            x: x,
            y: y
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
    var obj = {
      "10": {
        agentes: 2,
        lixeiras: 2,
        lixos: 6
      },
      "20": {
        agentes: 3,
        lixeiras: 3,
        lixos: 12
      },
      "30": {
        agentes: 4,
        lixeiras: 4,
        lixos: 20
      }
    };

    var totais = obj[this.dimensao];

    var limiteLixo = totais.lixos / totais.agentes;

    console.log(totais);

    // Cria os Agentes
    _.times( totais.agentes, function( i ) {
        self.elementos[AGENTE].push({
          name: AGENTE,
          index: i,
          lixo: {
            'LIXO_ORGANICO': [],
            'LIXO_SECO': []
          },
          selected: false,
          lixoCheio: function() {
            return this.lixo[LIXO_ORGANICO].length === limiteLixo ? LIXO_ORGANICO :
                  ( this.lixo[LIXO_SECO].length === limiteLixo ? LIXO_SECO : false );
          }
        });
      });

    // Cria Lixeiras
    _.times( totais.lixeiras, function( i ) {
        self.elementos[ LIXEIRA_ORGANICO ].push({
          name: LIXEIRA_ORGANICO,
          index: i,
          lixo: [],
          selected: false,
          cheia: function() {
            return limiteLixo === this.lixo.length;
          }
        });
        self.elementos[ LIXEIRA_SECO ].push({
          name: LIXEIRA_SECO,
          index: i,
          lixo: [],
          selected: false,
          cheia: function() {
            return limiteLixo === this.lixo.length;
          }
        });
      });

    // Cria Lixos
    _.times( totais.lixos, function() {
        self.elementos[ LIXO_ORGANICO ].push({ name: LIXO_ORGANICO });
        self.elementos[ LIXO_SECO ].push({ name: LIXO_SECO });
      });

    return false;
  };


  // sujar
  App.fn.colocarLixosNoAmbiente = function () {

    var self = this;

    // Lixos
    _.each([ LIXO_ORGANICO, LIXO_SECO ], function( nome ) {
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
    _.each([ LIXEIRA_ORGANICO, LIXEIRA_SECO ], function( nome ) {
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
    this.elementos[AGENTE] = _.map( this.elementos[AGENTE], function( item ) {
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
    return this.elementos[AGENTE][this.agenteINDEX];
  };

  App.fn.selecionarElementosNoAmbiente = function ( vetor ) {

    var self = this;
    if( false === _.isArray( vetor ) ) vetor = [vetor];

    this.ambiente = _.map( this.ambiente, function( x ) {
      return _.map( x, function ( y ) {
        y.selected = false;
        return y;
      });
    });

    _.each( vetor, function( item ) {
      if( typeof item.x !== "undefined" ) {
        self.ambiente[item.x][item.y].selected = true;
      }
    });

    this.renderInterface();

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

  App.fn.distanciaEntreDoisPontos = function( obj1, obj2 ) {
    var x1 = obj1.x;
    var y1 = obj1.y;
    var x2 = obj2.x;
    var y2 = obj2.y;
    return Math.round( Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 ) );
  }


  // mostra rota até a lixeira, passar o agente e a lixeira
  App.fn.funcaoPontos = function ( origem , destino ) {
    var orig = origem; //copia o array origem e destino
    var dest = destino;
    var movimentos = [];
    while(orig[0] != dest[0] && orig[1] != dest[1]){ //loop para n parar até terminar simulação
      while(orig[0] != dest[0]){ //loop para n terminar até o x orig for o mesmo de dest
        if(orig[0] > dest[0] && this.ambiente[orig[0]-1][orig[1]].name == null){
          orig[0]-=1;
          movimentos.push([orig[0],orig[1]]);
        }else if(this.ambiente[orig[0]+1][orig[1]].name == null){
          orig[0]+=1;
          movimentos.push([orig[0],orig[1]]);
        }
      }
      while(orig[1] != dest[1]){ //loop para n terminar até o y orig for o mesmo de dest
        if(orig[1] > dest[1] && this.ambiente[orig[0]][orig[1]-1].name == null){
          orig[1]-=1;
          movimentos.push([orig[0],orig[1]]);
        }else if(this.ambiente[orig[0]][orig[1]+1].name == null){
          orig[1]+=1;
          movimentos.push([orig[0],orig[1]]);
        }
      }
    }
    console.log(movimentos);
    return movimentos;
  };

  App.fn.passoAPassoAteLixeira = function ( movimentos, callback ) {

    var self = this;
    var agente = this.getAgenteAtual();
    var time = 0;
    var timout = 300;
    var total = movimentos.length - 1;

    _.each(movimentos, function( arr, index ) {
      time += timout;
      setTimeout( move.bind(self, arr, agente, index === total ), time );
    });

    function move( arr, agente, isLast ) {
      this.ambiente[agente.x][agente.y] = { name: null, index: null, x: agente.x, y: agente.y };
      agente.x = arr.x;
      agente.y = arr.y;
      this.ambiente[agente.x][agente.y] = agente;
      this.selecionarElementosNoAmbiente( agente );
      if( isLast ) {
        callback();
      }
    }

  };

  // ==========================================================================
  // ACOES DO JOGO
  // ==========================================================================

  App.fn.novoCiclo = function () {

    if( !this.emitirEVENTO ) {
      console.log('....aguarde....');
      return false;
    }

    ++CICLO;
    console.log('CICLO', CICLO);
    this.emit( this.emitirEVENTO );

  };

  App.fn.eventosDosCiclos = function () {

    // Evento: Selecionar Agente
    this.on('onSelecionarAgente', function() {
      this.selecionarAgente();
      this.emit('onTemLixoNoRange');
    }.bind(this));

    // Evento: Andar até Lixeira
    this.on('onAndarAteUmaLixeira', function() {
      console.log('onAndarAteUmaLixeira');
      // aguarda chegar ate a lixeira
      this.andarAteUmaLixeira( function( lixeira ) {
        if( this.tentarEsvaziarSaco( lixeira ) ) {
          this.emitirEVENTO = 'onTemLixoNoRange';
        } else {
          this.emitirEVENTO = 'onAndarAteUmaLixeira';
        }
      }.bind(this));
      this.emitirEVENTO = 0;
    }.bind(this));

    // Evento: Tem Lixo no Range
    this.on('onTemLixoNoRange', function() {

      this.emitirEVENTO = 'onTemLixoNoRange';

      if ( this.temLixoNoRange() ) {
        this.recolherLixo();
        if ( this.ambienteLimpo() ) {
          this.fim();
          this.emitirEVENTO = 0;
          return;
        }
        if ( this.agenteDeSacoCheio() ){
          this.criarLixeirasParaVisitar();
          this.emit('onAndarAteUmaLixeira');
        }
        return;
      }

      if ( this.contaAleatorio === 3 ) {
        this.andarLateralmente();
        return;
      }

      if( this.contaLateral === 3 ) {
        this.emit('onSelecionarAgente');
        return;
      }

      this.andarAleatorimente();


    }.bind(this));

  };

  App.fn.selecionarAgente= function() {

    // seleciona um agente excluindo o agente atual

    this.contaAleatorio = 0;
    this.contaLateral = 0;
    var agente = this.getAgenteAtual() || false;
    var max = this.elementos[AGENTE].length - 1;
    var idx = _.random(0, max);
    if( agente && agente.index === idx ) {
      while( agente.index === idx ) {
        idx = _.random(0, max);
      }
    }

    this.agenteINDEX = idx;
    this.elementos[AGENTE] = this.elementos[AGENTE].map(function( v, k ) {
      k === idx ? v.selected = true : v.selected = false;
      return v;
    });

    var agente = this.getAgenteAtual();

    this.selecionarElementosNoAmbiente( agente );

    this.contaAleatorio = 0;

    console.log('Agente Selecionado' );
  };


  App.fn.temLixoNoRange = function () {

    var agente = this.getAgenteAtual();
    var ranges = this.getRange( agente.x, agente.y );
    var temLixo = function ( a, b ) {
      if( a && a.name === LIXO_ORGANICO || a.name === LIXO_SECO ) {
        return [ 0, a ];
      }
      if ( a && ( a.name === null && b.name === LIXO_ORGANICO ) || (a.name === null && b.name === LIXO_SECO) ) {
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
            },[]);

    var res = this.lixo = lixo.pop();

    console.log('Algum lixo no Range do Agente [', agente.index,'] ?', !!res);

    return res;

  };

  App.fn.recolherLixo = function () {

    var agente = this.getAgenteAtual();
    var lixo   = this.lixo;

    this.selecionarElementosNoAmbiente( [ agente, lixo ] );

    this.ambiente[agente.x][agente.y] = { name: null, index: null, x: agente.x, y: agente.y };
    agente.lixo[lixo.name].push( this.elementos[lixo.name].splice(lixo.index,1) );
    agente.x = lixo.x;
    agente.y = lixo.y;
    this.ambiente[lixo.x][lixo.y] = agente;

    this.contaAleatorio = 0;

    console.log('Agente pega o lixo!');

    setTimeout(function(){
      this.selecionarElementosNoAmbiente( agente );
    }.bind(this),1000);

  };

  App.fn.ambienteLimpo= function() {
    var res = this.elementos[LIXO_ORGANICO].length === 0 &&  this.elementos[LIXO_SECO].length === 0;
    console.log('Ambiente Limpo ?', res );
    return res;
  };

  // Lixeiras
  App.fn.agenteDeSacoCheio= function() {
    var res = this.getAgenteAtual().lixoCheio();
    console.log('Agente está com algum saco cheio ?', res);
    return res;
  };

  App.fn.criarLixeirasParaVisitar = function () {

    var self = this;
    var agente = this.getAgenteAtual();

    var tipoLixo = agente.lixoCheio();
    var tipoLixeira = tipoLixo === LIXO_ORGANICO ? LIXEIRA_ORGANICO : LIXEIRA_SECO;

    this.lixeirasParaVisitar = _.clone(this.elementos[tipoLixeira]);

  };

  App.fn.ordenarLixeirasParaVisitarPorProximidade = function () {
    var agente = this.getAgenteAtual();
    this.lixeirasParaVisitar = _.map(this.lixeirasParaVisitar,
      function( item ) {
        item.distancia = this.distanciaEntreDoisPontos(agente, item);
        return item;
      }.bind(this));
    this.lixeirasParaVisitar = _.sortBy( this.lixeirasParaVisitar, 'distancia' );
  };

  App.fn.andarAteUmaLixeira = function ( callback ) {

    this.ordenarLixeirasParaVisitarPorProximidade();

    _.each(this.lixeirasParaVisitar, function(l) {
      console.log('=>', l.x,l.y, l.distancia );
    });


    var agente  = this.getAgenteAtual();
    var lixeira = this.lixeirasParaVisitar.shift();

    console.log(agente.name, agente.x, agente.y);
    console.log(lixeira.name, lixeira.x, lixeira.y);

    var pontos = new DoisPontos( agente, lixeira, this.ambiente );
    var rotas = pontos.getRotas();

    this.passoAPassoAteLixeira( rotas, function () {
      this.selecionarElementosNoAmbiente( [ agente , lixeira ] );
      callback( lixeira );
    }.bind(this));

  };


  App.fn.tentarEsvaziarSaco = function ( lixeira ) {

    if ( lixeira.cheia() ) {
      return false;
    }

    var agente = this.getAgenteAtual();
    var tipoLixeira = lixeira.name;
    var tipoLixo = tipoLixeira === LIXEIRA_ORGANICO ? LIXO_ORGANICO : LIXO_SECO;

    _.each(agente.lixo[tipoLixo].splice(0), function( lixo ) {
      this.elementos[tipoLixeira][lixeira.index].lixo.push(lixo);
    }.bind(this));

    this.selecionarElementosNoAmbiente( agente );

    return true;

  };


  App.fn.andarAleatorimente = function () {

    this.contaAleatorio++;

    var agente = this.getAgenteAtual();
    var ranges = this.getRange( agente.x, agente.y );

    this.selecionarElementosNoAmbiente( ranges );

    var pos = ranges.reduce( function( acc, curr, index, array ) {
      if( index%2 ) {
        if( array[index-1].name === null && curr.name === null ) acc.push( curr );
      } else {
        if( curr.name === null ) acc.push( curr );
      }
      if ( index === array.length - 1 ) acc = acc[_.random(0,acc.length -1)];
      return acc;
    },[]);

    this.ambiente[agente.x][agente.y] = { name: null, index: null, x: agente.x, y: agente.y };
    agente.x = pos.x;
    agente.y = pos.y;

    this.ambiente[agente.x][agente.y] = agente;

    setTimeout(function () {
      this.selecionarElementosNoAmbiente( [ agente, pos ] );
    }.bind(this), 1000);

    console.log('Anda Aleatório pela', this.contaAleatorio, 'vez' );

  };

  App.fn.andarLateralmente = function () {

    this.contaLateral++;
    this.contaAleatorio = 0;

    var agente = this.getAgenteAtual();
    var ranges = this.ambiente[agente.x];
    var left, right, pos, idx;
    var reducer = function(acc,curr){
      if ( curr.name === null ) acc.push( curr );
      else acc = [];
      return acc;
    };

    left = ranges.slice(0,agente.y).reduce( reducer, [] );
    right = ranges.slice(agente.y+1).reverse().reduce( reducer, [] );
    ranges = left.concat(right);

    this.selecionarElementosNoAmbiente( ranges );

    idx =_.random(0, ranges.length-1);
    pos = ranges[idx];

    this.ambiente[agente.x][agente.y] = { name: null, index: null, x: agente.x, y: agente.y };
    agente.x = pos.x;
    agente.y = pos.y;
    this.ambiente[agente.x][agente.y] = agente;

    setTimeout(function() { this.selecionarElementosNoAmbiente( agente ); }.bind(this), 1300);

    console.log('Anda Lateral pela', this.contaLateral, 'vez' );

  };

  App.fn.fim = function () {
    this.novoCiclo = function() {};
    console.log('FIM do PROGRAMA com ', CICLO, 'Ciclos!');

  };


  context.App = App;


})(this);

