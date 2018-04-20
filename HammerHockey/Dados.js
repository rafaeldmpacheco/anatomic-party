var TipoDado = 
{
	MOVEU_JOGADOR: 0,
	SELECIONOU_ITEM_PERGUNTA: 1,
	CRIOU_TELA_PERGUNTA: 2,
	CLICOU_CONFIRMAR_TELA_PERGUNTA: 3,
	ABRIU_TELA_MONTAR_CORPO: 4,
	MOVEU_PARTE: 5,
}

function MoveuJogador(indiceJogador, quantidade)
{
	this.tipo = TipoDado.MOVEU_JOGADOR,
	this.indice = indiceJogador,
	this.quantidade = quantidade
}

function CriouTelaPergunta(perguntasPorJogador)
{
	this.tipo = TipoDado.CRIOU_TELA_PERGUNTA,
	this.perguntasPorJogador = perguntasPorJogador
}

function SelecionouItemPergunta(jogador, indiceResposta)
{
	this.tipo = TipoDado.SELECIONOU_ITEM_PERGUNTA,
	this.jogador = jogador,
	this.indiceResposta = indiceResposta
}

function ClicouConfirmarTelaPergunta(jogador, estaCorreto)
{
	this.tipo = TipoDado.CLICOU_CONFIRMAR_TELA_PERGUNTA,
	this.jogador = jogador,
	this.estaCorreto = estaCorreto
}

function AbriuTelaMontarCorpo(partesPorJogador)
{
	this.tipo = TipoDado.ABRIU_TELA_MONTAR_CORPO,
	this.partesPorJogador = partesPorJogador
}

function MoveuParte(jogador, offsetX, offsetY, parte)
{
	this.tipo = TipoDado.MOVEU_PARTE,
	this.jogador = jogador,
	this.offsetX = offsetX,
	this.offsetY = offsetY
	this.parte = parte;
}