var amb = [
  [ { n: null}, { n: null }, { n: null }, { n: null }, { n: null} , { n: 'xx' } ],
  [ { n: null}, { n: null }, { n: 'xx' }, { n: 'lo' }, { n: 'xx'} , { n: null } ],
  [ { n: null}, { n: 'xx' }, { n: null }, { n: 'xx' }, { n: null} , { n: null } ],
  [ { n: null}, { n: null }, { n: null }, { n: null }, { n: null} , { n: null } ],
  [ { n: null}, { n: 'aa' }, { n: null }, { n: null }, { n: null} , { n: null } ]
];

var amb = [
  [ { n: null}, { n: null }, { n: null }, { n: null} , { n: 'll' } ],
  [ { n: null}, { n: 'xx' }, { n: 'xx' }, { n: 'xx'} , { n: 'xx' } ],
  [ { n: null}, { n: 'xx' }, { n: null }, { n: null} , { n: null } ],
  [ { n: null}, { n: 'xx' }, { n: null }, { n: null} , { n: null } ],
  [ { n: null}, { n: null }, { n: 'aa' }, { n: null} , { n: null } ]
];

var amb = [
  [ { n: null}, { n: null }, { n: null }, { n: null} , { n: 'll' } ],
  [ { n: null}, { n: 'xx' }, { n: 'xx' }, { n: 'xx'} , { n: 'xx' } ],
  [ { n: null}, { n: 'xx' }, { n: null }, { n: null }, { n: null } ],
  [ { n: null}, { n: 'xx' }, { n: null }, { n: null }, { n: null } ],
  [ { n: null}, { n: null }, { n: 'aa' }, { n: null }, { n: null } ]
];


var ori = { x: 4, y:2 };
var des = { x: 0, y:4 };
var stack = [];

function TwoPoints() {


  var times = 10;
  var notFound = true;
  var oriCurrent = ori;
  var moves;
  var steps = [];
  var aux;

  var end = endPoints();

  // var firstMove = defineMoves();

  while( ( notFound ) && ( times-- > 0 )  ) {

    moves = defineMoves( oriCurrent );
    aux = move( oriCurrent, moves );
    oriCurrent = aux[3];
    if( !oriCurrent ) {
      notFound = false;
      console.log("CANT GO AHEAD");
    } else if( iArrived( oriCurrent, end ) ) {
      notFound = false;
      console.log("YOU ARRIVED", aux[3]);
    } else {
      steps.push( aux.splice(0,3) );
    }
  }
  console.log(steps);

}

function defineMoves( ori ) {

  var pos = ['top','right','bottom','left'];
  var res = [];
  var x = ori.x > des.x ? 0 : 2;
  var y = ori.y > des.y ? 3 : 1;
  var lastStack;
  var opp;

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

function move( ori, moves ) {

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
    acc[curr] = getXYDirections( x, y, curr );
    return acc;
  }, {});

  // se voltou numa posicao, exclui a decisao que tomou
  var times = timesInStack( x, y );
  if( times.length === 1 ) {
    moves = moves.filter(function( mov ) {
      return mov !== times[0].moveSelected;
    });
  }

  // evita ir para posicoes que ja passou 2 vezes
  moves = moves
    .reduce(function( acc, mov ) {
      var times = timesInStack( stackMoves[mov].x, stackMoves[mov].y );
      if( times.length < 2 ) {
        acc.push( mov );
      }
      return acc;
    },[]);

  // console.log(moves);
  // which way
  var stackMoveSelected =
    moves
      .reduce(function(acc, curr) {
          if( false === acc ) {
            if( isAmbNull( stackMoves[curr].x, stackMoves[curr].y ) ) acc = curr;
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

function timesInStack( x, y ) {
  return stack.filter(function( s ) {
              return s.id === x + "_" + y;
            });
}

function iArrived( ori, endPoints ) {
  return !!endPoints[ori.x + "_" + ori.y];
}

function endPoints(){
  return [
      [ des.x - 1, des.y], //[1,2]
      [ des.x, des.y + 1], //[2,3]
      [ des.x + 1, des.y], //[3,2]
      [ des.x, des.y - 1]  // [2,1]
    ]
    .reduce(function( acc, curr ) {
      if( isAmbNull(curr[0], curr[1]) ) acc[curr[0] + "_" + curr[1]] = true;
      return acc;
    },{});
}


function isAmbNull( x, y ) {
  return (amb[x]) && (amb[x][y]) && (amb[x][y].n === null);
}


function getXYDirections ( x, y, move ) {
  return move === 'top'    ? { x: x - 1, y: y }     :
        (move === 'right'  ? { x: x,     y: y + 1 } :
        (move === 'bottom' ? { x: x + 1, y: y }     :
        (move === 'left'   ? { x: x,     y: y - 1 } : false )));
}




function dist( obj1, obj2 ) {
  var x1 = obj1.x;
  var y1 = obj1.y;
  var x2 = obj2.x;
  var y2 = obj2.y;
  return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
}


TwoPoints();
