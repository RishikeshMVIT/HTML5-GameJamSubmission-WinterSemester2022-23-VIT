
//#region Helper Functions
function CreatePlatform(spawn, scene){
    var choice = Math.random();

    if (choice < 0.5) {
        let platform_1 = new Platform_small(scene, 540, 0);
        let platform_2 = new Platform_small(scene, 540, 0);

        platform_1.setPosition(spawn, 0);
        platform_2.setPosition(spawn + 400, 0);

        platform_1.setMaxVelocity(0, 100);
        platform_2.setMaxVelocity(0, 100);

        scene.platforms.add(platform_1);
        scene.platforms.add(platform_2);

        scene.add.existing(platform_1);
        scene.add.existing(platform_2);
    }

    else {
        let platform = new Platform_medium(scene, 540, 0);

        platform.setPosition(spawn, 0);

        platform.setMaxVelocity(0, 100);

        scene.platforms.add(platform);

        scene.add.existing(platform);
    }
        
}

function CreateCoin(spawn, scene){
    let coin = new Coin(scene, 540, 0);

    coin.setPosition(spawn, -32);

    scene.coins.add(coin);

    scene.add.existing(coin);
}

function CreateItems(scene){
    var spawn = Math.floor(Math.random() * 1080); 

    CreatePlatform(spawn, scene);

    CreateCoin(spawn, scene)

    scene.altitude += 1 ;
    scene.altitudeText.setText('Altitude: ' + scene.altitude);
}

function Kill_init(scene){
    scene.init_platform.destroy();
}

function AddScore(player, coin, scene){
    coin.disableBody(true, true);
    this.coin_pickup.play();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
}

function GameOver(scene){
    console.log('GameOver');
    this.scene.pause();
    this.scene.start('Menu');
}

//#endregion

//#region Main Scene

let gameScene = new Phaser.Scene('Game');

gameScene.preload = function(){
    this.load.image('play', '../assets/Play.png');
    this.load.image('platform_small', '../assets/platform_small.png' );
    this.load.image('platform_medium', '../assets/platform_medium.png');
    this.load.image('platform_large', '../assets/platform_large.png');
    this.load.image('player', '../assets/player.png');
    this.load.image('coin', '../assets/coin.png')

    this.load.audio('title_music', '../assets/sky.mp3');
    this.load.audio('coin_pickup', '../assets/coin.wav');
    
};

gameScene.create = function(){

    this.fallGravity = 128;
    this.jumpGravity = 108;

    this.jumpVelocity = 300;

    //#region
    this.score = 0;
    this.scoreText = this.add.text(0, 0, ['Score: ' + this.score], { fontFamily: 'CustomFont' ,fontSize: '20px'});

    this.altitude = 0;
    this.altitudeText = this.add.text(0, 24, ['Altitude: ' + this.altitude], { fontFamily: 'CustomFont' ,fontSize: '20px'});

    this.player =  new Player(this, 540, 20);
    this.add.existing(this.player);

    this.coin_pickup = this.sound.add('coin_pickup');

    this.platforms = this.add.group();
    this.coins = this.add.group();

    this.init_platform = this.physics.add.staticImage(540, 540, 'platform_medium');
    this.time.delayedCall(8000, Kill_init, [this], globalThis);
    this.platforms.add(this.init_platform);

    this.kill_platform = this.physics.add.staticImage(540, 704, 'platform_large');
    this.kill_platform.setScale(10, 1); 

    this.time.addEvent({
        delay: 1000,
        callback: CreateItems,
        args: [this],
        callbackScope: globalThis,
        loop: true
    });

    //#endregion

    //#region Colliders
    this.physics.add.collider(this.player, this.platforms, null, null, this);
    this.physics.add.collider(this.coins, this.platforms, null, null, this);
    //#endregion

    //#region Overlaps
    this.physics.add.overlap(this.player, this.coins, AddScore, null, this);
    this.physics.add.overlap(this.player, this.kill_platform, GameOver, null, this);
    //#endregion

};

gameScene.update = function(){

    let cursors = this.input.keyboard.createCursorKeys();

    //#region Horizontal Movement
    
    if (cursors.left.isDown) { this.player.setVelocityX(-180); }
    else if (cursors.right.isDown){ this.player.setVelocityX(180); }
    else {this.player.setVelocityX(0); }

    //#endregion

    //#region Jumping
    
    if (this.player.body.onFloor()){
        this.player.onGround = true;
    }

    if (this.player.body.velocity.y > 0){
        this.player.setGravityY(this.jumpGravity);
        if (this.player.onGround){ 
            this.player.onGround = false;
            this.player.fallTime = this.time.now;
        }
    }

    if (cursors.space.isDown || cursors.up.isDown)
    {
        this.player.jumpTime = this.time.now;
        let coyoteTime = this.player.jumpTime - this.player.fallTime

        if (this.player.body.onFloor()){
            this.player.setVelocityY(-this.jumpVelocity);
            this.player.setGravityY(this.fallGravity);
            this.player.onGround = false;
        }

        if (!this.player.body.onFloor() && coyoteTime < 500){
            this.player.setVelocityY(-this.jumpVelocity);
            this.player.setGravityY(this.fallGravity);
            this.player.onGround = false;
        }

    }

    //#endregion

}

//#endregion

//#region Menu Scene
let menuScene = new Phaser.Scene('Menu')

menuScene.preload = function(){
    this.load.audio('UI_sound', '../assets/Accept.wav');
}

menuScene.create = function(){
    this.accept = this.sound.add('UI_sound');
    this.button = new Button(540, 360, 'Start Game', this, () => {this.accept.play(); this.scene.start('Game');});
}
//#endregion

let gameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    backgroundColor: "#121212",
    pixelArt: true,
    parent: 'Game_Window',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 100
            }
        }
    },
    scale: {
        parent: 'Game_Window',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

window.addEventListener('load', function () {

	var game = new Phaser.Game(gameConfig);

	game.scene.add('Game', gameScene);
    game.scene.add('Menu', menuScene, true);
});
