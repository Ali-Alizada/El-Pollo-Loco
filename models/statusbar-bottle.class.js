class Statusbarbottle extends Drawableobject {

        IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',    
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',    
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',    
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',    
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];


    percentage = 0;

    constructor () {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.setPercentage(0);
        // this.x = 10;
        // this.y = -10;    
        this.x = 10;
        this.y = 10;
        this.width = 200;
        this.height = 40;
        
    }


    setPercentage(percentage) { // set Percentage (50);
        this.percentage = percentage; // 0 to 5 imges.  
        let path = this.IMAGES_BOTTLE[this.resoveImageIndex()];
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
        
    
