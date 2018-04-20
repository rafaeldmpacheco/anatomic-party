var Util = {
	verificarBoundingBox: function(x, y, boundingBox) {
		if (x > boundingBox.esquerda &&
			x < boundingBox.direita &&
			y > boundingBox.cima &&
			y < boundingBox.baixo)
			return true;

		return false;
	}
}