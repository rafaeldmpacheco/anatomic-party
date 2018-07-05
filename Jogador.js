var idJogador = 0;

function Jogador(celula, posicao, cor) {
	this.celulaAtual = celula;
	this.posicao = posicao;
	this.cor = cor;

	this.corMenu = cor;
	this.bufferCor = 'yellow';

	this.texto = 'Equipe ' + (posicao + 1);
	this.bufferTexto = 'Aperte para rolar o dado';

	this.estaNoTurno = false;

	this.amarelo = false;
	this.tempoAnimacao = 0;

	this.movimentosRestantes = 0;
	this.tempoMovimentacao = 0;

	this.atualizar = function(jogo) {
		if (this.movimentosRestantes == 0)		
			return;

		var data = new Date();
		var tempoMillis = data.getTime();
		if ((tempoMillis - this.tempoMovimentacao) > configuracoes.TEMPO_AVANCO_JOGADOR) 
		{			
			this.mover();			
			if (this.celulaAtual.sucessor == null) 
			{
				jogo.finalizar(this);
			} 
			else 
			{
				this.movimentosRestantes--;
				this.texto = this.movimentosRestantes;
				this.tempoMovimentacao = tempoMillis;
				if (this.movimentosRestantes == 0)
				{
					this.texto = 'Equipe ' + (this.posicao + 1);
					this.celulaAtual.onJogadorParouCelula(this);
					jogo.avancarTurno();
				}
			}
		}
	}

	this.desenhar = function (contexto) {
		contexto.fillStyle = this.cor;
		
		contexto.beginPath();
		contexto.arc(this.posicaoX, this.posicaoY, configuracoes.TAMANHO_JOGADOR / 2, 0, 2 * Math.PI);
		contexto.fill();
		
		this.desenharMenu(contexto);
	}

	this.mover = function () {
		this.celulaAtual = this.celulaAtual.sucessor;
		this.celulaAtual.atribuirJogador(this);
		this.posicaoX = this.definirX(this.celulaAtual);
		this.posicaoY = this.definirY(this.celulaAtual);
	}

	this.retroceder = function () {
		this.celulaAtual = this.celulaAtual.antecessor;
		this.celulaAtual.atribuirJogador(this);
		this.posicaoX = this.definirX(this.celulaAtual);
		this.posicaoY = this.definirY(this.celulaAtual);
	}

	this.definirX = function(celula) {	
		var umQuartoCelula = configuracoes.TAMANHO_CELULA / 4;
		
		if (this.posicao == 0 || 
			this.posicao == 2) {
			return (celula.x * configuracoes.TAMANHO_CELULA + celula.x * 10) + (umQuartoCelula);
		} else {
			return (celula.x * configuracoes.TAMANHO_CELULA + celula.x * 10) + (configuracoes.TAMANHO_CELULA - umQuartoCelula);
		}
	}

	this.definirY = function(celula) {
		var umQuartoCelula = configuracoes.TAMANHO_CELULA / 4;
		
		if (this.posicao == 0 || 
			this.posicao == 1) {
			return (celula.y * configuracoes.TAMANHO_CELULA + celula.y * 10) + (umQuartoCelula);
		} else {
			return (celula.y * configuracoes.TAMANHO_CELULA + celula.y * 10) + (configuracoes.TAMANHO_CELULA - umQuartoCelula);
		}
	}

	this.gerarNovoIdentificador = function() {
		this.identificador = ++idJogador;
	}

	this.desenharMenu = function(contexto) {
		contexto.save();
		
		var data = new Date();
		var tempoMillis = data.getTime();
		if (this.estaNoTurno && 
			(tempoMillis - this.tempoAnimacao) > configuracoes.TEMPO_ANIMACAO_TURNO) {
			this.tempoAnimacao = tempoMillis;
			var corIntermediaria = this.corMenu;
			this.corMenu = this.bufferCor;
			this.bufferCor = corIntermediaria;
		}

		contexto.fillStyle = this.corMenu;
		
		var altura = configuracoes.ALTURA_MENU;
		var largura = configuracoes.LARGURA_MENU;
		
		contexto.fillRect(this.xMenu, this.yMenu, largura, altura);
		contexto.strokeRect(this.xMenu, this.yMenu, largura, altura);
		
		contexto.fillStyle = 'black';
		contexto.textAlign = 'center';
		contexto.font = '12px Arial';
		contexto.fillText(this.texto, this.xMenu + configuracoes.LARGURA_MENU / 2, this.yMenu + configuracoes.ALTURA_MENU / 2 + 5);

		contexto.restore();
	}

	this.verificarClique = function(evento, jogo) {
		var altura = configuracoes.ALTURA_MENU;
		var largura = configuracoes.LARGURA_MENU;

		var xInferiorMenu = this.xMenu + largura;
		var yInferiorMenu = this.yMenu + altura;

		var xEvento = parseInt(evento.pageX) - 8;
		var yEvento = parseInt(evento.pageY) - 8;
		
		if (xEvento > this.xMenu &&
			xEvento < xInferiorMenu &&
			yEvento > this.yMenu &&
			yEvento < yInferiorMenu)
		{
			if (this.estaNoTurno)
			{
				this.estaNoTurno = false;
				this.corMenu = this.cor;
				this.bufferCor = 'yellow';
				this.rolarDado();
			}
		}
	}

	this.entrarTurno = function() {
		this.estaNoTurno = true;
		this.tempoAnimacao = new Date().getTime();
		this.texto = 'Clique para rolar o dado';
	}

	this.rolarDado = function() {
		var quantidadeMovimentos = Math.floor((Math.random() * 6) + 1);
		this.movimentosRestantes = quantidadeMovimentos;
		this.tempoMovimentacao = new Date().getTime();
		socket.moveuJogador(this.posicao, quantidadeMovimentos);
	}

	this.definirPosicoesMenu = function() {		
		switch (this.posicao) {
			case 0:
				this.xMenu = Posicoes.TopoEsquerdo.x;
				this.yMenu = Posicoes.TopoEsquerdo.y;
				return;
			case 1:
				this.xMenu = Posicoes.TopoDireito.x - configuracoes.LARGURA_MENU;
				this.yMenu = Posicoes.TopoDireito.y;
				return;
			case 2:
				this.xMenu = Posicoes.BaseEsquerda.x;
				this.yMenu = Posicoes.BaseEsquerda.y - configuracoes.ALTURA_MENU;
				return;
			case 3:
				this.xMenu = Posicoes.BaseDireita.x - configuracoes.LARGURA_MENU;
				this.yMenu = Posicoes.BaseDireita.y - configuracoes.ALTURA_MENU;
				return;
		}
	}
	
	this.posicaoX = this.definirX(this.celulaAtual);
	this.posicaoY = this.definirY(this.celulaAtual);

	this.gerarNovoIdentificador();
	this.definirPosicoesMenu();
}