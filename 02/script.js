function criaReta(app, container, pixels)
{
	const graphics = new PIXI.Graphics();
	graphics.moveTo(-app.screen.width/2,0);
	graphics.lineTo(app.screen.width/2, 0);
	graphics.stroke({ width: 1, color: 0xffffff });
	var amount = (app.screen.width / pixels / 2) | 0;
	for (var i = -amount; i <= amount; ++i)
	{
		graphics.moveTo(i * pixels, 0);
		graphics.lineTo(i * pixels, 10);
		graphics.stroke({ width: 1, color: 0xffffff });
		
		const basicText = new PIXI.Text({ text: (i * pixels) + '', style: { fill : 0xffffff } });
		basicText.x = i * pixels - (basicText.width / 2);
		basicText.y = 12;
		container.addChild(basicText);
	}
	container.addChild(graphics);
}

posicaoMario = 0;

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new PIXI.Application();
	
	var stageDiv = document.getElementById("stage");
	var esqInput = document.getElementById("esquerda_input");
	var dirInput = document.getElementById("direita_input");

    // Intialize the application.
    await app.init({ background: '#000000', resizeTo: stageDiv });
	
	const container = new PIXI.Container();
	app.stage.addChild(container);

	criaReta(app, container, 100);
	
	container.x = app.screen.width / 2;
	container.y = app.screen.height / 2;
	
	const texture = await PIXI.Assets.load('marioyoshi.png');
	const esqPretoTex = await PIXI.Assets.load('esq_preto.png');
	const esqBrancoTex = await PIXI.Assets.load('esq_branco.png');
	const dirPretoTex = await PIXI.Assets.load('dir_preto.png');
	const dirBrancoTex = await PIXI.Assets.load('dir_branco.png');
	
	function setupBotao(botao, brancoTex, pretoTex, input)
	{
		botao.eventMode = 'static';
		botao.cursor = 'pointer';
		var isPointerDown = false;
		botao.on('pointerdown', function() {
			botao.texture = brancoTex;
			isPointerDown = true;
		});
		
		app.ticker.add(function() {
			if (isPointerDown)
			{
				eval("posicaoMario = " + input.value);
			}
		});
		
		botao.on('pointerup', function() {
			botao.texture = pretoTex;
			isPointerDown = false;
		});
	}
	
	const marioContainer = new PIXI.Container();
	container.addChild(marioContainer);
	
	const mario = new PIXI.Sprite(texture);
	mario.scale.x = 0.5;
	mario.scale.y = 0.5;
	marioContainer.y = -mario.height;
	marioContainer.x = -mario.width/3;
	marioContainer.addChild(mario);
	
	
	const esq = new PIXI.Sprite(esqPretoTex);
	esq.x = app.screen.width/10;
	esq.y = app.screen.height - esq.height - app.screen.height / 10;
	app.stage.addChild(esq);
	
	setupBotao(esq, esqBrancoTex, esqPretoTex, esqInput);

	
	const dir = new PIXI.Sprite(dirPretoTex);
	dir.x = app.screen.width/10 + esq.width * 1.5;
	dir.y = app.screen.height - dir.height - app.screen.height / 10;
	app.stage.addChild(dir);
	
	setupBotao(dir, dirBrancoTex, dirPretoTex, dirInput);
	
	const textoPos = new PIXI.Text({ text: 'posição: 0', style: { fill : 0xffffff } });
	textoPos.x = app.screen.width - textoPos.width - app.screen.width/10;
	textoPos.y = app.screen.height - textoPos.height - app.screen.height / 10 ;
	app.stage.addChild(textoPos);

	app.ticker.add(function (time)
	{
		mario.x = posicaoMario;
		textoPos.text = "posição: " + posicaoMario;
		textoPos.x = app.screen.width - textoPos.width - app.screen.width/10;
	});
    // Then adding the application's canvas to the DOM body.
    stageDiv.appendChild(app.canvas);
})();
