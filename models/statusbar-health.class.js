class Statusbarhealth extends Drawableobject{

    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
 
    percentage = 100;
    constructor () {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.setPercentage(100);
        this.x = 10;
        this.y = 78;
        this.width = 200;
        this.height = 50;
    }


    setPercentage(percentage) { // set Percentage (50);
        this.percentage = percentage; // 0 to 5 imges.  
        let path = this.IMAGES_HEALTH[this.resoveImageIndex()];
        this.img = this.imgCache[path];

    }

    resoveImageIndex() {
          if(this.percentage == 100) {
            return 5;
        } else if(this.percentage > 80) {
            return 4;
        } else if(this.percentage > 60) {
            return 3;
        } else if(this.percentage > 40) {
            return 2;
        } else if(this.percentage > 20){
            return 1;
        } else {
            return 0;
        }
    }

}



       