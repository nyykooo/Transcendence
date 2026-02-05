import Phaser from "phaser";

class Player extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "player");
        scene.add.existing(this);

        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setCollisionCategory(1);
    }
}

class Tree extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "tree");
        scene.add.existing(this);

        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setCollidesWith(1);
        this.body.immovable = true;
    }
}

export default class MountainScene extends Phaser.Scene {
    private player!: Player; // Declare the player property
    private trees!: Tree[]; // Declare the tree property

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Declare the cursors property
    private l_keyPressed: boolean = false;
    private r_keyPressed: boolean = false;

    private difficulty: number = 1;

    constructor() {
        super({ key: "MountainScene" });
    }

    preload() {
        // carregar os assets usados pela cena aqui
        this.load.spritesheet("player", "/assets/player.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image("tree", "/assets/tree.png");
    }

    create() {
        // configurar a cena, adicioanr sprites, etc.

        // configurar personagem:
        this.player = new Player(this, 400, 0);

        // Initialize trees array and generate trees
        this.trees = [];
        this.generateTrees();

        // teclado
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.anims.create({
        key: "turn-left",
        frames: this.anims.generateFrameNumbers("player", {
            start: 0,
            end: 1,
        }),
        frameRate: 2,
        repeat: 0,
        });

        this.anims.create({
        key: "turn-right",
        frames: this.anims.generateFrameNumbers("player", {
            start: 2,
            end: 3,
        }),
        frameRate: 2,
        repeat: 0,
        });

    }

    
    update() {
        this.downhill();

        this.playerLifeCycle();

        const x_speed = 200;
        const y_speed = 100;

        switch (true) {
            case this.cursors.left.isDown:
                if (!this.l_keyPressed){
                    this.player.body.setVelocityX(-x_speed);
                    this.player.anims.play("turn-right", true);
                    this.l_keyPressed = true;
                }
                break;
            case this.cursors.right.isDown:
                if (!this.r_keyPressed){
                    this.player.body.setVelocityX(x_speed);
                    this.player.anims.play("turn-left", true);
                    this.r_keyPressed = true;
                }
                break;
            // Player cant move up in mountain scene
            case this.cursors.up.isDown:
                this.player.body.setVelocityY(-y_speed);
                break;
            case this.cursors.down.isDown:
                this.player.body.setVelocityY(y_speed);
                break;
            default:
                if (this.l_keyPressed)
                    this.l_keyPressed = false;
                if (this.r_keyPressed)
                    this.r_keyPressed = false;
                this.player.body.setVelocity(0, 0);
                this.player.anims.stop();
                this.player.setFrame(0); // frame parado
        }
    }

    downhill() {
        this.trees.forEach(tree => {
            tree.body.setVelocityY(-50*(1 + this.difficulty));
    
            if (tree.y - tree.height/2 == 0)
            {
                tree.y = 600;
                tree.x = Phaser.Math.Between(50, 750);
                this.difficulty += 0.025;
            }
        });

    }

    generateTrees() {
        for (let i = 0; i < Phaser.Math.Between(20, 40); i++) {
            let tree = new Tree(this, Phaser.Math.Between(50, 750), Phaser.Math.Between(0, 600));
    
            // Add collision between player and tree
            this.physics.add.collider(this.player, tree);
    
            this.trees.push(tree);
        }
    }

    playerLifeCycle() {
        if (this.player.body.checkCollision.down && this.player.body.touching.down) {
            console.log("Player has collided with a tree!");
            this.scene.restart(); // Restart the scene on collision
        }
    }
}