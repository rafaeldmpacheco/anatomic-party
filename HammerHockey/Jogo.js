var ModoJogo = {
	NORMAL: 1,
	PERGUNTA: 2,
	MINI_GAME: 3,
}

function Jogo(contexto) {

	this.tabuleiro;
	this.jogadores = [];
	this.indiceJogadorAtual = 0;

	this.contexto = contexto;

	this.terminou = false;

	this.evento;

	this.imagemJogo = document.getElementById('fundo');

	this.iniciar = function() {
		var self = this;
		
		this.modo = ModoJogo.NORMAL;

		this.tabuleiro = new Tabuleiro(this);
		this.jogadores.push(this.tabuleiro.adicionarJogador(0, 'red'));
		this.jogadores.push(this.tabuleiro.adicionarJogador(1, 'green'));
		this.jogadores.push(this.tabuleiro.adicionarJogador(2, 'cyan'));
		this.jogadores.push(this.tabuleiro.adicionarJogador(3, 'magenta'));

		configuracoes.numeroJogadores = 4;

		var div = document.getElementById('divToc');

		if (configuracoes.ATIVAR_EVENTOS_MOUSE)
		{
			div.addEventListener('mousedown', function(e) {
				e.preventDefault();
				
				switch (self.modo)
				{
					case ModoJogo.NORMAL:
						self.verificarCliqueNormal(e, self);
						break;
					case ModoJogo.PERGUNTA:
					case ModoJogo.MINI_GAME:
						self.verificarCliqueEvento(e, self);
						break;
					default:
						break;
				}
			}, false);
	
			div.addEventListener('mousemove', function(e) {
				e.preventDefault();
	
				if (self.modo == ModoJogo.MINI_GAME)
					self.evento.verificarMovimento(e);
			}, false);
	
			div.addEventListener('mouseup', function(e) {
				e.preventDefault();
	
				if (self.modo == ModoJogo.MINI_GAME)
					self.evento.verificarFinal(e);
			}, false);
		}

		div.addEventListener('touchstart', function(e) 
		{
			e.preventDefault();

			for (var i = 0; i < e.changedTouches.length; i++)
			{
				switch (self.modo)
				{
					case ModoJogo.NORMAL:
						self.verificarCliqueNormal(e.changedTouches[i], self);
						break;
					case ModoJogo.PERGUNTA:
					case ModoJogo.MINI_GAME:
						self.verificarCliqueEvento(e.changedTouches[i], self);
						break;
					default:
						break;
				}
			}
		}, false);
		
		div.addEventListener('touchmove', function(e) {
			e.preventDefault();

			if (self.modo == ModoJogo.MINI_GAME)
				for (var i = 0; i < e.changedTouches.length; i++)
					self.evento.verificarMovimento(e.changedTouches[i]);
		}, false);

		div.addEventListener('touchend', function(e) {
			e.preventDefault();

			if (self.modo == ModoJogo.MINI_GAME)
				for (var i = 0; i < e.changedTouches.length; i++)
					self.evento.verificarFinal(e.changedTouches[i]);
		}, false);

		this.jogadores[0].entrarTurno();

		this.step();
	}

	this.irPara = function(tipoEvento)
	{
		var jogador = this.jogadores[this.indiceJogadorAtual];
		while(jogador.celulaAtual.evento == null ||
			  jogador.celulaAtual.evento.tipoEvento != tipoEvento)
		{
			jogador.mover();
		}
		jogador.celulaAtual.onJogadorParouCelula(jogador);
	}

	this.verificarCliqueNormal = function(evento, jogo) {
		for (var i = 0; i < jogo.jogadores.length; i++) 
			jogo.jogadores[i].verificarClique(evento, jogo);
	}

	this.verificarCliqueEvento = function(evento, jogo) {
		if (this.evento) 
			this.evento.verificarClique(evento, jogo)
	}

	this.avancarTurno = function() {
		if (++this.indiceJogadorAtual == configuracoes.numeroJogadores) {
			this.indiceJogadorAtual = 0;
		}
		this.jogadores[this.indiceJogadorAtual].entrarTurno();
	}

	this.step = function() 
	{
		if (!this.terminou)  
		{			
			requestAnimationFrame(this.step.bind(this));
			this.contexto.clearRect(Posicoes.TopoEsquerdo.x - 1, Posicoes.TopoEsquerdo.y - 1, Posicoes.BaseDireita.x - Posicoes.TopoEsquerdo.x + 2, Posicoes.BaseDireita.y - Posicoes.TopoEsquerdo.y + 2);		
			this.contexto.drawImage(this.imagemJogo, Posicoes.TopoEsquerdo.x - 20, Posicoes.TopoEsquerdo.y - 10);
			switch (this.modo) 
			{
				case ModoJogo.NORMAL:
					this.desenharTabuleiroNormal();
					break;				
				case ModoJogo.PERGUNTA:		
				case ModoJogo.MINI_GAME:
					this.desenharEvento();
					break;
			}
		}
	}

	this.desenharTabuleiroNormal = function() 
	{		
		this.tabuleiro.atualizar();
		for (var i = 0; i < this.jogadores.length; i++) 
		{
			this.jogadores[i].atualizar(this);
			if (!this.terminou) 
			{
				this.jogadores[i].desenhar(this.contexto);
			}
		}
	}

	this.desenharEvento = function() 
	{
		this.evento.desenhar(this.contexto);
	}

	this.mudarModo = function(modoJogo) {
		this.modo = modoJogo;
	}

	this.atribuirEvento = function(evento) {
		this.evento = evento;
	}

	this.finalizar = function(jogadorVencedor) {
		this.terminou = true;		
		this.contexto.clearRect(Posicoes.TopoEsquerdo.x - 1, Posicoes.TopoEsquerdo.y - 1, Posicoes.BaseDireita.x - Posicoes.TopoEsquerdo.x + 2, Posicoes.BaseDireita.y - Posicoes.TopoEsquerdo.y + 2);
		contexto.fillStyle = jogadorVencedor.cor;
		contexto.textAlign = 'center';
		contexto.font = '32px Arial';

		var xTexto = (Posicoes.BaseDireita.x + Posicoes.TopoEsquerdo.x) / 2;
		var yTexto = (Posicoes.BaseDireita.y + Posicoes.TopoEsquerdo.y) / 2 - 7;
		contexto.fillText("A equipe " + (jogadorVencedor.posicao + 1) + " venceu!", xTexto, yTexto);
	}
}