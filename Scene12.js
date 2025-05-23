class Scene12 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene12' });
    }

    preload() {
        for (let i = 1; i <= 15; i++) {
            this.load.image(`mine${i}`, `assets/images/mine${i}.png`);
        }
        this.load.image('skip', 'assets/images/skip.png');
        this.load.image('dialog251', 'assets/images/dialog251.png');
        this.load.image('backtoschool', 'assets/images/backtoschool.png');
        this.load.audio('ling', 'assets/audio/ling.mp3');
        this.load.audio('gameBGM', 'assets/audio/gameBGM.mp3');
        this.load.audio('puzzle', 'assets/audio/puzzle.mp3');
    }

    create() {
        // ✅ 釋放 Scene1~11 用過的 dialog1~dialog25 圖片資源
        const dialogKeysToRemove = [];
        for (let i = 1; i <= 25; i++) {
            dialogKeysToRemove.push(`dialog${i}`);
        }
        dialogKeysToRemove.forEach(key => {
            if (this.textures.exists(key)) {
                this.textures.remove(key);
                console.log(`✅ 已釋放圖片資源: ${key}`);
            }
        });

        const ROWS = 3;
        const COLS = 5;
        const PUZZLE_COUNT = ROWS * COLS;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.gameBGM = this.sound.add('gameBGM', { volume: 1.3, loop: true });
        this.gameBGM.play();

        this.puzzleSound = this.sound.add('puzzle');
        this.puzzlePieces = [];
        this.isPuzzleLocked = false;

        const maxPuzzleWidth = this.cameras.main.width * 0.9 / COLS;
        const maxPuzzleHeight = this.cameras.main.height * 0.9 / ROWS;
        const puzzleSize = Math.min(maxPuzzleWidth, maxPuzzleHeight);
        const startX = centerX - (puzzleSize * COLS) / 2 + puzzleSize / 2;
        const startY = centerY - (puzzleSize * ROWS) / 2 + puzzleSize / 2;

        for (let i = 0; i < PUZZLE_COUNT; i++) {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const x = startX + col * puzzleSize;
            const y = startY + row * puzzleSize;

            const puzzlePiece = this.add.image(x, y, `mine${i + 1}`)
                .setOrigin(0.5)
                .setDisplaySize(puzzleSize, puzzleSize)
                .setInteractive();

            const randomRotation = Phaser.Math.Between(0, 3) * 90;
            puzzlePiece.rotation = Phaser.Math.DegToRad(randomRotation);

            puzzlePiece.on('pointerdown', () => {
                if (!this.isPuzzleLocked) {
                    puzzlePiece.rotation += Phaser.Math.DegToRad(90);
                    this.puzzleSound.play();
                    this.checkComplete();
                }
            });

            this.puzzlePieces.push(puzzlePiece);
        }

        this.skipImage = this.add.image(this.scale.width * 0.93, this.scale.height * 0.93, 'skip')
            .setDisplaySize(this.scale.width * 0.1, this.scale.height * 0.08)
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        this.skipImage.on('pointerdown', () => {
            this.gameBGM.stop();
            this.puzzlePieces.forEach(piece => piece.setVisible(false));
            this.skipImage.setVisible(false);

            const dialog = this.add.image(centerX, centerY, 'dialog251').setOrigin(0.5);
            this.scaleToFitScreen(dialog);

            this.time.delayedCall(1500, () => {
                const backToSchoolButton = this.add.image(this.scale.width * 0.5, this.scale.height * 0.7, 'backtoschool')
                    .setOrigin(0.5)
                    .setDisplaySize(this.scale.width * 0.15, this.scale.height * 0.1)
                    .setInteractive()
                    .setDepth(1);

                backToSchoolButton.on('pointerdown', () => {
                    this.scene.start('Scene13');
                });
            });
        });

        this.completionText = this.add.text(centerX, centerY, "報紙拼湊完成", {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            align: 'center',
        }).setOrigin(0.5).setVisible(false);
    }

    checkComplete() {
        const isComplete = this.puzzlePieces.every(piece => Phaser.Math.RadToDeg(piece.rotation) % 360 === 0);

        if (isComplete) {
            this.sound.play('ling', { volume: 0.1 });
            this.completionText.setVisible(true);
            this.isPuzzleLocked = true;

            this.time.delayedCall(2000, () => {
                this.completionText.setVisible(false);
            });

            this.time.delayedCall(8000, () => {
                this.skipImage.setVisible(true);
            });
        }
    }

    scaleToFitScreen(image) {
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.min(scaleX, scaleY);
        image.setScale(scale);
    }
}

export default Scene12;
