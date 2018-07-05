function Celula(x, y, ordem, evento) {
	this.x = x;
	this.y = y;
	this.ordem = ordem;
	this.sucessor = null;
	this.antecessor = null;

	this.jogadores = [ ];
	this.evento = evento;

	this.desenhar = function(contexto) {
		contexto.save();

		var xTopoEsquerdoCelula = configuracoes.TAMANHO_CELULA * this.x + this.x * 10;
		var yTopoEsquerdoCelula = configuracoes.TAMANHO_CELULA * this.y + this.y * 10;
		
		var texto = this.ordem;

		contexto.fillStyle = 'white';

		if (this.evento != null) {			
			texto = '?';			
			if (this.evento.tipoEvento != TipoEvento.PERGUNTA) {
				contexto.fillStyle = 'yellow';
			}
		} else if (this.sucessor == null) {
			contexto.fillStyle = 'green';			
		}

		contexto.fillRect(
			xTopoEsquerdoCelula,
			yTopoEsquerdoCelula,
			configuracoes.TAMANHO_CELULA,
			configuracoes.TAMANHO_CELULA
		);

		contexto.strokeRect(
			xTopoEsquerdoCelula,
			yTopoEsquerdoCelula, 
			configuracoes.TAMANHO_CELULA, 
			configuracoes.TAMANHO_CELULA
		);
		
		contexto.fillStyle = 'black';
		contexto.textAlign = 'center';
		contexto.font = (this.evento != null ? configuracoes.TAMANHO_TEXTO_EVENTOS : configuracoes.TAMANHO_TEXTO_CELULAS) + ' Arial';
		contexto.fillText(texto, xTopoEsquerdoCelula + configuracoes.TAMANHO_CELULA / 2, yTopoEsquerdoCelula + configuracoes.TAMANHO_CELULA / 2 + 3);
		
		contexto.restore();
	}

	this.avancarJogador = function(posicao, contexto, tabuleiro) {
		var jogador = this.jogadores[posicao];
		jogador.mover(this.sucessor, contexto, tabuleiro);
	}

	this.atribuirJogador = function(jogador) {
		this.jogadores[jogador.posicao] = jogador;
	}	

	this.onJogadorParouCelula = function(jogador) {
		if (this.evento != null)
		{
			this.evento.disparar(jogador);
			this.evento = null;
		}
	}

	this.atribuirSucessor = function(sucessor) {
		this.sucessor = sucessor;
	}

	this.moverJogador = function(posicao) {
		this.jogadores[posicao - 1]
	}
}