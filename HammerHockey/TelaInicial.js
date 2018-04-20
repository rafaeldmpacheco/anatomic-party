function TelaInicial(contexto)
{
	this.contexto = contexto;	

	this.amarelo = false;
	this.tempoAnimacao = new Date().getTime();

	this.desenhar = function()
	{
		this.contexto.save();

		this.contexto.clearRect(0, 0, 1920, 1080);
		this.contexto.font = '75px fonteTitulo';
		this.contexto.fillStyle = 'red';
		this.contexto.textBaseline = 'top';
		this.contexto.fillText('Anatomic Party', 555, 75);
		this.contexto.lineWidth = 5;
		this.contexto.strokeText('Anatomic Party', 555, 75);
        
        var imagem = document.getElementById('targetu');
        contexto.drawImage(imagem, 0, 0, imagem.width, imagem.height,
        				   660, 165, 500, 500);

		this.contexto.fillStyle = this.amarelo ? 'yellow' : 'red';
        this.contexto.fillRect(660, 695, 500, 100);
        this.contexto.lineWidth = 2;
        this.contexto.strokeRect(660, 695, 500, 100);

        var tempo = new Date().getTime();
        if (tempo - this.tempoAnimacao > 1000)
        {
        	this.amarelo = !this.amarelo;
        	this.tempoAnimacao = tempo;
        }

        this.contexto.font = '40px Arial';
        this.contexto.fillStyle = 'black';
        this.contexto.fillText('Aperte para começar!', 715, 720);

        this.contexto.restore();

        requestAnimationFrame(this.desenhar.bind(this));
	}

	this.div = document.getElementById('divToc');
	var self = this;

	this.verificarAperto = function(e)
	{
		for (var i = 0; i < e.changedTouches.length; i++)
		{
			var evento = e.changedTouches[i];
			evento.pageX -= 8;
			evento.pageY -= 8;
			this.verificarBotao(evento);
		}
	}

	this.verificarBotao = function(e)
	{
		if (e.pageX > 660 &&
			e.pageX < 1160 &&
			e.pageY > 695 &&
			e.pageY < 795)
		{
			self.contexto.clearRect(0, 0, 1920, 1080);
			self.div.removeEventListener('mousedown', self.verificarBotao);
			self.div.removeEventListener('touchstart', self.verificarAperto);
			new Jogo(self.contexto).iniciar();
		}
	}

	this.div.addEventListener('mousedown', this.verificarBotao);
	this.div.addEventListener('touchstart', this.verificarAperto);

	requestAnimationFrame(this.desenhar.bind(this));
}
