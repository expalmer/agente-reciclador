;(function(context){

  'use strict';

  function Interface() {


    this.$start = $('#start');
    this.$body = $('body');
    this.$command = $('#command');
    this.$output = $('#output');
    this.$grid = $('#grid');

    this.$command.focus();

    this.dimensao = 0;
    this.debug = true;

    // Command Line Vars
    this.iniciado = false;
    this.auto     = false;
    this.acao     = function () {};

    this.addEventListeners();

  }

  Interface.fn = Interface.prototype;

  Interface.fn.addEventListeners = function () {

    this.$command.on('keypress', function(e) {
      if( e.charCode === 13 ) {
        this.commandLine( e.target.value );
      }
    }.bind(this));

  };

  Interface.fn.commandLine = function ( value ) {

    var output = [];
    var clear = false;

    switch( value ) {

      case "help":
        if( this.iniciado ) {
          output = this.informacoes();
        } else {
          output.push("Digite <span class='green'> init</span> para Iniciar");
          output.push("Digite <span class='red'> exit</span> para terminar");
          output.push("Digite <span class='green'> clear</span> para limpar");
        }
      break;

      case "init":
        output.push("Digite <span class='green'>10, 20</span> ou <span class='green'>30</span>");
        clear = true;
      break;

      case "10":
      case "20":
      case "30":
        this.dimensao = +value;
        this.inicializar();
        this.iniciado = true;
        clear = true;
        output.push("<span class='green'>-----------------------------------------</span>");
        output.push("<span class='green'> INICIADO </span>");
        output.push("<span class='green'>-----------------------------------------</span>");
        output.push("Dê <span class='yellow'>ENTER</span> para cada ciclo");
        output.push("Ou Digite <span class='yellow'>auto</span> para automático");
      break;

      case "auto":
        if( false === this.iniciado || true === this.auto ) {
          return false;
        }
        this.auto = true;
        this.acao = setInterval(function(){
          if( this.app.novoCiclo() ) {
            clearInterval(this.acao);
          }
        }.bind(this), 1000);
      break;

      case "stop":
        if( false === this.iniciado || false === this.auto ) {
          return false;
        }
        this.auto = false;
        clearInterval(this.acao);
      break;

      case "exit":
        this.$start.fadeOut();
        this.$grid.html('');
        this.iniciado = false;
        output.push("<span class='red'>-----------------------------------------</span>");
        output.push("<span class='red'> TERMINADO </span>");
        output.push("<span class='red'>-----------------------------------------</span>");
      break;

      case "clear":
        clear = true;
      break;

      default:
        if( this.iniciado && this.auto === false ) {
          this.app.novoCiclo();
        }
    }

    this.$command.val('');

    if( clear ) {
      this.$output.html('');
    }

    if( output ) {
      this.$output.prepend(
          output.map(function( i ){
            return '<div>' + i + '</div>';
          })
      );
    }

  };

  Interface.fn.inicializar = function() {

    this.$start.fadeIn();
    this.app = new App( this.dimensao, this.render.bind(this), this.output.bind(this) );
    this.app.inicializar();
    this.render();

  };

  Interface.fn.output = function ( logs ) {
    this.$output.prepend(
      logs.map(function( i ){
          return '<div>' + i + '</div>';
      })
    );
  };

  Interface.fn.informacoes = function () {

    var html = [];
    var vetor = this.app.elementos;

    html.push( "<span class='gray'>---------------------------------------------</span>" );
    _.each( vetor[AGENTE], function ( i ) {
      html.push( AGENTES[i.index] + " &nbsp; <span class='org'>" + i.lixo[LIXO_ORGANICO].length + "</span> <span class='sec'>" + i.lixo[LIXO_SECO].length + "</span>" );
    });
    _.each( vetor[LIXEIRA_ORGANICO], function ( i, idx ) {
      html.push( "<span class='org'>Lixeira Org["+ idx +"] => " + i.lixo.length + "</span>" );
    });
    _.each( vetor[LIXEIRA_SECO], function ( i, idx ) {
      html.push( "<span class='sec'>Lixeira Sec["+ idx +"] => " + i.lixo.length + "</span>" );
    });

    html.push( "<span class='org'>Lixo Org => " + vetor[LIXO_ORGANICO].length + "</span>" );
    html.push( "<span class='sec'>Lixo Sec => " + vetor[LIXO_SECO].length + "</span>" );
    html.push( "<span class='gray'>---------------------------------------------</span>" );

    return html;
  };

  Interface.fn.render = function () {
    this.renderGrid();
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
        var debug = self.debug ? self.infos(y) : '';
        if( y.name === LIXEIRA_ORGANICO || y.name === LIXEIRA_SECO ) {
          classe = y.cheia() ? classe + "_closed" : classe;
        }

        html.push( '<div class="col ' + selected + '">' + debug + '<span class="' + classe +'"></div>' );
      });
      html.push('</div>');
    });
    this.$grid.removeClass("box-10 box-20 box-30").addClass("box-" + size);
    $.when( this.$grid.html( html.join("") )).then(function() {
      // console.log('grid ok');
    });

  };

  Interface.fn.infos= function ( y ) {
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
    return res.length ? '<div class="info">' + res.join('') + '</div>' : '';
  }

  context.Interface = Interface;

})(this);

