function LoadScript(url) {
    var script = document.createElement("script");
    script.src = url;
    script.type = 'text/javascript';
    script.defer = true;
    script.async = false;
    document.head.appendChild(script); 
}

LoadScript("./lib/phaser.min.js");

LoadScript("./assets/assets.js");

LoadScript("./src/game.js");