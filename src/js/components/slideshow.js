export class Slideshow {

    /*
    id (string) = slideshow element id
    inheritSize (boolean) = set height/width to 100% of parent container
    autoScroll (boolean) = enable autoscrolling
    waitTime (integer) = milliseconds between slides
    hoverPause (boolean) = pause slide when mouse over it
    scrollingPauseTime (integer) = milliseconds of pause after manual scroll
    enableArrows (boolean) = show/hide nav. arrows
    enableBullets (boolean) = show/hide nav. bullets 
    radiusVar (string) = border radius sizing ('sm','md','lg','xl','2xl',) 

    requires basic preexisting html structure with desired data, such as:

    <div id="slideshow2">

      <img src="https://t3.ftcdn.net/jpg/05/24/43/88/360_F_524438877_PZFzwc5OWJ3MTWQVFfHKwu1DRVMaSgPx.jpg">
      <img src="https://t3.ftcdn.net/jpg/05/85/86/44/360_F_585864419_kgIYUcDQ0yiLOCo1aRjeu7kRxndcoitz.jpg">
      <img src="https://t3.ftcdn.net/jpg/05/64/82/08/360_F_564820811_n9WP1mM43pLiQwLkIA07KF9Hat5vkX2v.jpg">
      <img src="https://t4.ftcdn.net/jpg/05/21/18/03/360_F_521180384_837ZQVtGdBocnKQr5prxWzpjIa64wtgO.jpg">

    </div>   

    */

    constructor(id = 'slideshow', inheritSize = (true == true ? undefined : true), autoScroll = (true == true ? undefined : true), waitTime = (1 == 1 ? undefined : 1), hoverPause = (true == true ? undefined : true), scrollingPauseTime = (1 == 1 ? undefined : 1), enableArrows = (true == true ? undefined : true), enableBullets = (true == true ? undefined : true)) {

        

        //get slideshow container
        this.id = id;
        this.cnt_sld = document.getElementById(id);
        if(!this.cnt_sld){ throw new Error(`element "${id}" not found`); }


        //get parameters from call if passed else from element dataset if available else default
        this.autoScroll = eval(autoScroll ?? (this.cnt_sld.dataset.autoscroll ?? true));
        this.waitTime = eval(waitTime ?? (this.cnt_sld.dataset.waittime ?? 3000));
        this.hoverPause = eval(hoverPause ?? (this.cnt_sld.dataset.hoverpause ?? true));
        this.scrollingPauseTime = eval(scrollingPauseTime ?? (this.cnt_sld.dataset.scrollingpausetime ?? 2000));
        this.enableArrows = eval(enableArrows ?? (this.cnt_sld.dataset.enablearrows ?? true));
        this.enableBullets = eval(enableBullets ?? (this.cnt_sld.dataset.enablebullets ?? true));
        this.inheritSize = eval(inheritSize ?? (this.cnt_sld.dataset.inheritsize ?? false));

        //set size
        if( this.inheritSize ){ this.cnt_sld.classList.add('inheritsize'); }

        //get imgs
        var prvSlds = this.cnt_sld.querySelectorAll('img');
        
        //add arrows
        if(this.enableArrows && prvSlds.length>1){

            var arrowLeft = document.createElement('div');
            arrowLeft.classList.add('arrow');
            arrowLeft.classList.add('arrowLeft');
            arrowLeft.classList.add('hidden');
            arrowLeft.innerHTML = '<';
            
            var arrowRight = document.createElement('div');
            arrowRight.classList.add('arrow');
            arrowRight.classList.add('arrowRight');
            arrowRight.classList.add('hidden');
            arrowRight.innerHTML = '>';

            this.cnt_sld.appendChild(arrowRight);
            this.cnt_sld.appendChild(arrowLeft);

        }

        //get arrows
        this.arr_r = this.cnt_sld.querySelector('.arrowRight');
        this.arr_l = this.cnt_sld.querySelector('.arrowLeft');

        //add bullets
        if(this.enableBullets && prvSlds.length>1){

            var cnt_blt = document.createElement('div');
            cnt_blt.classList.add('bullets');
            cnt_blt.classList.add('hidden');

            var blt = document.createElement('div');
            blt.classList.add('bullet');
            cnt_blt.appendChild(blt);
            
            this.cnt_sld.appendChild(cnt_blt);

        }
        
        //get bullets
        this.cnt_blt = this.cnt_sld.querySelector('.bullets');
        this.blts = this.cnt_sld.querySelectorAll('.bullet');

        //set slides
        prvSlds.forEach((prvSld,index) => {

            
            var sld = document.createElement('div');
            sld.classList.add('slide');
            if(index == 0){sld.classList.add('first');}
            if(index == (prvSlds.length - 1)){sld.classList.add('last');}
            sld.style.background = 'url('+prvSld.src+')';
            this.cnt_sld.appendChild(sld);
            prvSld.remove();


        });

        //get slides
        this.slds = this.cnt_sld.querySelectorAll('.slide');

        
        this.autoSlidesTimers = [];

        //set slidewhow
        this.setSlide();


    }

    //first slideshow setting
    setSlide(){


        this.cnt_sld.classList.add('slideshow');


        //display bullets
        if(this.enableBullets && this.slds.length>1){

   
            for(var i = 0; i < this.slds.length; i++){

                
                var newBlt = this.blts[0].cloneNode();          
                newBlt.dataset.index = i;

                newBlt.addEventListener('click',(e) => {

                    if(e.target.dataset.index != this.getCurrentSlide()){

                        var curScroll = parseInt(this.cnt_sld.scrollLeft);
                        var newScroll = e.target.dataset.index * parseInt(getComputedStyle(this.cnt_sld).width);
                        this.slideScroll(newScroll - curScroll);

                    }

                });

                this.cnt_blt.appendChild(newBlt);

            }

            this.blts[0].remove();
            this.blts = this.cnt_sld.querySelectorAll('.bullet');
            this.cnt_blt.classList.remove('hidden');
            this.blts[0].classList.add('current');

        }

        //display arrows
        if(this.enableArrows && this.slds.length>1){

            this.arr_r.classList.remove('hidden');
            this.arr_r.addEventListener('click',() => {this.slideSwipe('r');});
            this.arr_l.addEventListener('click',() => {this.slideSwipe('l');});

        }

        //add hover class
        if(this.hoverPause){

            this.cnt_sld.addEventListener('mouseover',() => {

                if(!this.cnt_sld.classList.contains("hovering")){
                    this.cnt_sld.classList.add("hovering");
                }
            
            });
            
            //rimuovi class hover
            this.cnt_sld.addEventListener('mouseout',() => {

                if(this.cnt_sld.classList.contains("hovering")){
                    this.cnt_sld.classList.remove("hovering");
                }
            
            });

        }

        //update scrolling class
        //update arrows and buttons
        this.cnt_sld.addEventListener('scroll',() => {

            if(!this.cnt_sld.classList.contains("scrolling")){

                this.cnt_sld.classList.add("scrolling");
                setTimeout(() => { this.cnt_sld.classList.remove("scrolling"); }, this.scrollingPauseTime);

            }

            var cur_sld = this.getCurrentSlide();
            if(cur_sld == (this.slds.length - 1)){this.arr_r.classList.add('hidden');}
            else if(this.enableArrows){this.arr_r.classList.remove('hidden');}
            if(cur_sld == 0){this.arr_l.classList.add('hidden');}
            else if(this.enableArrows){this.arr_l.classList.remove('hidden');}

            if(this.enableBullets && this.blts[0]){
                this.cnt_blt.querySelector('.current').classList.remove('current');
                this.blts[cur_sld].classList.add('current');
            }



        });

        //start automatic scroll
        console.log(this.autoScroll);
        if(this.autoScroll){this.slideAuto();}

        
    }

    //get the index of the current visbile slide
    getCurrentSlide(){

        return parseInt( parseInt(this.cnt_sld.scrollLeft) / parseInt(getComputedStyle(this.cnt_sld).width) );

    }

    //manual scroller using pixels
    slideScroll(n){

        this.cnt_sld.scrollBy({left: n,behavior: 'smooth'});

    }

    //scroll to previous/next slide
    slideSwipe(dir = 'r'){

        if(dir=='r'){this.slideScroll(parseInt(getComputedStyle(this.cnt_sld).width));}
        else if(dir=='l'){this.slideScroll(-1 * parseInt(getComputedStyle(this.cnt_sld).width));}

    }

    //set automatic scrolling
    slideAuto(){

        this.autoSlidesTimers[this.id] = setInterval(() => {

            //verifica scrolling e hovering
            if(!this.cnt_sld.classList.contains('hovering') && !this.cnt_sld.classList.contains('scrolling') ){
                if(this.getCurrentSlide() == (this.slds.length - 1)){ this.cnt_sld.scrollLeft = 0; }
                else{this.slideSwipe();}
            }

        }, this.waitTime);

    }



}


