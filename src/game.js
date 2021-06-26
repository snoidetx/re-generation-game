var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
game.state.add('play', {
    preload: function() {
        game.load.image("universe", "assets/universe.png");
        game.load.image("planet", "assets/planet.png");
    },
    create: function() {
        game.add.image(400, 300, "universe");
        game.add.image(400, 300, "planet");
    },
    render: function() {
        game.debug.text('Adventure Awaits!', 400, 300);
    }
});
 
game.state.start('play');