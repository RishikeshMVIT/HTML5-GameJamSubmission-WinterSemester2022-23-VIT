class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'Load'
        })
    }

    init(){

    }

    preload(){
        this.load.image('play', '../assets/Play.png');
        this.load.audio('title_music', '../assets/sky.mp3');

        let loadingbar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        this.load.on("progress", (percent)=>{
            loadingbar.fillRect(0, this.game.renderer.height/2);
            console.log(percent);
        })
    }

    create(){
        console.log("created");
    }

}