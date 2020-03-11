var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, });


function preload() {

    game.load.image('background','sprites/background.png');
    game.load.image('player', 'sprites/chariotcolor.png');
    game.load.image('bullet', 'sprites/javelin32x40.png');
    game.load.image('trojan', 'sprites/trojanminion.png');
    game.load.image('trojan_javelin', 'sprites/enemyjavelin.png');
    game.load.image('player_hitbox', 'sprites/hitbox.png');
    game.load.bitmapFont('greekfont', 'font.png', 'font.fnt');
        game.load.image('hector_stage', 'sprites/hectorstage.png');
        game.load.image('hector', 'sprites/hector.png');
        game.load.image('hectorhpbar','sprites/hpbar.png');


}

var player;
var cursors;

var bullets;

var cursors;
var fireButton;

var bulletTime = 0;
var bullet;

var background;

var boss;
var boss_group;

var BossImageWidth;
var BossImageHeight;

var trojan;
var trojan_group;

var text;

var isGameOver;

var tryagaintext;

var BossSpeed = 50;

var faster;

var playerSpeedx = 5;
var playerSpeedy = 3;

var difficultyHard;
var difficultyEasy;

var easy = {
    speedIncrease: 50,
    enemyThreshold: 15
};
var hard = {
    speedIncrease: 100,
    enemyThreshold: 5
};
var difficulty = easy;

var timer;
var trojan_count = 0;

var trojan_bullet;
var trojan_bullet_group;

var player_hitbox;

var enemy_shoot_timer;

var trojan_kill_count = 0;

var hector_stage;

var hector_stage_yet = false;

var hector;

var hector_hp = 50;

var hec_timer;

var hec_timer_stop_seq;

var hector_roll;

var stop_shooting = true;

var timer1;
var timer2;
var timer3;

var hectortext;
var fighttext;
var hector_bar;

function create() {
 
    game.physics.startSystem(Phaser.Physics.ARCADE);
   
    hector_stage = game.add.sprite(0, 0, 'hector_stage');
    hector_stage.alpha = 0;
    
     hector_bar = game.add.sprite(0, 0, 'hectorhpbar');
    hector_bar.alpha = 0;
    

    hector = game.add.sprite((game.width / 2), 70, 'hector');
    hector.anchor.setTo(0.5, 0.5);
    hector.alpha = 0;

    game.physics.enable(hector, Phaser.Physics.ARCADE);

    
    background = game.add.tileSprite(0, 0, 8000, 2000, 'background');
    

    
    game.world.setBounds(0, 0, 800, 600);

    player = game.add.sprite(400, 600, 'player');
    player_hitbox = game.add.sprite(400, 580, 'player_hitbox');
    
    player.anchor.setTo(0.5, 0.5);
    player_hitbox.anchor.setTo(0.5, 0.5);
    player_hitbox.alpha = 0;

    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.enable(player_hitbox, Phaser.Physics.ARCADE);
    
    player.scale.setTo(0.40, 0.40);
    player_hitbox.scale.setTo(0.30, 0.30);
    

    trojan_group = game.add.group();
    trojan_group.enableBody = true;
    trojan_group.physicsBodyType = Phaser.Physics.ARCADE;
    
    timer = game.time.create(false);
    timer.start();

    timer.loop(1000, addTrojan, this);

    
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.00, 0.00);

    bullets = game.add.physicsGroup();
    bullets.createMultiple(5, 'bullet', false);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    player.body.collideWorldBounds = true;
    
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    trojan_bullet_group = game.add.group();
    trojan_bullet_group.enableBody = true;
    trojan_bullet_group.physicsBodyType = Phaser.Physics.ARCADE;
    trojan_bullet_group.setAll('checkWorldBounds', true);
    trojan_bullet_group.setAll('outOfBoundsKill', true);


    timer1 = game.time.create(false);
    timer2 = game.time.create(false);
    timer3 = game.time.create(false);
    
    hectortext = game.add.bitmapText((game.width / 2), -50, 'greekfont', 'Hector,', 40);
    hectortext.anchor.setTo(0.5, 0.5);
    
    fighttext = game.add.bitmapText((game.width / 2), -100, 'greekfont', 'Fight me!', 40);
    fighttext.anchor.setTo(0.5, 0.5);
    
    
}

function update() {
    
    background.tilePosition.y += 1.5;

    game.physics.arcade.overlap(bullets, trojan_group, bulletHitTrojanHandler, null, this); 
    
    game.physics.arcade.overlap(player_hitbox, trojan_group, playerHitTrojanHandler, null, this); 
    
    game.physics.arcade.overlap(player_hitbox, trojan_bullet_group, TrojanBulletHitPlayerHandler, null, this); 
    

    
    if (cursors.up.isDown)
    {
        player.body.position.y += -playerSpeedy;
        player_hitbox.body.position.y += -playerSpeedy;
    }
    else if (cursors.down.isDown)
    {
        player.body.position.y += playerSpeedy; player_hitbox.body.position.y += playerSpeedy;
    }

    if (cursors.left.isDown)
    {
        player.body.position.x += -playerSpeedx;
        player_hitbox.body.position.x += -playerSpeedx;
    }
    else if (cursors.right.isDown)
    {
        player.body.position.x += playerSpeedx;
        player_hitbox.body.position.x += playerSpeedx;
    }
    if (fireButton.isDown)
    {
        fireBullet();
    }
    
    if(hector_stage_yet) {
        
        hectortext.outOfBoundsKill = true;
        fighttext.outOfBoundsKill = true;

        hectortext.y -= 1;
        fighttext.y -= 1;
            
        hector_stage.alpha += 1;
        hector.alpha += 1;
        
        hector_bar.alpha += 1;
        
        game.physics.arcade.overlap(hector, bullets, bulletHitHectorHandler, null, this); 
        
//        killtxt();
        
    }
    
    
    
}

function killtxt(){
    
//    hectortext.y 
//    
//    hectortext.kill();
//    fighttext.kill();
    game.world.remove(hectortext);
    game.world.remove(fighttext);
}

function hector_stage_begin () {
    timer.stop();
    enemy_shoot_timer.stop();
    
        game.add.tween(background).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    
    timer1.add(8000, make_hector_text, this);
    timer1.start();

    
}

function make_hector_text() {
        
//    hectortext = game.add.bitmapText((game.width / 2), 50, 'greekfont', 'Hector,', 40);
//        hectortext.anchor.setTo(0.5, 0.5);
    
    hectortext.y = 50;
    
//    game.time.events.add(Phaser.Timer.SECOND * 2, make_fight_text, this);
    timer2.add(2000, make_fight_text, this);
    timer2.start();
    
}

function make_fight_text() {
            
    fighttext.y = 100;

//     fighttext = game.add.bitmapText((game.width / 2), 100, 'greekfont', 'Fight me!', 40);
//        fighttext.anchor.setTo(0.5, 0.5);
    
//     fighttext = game.add.text((game.width / 2), 100, "Fight me!", {
//        font: "40px greek",
//        fill: "#000000",
//        align: "center"
//    });

    fighttext.anchor.setTo(0.5, 0.5);
    
//        game.physics.arcade.enable([ hectortext, fighttext ]);

//        game.time.events.add(Phaser.Timer.SECOND * 2, text_disappear, this);
    timer3.add(2000, text_disappear, this);
    timer3.start();


        

}

function text_disappear() {

    hectortext.y = -50;
    fighttext.y = -100;
//    hectortext.kill();
//    fighttext.kill();
    hector_stage_yet = true;
    hector_begin_shoot();
    
}



function fireBullet () {

    if (!isGameOver && game.time.time > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x, player.y - 10);
            bullet.body.velocity.y = -600;
            bullet.angle = player.angle;
            bulletTime = game.time.time + 250;
        }
    }
    
}



function bulletHitTrojanHandler (bullet, trojan){
    bullet.kill();
    trojan.kill();
    trojan_kill_count++;
    
    if (trojan_kill_count > 15) {
        hector_stage_begin();
    }

}


function playerHitTrojanHandler (player_hitbox, trojan){

    player.kill ();
    gameover();
}

function TrojanBulletHitPlayerHandler (player_hitbox, trojan_bullet) {
    player.kill();
    gameover();
}

function bulletHitHectorHandler(hector, bullet) {
    if (hector_hp <= 0) {
        victory();
    }
    hector_hp = hector_hp - 1;
    hector_bar.x -= 5;

    bullet.kill();
}

function victory() {
    hector.kill();
    hec_timer.stop();
    stop_shooting = false;
    hector_stage_yet = false;
    game.add.tween(hector_stage).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    
    wintest = game.add.bitmapText((game.width / 2), 200, 'greekfont', 'HECTOR IS DEAD', 60);
        wintest.anchor.setTo(0.5, 0.5);
    
        wintest2 = game.add.bitmapText((game.width / 2), 260, 'greekfont', 'YOU WIN!', 60);
        wintest2.anchor.setTo(0.5, 0.5);

}

function gameover () {
    
        timer.stop();
    isGameOver = true;
    stop_shooting = false;


    diedtext = game.add.bitmapText((game.width / 2), 200, 'greekfont', 'YOU DIED', 80);
        diedtext.anchor.setTo(0.5, 0.5);
        diedtext.inputEnabled = true;

    
    tryagaintext = game.add.bitmapText((game.width / 2), 400, 'greekfont', 'Click here to try again', 45);
        tryagaintext.anchor.setTo(0.5, 0.5);
        tryagaintext.inputEnabled = true;

     tryagaintext.events.onInputUp.add(function() {
         reset();
     });
    
}
    

function addTrojan(){
    if (trojan_count < 25){
            trojan = trojan_group.create(20 + game.rnd.integerInRange(0, 740), -50, 'trojan');
    trojan.anchor.setTo(0.5, 0.5);
    trojan.scale.setTo(0.7, 0.7);

    trojan.body.immovable = true;
    trojan.checkWorldBounds = true;
    trojan.body.velocity.x = 0;
    trojan.body.velocity.y = 100;
    trojan_count++;
        
        
        enemy_shoot_timer = game.time.create(false);

    enemy_shoot_timer.add(3000, trojan_shoot, this);
            enemy_shoot_timer.start();

    }
}

function trojan_shoot() {
        var roll = game.rnd.integerInRange(0, 100);

        if (roll >= 0) {
            trojan_bullet = trojan_bullet_group.create(trojan.x, trojan.y, 'trojan_javelin');
            trojan_bullet.anchor.setTo(0.5,0.5);
            trojan_bullet.body.velocity.y = 100;
        
            trojan_bullet.rotation = game.physics.arcade.angleToXY(trojan_bullet, player.x , player.y) + 1.4;
        
            this.physics.arcade.moveToObject(trojan_bullet, player, 200);

        }
}


function reset(){
    isGameOver = false;

    game.state.restart();

}

function hector_begin_shoot() {
    
        hec_timer = game.time.create(false);
        hec_timer.start();
        hec_timer.loop(game.rnd.integerInRange(250, 500), hector_shoot, this);
    
}

function hector_shoot() {
    
    if (stop_shooting){
        trojan_bullet = trojan_bullet_group.create(hector.x, hector.y, 'trojan_javelin');
        trojan_bullet.anchor.setTo(0.5,0.5);
//        trojan_bullet.body.velocity.y = 75;
         
         var randx = game.rnd.integerInRange(0, 800);
         var randy = game.rnd.integerInRange(70, 600);
        trojan_bullet.rotation = game.physics.arcade.angleToXY(trojan_bullet, randx, randy) + 1.4;
        
        game.physics.arcade.moveToXY(trojan_bullet, randx, randy, 200);

    }
}

