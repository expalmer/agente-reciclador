;(function( context ) {

  var stack = [];

  var PROP = 'name';

  function DoisPontos( origem, destino, ambiente ) {
    this.origem   = origem;
    this.destino  = destino;
    this.ambiente = ambiente;
  }

  DoisPontos.prototype.getRotas = function() {

    var self = this;
    var times = 100;
    var CONTINUAR = true;
    var oriCurrent = this.origem;
    var moves;
    var steps = [];
    var aux;
    var movs = [];
    var chegou = false;

    var end = this.pontosDeDestino();

    while( ( CONTINUAR ) && ( times-- > 0 )  ) {

      moves = this.defineMovimentos( oriCurrent );
      aux = this.movimentar( oriCurrent, moves );
      oriCurrent = aux[3];
      movs.push( oriCurrent );
      steps.push( aux.splice(0,3) );
      if( !oriCurrent ) {
        CONTINUAR = false;
        console.log("TRANCADO");
      } else if( this.chegouNoDestino( oriCurrent, end ) ) {
        CONTINUAR = false;
        chegou = true;
        console.log("CHEGOU");
      }
    }
    // console.log(steps);
    return movs;

  };

  DoisPontos.prototype.defineMovimentos = function ( ori ) {

    var des = this.destino;

    var pos = ['top','right','bottom','left'];
    var res = [];
    var x = ori.x > des.x ? 0 : 2;
    var y = ori.y > des.y ? 3 : 1;

    if( ori.x === des.x ) {
      res.push( pos[y] );
      res.push( pos[x] );
    } else {
      res.push( pos[x] );
      res.push( pos[y] );
    }

    pos = pos.filter(function( i, idx ) {
      return idx !== y && idx !== x;
    });

    return res.concat(pos);

  }

  DoisPontos.prototype.movimentar = function ( ori, moves ) {

    var self = this;
    var x = ori.x;
    var y = ori.y;

    // last move
    var opposite = { bottom: "top", top: "bottom", left: "right", right: "left" };
    var lastStack = stack[ stack.length -1 ];
    if( lastStack ) {
      opp = opposite[lastStack.moveSelected];
      moves = moves.filter(function(i) {
        return i !== opp;
      });
      moves.push( opp );
    }

    var stackId = x + '_' + y;
    var stackMoves = moves.reduce(function( acc, curr ) {
      acc[curr] = self.getDirecoes( x, y, curr );
      return acc;
    }, {});

    // se voltou numa posicao, coloca para o final a opcao escolhi
    var times = self.timesInStack( x, y );
    var mSelected;
    if( times.length === 1 ) {
      mSelected = times[0].moveSelected;
      moves.splice(moves.indexOf(mSelected),1);
      moves.push( mSelected );
    }

    // evita ir para posicoes que ja passou 2 vezes
    moves = moves
      .reduce(function( acc, mov ) {
        var times = self.timesInStack( stackMoves[mov].x, stackMoves[mov].y );
        if( times.length !== 2 ) {
          if( times.length === 1 ) {
            acc.last.push( mov );
          } else {
            acc.first.push( mov );
          }
        }
        return acc;
      },{ first: [], last: [] });

    moves = moves.first.concat(moves.last);

    // which way
    var stackMoveSelected =
      moves
        .reduce(function(acc, curr) {
            if( false === acc ) {
              if( self.pontoNoAmbienteEstaVazio( stackMoves[curr].x, stackMoves[curr].y ) ) acc = curr;
            }
            return acc;
          }, false );



    var obj = {
      id: stackId,
      moveSelected: stackMoveSelected,
      moves: stackMoves
    };

    stack.push( obj );

    return [ [x, y], moves, stackMoveSelected, obj.moves[stackMoveSelected] ];

  }

  // ============================
  // HELPERS
  // ============================

  DoisPontos.prototype.timesInStack = function( x, y ) {
    return stack.filter(function( s ) {
                return s.id === x + "_" + y;
              });
  }

  DoisPontos.prototype.chegouNoDestino = function ( ori, destinos ) {
    return !!destinos[ori.x + "_" + ori.y];
  }

  DoisPontos.prototype.pontosDeDestino = function () {
    var self = this;
    var des = this.destino;
    return [
        [ des.x - 1, des.y], //[1,2]
        [ des.x, des.y + 1], //[2,3]
        [ des.x + 1, des.y], //[3,2]
        [ des.x, des.y - 1]  // [2,1]
      ]
      .reduce(function( acc, curr ) {
        if( self.pontoNoAmbienteEstaVazio(curr[0], curr[1]) ) acc[curr[0] + "_" + curr[1]] = true;
        return acc;
      },{});
  }


  DoisPontos.prototype.pontoNoAmbienteEstaVazio = function ( x, y ) {
    var amb = this.ambiente;
    return (amb[x]) && (amb[x][y]) && (amb[x][y][PROP] === null);
  }

  DoisPontos.prototype.getDirecoes = function ( x, y, move ) {
    return move === 'top'    ? { x: x - 1, y: y }     :
          (move === 'right'  ? { x: x,     y: y + 1 } :
          (move === 'bottom' ? { x: x + 1, y: y }     :
          (move === 'left'   ? { x: x,     y: y - 1 } : false )));
  }

  context.DoisPontos = DoisPontos;

})( this );
