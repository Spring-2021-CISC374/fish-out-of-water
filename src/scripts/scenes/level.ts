
export default class Level extends Phaser.Scene {
	player: Phaser.Physics.Arcade.Sprite
	npcptCollide: Phaser.Physics.Arcade.Sprite
	npc1Collide: Phaser.Physics.Arcade.Sprite
	npc2Collide: Phaser.Physics.Arcade.Sprite
	music:Phaser.Sound.BaseSound;
	questionMusic:Phaser.Sound.BaseSound;
	combatMusic:Phaser.Sound.BaseSound;
	bumpSound:Phaser.Sound.BaseSound;
	pipeScore = 0;
	pauseMovement = false;
	//Pop up message box 
	pipeMsg;
	messageBox;
	closeButton;
	text;
	delay
	//Map information
	minimap
	firstTimeInBattle:boolean
	map: Phaser.Tilemaps.Tilemap;
	color:Phaser.Tilemaps.TilemapLayer;
	background:Phaser.Tilemaps.TilemapLayer;
	insufficientLayer: Phaser.Tilemaps.TilemapLayer;
	sufficientLayer: Phaser.Tilemaps.TilemapLayer;
	tileset: Phaser.Tilemaps.Tileset;
	instructions: any
	mapKey
	sceneKey
	nextSceneKey
	PipeLayer;
	CombatLayer;
	bossLayer;
	startpt;
	npcpt;
	npc1;
	npc2;
	npcptAlternate;
	npc1Alternate;
	npc2Alternate;
	helper1;
	helper2;
	helper3;
	helper4;
	helper5;
	helper6;
	helper7;
	helper8;
	clogpt;
	pipechecker;
	pipecheck;
	clog;
	help: Phaser.GameObjects.Text;
	battlescene: any;
	minimapOnOff;
	minimapKey;
	zoomOutOrNot;
	
	constructor(sceneKey:string, mapKey:string, nextSceneKey:string) {
	  super({ key: sceneKey })
	  this.sceneKey = sceneKey
	  this.mapKey = mapKey
	  this.nextSceneKey = nextSceneKey
	  this.delay = false
	  this.firstTimeInBattle = true
	}
  
	preload(){
		this.music = this.sound.add('sewermusic', {loop: true, volume: 0.5});
		this.questionMusic = this.sound.add('questionmusic', {loop: true, volume: 0.5});
		this.combatMusic = this.sound.add('combatmusic', {loop: true, volume: 0.5});
		this.bumpSound = this.sound.add('bumpsound', {loop: false, volume: 0.5});

	}
	
	create() {
		this.npcptAlternate = Phaser.Math.Between(1, 2);
		this.npc1Alternate = Phaser.Math.Between(1, 2);
		this.npc2Alternate = Phaser.Math.Between(1, 2);
		this.minimapOnOff = 1;
		this.zoomOutOrNot = false
		this.pauseMovement = false;
		//music
		this.music.play();
		this.questionMusic.play();
		this.questionMusic.pause();
		this.combatMusic.play();
		this.combatMusic.pause();
		//message box
		this.createMessageBox("")
	  	this.messageBox.setVisible(false)
	  	this.pipeMsg.setVisible(false)
		this.delay = true
	  //Create map from Tiled and add necessary collisions
	  this.map = this.make.tilemap({key: this.mapKey})
	  this.tileset = this.map.addTilesetImage('Pipes', 'pipes')
	  this.color = this.map.createLayer('Background', this.map.addTilesetImage('background', 'background')).setDepth(-5)
	  this.background = this.map.createLayer('Sewer', this.tileset)
	  //turn off below for noclip
	  this.background.setCollisionByProperty({collides: true})
	  this.physics.world.setBoundsCollision()

	  //Setting object points
	  this.startpt = this.map.findObject("Points", obj => obj.name === "StartingPoint")
	  this.npcpt = this.map.findObject("Points", obj => obj.name === "NPCPoint")
	  this.npc2 = this.map.findObject("NPC", obj => obj.name === "NPC2")
	  this.npc1 = this.map.findObject("NPC", obj => obj.name === "NPC1")
	  this.bossLayer = this.map.getObjectLayer('Boss')['objects'];

	  if(this.sceneKey == "LevelTwoScene") {
		this.insufficientLayer = this.map.createLayer('InsufficientPipes', this.tileset).setDepth(-1)
		this.clogpt = this.map.findObject("Clog", obj => obj.name === "Clog")
		this.pipechecker = this.map.findObject("PipeCheck", obj => obj.name === "PipeCheck")
		this.clog = this.physics.add.image(this.clogpt.x, this.clogpt.y,'clog').setScale(0.025)
		this.pipecheck = this.physics.add.image(this.pipechecker.x, this.pipechecker.y, 'transparent').setScale(0.05)
	  }
	  //Setting arrays of objects that contain position data
	  this.PipeLayer = this.map.getObjectLayer('Pipe')['objects'];
	  this.CombatLayer = this.map.getObjectLayer('Combat')['objects'];
	//Create all players on the map
	this.player = this.physics.add.sprite(this.startpt.x, this.startpt.y,'clown').setScale(0.06)
	this.npcptCollide = this.physics.add.sprite(this.npcpt.x,this.npcpt.y,'flounder').setScale(0.06).setBounce(0)
	this.npc1Collide = this.physics.add.sprite(this.npc1.x,this.npc1.y,'flounder').setScale(0.06).setBounce(0)
	this.npc2Collide = this.physics.add.sprite(this.npc2.x,this.npc2.y,'flounder').setScale(0.06).setBounce(0)
	//change later, to where they need/should be
	if(this.sceneKey == "LevelOneScene"){
	this.helper1 = this.physics.add.sprite(287.5,310,'surgeon').setScale(0.06).setBounce(0)
	this.helper2 = this.physics.add.sprite(132.5,342.5,'surgeon').setScale(0.06).setBounce(0)
	this.helper3 = this.physics.add.sprite(542.5,342.5,'surgeon').setScale(0.06).setBounce(0)
	this.helper4 = this.physics.add.sprite(440.5,50,'surgeon').setScale(0.06).setBounce(0)
	}
	if(this.sceneKey == "LevelTwoScene"){	
	this.helper5 = this.physics.add.sprite(197,530,'surgeon').setScale(0.06).setBounce(0)
	this.helper6 = this.physics.add.sprite(199,367.5,'surgeon').setScale(0.06).setBounce(0)
	this.helper7 = this.physics.add.sprite(17.5,200,'surgeon').setScale(0.06).setBounce(0)
	this.helper8 = this.physics.add.sprite(537.5,190.5,'surgeon').setScale(0.06).setBounce(0)
	}

	  //animations
	  this.npcptCollide.anims.play('flounder-idle')
	  this.player.anims.play('clown-idle')
	  this.npcptCollide.anims.play('flounder-idle')
	  this.npc1Collide.anims.play('flounder-idle')
	  this.npc2Collide.anims.play('flounder-idle')
	  //helper animations
	  if(this.sceneKey == "LevelOneScene"){
		this.helper1.anims.play('surgeon-idle')
		this.helper2.anims.play('surgeon-idle')
		this.helper3.anims.play('surgeon-idle')
		this.helper4.anims.play('surgeon-idle')

	  }
	  if(this.sceneKey == "LevelTwoScene"){
		this.helper5.anims.play('surgeon-idle')
		this.helper6.anims.play('surgeon-idle')
		this.helper7.anims.play('surgeon-idle')
		this.helper8.anims.play('surgeon-idle')

	  }
	  //physics collider
	  this.physics.add.collider(this.player, this.background)
	  this.player.setCollideWorldBounds(true);
	  this.npcptCollide.angle = 180;
	  this.physics.add.collider(this.player, this.clog, () =>{
		this.createMessageBox("			You found the clog, \n and saved Sewer-topia!")	
		this.clog.destroy()
	  })
	  this.physics.add.collider(this.player,this.pipecheck, () => {
		if(this.pipeScore > 3) {
			this.createMessageBox("You collected enough pipes \nto fix the broken pipes!")
			this.insufficientLayer.destroy()
			this.sufficientLayer = this.map.createLayer('SufficientPipes', this.tileset).setDepth(-1)
			this.sufficientLayer.setCollisionByProperty({collides: true})
			this.physics.add.collider(this.player, this.sufficientLayer)
		}
		else {
			this.createMessageBox("Sorry, you didn't collect enough \npipes to fix the break :(")
			this.insufficientLayer.setCollisionByProperty({collides: true})
			this.physics.add.collider(this.player, this.insufficientLayer)
		}
		this.pipecheck.destroy()
	  })
	this.bossLayer.forEach(object => {
		const image = this.physics.add.image(object.x, object.y, "transparent").setScale(0.05);
		this.physics.add.overlap(this.player, image, () =>{
			if(this.pipeScore > 3) {
				this.scene.switch('PipeScene')
			}
			else {
				this.game.scene.start('BossBattleScene', {extraDamage: false, extraHealth: false, extraLife: false})
				this.scene.sleep()
				
			}
			this.player.y = this.player.y - 20;
			this.pauseMovement = true
			this.music.pause()
			this.bumpSound.play()
		})
	});
	  this.physics.add.collider(this.player, this.npcptCollide, () =>{
		  this.music.pause()
		  this.bumpSound.play();
		  this.questionMusic.resume();
		  this.pauseMovement = true;
		  if(this.sceneKey == "LevelTwoScene"){
			if (this.npcptAlternate == 1 || this.npcptAlternate == 2){
				this.game.scene.start('QuestionScene6');
			}	
		}
		else{
			if (this.npcptAlternate == 1){
				this.game.scene.start('QuestionScene1');
			}
			if (this.npcptAlternate == 2){
				this.game.scene.start('QuestionScene1A');
			}
		}
		  this.player.x = this.startpt.x
		  this.player.y = this.startpt.y
	  })
	  this.physics.add.collider(this.player, this.npc1Collide, () =>{
		this.music.pause()	
		this.bumpSound.play();
		this.questionMusic.resume();
		this.pauseMovement = true;
		if(this.sceneKey == "LevelTwoScene"){
			if (this.npc1Alternate == 1 || this.npc1Alternate == 2){
				this.game.scene.start('QuestionScene4');
			}			
		}
		else{
			if (this.npc1Alternate == 1){
				this.game.scene.start('QuestionScene2');
			}
			if (this.npc1Alternate == 2){
				this.game.scene.start('QuestionScene2A');
			}
		}
		this.player.x = this.startpt.x
		this.player.y = this.startpt.y
	})
	this.physics.add.collider(this.player, this.npc2Collide, () =>{
		this.music.pause()
		this.bumpSound.play();
		this.questionMusic.resume();
		this.pauseMovement = true;
		if(this.sceneKey == "LevelTwoScene"){
			if (this.npc2Alternate == 1){
				this.game.scene.start('QuestionScene5');
			}
			if (this.npc2Alternate == 2){
				this.game.scene.start('QuestionScene5A');
			}		
		}
		else{
			if (this.npc2Alternate == 1){
				this.game.scene.start('QuestionScene3');
			}
			if (this.npc2Alternate == 2){
				this.game.scene.start('QuestionScene3A');
			}
		}
		this.player.x = this.startpt.x
		this.player.y = this.startpt.y
	});
	  
	  //Initialize cameras to follow fish
	  this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
	  this.cameras.main.startFollow(this.player,true)
	  this.cameras.main.zoom = 5;
	  this.minimap = this.cameras.add(0, 0, 640, 640).setZoom(0.8)
	  this.minimap.scrollX = -20
	  this.minimap.scrollY = -20
	  this.minimap.setVisible(false)

	  //Add pipe and combat overlap 
	  this.PipeLayer.forEach(object => {
		var value = Phaser.Math.Between(1, 5);
		const image = this.physics.add.image(object.x, object.y, "pipe"+value).setScale(0.04);
		this.physics.add.overlap(this.player, image, () =>{
			image.destroy()
			this.pipeScore++
			this.text.setText(`Pipe Pieces found : ${this.pipeScore} \nPress M for map`)
			this.createMessageBox("\t\t\t\tYou found a pipe! \n Hmm... I wonder what it's for...")
		})
	 });

	// switching scenes to combat
	this.CombatLayer.forEach(object => {
		const image = this.physics.add.image(object.x, object.y, "transparent").setScale(0.05);
		this.physics.add.existing(image)
		this.physics.add.overlap(this.player, image, () =>{
			this.music.pause()
			this.bumpSound.play()
			this.combatMusic.resume()
			this.battlescene = this.scene.get("BattleScene")
			this.battlescene.setHostScene(this.sceneKey)
			//if(this.firstTimeInBattle && this.sceneKey == "LevelOneScene") {
				this.scene.switch('CombatInstructions')
			// 	this.firstTimeInBattle = false
			// }
			// else
			// 	this.scene.switch('BattleScene');
			image.destroy()
		})
	})

	//helper overlap
	//done
	this.physics.add.overlap(this.player, this.helper1, () =>{
		this.helper1.destroy()
		if( this.npc1Alternate == 1){
			this.helperCreateMessageBox("Hey friend!\nSmelly odors are NEVER a good \nsign. Beware! Good luck!")
		}
		if( this.npc1Alternate == 2){
			this.helperCreateMessageBox("Hey, watch out!\nSome of these pipes don't seem\nsturdy! Curse those tree roots!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper2, () =>{
		this.helper2.destroy()
		if( this.npc1Alternate == 1){
			this.helperCreateMessageBox("Hey, watch out!\nSome of these pipes don't seem\nsturdy! Curse those tree roots!")
		}
		if( this.npc1Alternate == 2){
			this.helperCreateMessageBox("Check out those roots growing into\nour pipes! It???s a shame that hoomans\nplant trees so close to us.")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper3, () =>{
		this.helper3.destroy()
		if( this.npc2Alternate == 1){
			this.helperCreateMessageBox("Hoomans don't need to be strangers,\nbut their trees need to give our\nhomes at least 10ft!")
		}
		if( this.npc2Alternate == 2){
			this.helperCreateMessageBox("I always thought that pipes were\ncontrolled by some weird hi-tech stuff.\nBut mostly they just use gravity!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper4, () =>{
		this.helper4.destroy()
		if( this.npcptAlternate == 1 || this.npcptAlternate == 2){
			this.helperCreateMessageBox("Grease becomes solid once it cools\ndown! This can cause clogs! Soap,\nhowever, dissolves really easily!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper5, () =>{
		this.helper5.destroy()
		if( this.npc1Alternate == 1 || this.npc1Alternate == 2 ){
			this.helperCreateMessageBox("I had a childhood friend named\nJimmy. One day, he went very far\ninto the sewers and went missing!!!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper6, () =>{
		this.helper6.destroy()
		if( this.npc1Alternate == 1 || this.npc1Alternate == 2){
			this.helperCreateMessageBox("Eventually, he came back and\ntold us he saw the outside world!\nHe saw a ???farm??? and a bunch of\nhoomans drinking water!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper7, () =>{
		this.helper7.destroy()
		if( this.npc2Alternate == 1){
			this.helperCreateMessageBox("Did you know? Toliet paper\ncan sometimes cause clogs, but it\nis safe to flush down the toliet!")
		}
		if( this.npc2Alternate == 2){
			this.helperCreateMessageBox("Always remember the 3 p's!\nPoop, pee, and paper!\nAll can be flushed!")
		}
	})

	//done
	this.physics.add.overlap(this.player, this.helper8, () =>{
		this.helper8.destroy()
		if( this.npcptAlternate == 1 || this.npcptAlternate == 2){
			this.helperCreateMessageBox("Wastewater can be extremely\ndangerous! Be careful up ahead!\nI believe in you!")
		}
	})

	//instructions
	this.help = this.add.text(this.game.canvas.width/2+30, this.game.canvas.height/2 - 60, 'Press H for help').setScrollFactor(0).setColor('#ffffff').setFontSize(32).setScale(0.1);

	//score
	this.text = this.add.text(this.game.canvas.width/2-60, this.game.canvas.height/2 - 60,`Pipe Pieces found : ${this.pipeScore} \nPress M for map`).setScrollFactor(0).setColor('#ffffff').setFontSize(32).setScale(0.1);

	this.input.keyboard.on("keydown", this.onKeyInput, this);
  }

  	onKeyInput(event) {
        if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.H) {
			this.instructions = this.scene.get("InstructionScene")
			this.instructions.setHostScene(this.sceneKey);
            this.scene.switch("InstructionScene");
        } 
	  }
  	createMessageBox(message){
    	this.messageBox = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "messageBox").setScale(0.1).setScrollFactor(0)
		this.pipeMsg = this.add.text(this.game.canvas.width/2 -30 , this.game.canvas.height/2 -5, message, { font: "20px Arial", align: "left" }).setColor('#000000').setScale(0.2).setScrollFactor(0)
		if(this.delay) {
			this.time.addEvent({ delay: 2250, callback: this.destroyMessageBox, callbackScope: this });
			this.pauseMovement = true;
		}
   }

   helperCreateMessageBox(message){
	this.messageBox = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "messageBox").setScale(0.1).setScrollFactor(0)
	this.closeButton = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2 + 5, "closeButton").setScale(0.1).setScrollFactor(0)
	this.pipeMsg = this.add.text(this.game.canvas.width/2 -30 , this.game.canvas.height/2 - 10, message, { font: "20px Arial", align: "left" }).setColor('#000000').setScale(0.2).setScrollFactor(0)
    var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);	
	spaceKey.on('down', this.helperDestroyMessageBox, this);
	this.pauseMovement = true;
}

   mouseFix(){}
   destroyMessageBox(){
		this.pauseMovement = false;
    	this.pipeMsg.destroy();
    	this.messageBox.destroy();
		//this.help.visible = false;
	  }

	helperDestroyMessageBox(){
		this.pauseMovement = false;
    	this.messageBox.destroy();
		this.pipeMsg.destroy();
		this.closeButton.destroy();
		//this.help.visible = false;
	}
	  

	resetZoom(){
		this.zoomOutOrNot = false;
		this.cameras.main.zoom = 5;
		this.text.setVisible(true)
		this.help.setVisible(true)
	}

	zoomOut(){
		this.zoomOutOrNot = true
		this.cameras.main.zoom = 2.5;
		this.text.setVisible(false)
		this.help.setVisible(false)
	}

  update(){
	this.minimapKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
	if ((Phaser.Input.Keyboard.JustDown(this.minimapKey))) {
		this.minimapOnOff = this.minimapOnOff + 1;
	}
	if (this.minimapOnOff % 2 == 0) {
		this.minimap.setVisible(true)
		this.player.setTint(0xff0000)
		this.text.setVisible(false)
		this.messageBox.setVisible(false)
		this.pipeMsg.setVisible(false)
	}
	if (this.minimapOnOff % 2 == 1) {
			this.minimap.setVisible(false)
			this.player.setTint(0xffffff)
			if (this.zoomOutOrNot == true){
				this.text.setVisible(false)
			}
			if (this.zoomOutOrNot == false){
				this.text.setVisible(true)
			}
	}
	if (this.registry.get("Battle") == 1){
		this.combatMusic.pause();
		  this.music.resume()
		  this.registry.set("Battle", 0)
	  }
	  if (this.registry.get("Question") == 1){
		this.questionMusic.pause();
		  this.music.resume()
		  this.pauseMovement = false;
		  this.QuestionOne()
		  this.registry.set("Question", 0)
	  }
	  if (this.registry.get("Question") == 2){
		this.questionMusic.pause();
		this.music.resume()
		this.pauseMovement = false;
		this.QuestionTwo()
		this.registry.set("Question", 0)
	}
	if (this.registry.get("Question") == 3){
		this.questionMusic.pause();
		this.music.resume()
		this.pauseMovement = false;
		this.QuestionThree()
		this.registry.set("Question", 0)
	}
	if (this.registry.get("Question") == 4){
		this.questionMusic.pause();
		this.music.resume()
		this.pauseMovement = false;
		this.QuestionFour()
		this.registry.set("Question", 0)
	}
	if (this.registry.get("Question") == 5){
		this.questionMusic.pause();
		this.music.resume()
		this.pauseMovement = false;
		this.QuestionFive()
		this.registry.set("Question", 0)
	}
	if (this.registry.get("Question") == 6){
		this.questionMusic.pause();
		this.music.resume()
		this.pauseMovement = false;
		this.QuestionSix()
		this.registry.set("Question", 0)
	}
	this.npc1Collide.setVelocity(0,0);
	this.npc2Collide.setVelocity(0,0);
	this.npcptCollide.setVelocity(0,0);
	var velocityX = 125; 
    var velocityY = 125
	var prevDir = 0;
	let framesPerDirection:number = 3;
	this.player.setVelocity(0,0);
	  var cursors = this.input.keyboard.createCursorKeys();
	  if(this.pauseMovement){
		return;
	  }
	 if (cursors.up.isDown) {
          this.player.setVelocityY(-velocityY);
		  this.player.angle = 270;
		  prevDir = 3;
	  }
	  else if (cursors.down.isDown) {
		this.player.setVelocityY(velocityY);
		this.player.angle = 90;
		prevDir = 0;
	  }
	  else if (cursors.left.isDown) {
		this.player.setVelocityX(-velocityX);
		this.player.angle = 180;
		this.player.flipY = true;
		prevDir = 1;
	  }
	  else if (cursors.right.isDown) {
		this.player.setVelocityX(velocityX);
		this.player.angle = 0;
		this.player.flipY = false;
		prevDir = 2;
	  }
	  else{
		this.player.setVelocity(0,0);
		this.player.setFrame( (prevDir * framesPerDirection));
	  }
	}

	width: number = 0; 

	//npc1 (I know I know Im sorry)
	QuestionTwo(){

		var elem = document.getElementById('pmeterBar');
			
		if (elem != null){
            var w = (parseInt)(elem.style.width);

                if (w > 100) {
                        this.scene.start('EndingScene');
                }
        }

		if (this.registry.get("B1") == 'D'){
			//right answer
			this.player.x = 415
			this.player.y = 580
			this.registry.set("B1", "Done")
			this.createMessageBox("*Gasp!* You have been teleported!\nGood job! Right answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			// pmeter attributes
			if (this.width < 0) {
				this.width = 0;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById("pmeterBar");
				var p = 17;
				this.width = this.width - p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
		}
	
		if (this.registry.get("B1") == 'B' || this.registry.get("B1") == 'C' || this.registry.get("B1") == 'A'){
			//wrong answer
			this.player.x = 50
			this.player.y = 110
			this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width >= 100) {
				this.width = 100;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById('pmeterBar');
				var p = 17;
				this.width = this.width + p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
		}
	}

	//npc2
	QuestionThree(){

		var elem = document.getElementById('pmeterBar');
			
		if (elem != null){
            var w = (parseInt)(elem.style.width);

				if (w > 100) {
                        this.scene.start('EndingScene');
                }
        }

		if (this.registry.get("C1") == 'B'){
			//right answer
			this.player.x = 220
			this.player.y = 245
			this.registry.set("C1", "Done")
			this.createMessageBox("*Gasp!* You have been teleported\nGood job! Right answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width < 0) {
				this.width = 0;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById("pmeterBar");
				var p = 17;
				this.width = this.width - p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
		}
		if (this.registry.get("C1") == 'A' || this.registry.get("C1") == 'C' || this.registry.get("C1") == 'D'){
			//wrong answer
			this.player.x = 625
			this.player.y = 325
			this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width >= 100) {
				this.width = 100;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById('pmeterBar');
				var p = 17;
				this.width = this.width + p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}

			}
		}
		
	}

		//npc 3
		QuestionOne(){

			var elem = document.getElementById('pmeterBar');
			
			if (elem != null){
				var w = (parseInt)(elem.style.width);
	
				if (w > 100) {
							this.scene.start('EndingScene');
					}
			}

			if (this.registry.get("A1") == 'A'){
				//right answer
				if(this.nextSceneKey != '')
					this.scene.start(this.nextSceneKey, {pipeScore: this.pipeScore}); // use this to launch the next scene
					this.music.destroy()
				this.registry.set("A1", "Done")
				this.createMessageBox("*Gasp!* You have been teleported!\nGood job! Right answer!")
				this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
				this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

				//var width = 0;
				var elem = document.getElementById("pmeterBar");

				if (this.width < 0) {
					this.width = 0;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
				
				else {
					var elem = document.getElementById("pmeterBar");
					var p = 17;
					this.width = this.width - p;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			}
			if (this.registry.get("A1") == 'B' || this.registry.get("A1") == 'C' || this.registry.get("A1") == 'D'){
				//wrong answer				
				this.player.x = 220
				this.player.y = 275
				this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
				this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
				this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

				//var width = 0;
				var elem = document.getElementById("pmeterBar");

				if (this.width >= 100) {
					this.width = 100;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			
				else {
					var elem = document.getElementById('pmeterBar');
					var p = 17;
					this.width = this.width + p;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			}
		}

	//npc 1
	QuestionFour(){

		var elem = document.getElementById('pmeterBar');
			
		if (elem != null){
            var w = (parseInt)(elem.style.width);

			if (w > 100) {
                        this.scene.start('EndingScene');
                }
        }
		
		if (this.registry.get("D1") == 'D'){
			//right answer
			this.player.x = 335
			this.player.y = 630
			this.registry.set("D1", "Done")
			this.createMessageBox("*Gasp!* You have been teleported!\nGood job! Right answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width < 0) {
				this.width = 0;
				if (elem != null) {
				elem.style.width = this.width + "%";
				//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById("pmeterBar");
				var p = 17;
				this.width = this.width - p;
				if (elem != null) {
				elem.style.width = this.width + "%";
				//elem.innerHTML = this.width + "%";
				}
			}
		}
		if (this.registry.get("D1") == 'B' || this.registry.get("D1") == 'C' || this.registry.get("D1") == 'A'){
			//wrong answer
			this.player.x = 295
			this.player.y = 630
			this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width >= 100) {
				this.width = 100;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById('pmeterBar');
				var p = 17;
				this.width = this.width + p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
		}
	}

	//npc 2
	QuestionFive(){

		var elem = document.getElementById('pmeterBar');
			
		if (elem != null){
            var w = (parseInt)(elem.style.width);

			if (w > 100) {
                        this.scene.start('EndingScene');
                }
        }

		if (this.registry.get("E1") == 'B'){
			//right answer
			this.player.x = 290
			this.player.y = 195
			this.registry.set("E1", "Done")
			this.createMessageBox("*Gasp!* You have been teleported!\nGood job! Right answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width < 0) {
				this.width = 0;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById("pmeterBar");
				var p = 17;
				this.width = this.width - p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
		}
		if (this.registry.get("E1") == 'A' || this.registry.get("E1") == 'C' || this.registry.get("E1") == 'D'){
			//wrong answer		
			this.player.x = 180
			this.player.y = 170
			this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
			this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
			this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

			//var width = 0;
			var elem = document.getElementById("pmeterBar");

			if (this.width >= 100) {
				this.width = 100;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
			
			else {
				var elem = document.getElementById('pmeterBar');
				var p = 17;
				this.width = this.width + p;
				if (elem != null) {
					elem.style.width = this.width + "%";
					//elem.innerHTML = this.width + "%";
				}
			}
		}
	}
		//npc 3 (last, if right go to boss or end or whatever)
		QuestionSix(){

			var elem = document.getElementById('pmeterBar');
			
			if (elem != null){
				var w = (parseInt)(elem.style.width);
	
				if (w > 100) {
						this.scene.start('EndingScene');
					}
			}

			this.player.x = 500
			this.player.y = 500
			if (this.registry.get("F1") == 'A'){
				//right answer
				if(this.nextSceneKey != '')
					this.registry.set("F1", "Done")
				else {
					this.npcptCollide.setActive(false).setVisible(false)
					this.npcptCollide.body.enable = false;
				}

				//var width = 0;
				var elem = document.getElementById("pmeterBar");

				if (this.width < 0) {
					this.width = 0;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
				
				else {
					var elem = document.getElementById("pmeterBar");
					var p = 17;
					this.width = this.width - p;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			}
			if (this.registry.get("F1") == 'B' || this.registry.get("F1") == 'C' || this.registry.get("F1") == 'D'){
				//wrong answer				
				this.player.x = 370
				this.player.y = 560
				this.createMessageBox("You've been teleported... but where?\nSorry! Wrong answer!")
				this.time.addEvent({ delay: 2250, callback: this.zoomOut, callbackScope: this });
				this.time.addEvent({ delay: 4500, callback: this.resetZoom, callbackScope: this });

				//var width = 0;
				var elem = document.getElementById("pmeterBar");

				if (this.width >= 100) {
					this.width = 100;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			
				else {
					var elem = document.getElementById('pmeterBar');
					var p = 17;
					this.width = this.width + p;
					if (elem != null) {
						elem.style.width = this.width + "%";
						//elem.innerHTML = this.width + "%";
					}
				}
			}
		}

		getPipeScore() {
			return this.pipeScore;
		}
  }