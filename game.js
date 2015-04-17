(function(){
	var WIDTH = 1280;
	var HEIGHT = 720;
	//increase bullet capacity when you hit a heart
	//
	var _game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

	var mainState = {
		preload : function(){
			this.game.load.image('bullet','assets/bullet.png');
			this.game.load.image('bgSpace','assets/background.png');
			this.game.load.image('bgSpace2','assets/starfield.png');
			this.game.load.spritesheet('ship','assets/doctor.gif',96,141,1);
			"64,29,4"
			this.game.load.spritesheet("enemyship1","assets/intestine.png",57, 57, 1);
			this.game.load.spritesheet("enemyship2","assets/pancreas.png",57, 48, 1);
			this.game.load.spritesheet("enemyship3","assets/liver.png",50, 33, 1);
			this.game.load.spritesheet("enemyship4","assets/kidney.png",50, 47, 1);
			this.game.load.spritesheet("enemyship5","assets/lung.png",75, 56, 1);
			this.game.load.spritesheet("fake1","assets/lung1.png",75, 56, 1);
			this.game.load.spritesheet("fake2","assets/kidney1.png",50, 47, 1);
			this.game.load.spritesheet("fake3","assets/liver1.png",50, 33, 1);
			this.game.load.spritesheet("fake4","assets/pancreas1.png",57, 48, 1);
			this.game.load.spritesheet("fake5","assets/intestine1.png",57, 57, 1);
			this.game.load.spritesheet("patient1","assets/patient.png",90, 134, 1);
			this.game.load.spritesheet("patient2","assets/patient1.png",90, 134, 1);
			this.game.load.spritesheet("patient3","assets/patient2.png",90, 134, 1);
			this.game.load.spritesheet("patient4","assets/patient3.png",90, 134, 1);
			this.game.load.spritesheet("patient5","assets/patient4.png",90, 134, 1);
			this.game.load.spritesheet("patientcpy1","assets/patientcopy.png",90, 134, 1);
			this.game.load.spritesheet("patientcpy2","assets/patientcopy1.png",90, 134, 1);
			this.game.load.spritesheet("patientcpy3","assets/patientcopy2.png",90, 134, 1);
			this.game.load.spritesheet("patientcpy4","assets/patientcopy3.png",90, 134, 1);
			this.game.load.spritesheet("patientcpy5","assets/patientcopy4.png",90, 134, 1);
		},

		create : function(){
			this.lastBullet = 0;
			this.lastEnemy = 0;
			this.lastPatient = 0;
			this.lastPatientDead = 0;
			this.lastFake = 0;
			this.lastTick = 0;
			this.speed = 240;
			this.bg1Speed = 30;
			this.bg2Speed =40;
			this.bg3Speed =50;
			this.enemySpeed = 200;
			this.patientSpeed = 230;
			this.patientsDeadSpeed = 245;
			this.fakeSpeed = 245;
			this.bulletSpeed = 300;
			this.lives = 0;
			this.score = 0;
			this.numBullets = 100;
			this.numOrgans = 0;
			
			this.numFakes = 0;
			this.numPatientsDead = 0;
			this.numDonated = 0;
			this.numPatientsTransferred  =0;
			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			this.bg = this.game.add.tileSprite(0,0,1280,720,'bgSpace');
			this.bg.autoScroll(-this.bg1Speed,0);

			this.bg2 = this.game.add.tileSprite(0,0,1280,720,'bgSpace2');
			this.bg2.autoScroll(-this.bg2Speed,0);

			this.bg3 = this.game.add.tileSprite(0,0,800,601,'bgSpace2');
			this.bg3.autoScroll(-this.bg3Speed,0);

			//this.ship = this.game.add.sprite(10,HEIGHT/2, 'ship');
			//this.ship.animations.add('move');
			
			
			//this.ship.body.checkCollision.left = false;
			//this.ship.body.checkCollision.right = false;
			//this.ship.animations.play('move', 48, true);
			//this.game.physics.arcade.enable(this.ship, Phaser.Physics.ARCADE);

			this.bullets = this.game.add.group();
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
			this.bullets.createMultiple(10,'bullet');		
            //this.numBullets = 100;			
    		this.bullets.setAll('outOfBoundsKill', true);
    		this.bullets.setAll('checkWorldBounds', true);

			this.enemies = this.game.add.group();
			this.enemies.enableBody = true;
			this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
			
			this.patients = this.game.add.group();
			this.patients.enableBody = true;
			this.patients.physicsBodyType = Phaser.Physics.ARCADE;
			
			this.fakes = this.game.add.group();
			this.fakes.enableBody = true;
			this.fakes.physicsBodyType = Phaser.Physics.ARCADE;
			
			this.patientsDead = this.game.add.group();
			this.patientsDead.enableBody = true;
			this.patientsDead.physicsBodyType = Phaser.Physics.ARCADE;
			
			var style = { font: "28px Arial", fill: "#DE5F3D", align: "left" };
			this.scoreText = this.game.add.text(0,0,"Score : "+this.score,style);
			//this.livesText = this.game.add.text(0,28,"Balloons hit by car : "+this.lives,style);
			//this.bulletsText = this.game.add.text(0,56,"Bullets : "+this.numBullets, style);
			this.numDonatedText = this.game.add.text(0,28,"Organs donated : "+this.numDonated, style);
			this.numOrgansText = this.game.add.text(0, 56,"Organs collected : "+this.numOrgans, style);
			this.numPatientsText = this.game.add.text(0,84,this.numPatientsTransferred+" patients transferred to hospital for organ transplant",style);
			//this.numPatientsadText = this.game.add.text(0,112,"Patient #"+this.lastPatient+" transferred to hospital for organ transplant",style);
			this.numFakesText = this.game.add.text(0, 112,"Fakes collected : "+this.numFakes, style);
			this.numPatientsDeadText = this.game.add.text(0, 140,"Dead patients passed : "+this.numPatientsDead, style);
			this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
			this.sprite.anchor.set(0.5);
			//  And enable the Sprite to have a physics body:
			this.game.physics.arcade.enable(this.sprite);
		},

		update : function(){
			this.sprite.body.velocity.setTo(0,0);
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.sprite.x > 0)
			{
				this.sprite.body.velocity.x = -2*this.speed;
			}
			//else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.sprite.x < (WIDTH-this.sprite.width))
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.sprite.x < (WIDTH-1080))
			{
				this.sprite.body.velocity.x = this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.sprite.y > 0)
			{
				this.sprite.body.velocity.y = -this.speed;
			}
			//else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.sprite.y < (HEIGHT-this.sprite.height))
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.sprite.y < (HEIGHT))
			{
				this.sprite.body.velocity.y = +this.speed;
			}
			//  If the sprite is > 8px away from the pointer then let's move to it
			//if (this.game.physics.arcade.distanceToPointer(this.sprite, this.game.input.activePointer) > 8)
			//{
			//  Make the object seek to the active pointer (mouse or touch).
			//this.game.physics.arcade.moveToPointer(this.sprite, 800);
			//}
			else
			{
			//  Otherwise turn off velocity because we're close enough to the pointer
			this.sprite.body.velocity.set(0);
			}
			

			var curTime = this.game.time.now;

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			{
				if(curTime - this.lastBullet > this.rnd.integerInRange(145,300))
				{
					this.fireBullet();
					//this.numBullets--;
					//this.bulletsText.setText = ("Bullets : "+this.numBullets);
					this.lastBullet = curTime;
				}
			}
			//put 500 here just in case 
			if(curTime - this.lastEnemy > this.rnd.integerInRange(500,600))
			{
				this.generateEnemy();
				this.lastEnemy = curTime;
			}

			if(curTime - this.lastPatient > this.rnd.integerInRange(289,300))
			{
				this.generatePatients();
				this.lastPatient = curTime;
			}
			if(curTime - this.lastFake > this.rnd.integerInRange(500,600))
			{
				this.generateFake();
				this.lastFake = curTime;
			}
			if(curTime - this.lastPatientDead > this.rnd.integerInRange(289,300))
			{
				this.generatePatientsDead();
				this.lastPatientDead = curTime;
			}
			this.game.physics.arcade.collide(this.enemies, this.sprite, this.enemyHitPlayer, null, this);
			this.game.physics.arcade.collide(this.enemies, this.bullets, this.enemyHitBullet,null, this);
			this.game.physics.arcade.overlap(this.patients, this.sprite, this.patientHitPlayer, null, this);
			this.game.physics.arcade.overlap(this.fakes, this.sprite, this.fakeHitPlayer, null, this);
			this.game.physics.arcade.overlap(this.patientsDead, this.sprite, this.patientDeadHitPlayer, null, this);
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
				patient.reset(WIDTH - 10,Math.floor(Math.random()*(HEIGHT-60)),'patient'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			else
			{
				patient = this.patients.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-60)),'patient'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			
			patient.body.velocity.x = -this.patientSpeed;
			patient.outOfBoundsKill = true;
			//patient.checkWorldBounds = true;
			patient.animations.add('move');
			patient.animations.play('move',20,true);
			
			
		},
		generatePatientsDead : function(){
			var patientDead = this.patientsDead.getFirstExists(false);
			//patient.set("hit",false);
			if(patientDead)
			{
				patientDead.reset(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'patientcpy'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			else
			{
				patientDead = this.patients.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'patientcpy'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			
			patientDead.body.velocity.x = -this.patientDeadSpeed;
			patientDead.outOfBoundsKill = true;
			//patient.checkWorldBounds = true;
			patientDead.animations.add('move');
			patientDead.animations.play('move',20,true);
			
			
		},
		generateFake : function(){
			var fake = this.fakes.getFirstExists(false);
			//patient.set("hit",false);
			if(fake)
			{
				fake.reset(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'fake'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			else
			{
				fake = this.fakes.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'fake'+(1+Math.floor(Math.random()*5)));
				hit = false;
			}
			
			fake.body.velocity.x = -this.fakeSpeed;
			fake.outOfBoundsKill = true;
			//patient.checkWorldBounds = true;
			fake.animations.add('move');
			fake.animations.play('move',20,true);
			
			
		},
		fakeHitPlayer : function(player, fake){
			if(this.fakes.getIndex(fake) > -1)
				fake.kill();
			//this.lives += 1;
			this.numFakes += 1;
			this.numFakesText.setText("Fake organs collected: "+this.numFakes);
			//this.numOrgansText.setText("Organs collected : "+this.numOrgans);
			//this.livesText.setText("Balloons hit by car : "+this.lives);
			this.score -= 75;
			this.scoreText.setText("Score : "+this.score);
			if(this.numFakes > this.rnd.integerInRange(240,300))
			{
				
				var text = "- Game Over!!!! Your Score is "+this.score;
				var style = { font: "35px Arial", fill: "#ff0044", align: "center" };
				var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);
				this.game.state.start('menu');
			}	
			//if(this.lives > 30)
				//this.game.state.start('menu');
		},
		patientDeadHitPlayer : function(player, patientDead){
			if(this.patientsDead.getIndex(patientDead) > -1){
				patientDead.kill();
				this.numPatientsDead += 1;
		}
			//this.lives += 1;
			
			this.numPatientsDeadText.setText("Dead patients passed: "+this.numPatientsDead);
			//this.numOrgansText.setText("Organs collected : "+this.numOrgans);
			//this.livesText.setText("Balloons hit by car : "+this.lives);
			this.score -= 33;
			this.scoreText.setText("Score : "+this.score);	
			//if(this.lives > 30)
				//this.game.state.start('menu');
		},
		enemyHitPlayer : function(player, enemy){
			if(this.enemies.getIndex(enemy) > -1)
				
			enemy.kill();
			//this.lives += 1;
			this.numOrgans += 1;
			this.numOrgansText.setText("Organs collected : "+this.numOrgans);
			//this.livesText.setText("Balloons hit by car : "+this.lives);
			this.score += 50;
			this.scoreText.setText("Score : "+this.score);
			//if(this.lives > 30)
				//this.game.state.start('menu');
			if(this.numOrgans >= this.rnd.integerInRange(212,300)){
				this.game.state.start('menu');
			}
		},

		patientHitPlayer : function(player, patient){
		
			//if(this.patients.getIndex(patient) > -100)
			//{
			//}
			patient.kill();
			//var style = { font: "20px Arial", fill: "#DE5F3D", align: "center" };
			//this.title = this.game.add.text(250,170,"Patient transferred to organ transplant",style);
				this.numOrgans -= 1;
					this.numOrgansText.setText("Organs collected : "+this.numOrgans);
					this.numDonated += 1;
					this.numDonatedText.setText("Patients passed : "+this.numDonated);
					this.score += 50;
					this.numPatientsTransferred  +=1;
					this.numOrgans +=1; //recieve an organ from a patient
					this.numPatientsText.setText(this.numPatientsTransferred+" patients transferred to hospital for organ transplant.");
					//this.numPatientsadText.setText("Patient #"+this.lastPatient+" transferred to hospital for organ transplant.");
					//this.patients.remove(patient);
				//this.lives += 1;
				//if(this.numDonated >= 450) //one simply cant reach that score
				//{
					//this.game.state.start('menu');
					//var text = "- Game Over!!!!! Your Score is "+this.score;
					//var style = { font: "35px Arial", fill: "#ff0044", align: "center" };

					//var t = this.game.add.text(this.game.world.centerX-300, 0, text, style);
				//}
				
				
				//this.livesText.setText("Balloons hit by car : "+this.lives);
				
				this.scoreText.setText("Score : "+this.score);
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
			this.help = this.game.add.text(250,230,"Get ready to collect some organs!!!",style2);
			var style3 = { font: "28px Arial", fill: "#DE5F3D", align: "center" };
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
