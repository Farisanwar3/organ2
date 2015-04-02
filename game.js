
(function(){
	var WIDTH = 960;
	var HEIGHT = 720;
	//increase bullet capacity when you hit a heart
	//
	var _game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');
	//var sfx = Phaser.Sound;
	var mainState = {
		preload : function(){
			this.game.load.image('bullet','assets/bullet.png');
			this.game.load.image('bgSpace','assets/background.png');
			this.game.load.image('bgSpace2','assets/starfield.png');
			this.game.load.spritesheet('ship','assets/charger1.png',277,90,1); 
			"64,29,4"
			this.game.load.spritesheet("enemyship1","assets/dollars.png",50, 80, 1);
			this.game.load.spritesheet("enemyship2","assets/dollars.png",50, 80, 1);
			this.game.load.spritesheet("enemyship3","assets/dollars.png",50, 80, 1);
			this.game.load.spritesheet("enemyship4","assets/dollars.png",50, 80, 1);
			this.game.load.spritesheet("enemyship5","assets/dollars.png",50, 80, 1);
			this.game.load.spritesheet("patient1","assets/toyota.png",200, 58, 1);
			this.game.load.spritesheet("patient2","assets/toyota.png",200, 58, 1);
			this.game.load.spritesheet("patient3","assets/toyota.png",200, 58, 1);
			this.game.load.spritesheet("patient4","assets/toyota.png",200, 58, 1);
			this.game.load.spritesheet("patient5","assets/toyota.png",200, 58, 1);
			this.game.load.audio('sfx','assets/charger.mp3');
			this.game.load.audio('vin','assets/fast.mp3');
		},

		create : function(){
			vin = this.game.add.audio('vin');
			sfx = this.game.add.audio('sfx');
			sfx.play();
			vin.play();
			this.lastBullet = 0;
			this.lastEnemy = 0;
			this.lastPatient = 0;
			this.lastTick = 0;
			this.speed = 240;
			this.bg1Speed = 30;
			this.bg2Speed =40;
			this.bg3Speed =50;
			this.enemySpeed = 200;
			this.patientSpeed = 230;
			this.bulletSpeed = 300;
			this.lives = 0;
			this.score = 0;
			this.numBullets = 100;
			this.numOrgans = 0;
			this.numDonated = 0;
			this.numPatientsTransferred  =0;
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.rnd;
			this.bg = this.game.add.tileSprite(0,0,1280,720,'bgSpace');
			this.bg.autoScroll(-this.bg1Speed,0);

			this.bg2 = this.game.add.tileSprite(0,0,1280,720,'bgSpace2');
			this.bg2.autoScroll(-this.bg2Speed,0);

			this.bg3 = this.game.add.tileSprite(0,0,800,601,'bgSpace2');
			this.bg3.autoScroll(-this.bg3Speed,0);

			this.ship = this.game.add.sprite(10,HEIGHT/2, 'ship');
			//this.ship.animations.add('move');
			//this.ship.animations.play('move', 20, true);
			this.game.physics.arcade.enable(this.ship, Phaser.Physics.ARCADE);

			this.bullets = this.game.add.group();
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
			this.bullets.createMultiple(10,'bullet');			
    		this.bullets.setAll('outOfBoundsKill', true);
    		this.bullets.setAll('checkWorldBounds', true);


			this.enemies = this.game.add.group();
			this.enemies.enableBody = true;
			this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
			
			this.patients = this.game.add.group();
			this.patients.enableBody = true;
		this.patients.physicsBodyType = Phaser.Physics.ARCADE;

			var style = { font: "28px Arial", fill: "#DE5F3D", align: "left" };
			this.scoreText = this.game.add.text(0,0,"Money won(in $) : $"+this.score,style);
			//this.livesText = this.game.add.text(0,28,"Balloons hit by car : "+this.lives,style);
			//this.bulletsText = this.game.add.text(0,56,"Bullets : "+this.numBullets, style);
			this.numDonatedText = this.game.add.text(0,28,"Dollar signs collected: "+this.numDonated, style);
			this.numOrgansText = this.game.add.text(0, 56,"Pink slips given to Brian : "+this.numOrgans, style);
			//this.numPatientsText = this.game.add.text(0,84,this.numPatientsTransferred+" patients transferred to hospital for organ transplant",style);
			//this.numPatientsadText = this.game.add.text(0,112,"Patient #"+this.lastPatient+" transferred to hospital for organ transplant",style);
			//this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
			//this.sprite.anchor.set(0.5);
			//  And enable the Sprite to have a physics body:
			this.game.physics.arcade.enable(this.ship);
		},

		update : function(){
			this.ship.body.velocity.setTo(0,0);
			/*
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.x > 0)
			{
				this.ship.body.velocity.x = -2*this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.x < (WIDTH-this.ship.width))
			{
				this.ship.body.velocity.x = this.speed;
			}*/
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.ship.y > 0)
			{
				this.ship.body.velocity.y = -this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.ship.y < (HEIGHT-this.ship.height))
			{
				this.ship.body.velocity.y = +this.speed;
			}
			var curTime = this.game.time.now;
			//put 500 here just in case 
			if(curTime - this.lastEnemy > this.rnd.integerInRange(100,155))
			{
				this.generateEnemy();
				this.lastEnemy = curTime;
			}

			if(curTime - this.lastPatient > this.rnd.integerInRange(270,320))
			{
				this.generatePatients();
				this.lastPatient = curTime;
			}
			this.game.physics.arcade.overlap(this.enemies, this.ship, this.enemyHitPlayer, null, this);
			this.game.physics.arcade.overlap(this.enemies, this.bullets, this.enemyHitBullet,null, this);
			this.game.physics.arcade.overlap(this.patients, this.ship, this.patientHitPlayer, null, this);
			//this.game.physics.arcade.collide();
		},
		generateEnemy : function(){
			var enemy = this.enemies.getFirstExists(false);
			if(enemy)
			{
				enemy.reset(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'enemyship'+(1+Math.floor(Math.random()*5)));
			}
			else
			{
				enemy = this.enemies.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'enemyship'+(1+Math.floor(Math.random()*5)));
			}
			enemy.body.velocity.x = -this.enemySpeed;
			enemy.outOfBoundsKill = true;
			enemy.checkWorldBounds = true;
			enemy.animations.add('move');
			enemy.animations.play('move',20,true);
		},
		generatePatients : function(){
			var patient = this.patients.getFirstExists(false);
			//patient.set("hit",false);
			if(patient)
			{
				patient.reset(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-90)),'patient'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			else
			{
				patient = this.patients.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-90)),'patient'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			
			patient.body.velocity.x = -this.patientSpeed;
			patient.outOfBoundsKill = true;
			//patient.checkWorldBounds = true;
			patient.animations.add('move');
			patient.animations.play('move',20,true);
			
			
		},

		enemyHitPlayer : function(player, enemy){
			if(this.enemies.getIndex(enemy) > -1)
				
			enemy.kill();
			//this.lives += 1;
			this.numOrgans += this.rnd.integerInRange(1,6);
			this.numOrgansText.setText("Pink slips given to Brian : "+this.numOrgans);
			//this.livesText.setText("Balloons hit by car : "+this.lives);
			this.score += 50;
			this.scoreText.setText("Money won(in $) : $"+this.score);
			//if(this.lives > 30)
				//this.game.state.start('menu');
		},

		patientHitPlayer : function(player, patient){
		
			//if(this.patients.getIndex(patient) > -100)
			//{
			//}
			patient.kill();
			//var style = { font: "20px Arial", fill: "#DE5F3D", align: "center" };
			//this.title = this.game.add.text(250,170,"Patient transferred to organ transplant",style);
				this.numOrgans -= this.rnd.integerInRange(1,8);
				
					this.numDonated += this.rnd.integerInRange(1,8);
					this.numDonatedText.setText("Dollar signs collected: "+this.numDonated);
					
					this.score += this.rnd.integerInRange(20, 70);
					this.numPatientsTransferred  +=1;
					this.numOrgans +=1;
					//this.numPatientsText.setText(this.numPatientsTransferred+" patients transferred to hospital for organ transplant.");
					//this.numPatientsadText.setText("Patient #"+this.lastPatient+" transferred to hospital for organ transplant.");
					//this.patients.remove(patient);
				//this.lives += 1;
				if(this.numDonated >= this.rnd.integerInRange(322, 800))
				{
					this.game.state.start('menu');
				}
				
				
				//this.livesText.setText("Balloons hit by car : "+this.lives);
				
				this.scoreText.setText("Money won(in $) : $"+this.score);
		},
		
	}

	var menuState = {
		preload : function(){
			this.game.load.image('bgSpace','mazehd1.png')
		},

		create : function(){
			this.speed = 10;

			this.bg = this.game.add.tileSprite(0,0,1280,720,'bgSpace');
			this.bg.autoScroll(-this.speed,0);

			var style = { font: "48px Arial", fill: "#DE5F3D", align: "center" };
			this.title = this.game.add.text(110,170,"THIS GAME WILL BLOW YOUR MIND!!!!!",style);

			var style2 = { font: "28px Arial", fill: "#DE5F3D", align: "center" };
			this.help = this.game.add.text(250,230,"Get ready to save Brian!!",style2);
		},

		update : function(){
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
				this.game.state.start('main');
		}
	}

	_game.state.add('main', mainState);
	_game.state.add('menu', menuState);
	_game.state.start('menu');
})();