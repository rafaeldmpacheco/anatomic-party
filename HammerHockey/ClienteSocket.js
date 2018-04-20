function ClienteSocketFake()
{
	this.moveuJogador = function(indiceJogador, quantidade)	{ }
	this.criouTelaPergunta = function(perguntasPorJogador) { }
	this.selecionouItemPergunta = function(jogador, indiceResposta) { }
	this.clicouConfirmarTelaPergunta = function(jogador, estaCorreto) {	}
	this.abriuTelaMontarCorpo = function(partesPorJogador) { }
	this.moveuParte = function(jogador, offsetX, offsetY, parte) { }
	this.encaixouParte = function(jogador, parte) { }	
	this.finalizouParte = function() { }
}

function ClienteSocket()
{
	this.socket = new WebSocket(configuracoes.URL_SERVER);
	this.estaConectado = false;

	this.ligarEventos = function() 
	{
		var self = this;

		this.socket.onopen = function (e) 
		{
			self.estaConectado = true;
  		};
	}

	this.moveuJogador = function(indiceJogador, quantidade)
	{
		this.socket.send(JSON.stringify(new MoveuJogador(indiceJogador, quantidade)));
	}
	
	this.criouTelaPergunta = function(perguntasPorJogador)
	{
		this.socket.send(JSON.stringify(new CriouTelaPergunta(perguntasPorJogador)));
	}
	
	this.selecionouItemPergunta = function(jogador, indiceResposta)
	{
		this.socket.send(JSON.stringify(new SelecionouItemPergunta(jogador, indiceResposta)));
	}
	
	this.clicouConfirmarTelaPergunta = function(jogador, estaCorreto)
	{
		this.socket.send(JSON.stringify(new ClicouConfirmarTelaPergunta(jogador, estaCorreto)));
	}
	
	this.abriuTelaMontarCorpo = function(partesPorJogador)
	{
		this.socket.send(JSON.stringify(new AbriuTelaMontarCorpo(partesPorJogador)));
	}
	
	this.moveuParte = function(jogador, offsetX, offsetY, parte)
	{
		this.socket.send(JSON.stringify(new MoveuParte(jogador, offsetX, offsetY, parte)));		
	}

	this.encaixouParte = function(jogador, parte)
	{
		this.socket.send(JSON.stringify( { 'tipo': 6, 'jogador': jogador, 'parte': parte } ));
	}
	
	this.finalizouParte = function()
	{
		this.socket.send(JSON.stringify( { 'tipo': 7 }));
	}

	this.ligarEventos();
}

socket = configuracoes.ATIVAR_SOCKET ? new ClienteSocket() : new ClienteSocketFake();