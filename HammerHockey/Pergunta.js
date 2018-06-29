function AreaJogadorPerguntas(texto, respostas, jogador) {
	this.jogador = jogador;
	this.boundingBox = {};

	this.texto = texto;
	this.respostas = respostas;

	this.botaoConfirmar =
		{
			boundingBox: {},
		};

	this.altura;

	this.terminou = false;
	this.acertou;

	this.selecionouResposta = false;

	this.definirBoundingBox = function () {
		switch (this.jogador.posicao) {
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

	this.inicializar = function () {
		this.definirBoundingBox();
		this.ordenarRespostas();

		var xCentro = (this.boundingBox.esquerda + this.boundingBox.direita) / 2;
		var yCentro = (this.boundingBox.cima + this.boundingBox.baixo) / 2;

		this.xInicial = xCentro - configuracoes.LARGURA_TELA_PERGUNTAS / 2;
		this.xFinal = xCentro + configuracoes.LARGURA_TELA_PERGUNTAS / 2;

		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			this.yInicial = this.boundingBox.baixo - 20;
		}
		else {
			this.yInicial = this.boundingBox.cima + 20;
		}
	}

	this.determinarX = function (offset) {
		if (!offset) {
			offset = 0;
		}

		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			return this.xFinal - offset;
		}

		return this.xInicial + offset;
	}

	this.desenhar = function (contexto) {
		contexto.save();

		this.desenharTelaPergunta(contexto);

		contexto.restore();
	}

	this.desenharTexto = function (contexto, texto, x, y) {
		contexto.save();
		contexto.translate(x, y);
		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			contexto.rotate(Math.PI);
		}
		contexto.fillText(texto, 0, 0);
		contexto.restore();
	}

	this.desenharTelaPergunta = function (contexto) {
		var offsetY = this.jogador.posicao == 0 || this.jogador.posicao == 1 ? this.yInicial - 5 : this.yInicial + 5;

		contexto.lineWidth = 2;

		contexto.fillStyle = 'black';
		contexto.font = '18px Arial bold';
		contexto.textAlign = 'center';
		contexto.textBaseline = "top";

		this.desenharTexto(contexto, 'PERGUNTA', this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS / 2), offsetY);

		offsetY = this.ajustarOffset(offsetY, 27);

		this.desenharDivisoria(contexto, offsetY);

		offsetY = this.ajustarOffset(offsetY, 5);

		contexto.textAlign = 'left';
		contexto.font = '14px Arial';
		offsetY = this.wrapText(contexto, this.texto, this.determinarX(5), offsetY, configuracoes.LARGURA_TELA_PERGUNTAS - 10, 20);
		offsetY = this.ajustarOffset(offsetY, 23);

		this.desenharDivisoria(contexto, offsetY);

		offsetY = this.ajustarOffset(offsetY, 5);

		for (var i = 0; i < this.respostas.length; i++) {
			offsetY = this.desenharResposta(contexto, this.respostas[i], offsetY);
		}

		if (!this.terminou) {
			offsetY = this.desenharBotaoConfirmacao(contexto, offsetY);
		}
		else {
			offsetY = this.desenharTelaFinal(contexto, offsetY);
		}

		this.altura = offsetY;

		contexto.strokeRect(
			this.xInicial,
			this.yInicial,
			configuracoes.LARGURA_TELA_PERGUNTAS,
			offsetY - this.yInicial
		);
	}

	this.determinarDirecao = function (valor) {
		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			return -valor;
		}

		return valor;
	}

	this.desenharBotaoConfirmacao = function (contexto, offsetY) {
		contexto.fillStyle = this.selecionouResposta ? 'green' : 'gray';


		if("Como é formado o sistema digestório:" === this.texto) {
            var img = new Image;
            img.src = './pergunta1.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Formam o caminho por onde o alimento passa até chegar ao estômago:" === this.texto) {
            var img = new Image;
            img.src = './pergunta4.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("As glândulas anexas ao tubo digestório são:" === this.texto) {
            var img = new Image;
            img.src = './pergunta5.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Qual a função dos movimentos peristálticos:" === this.texto) {
            var img = new Image;
            img.src = './pergunta6.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Ele movimenta, amassa e mexe o alimento. O suco gástrico é produzido aí:" === this.texto) {
            var img = new Image;
            img.src = './pergunta7.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Nele, o alimento já muito transformado, mistura-se com três líquidos e juntos transformam os nutrientes em alimentos:" === this.texto) {
            var img = new Image;
            img.src = './pergunta8.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Tem a função de absorver a água, evitando que ela seja eliminada junto com as fezes:" === this.texto) {
            var img = new Image;
            img.src = './pergunta9.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Maior glândula do nosso corpo, que é a responsável pela produção da bile:" === this.texto) {
            var img = new Image;
            img.src = './pergunta10.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Como é formado o sistema respiratório:" === this.texto) {
            var img = new Image;
            img.src = './pergunta11.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("Sua principal função é fornecer ao nosso sangue oxigênio:" === this.texto) {
            var img = new Image;
            img.src = './pergunta16.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("O processo de troca gasosa no pulmão — oxigênio por dióxido de carbono:" === this.texto) {
            var img = new Image;
            img.src = './pergunta17.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        } else if ("A faringe é responsável por conduzir o ar e os alimentos; por isso, pertence a dois sistemas, o digestório e o respiratório. Antes que o ar chegue até a laringe, ele precisa passar na faringe. Existe uma estrutura cartilaginosa que separa para onde vai o alimento e o ar, qual:" === this.texto) {
            var img = new Image;
            img.src = './pergunta19.jpg';
            contexto.drawImage(img, 0, 0, 300, 300);
            contexto.drawImage(img, 0, 600, 300, 300);
        }

		contexto.strokeRect(
			this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS - 105),
			offsetY,
			this.determinarDirecao(100),
			this.determinarDirecao(25)
		);

		contexto.fillRect(
			this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS - 105),
			offsetY,
			this.determinarDirecao(100),
			this.determinarDirecao(25)
		);

		this.botaoConfirmar.boundingBox.esquerda = this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS - 105);
		this.botaoConfirmar.boundingBox.cima = offsetY;
		this.botaoConfirmar.boundingBox.baixo = offsetY + this.determinarDirecao(25);
		this.botaoConfirmar.boundingBox.direita = this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS - 5);
		this.botaoConfirmar.boundingBox = this.verificarInversaoBoundingBox(this.botaoConfirmar.boundingBox)

		offsetY = this.ajustarOffset(offsetY, 3);

		contexto.fillStyle = 'black';
		contexto.textAlign = 'center';
		this.desenharTexto(contexto, 'Confirmar', this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS - 52.5), offsetY);

		offsetY = this.ajustarOffset(offsetY, 28);

		return offsetY;
	}

	this.desenharTelaFinal = function (contexto, offsetY) {
		offsetY = this.jogador.posicao == 0 || this.jogador.posicao == 1 ? offsetY + 5 : offsetY - 5;

		contexto.fillStyle = this.acertou ? 'green' : 'red';
		contexto.fillRect(
			this.determinarX(),
			offsetY,
			this.determinarDirecao(configuracoes.LARGURA_TELA_PERGUNTAS),
			this.determinarDirecao(50)
		);

		contexto.fillStyle = 'black';
		contexto.font = '18px Arial bold';
		contexto.textAlign = 'center';
		contexto.textBaseline = "top";
		var texto = this.acertou
			? 'RESPOSTA CORRETA!'
			: 'RESPOSTA ERRADA!';
		this.desenharTexto(contexto, texto, this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS / 2), offsetY)
		offsetY = this.ajustarOffset(offsetY, 27);

		contexto.font = '14px Arial';
		contexto.textAlign = 'left';
		texto = this.acertou
			? 'Você avançará uma casa por acertar a pergunta.'
			: 'Você não avançará nenhuma casa.';
		this.desenharTexto(contexto, texto, this.determinarX(5), offsetY);
		offsetY = this.ajustarOffset(offsetY, 23);

		return offsetY;
	}

	this.desenharResposta = function (contexto, resposta, offsetY) {
		var offsetYInicial = offsetY;

		offsetY = this.wrapText(contexto, resposta.texto, this.determinarX(configuracoes.TAMANHO_CIRCULO_RESPOSTAS + 21), offsetY, configuracoes.LARGURA_TELA_PERGUNTAS - 27, 20);
		offsetY = this.ajustarOffset(offsetY, 23);

		contexto.lineWidth = 1;

		if (resposta.selecionada) {
			contexto.fillStyle = 'green';
			contexto.beginPath();
			contexto.arc(this.determinarX(configuracoes.TAMANHO_CIRCULO_RESPOSTAS / 2 + 9), (offsetYInicial + offsetY) / 2 - this.determinarDirecao(2), configuracoes.TAMANHO_CIRCULO_RESPOSTAS, 0, 2 * Math.PI);
			contexto.fill();
			contexto.fillStyle = 'black';
		}

		contexto.beginPath();
		contexto.arc(this.determinarX(configuracoes.TAMANHO_CIRCULO_RESPOSTAS / 2 + 9), (offsetYInicial + offsetY) / 2 - this.determinarDirecao(2), configuracoes.TAMANHO_CIRCULO_RESPOSTAS, 0, 2 * Math.PI);
		contexto.stroke();

		contexto.lineWidth = 2;

		var xDivisoriaHorizontal = this.determinarX(configuracoes.TAMANHO_CIRCULO_RESPOSTAS + 18);

		contexto.beginPath();
		contexto.moveTo(xDivisoriaHorizontal, this.jogador.posicao == 0 || this.jogador.posicao == 1 ? offsetYInicial + 5 : offsetYInicial - 5);
		contexto.lineTo(xDivisoriaHorizontal, offsetY);
		contexto.stroke();

		this.desenharDivisoria(contexto, offsetY);

		resposta.boundingBox.esquerda = this.determinarX();
		resposta.boundingBox.direita = xDivisoriaHorizontal;
		resposta.boundingBox.cima = offsetYInicial + this.determinarDirecao(-7);
		resposta.boundingBox.baixo = offsetY;
		resposta.boundingBox = this.verificarInversaoBoundingBox(resposta.boundingBox)

		offsetY = this.ajustarOffset(offsetY, 5);

		return offsetY;
	}

	this.verificarInversaoBoundingBox = function (boundingBox) {
		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			var intermediario = boundingBox.cima;
			boundingBox.cima = boundingBox.baixo;
			boundingBox.baixo = intermediario;

			intermediario = boundingBox.esquerda;
			boundingBox.esquerda = boundingBox.direita;
			boundingBox.direita = intermediario;
		}

		return boundingBox;
	}

	this.desenharDivisoria = function (contexto, y) {
		contexto.beginPath();
		contexto.moveTo(this.determinarX(), y);
		contexto.lineTo(this.determinarX(configuracoes.LARGURA_TELA_PERGUNTAS), y);
		contexto.stroke();
	}

	this.ajustarOffset = function (offset, valor) {
		if (this.jogador.posicao == 0 ||
			this.jogador.posicao == 1) {
			return (offset - valor);
		}

		return offset + valor;
	}

	this.wrapText = function (context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				this.desenharTexto(context, line, x, y);
				line = words[n] + ' ';
				y = this.ajustarOffset(y, lineHeight);
			}
			else {
				line = testLine;
			}
		}
		this.desenharTexto(context, line, x, y);
		return y;
	}

	this.verificarClique = function (eventoClique, jogo) {
		if (this.terminou)
			return;

		for (var i = 0; i < this.respostas.length; i++) {
			if (this.verificarBoundingBox(eventoClique, this.respostas[i].boundingBox)) {
				this.respostas[i].selecionada = true;
				this.selecionouResposta = true;
				this.desmarcarOutrasRespostas(i);
				socket.selecionouItemPergunta(this.jogador.posicao, i);
			}
		}

		if (this.selecionouResposta &&
			this.verificarBoundingBox(eventoClique, this.botaoConfirmar.boundingBox)) {
			for (var i = 0; i < this.respostas.length; i++) {
				if (this.respostas[i].selecionada) {
					this.terminou = true;
					this.acertou = this.respostas[i].correta;
					socket.clicouConfirmarTelaPergunta(this.jogador.posicao, this.acertou);
					if (this.acertou) {
						return this.jogador;
					}
				}
			}
		}

		return false;
	}

	this.desmarcarOutrasRespostas = function (indiceRespostaMarcada) {
		for (var i = 0; i < indiceRespostaMarcada; i++)
			this.respostas[i].selecionada = false;
		for (var i = indiceRespostaMarcada + 1; i < this.respostas.length; i++)
			this.respostas[i].selecionada = false;
	}

	this.verificarBoundingBox = function (eventoClique, boundingBox) {
		var xEvento = eventoClique.clientX;
		var yEvento = eventoClique.clientY;

		return Util.verificarBoundingBox(xEvento, yEvento, boundingBox);
		//return Util.verificarBoundingBox(eventoClique.srcEvent.offsetX, eventoClique.srcEvent.offsetY, boundingBox);
		//return Util.verificarBoundingBox(eventoClique.center.x, eventoClique.center.y, boundingBox);
	}

	this.ordenarRespostas = function () {
		var currentIndex = this.respostas.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this.respostas[currentIndex];
			this.respostas[currentIndex] = this.respostas[randomIndex];
			this.respostas[randomIndex] = temporaryValue;
		}
	}

	this.inicializar();
}


function Resposta(texto, correta) {
	this.texto = texto;
	this.correta = correta;
	this.selecionada = false;
	this.boundingBox = {};
}

function Pergunta(texto, respostas, jogo) {
	this.jogo = jogo;
	this.areas = [];
	this.tipoEvento = TipoEvento.PERGUNTA;

	this.texto = texto;
	this.respostas = respostas;

	this.terminou = false;

	this.copiar = function (respostas) {
		var respostasLocais = [];
		for (var i = 0; i < respostas.length; i++) {
			respostasLocais.push(new Resposta(respostas[i].texto, respostas[i].correta));
		}
		return respostasLocais;
	}

	this.disparar = function (jogador) {
		this.jogo.mudarModo(ModoJogo.PERGUNTA);
		this.jogo.atribuirEvento(this);

		for (var i = 0; i < this.jogo.jogadores.length; i++) {
			this.areas.push(new AreaJogadorPerguntas(texto, this.copiar(this.respostas), this.jogo.jogadores[i]));
		}

		var perguntasPorJogador = [];
		for (var i = 0; i < this.areas.length; i++) {
			var respostas = [];
			for (var j = 0; j < this.areas[i].respostas.length; j++) {
				respostas.push(this.areas[i].respostas[j].texto);
			}
			perguntasPorJogador.push(
				{
					'pergunta':
						{
							'enunciado': this.texto,
							'respostas': respostas,
						},
					'jogador': this.areas[i].jogador.posicao,
				}
			);
		}

		socket.criouTelaPergunta(perguntasPorJogador);
	}

	this.verificarClique = function (eventoClique, jogo) {
		if (!this.terminou) {
			for (var i = 0; i < this.areas.length; i++) {
				jogadorQueAcertou = this.areas[i].verificarClique(eventoClique, jogo);
				if (jogadorQueAcertou) {
					this.jogadorQueAcertou = jogadorQueAcertou;
                    var alguemNaoRespondeu = this.areas.find(object => object.selecionouResposta == false);
                    if(!alguemNaoRespondeu) {
                        this.tempoFinal = new Date().getTime();
                        this.terminou = true;
                        socket.moveuJogador(this.jogadorQueAcertou.posicao, 1);
                    }
				}
				else {
					this.verificarTodasAreasRespondidas();
				}
			}
		}
	}

	this.verificarTodasAreasRespondidas = function () {
		for (var i = 0; i < this.areas.length; i++) {
			if (!this.areas[i].terminou) {
				return;
			}
		}
		this.tempoFinal = new Date().getTime();
		this.terminou = true;
	}

	this.desenhar = function (contexto) {
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

		if ((new Date().getTime() - this.tempoFinal) > 4000) {
			if (this.jogadorQueAcertou) {
				this.jogadorQueAcertou.mover();
			}
			this.jogo.mudarModo(ModoJogo.NORMAL);
		}
		else {
			for (var i = 0; i < this.areas.length; i++) {
				this.areas[i].desenhar(contexto);
			}
		}
	}
}
