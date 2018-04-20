function Quadrado(xCentro, yCentro, id)
{
	this.x = xCentro;
	this.xAnterior = 0;
	this.y = yCentro;
	this.yAnterior = 0;
	this.tamanho = configuracoes.TAMANHO_QUADRADO_MONTAR_BLAH;
	this.id = id;
	this.deltaXAnterior = 0;
	this.deltaYAnterior = 0;
	this.selecionado = false;
	this.boundingBox = {};
	this.viva = true;	
	
	this.definirBoundingBox = function() 
	{
		this.boundingBox.cima = this.y - (this.tamanho / 2);
		this.boundingBox.baixo = this.y + (this.tamanho / 2);
		this.boundingBox.esquerda = this.x - (this.tamanho / 2);
		this.boundingBox.direita = this.x + (this.tamanho / 2);
	}

	this.verificarOverlap = function(outro)
	{
		return (Math.abs(this.x - outro.x) < 15 &&
				Math.abs(this.y - outro.y) < 15 &&
				this.id == outro.id);
	}

	this.desenhar = function(contexto)
	{
		contexto.strokeRect(this.boundingBox.esquerda, this.boundingBox.cima, this.tamanho, this.tamanho);
	}

	this.alterarX = function(x)
	{
		this.xAnterior = this.x;
		this.x = x;
	}

	this.alterarY = function(y)
	{
		this.yAnterior = this.y;
		this.y = y;
	}

	this.mover = function(x, y)
	{
		this.x = x;
		this.y = y;
		this.definirBoundingBox();
	}

	this.enviarSocket = function(jogador)
	{
		var movimentoX = this.xAnterior - this.x;
		var movimentoY = this.yAnterior - this.y;
		
		if (jogador.posicao == 0 ||
			jogador.posicao == 1)
		{
			movimentoX = -movimentoX;
		}

		socket.moveuParte(jogador, movimentoX, movimentoY, this.id);
	}

	this.definirBoundingBox();
}

function AreaJogador(jogador)
{
	this.jogador = jogador;
	this.boundingBox = {};	

	this.areasCorretas = [];
	this.areasControlaveis = [];

	this.deltaXAnterior = 0;
	this.deltaYAnterior = 0;

	this.toquesNaArea = [];

	this.definirBoundingBox = function()
	{
		switch(this.jogador.posicao)
		{
			case 0:
				this.boundingBox.cima = Posicoes.TopoEsquerdo.y;
				this.boundingBox.baixo = Posicoes.Centro.y;
				this.boundingBox.esquerda = Posicoes.TopoEsquerdo.x;
				this.boundingBox.direita = Posicoes.Centro.x;
				break;
			case 1:
				this.boundingBox.cima = Posicoes.TopoEsquerdo.y;
				this.boundingBox.baixo = Posicoes.Centro.y;
				this.boundingBox.esquerda = Posicoes.Centro.x;
				this.boundingBox.direita = Posicoes.TopoDireito.x;
				break;
			case 2:
				this.boundingBox.cima = Posicoes.Centro.y;
				this.boundingBox.baixo = Posicoes.BaseEsquerda.y;
				this.boundingBox.esquerda = Posicoes.TopoEsquerdo.x;
				this.boundingBox.direita = Posicoes.Centro.x;
				break;
			case 3:
				this.boundingBox.cima = Posicoes.Centro.y;
				this.boundingBox.baixo = Posicoes.BaseEsquerda.y;
				this.boundingBox.esquerda = Posicoes.Centro.x;
				this.boundingBox.direita = Posicoes.TopoDireito.x;
				break;
		}
	};

	this.definirAreasCorretas = function() 
	{
		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1)
		{
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.baixo - 50, 0));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2 - 75, this.boundingBox.baixo - 125, 1));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.baixo - 150, 2));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.baixo - 250, 3));
		} 
		else 
		{
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.cima + 50, 0));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2 + 75, this.boundingBox.cima + 125, 1));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.cima + 150, 2));
			this.areasCorretas.push(new Quadrado((this.boundingBox.esquerda + this.boundingBox.direita) / 2, this.boundingBox.cima + 250, 3));	
		}
	}

	this.verificarIdJaUsada = function(id)
	{
		for (var i = 0; i < this.areasControlaveis.length; i++)
		{
			if (this.areasControlaveis[i].id == id)
				return true;
		}

		return false;
	}

	this.gerarId = function()
	{
		var id = 0;
		
		do 
		{
			id = Math.floor((Math.random() * 4));
		} while (this.verificarIdJaUsada(id));

		return id;
	}

	this.inicializarAreasControlaveis = function()
	{
		var metadeQuadrado = configuracoes.TAMANHO_QUADRADO_MONTAR_BLAH / 2;

		var xCentro = (this.boundingBox.esquerda + this.boundingBox.direita) / 2

		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1)
		{
			this.areasControlaveis.push(new Quadrado(this.boundingBox.direita - metadeQuadrado - 80, this.boundingBox.cima + metadeQuadrado + 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado((xCentro + this.boundingBox.direita) / 2 - 80, this.boundingBox.cima + metadeQuadrado + 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado((xCentro + this.boundingBox.esquerda) / 2 + 80, this.boundingBox.cima + metadeQuadrado + 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado(this.boundingBox.esquerda + metadeQuadrado + 80, this.boundingBox.cima + metadeQuadrado + 10, this.gerarId()));

		}
		else
		{
			this.areasControlaveis.push(new Quadrado(this.boundingBox.esquerda + metadeQuadrado + 80, this.boundingBox.baixo - metadeQuadrado - 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado((xCentro + this.boundingBox.esquerda) / 2 + 80, this.boundingBox.baixo - metadeQuadrado - 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado((xCentro + this.boundingBox.direita) / 2 - 80, this.boundingBox.baixo - metadeQuadrado - 10, this.gerarId()));
			this.areasControlaveis.push(new Quadrado(this.boundingBox.direita - metadeQuadrado - 80, this.boundingBox.baixo - metadeQuadrado - 10, this.gerarId()));
		}
	}

	this.desenhar = function(contexto)
	{
		contexto.save();

		for (var i = 0; i < this.areasCorretas.length; i++)
		{
			contexto.strokeStyle = this.areasCorretas[i].preenchida ? 'green' : this.jogador.cor;
			this.areasCorretas[i].desenhar(contexto);
			contexto.strokeStyle = 'black';
			if (this.areasControlaveis[i].viva)
				this.areasControlaveis[i].desenhar(contexto);
		}

		contexto.restore();
	}

	this.verificarToque = function(evento)
	{
		for (var i = 0; i < this.areasControlaveis.length; i++)
			if (Util.verificarBoundingBox(evento.clientX, evento.clientY, this.areasControlaveis[i].boundingBox))
				this.toquesNaArea.push( { 'id': evento.identifier, 'indexArea': i } );
	}

	this.verificarArraste = function(evento)
	{
		var indiceToque = this.obterIndiceToque(evento);
		if (indiceToque < 0) return;

		var toque = this.toquesNaArea[indiceToque];
		var area = this.areasControlaveis[toque.indexArea];

		area.alterarX(evento.clientX);
		area.alterarY(evento.clientY);

		var metadeTamanho = area.tamanho / 2;

		if ((area.x + metadeTamanho) > this.boundingBox.direita)
			area.x = this.boundingBox.direita - metadeTamanho;
		if ((area.x - metadeTamanho) < this.boundingBox.esquerda)
			area.x = this.boundingBox.esquerda + metadeTamanho;

		if ((area.y + metadeTamanho) > this.boundingBox.baixo)
			area.y = this.boundingBox.baixo - metadeTamanho;
		if ((area.y - metadeTamanho) < this.boundingBox.cima)
			area.y = this.boundingBox.cima + metadeTamanho;

		area.definirBoundingBox();
		area.enviarSocket(this.jogador.posicao);
	}

	this.verificarFimToque = function(evento)
	{
		var indiceToque = this.obterIndiceToque(evento);
		if (indiceToque < 0) return;
	
		var area = this.areasControlaveis[this.toquesNaArea[indiceToque].indexArea];

		for (var i = 0; i < this.areasCorretas.length; i++)
		{
			if (area.verificarOverlap(this.areasCorretas[i]))
			{
				area.viva = false;
				this.areasCorretas[i].preenchida = true;
				socket.encaixouParte(this.jogador.posicao, this.areasCorretas[i].id);
			}
		}
		
		this.toquesNaArea.splice(indiceToque, 1);

		return this.verificarFimJogo();
	}

	this.verificarFimJogo = function() 
	{
		for (var i = 0; i < this.areasCorretas.length; i++)
			if (!this.areasCorretas[i].preenchida)
				return -1;

		return this.jogador.posicao;
	}

	this.obterIndiceToque = function(evento)
	{
		for (var i = 0; i < this.toquesNaArea.length; i++)
			if (this.toquesNaArea[i].id == evento.identifier)
				return i;

		return -1;
	}

	this.inicializar = function()
	{
		this.definirBoundingBox();
		this.definirAreasCorretas();
		this.inicializarAreasControlaveis();
	}

	this.inicializar();
}

function MontarAlgumaCoisa(jogo) 
{
	this.jogadores = jogo.jogadores;
	this.jogo = jogo;
	this.areas = [ ];	

	this.tipoEvento = TipoEvento.MINI_GAME;

	this.disparar = function(jogador) 
	{
		this.jogo.mudarModo(ModoJogo.MINI_GAME);
		this.jogo.atribuirEvento(this);
		
		for(var i = 0; i < this.jogadores.length; i++)
		{
			this.areas.push(new AreaJogador(this.jogadores[i]));
		}

		var partesPorJogador = [];

		for (var i = 0; i < this.areas.length; i++)
		{
			var partes = [];
			for (var j = 0; j < this.areas[i].areasControlaveis.length; j++)
				partes.push(this.areas[i].areasControlaveis[j].id);

			partesPorJogador.push({ 'partesCorpo': partes, 'jogador': this.areas[i].jogador.posicao });
		}

		socket.abriuTelaMontarCorpo(partesPorJogador);
	}

	this.desenhar = function(contexto)
	{
		contexto.clearRect(Posicoes.TopoEsquerdo.x - 1, Posicoes.TopoEsquerdo.y - 1, Posicoes.BaseDireita.x - Posicoes.TopoEsquerdo.x + 2, Posicoes.BaseDireita.y - Posicoes.TopoEsquerdo.y + 2);

		contexto.save();
		contexto.strokeStyle = 'black';
		contexto.lineWidth = 2;
		contexto.strokeRect(Posicoes.TopoEsquerdo.x - 1, Posicoes.TopoEsquerdo.y - 1, Posicoes.BaseDireita.x - Posicoes.TopoEsquerdo.x + 2, Posicoes.BaseDireita.y - Posicoes.TopoEsquerdo.y + 2);
		contexto.restore();

		// Linha vertical centro
		contexto.beginPath();
		contexto.moveTo(Posicoes.Centro.x, Posicoes.TopoEsquerdo.y);
		contexto.lineTo(Posicoes.Centro.x, Posicoes.BaseEsquerda.y);
		contexto.stroke();

		// Linha horizontal centro
		contexto.beginPath();
		contexto.moveTo(Posicoes.TopoEsquerdo.x, Posicoes.Centro.y);
		contexto.lineTo(Posicoes.TopoDireito.x, Posicoes.Centro.y);
		contexto.stroke();
		
		for (var i = 0; i < this.areas.length; i++)
		{
			this.areas[i].desenhar(contexto);
		}

		if (this.terminou)
		{
			this.desenharTelaFinal(contexto);
			if ((new Date().getTime() - this.tempoFinal) > 4000)
			{
				var jogador = this.jogadores[this.jogadorVencedor];
				socket.moveuJogador(jogador.posicao, 3);
				jogador.mover();
				jogador.mover();
				jogador.mover();
				this.jogo.mudarModo(ModoJogo.NORMAL);
			}
		}
	}

	this.desenharTelaFinal = function(contexto)
	{
		contexto.save();
		contexto.fillStyle = 'white';
		contexto.strokeStyle = 'black';
		contexto.lineWidth = 2;
		contexto.fillRect(Posicoes.Centro.x - 235, Posicoes.Centro.y - 45, 420, 90);
		contexto.strokeRect(Posicoes.Centro.x - 235, Posicoes.Centro.y - 45, 420, 90);
		contexto.lineWidth = 1;
		contexto.fillStyle = 'black';
		contexto.font = '24px Arial bold';
		contexto.fillText('A equipe ' + (this.jogadorVencedor + 1) + ' venceu!', Posicoes.Centro.x - 215, Posicoes.Centro.y - 17);
		contexto.fillText('Essa equipe avançará três casas.', Posicoes.Centro.x - 215, Posicoes.Centro.y + 20);
		contexto.restore();
	}

	this.verificarClique = function(evento)
	{
		if (this.terminou)
			return;

		evento = this.ajustarEvento(evento);

		for (var i = 0; i < this.areas.length; i++)
			if (Util.verificarBoundingBox(evento.clientX, evento.clientY, this.areas[i].boundingBox))
				this.areas[i].verificarToque(evento);
	}

	this.verificarMovimento = function(evento)
	{
		if (this.terminou)
			return;

		evento = this.ajustarEvento(evento);
		
		for (var i = 0; i < this.areas.length; i++)
			if (Util.verificarBoundingBox(evento.clientX, evento.clientY, this.areas[i].boundingBox))
				this.areas[i].verificarArraste(evento);
			
	}

	this.verificarFinal = function(evento)
	{
		if (this.terminou)
			return;

		evento = this.ajustarEvento(evento);

		for (var i = 0; i < this.areas.length; i++)
		{
			var jogadorVencedor = this.areas[i].verificarFimToque(evento);
			if (jogadorVencedor > -1)
			{
				socket.finalizouParte();
				this.terminou = true;
				this.tempoFinal = new Date().getTime();
				this.jogadorVencedor = jogadorVencedor;
			}
		}
	}

	this.ajustarEvento = function(evento) 
	{
		evento.clientX = parseInt(evento.clientX) - 8;
		evento.clientY = parseInt(evento.clientY) - 8;		
		return evento;
	}
}