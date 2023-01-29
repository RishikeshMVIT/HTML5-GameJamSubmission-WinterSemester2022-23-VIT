class Platform_small extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture, frame){
        super(scene, x ?? 0, y ?? 0, texture || 'platform_small', frame);

        this.setScale(1, 1 );

        scene.physics.add.existing(this);

        this.setPushable(false);

    }
}

class Platform_medium extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture, frame){
        super(scene, x ?? 0, y ?? 0, texture || 'platform_medium', frame);

        this.setScale(1, 1 );

        scene.physics.add.existing(this);

        this.setPushable(false);

    }
}


class Coin extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture, frame){
        super(scene, x ?? 0, y ?? 0, texture || 'coin', frame);

        this.setScale(1, 1);

        scene.physics.add.existing(this);

        this.setBounce(0.5);
        
    }
}

class Player extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture){
        super(scene, x ?? 0, y ?? 0, texture || 'player');

        this.setScale(1, 1);

        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

    }
}

class Button {
    constructor(x, y, label, scene, callback) {
        const button = scene.add.text(x, y, label )
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#000000' ,fontFamily: 'Customfont', fontSize: '50px' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fill: '#ffffff' }))
            .on('pointerout', () => button.setStyle({ fill: '#ffffff' }));
    }
}

// Then later in one of your scenes, create a new button:
