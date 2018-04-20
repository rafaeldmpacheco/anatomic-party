function Configuracoes() {
	this.TAMANHO_CELULA = 74;
	this.TAMANHO_JOGADOR = (this.TAMANHO_CELULA / 4) - 3;

	this.ATIVAR_EVENTOS_MOUSE = true;
	this.ATIVAR_SOCKET = false;

	this.DISTANCIA_MENU_TABULEIRO = 10;
	this.ALTURA_MENU = 50;
	this.LARGURA_MENU = 185;
	this.TEMPO_ANIMACAO_TURNO = 500;
	this.TEMPO_AVANCO_JOGADOR = 500;
	this.TAMANHO_TEXTO_CELULAS = '12px';
	this.TAMANHO_TEXTO_EVENTOS = '20px';
	this.TAMANHO_LINHA_RESPOSTAS = 10;

	this.LARGURA_TELA_PERGUNTAS = 500;
	this.TAMANHO_CIRCULO_RESPOSTAS = 8;
	this.LARGURA_TELA_FINAL_PERGUNTAS = 300;

	this.TAMANHO_QUADRADO_MONTAR_BLAH = 65;

	this.URL_SERVER = 'ws://10.9.32.116:8000/Comunicacao';
}

var configuracoes = new Configuracoes();