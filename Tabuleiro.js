var Posicoes = {
	TopoEsquerdo: {},
	TopoDireito: {},
	BaseEsquerda: {},
	BaseDireita: {},
	Centro: {},
};

function Tabuleiro(jogo) {
	this.contexto = jogo.contexto;
	this.jogo = jogo;

	this.turnoDisponivel = true;

	//19 itens por array
	this.matriz = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 0, 0, 14, 15, 16, 17, 0, 0, 30, 31, 32, 33, 34, 0, 0],
		[0, 0, 0, 2, 0, 0, 13, 0, 0, 18, 0, 0, 29, 0, 0, 0, 35, 0, 0],
		[0, 0, 0, 3, 0, 0, 12, 0, 0, 19, 0, 0, 28, 0, 0, 0, 36, 0, 0],
		[0, 0, 0, 4, 0, 0, 11, 0, 0, 20, 0, 0, 27, 0, 0, 0, 37, 0, 0],
		[0, 0, 0, 5, 0, 0, 10, 0, 0, 21, 0, 0, 26, 0, 0, 0, 38, 0, 0],
		[0, 0, 0, 6, 7, 8, 9, 0, 0, 22, 23, 24, 25, 0, 0, 0, 39, 0, 0],
	];

	this.atualizar = function () {
		for (var i = 0; i < this.matriz.length; i++) {
			for (var j = 0; j < this.matriz[i].length; j++) {
				if (this.matriz[i][j]) {
					this.matriz[i][j].desenhar(this.contexto);
				}
			}
		}
	}

	this.adicionarJogador = function (posicao, cor) {
		var jogador = new Jogador(this.celulaInicial, posicao, cor);
		this.celulaInicial.atribuirJogador(jogador);
		return jogador;
	}

	this.verificarLinhaPreenchida = function (indice) {
		for (var i = 0; i < this.matriz[indice].length; i++) {
			if (this.matriz[indice][i] != 0) {
				return true;
			}
		}

		return false;
	}

	this.verificarColunaPreenchida = function (indice) {
		for (var i = 0; i < this.matriz.length; i++) {
			if (this.matriz[i].length > indice && this.matriz[i][indice] != 0) {
				return true;
			}
		}

		return false;
	}

	this.determinarUltimaColunaPreenchida = function () {
		var ultimaColuna = -1;
		for (var i = 0; i < this.matriz.length; i++) {
			for (var j = this.matriz[i].length - 1; j > ultimaColuna; j--) {
				if (this.matriz[i][j] !== 0) {
					ultimaColuna = j;
					break;
				}
			}
		}
		return ultimaColuna;
	}

	this.determinarTamanhoTabuleiro = function () {
		var self = this;

		Posicoes.primeiraLinhaPreenchida = (function () {
			for (var i = 0; i < self.matriz.length; i++) {
				if (self.verificarLinhaPreenchida(i))
					return i;
			}
			return -1;
		})();

		Posicoes.ultimaLinhaPreenchida = (function () {
			for (var i = self.matriz.length - 1; i > -1; i--) {
				if (self.verificarLinhaPreenchida(i))
					return i;
			}
			return -1;
		})();

		Posicoes.primeiraColunaPreenchida = (function () {
			for (var i = 0; i < self.matriz.length; i++) {
				if (self.verificarColunaPreenchida(i))
					return i;
			}
			return -1;
		})();

		Posicoes.ultimaColunaPreenchida = this.determinarUltimaColunaPreenchida();

		var xPrimeiraColuna = (Posicoes.primeiraColunaPreenchida * configuracoes.TAMANHO_CELULA + Posicoes.primeiraColunaPreenchida * 10);
		var yPrimeiraLinha = (Posicoes.primeiraLinhaPreenchida * configuracoes.TAMANHO_CELULA + Posicoes.primeiraLinhaPreenchida * 10) - (configuracoes.ALTURA_MENU + configuracoes.DISTANCIA_MENU_TABULEIRO);
		var xSegundaColuna = (Posicoes.ultimaColunaPreenchida + 1) * configuracoes.TAMANHO_CELULA + (Posicoes.ultimaColunaPreenchida) * 10;
		var ySegundaLinha = (Posicoes.ultimaLinhaPreenchida + 1) * configuracoes.TAMANHO_CELULA + + (Posicoes.ultimaLinhaPreenchida) * 10 + configuracoes.DISTANCIA_MENU_TABULEIRO + configuracoes.ALTURA_MENU;

		Posicoes.TopoEsquerdo.x = xPrimeiraColuna;
		Posicoes.TopoEsquerdo.y = yPrimeiraLinha;

		Posicoes.TopoDireito.x = xSegundaColuna;
		Posicoes.TopoDireito.y = yPrimeiraLinha;

		Posicoes.BaseEsquerda.x = xPrimeiraColuna;
		Posicoes.BaseEsquerda.y = ySegundaLinha;

		Posicoes.BaseDireita.x = xSegundaColuna;
		Posicoes.BaseDireita.y = ySegundaLinha;

		Posicoes.Centro.x = (Posicoes.TopoEsquerdo.x + Posicoes.BaseDireita.x) / 2;
		Posicoes.Centro.y = (Posicoes.TopoEsquerdo.y + Posicoes.BaseDireita.y) / 2;
	}

	this.gerarComPergunta = function (k, j, i) {
		var pergunta = null;
		do {
			pergunta = this.perguntas[Math.floor((Math.random() * 25))];
		} while (pergunta.usada);

		pergunta.usada = true;
		return new Celula(k, j, i, pergunta.pergunta);
	}

	this.gerarComEvento = function (k, j, i, posicaoFinal) {
		if (i == posicaoFinal)
			return new Celula(k, j, i);

		var gerarEventoEspecial = Math.floor((Math.random() * 10)) == 9;
		if (gerarEventoEspecial) {
			return new Celula(k, j, i, new MontarAlgumaCoisa(this.jogo));
		}
		else {
			return this.gerarComPergunta(k, j, i)
		}
	}

	this.inicializarTabuleiro = function () {
		var anterior = null;
		var contador = 0;
		var posicaoFinal = this.determinarPosicaoFinal();
		for (var i = 1; i <= posicaoFinal; i++) {
			for (var j = 0; j < this.matriz.length; j++) {
				for (var k = 0; k < this.matriz[j].length; k++) {
					if (this.matriz[j][k] == i) {
						if (contador == 2) {
							this.matriz[j][k] = this.gerarComPergunta(k, j, i);
						}
						else {
							this.matriz[j][k] = new Celula(k, j, i);
						}
						if (anterior != null) {
							anterior.sucessor = this.matriz[j][k];
							this.matriz[j][k].antecessor = anterior;
						} else {
							this.celulaInicial = this.matriz[j][k];
						}
						anterior = this.matriz[j][k];

						contador++;
						if (contador > 2)
							contador = 0;
					}
				}
			}
		}

		this.determinarTamanhoTabuleiro();
	}

	this.determinarPosicaoFinal = function () {
		var maior = 0;
		for (var i = 0; i < this.matriz.length; i++) {
			for (var j = 0; j < this.matriz[i].length; j++) {
				if (this.matriz[i][j] > maior) {
					maior = this.matriz[i][j];
				}
			}
		}
		return maior;
	}

	this.inicializarPerguntas = function () {
		this.perguntas = [];

		this.perguntas.push({
			'pergunta': new Pergunta("Como é formado o sistema digestório:", [
				new Resposta("faringe, estômago, intestino delgado, intestino grosso e ânus", false),
				new Resposta("esôfago, estômago, fígado, intestino delgado, intestino grosso, reto e ânus.", false),
				new Resposta("boca, faringe, esôfago, estômago, fígado, vesícula biliar, pâncreas, intestino delgado, intestino grosso, reto e ânus.", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("A importância da digestão para o nosso corpo é:", [
				new Resposta("desenvolver nosso organismo.", false),
				new Resposta("transformar os alimentos em nutrientes e eliminá-los.", false),
				new Resposta("retirar os nutrientes indispensáveis dos alimentos ingeridos; para o desenvolvimento e manutenção do organismo", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("A Digestão dos alimentos se inicia:", [
				new Resposta("nas glândulas salivares.", false),
				new Resposta("na boca.", true),
				new Resposta("no estômago.", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Formam o caminho por onde o alimento passa até chegar ao estômago:", [
				new Resposta("boca, faringe e esôfago", true),
				new Resposta("faringe, esôfago vesícula biliar", false),
				new Resposta("Boca e esôfago", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("As glândulas anexas ao tubo digestório são:", [
				new Resposta("glândulas salivares, fígado e estômago.", false),
				new Resposta("glândulas salivares, pâncreas e esôfago.", false),
				new Resposta("glândulas salivares, pâncreas e o fígado.", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Qual a função dos movimentos peristálticos: ", [
				new Resposta("ativar as glândulas anexas", false),
				new Resposta("fazer com que o bolo alimentar caminhe para o reto para ser eliminado pelo ânus.", false),
				new Resposta("fazer com que o bolo alimentar caminhe ao longo do tubo digestório, para que a digestão ocorra.", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Ele movimenta, amassa e mexe o alimento. O suco gástrico é produzido aí:", [
				new Resposta("pâncreas", false),
				new Resposta("estômago", true),
				new Resposta("intestino delgado", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Nele, o alimento já muito transformado, mistura-se com três líquidos e juntos transformam os nutrientes em alimentos:", [
				new Resposta("intestino delgado", true),
				new Resposta("intestino grosso", false),
				new Resposta("estômago", false)
			]), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Tem a função de absorver a água, evitando que ela seja eliminada junto com as fezes:", [
				new Resposta("intestino grosso", true),
				new Resposta("ânus", false),
				new Resposta("intestino delgado", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Maior glândula do nosso corpo, que é a responsável pela produção da bile:", [
				new Resposta("pâncreas ", false),
				new Resposta("glândulas salivares ", false),
				new Resposta("fígado ", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Como é formado o sistema respiratório:", [
				new Resposta("faringe, laringe, brônquios e pulmões", false),
				new Resposta("nariz, laringe, brônquios e pulmões ", false),
				new Resposta("nariz, faringe, laringe, traqueia, brônquios, pulmões.", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Órgão responsável por captar, filtrar e umedecer o ar inspirado:", [
				new Resposta("nariz", true),
				new Resposta("laringe", false),
				new Resposta("boca", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Como se designa a saída de ar pelos pulmões:", [
				new Resposta("respiração", false),
				new Resposta("inspiração", false),
				new Resposta("expiração", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Qual é o gás mais importante para nosso organismo:", [
				new Resposta("Oxigênio.", true),
				new Resposta("Gás Carbônico.", false),
				new Resposta("Nitrogênio.", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("O sistema respiratório possui como função principal:", [
				new Resposta("transportar o sangue pelo nosso corpo.", false),
				new Resposta("permitir a entrada de oxigênio no nosso corpo e a saída de gás carbônico", true),
				new Resposta("eliminar as impurezas pela urina.", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Sua principal função é fornecer ao nosso sangue oxigênio:", [
				new Resposta("pulmões ", true),
				new Resposta("traqueia", false),
				new Resposta("brônquios ", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("O processo de troca gasosa no pulmão — oxigênio por dióxido de carbono:", [
				new Resposta("hematose", true),
				new Resposta("respiração", false),
				new Resposta("homeostase", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("O sistema respiratório tem função de ofertar oxigênio ao organismo e expelir gás carbônico. O principal músculo que auxilia o processo respiratório é:", [
				new Resposta("esternocleidomastoideo", false),
				new Resposta("diafragma", true),
				new Resposta("pulmão", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("A faringe é responsável por conduzir o ar e os alimentos; por isso, pertence a dois sistemas, o digestório e o respiratório. Antes que o ar chegue até a laringe, ele precisa passar na faringe. Existe uma estrutura cartilaginosa que separa para onde vai o alimento e o ar, qual:", [
				new Resposta("glândulas salivares", false),
				new Resposta("diafragma ", false),
				new Resposta("epiglote", true)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Dupla membrana que envolve o pulmão:", [
				new Resposta("pleura", true),
				new Resposta("alvéolos pulmonares ", false),
				new Resposta("plasmática ", false)
			], this.jogo), 'usada': false
		});

		this.perguntas.push({
			'pergunta': new Pergunta("Sua função é filtrar, umedecer e aquecer o ar para conduzi-lo aos pulmões:", [
				new Resposta("traqueia", true),
				new Resposta("laringe", false),
				new Resposta("faringe", false)
			], this.jogo), 'usada': false
		});

        this.perguntas.push({
            'pergunta': new Pergunta("Qual das atividades a seguir é prejudicial principalmente ao sistema respiratório:", [
                new Resposta("uso de cigarro", true),
                new Resposta("uso de bebidas alcoólicas", false),
                new Resposta("faringe", false)
            ], this.jogo), 'usada': false
        });

        this.perguntas.push({
            'pergunta': new Pergunta("Auxilia nos processos digestivos e hidratação do corpo humano:", [
                new Resposta("Mac Lanche Feliz", false),
                new Resposta("cerveja", false),
                new Resposta("água", true)
            ], this.jogo), 'usada': false
        });

        this.perguntas.push({
            'pergunta': new Pergunta("Ao tossir ou espirrar, devemos:", [
                new Resposta("ficar à vontade", false),
                new Resposta("tapar com o antebraço", true),
                new Resposta("usar lenço de tecido", false)
            ], this.jogo), 'usada': false
        });

        this.perguntas.push({
            'pergunta': new Pergunta("Responsável por iniciar o processo sobre o alimento, facilitando o processo dos demais órgãos do sistema digestivo:", [
                new Resposta("boca", true),
                new Resposta("ânus", false),
                new Resposta("pâncreas", false)
            ], this.jogo), 'usada': false
        });
	};

	this.inicializarPerguntas();
	this.inicializarTabuleiro();
}