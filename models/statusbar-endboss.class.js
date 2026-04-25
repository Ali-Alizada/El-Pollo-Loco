class StatusBarBoss extends Drawableobject {

    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    percentage = 100;
    isLow = false;
    visible = false;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 500; 
        this.y = 56;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        if (percentage <= 20) {
        this.isLow = true;
        this.startBlinking();
        }

        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imgCache[path];
    }

    startBlinking() {
        if(this.blinkInterval) return;

        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        })
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}
