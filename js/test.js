

function nullForNegative( a, b ) {
  var limit = 10 - 1;
  return (a < 0 || b < 0) || ( a > limit || b > limit ) ? [ null, null ] : [ a, b ];
}

function justDoIt( arr, limit ) {

  var res = [];

  res.push( { t: nullForNegative( arr[0] - 1, arr[1] ) } );
  res.push( { r: nullForNegative( arr[0], arr[1] + 1 ) } );
  res.push( { b: nullForNegative( arr[0] + 1, arr[1] ) } );
  res.push( { l: nullForNegative( arr[0], arr[1] -1  ) } );
  console.log(res);
}
function walk( x, y, deep ) {

}
// justDoIt( [0,0] );
// justDoIt( [0,10] );
// justDoIt( [0,20] );
justDoIt( [0,0] );
/*
 0 1 2 3
 0 1 2 3
 0 1 2 3
 0 1 2 3
*/