export class KromaNavbar {

    /*
    id (string) = navbar element id
    siteTitle (string) = title to display as alt or instead of image logo

    requires basic preexisting html structure with desired data, such as:

        <!--main nav menu-->
        <nav class="kroma-navbar">

            <!--logo-->
            <img src="./src/images/dummy-logo.png">

            <!--menu links-->
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contacts</a>

            <!--profile avatar (see avatar component for reference)-->
            <div class="kroma-avatar" data-size="xl" data-variant="ghost" data-status="online" data-disabled="true" aria-label="Ghost avatar online status">
            <span class="kroma-avatar-status"></span>
            <img src="https://ui-avatars.com/api/?name=Online&background=cccccc&color=5a67d8" alt="User Avatar">
            </div>

        </nav>
    
    */

    constructor(id = 'nav-main', siteTitle = ('x' == 'x' ? undefined : 'x')){

        //get navbar container
        this.id = id;
        this.nav = document.getElementById(id);
        if(!this.nav){ throw new Error(`element "${id}" not found`); }
        if(this.nav.classList.contains('kroma-navbar-set')){ throw new Error(`navbar already set.`); }
        this.nav.classList.add('kroma-navbar-set');

        //get logo path/text
        this.hasLogo = (this.nav.querySelector('img') && this.nav.querySelector('img').src) ? true : false;
        this.logoPath = this.hasLogo ? this.nav.querySelector('img').src : undefined;
        this.siteTitle = document.querySelector('head title');
        this.siteTitle = ( this.nav.dataset.title ?? siteTitle ) ?? (this.siteTitle.innerText ?? '');

        //menu sizing for toggle
        this.menuExtWidth = undefined;
        this.menuIntWidth = undefined;

        //get menu items
        this.hasMenu = document.querySelector('#'+this.nav.id+' > a') ? true : false;
        this.pages = [];
        this.nav.querySelectorAll('#'+this.nav.id+' > a').forEach((a)=>{

            var page = {};
            page.href = a.href ?? '';
            page.text = a.innerText ?? 'Page';
            this.pages.push(page);
            
        
        });

        //get avatar element
        this.hasAvatar = (this.nav.querySelectorAll('.kroma-avatar')).length > 0 ? true : false;
        this.avatar = this.hasAvatar ? this.nav.querySelectorAll('.kroma-avatar')[0].cloneNode(true) : undefined;

        //remove anything else in navbar container
        this.nav.innerHTML = "";

        //add logo or simple text with site title
        this.addLogo();

        //add menu toggle and list
        if(this.hasMenu){

            this.addToggle();
            this.addMenu();
            this.autoToggle();

            //auto add/remove toggle for menu width
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => { this.autoToggle(); this.addUpdAvatar(); }, 200); 
            });

        }


        //add avatar
        this.addUpdAvatar();
      
        
        
        

        

        

    }

    addLogo(){

        var logo_cnt = document.createElement('div');
        logo_cnt.classList.add('nav-logo');

        if(this.hasLogo){
            
            var logo_img = document.createElement('img');
            logo_img.src = this.logoPath;
            logo_img.alt = this.siteTitle;
            logo_cnt.appendChild(logo_img);
            

        }

        var logo_txt = document.createElement('span');
        logo_txt.innerText = this.siteTitle;
        logo_cnt.appendChild(logo_txt);


        this.nav.appendChild(logo_cnt);

    }

    addToggle(){


        if(this.hasMenu){

            var toggle = document.createElement('div');
            

            toggle.classList.add('nav-toggle');
            toggle.addEventListener('click',function(){if(this.classList.contains('show')){this.classList.remove('show');}else{this.classList.add('show');}});

            for(var i = 1; i <= 3; i++){

                var line = document.createElement('span');
                line.id = ('nav-line-'+i);
                line.classList.add('nav-line');
                toggle.appendChild(line);

            }

            this.nav.appendChild(toggle);

            return true;
        
        }

        return false;


    }

    addMenu(){

        if(this.hasMenu){

            var menu = document.createElement('div');
            menu.classList.add('nav-menu');
            var ul = document.createElement('ul');
            
            for(var i = 0; i < this.pages.length; i++){

                var li = document.createElement('li');
                var a = document.createElement('a');
                if(this.pages[i].href.length > 0){ a.href = this.pages[i].href; }
                a.innerText = this.pages[i].text;
                li.appendChild(a);
                ul.appendChild(li);

            }

            menu.appendChild(ul);
            this.nav.appendChild(menu);

            return true;

        }

        return false;


    }

    autoToggle(){

        if(this.hasMenu){

            if(window.innerWidth <= 500){this.nav.classList.add('toggled-menu'); return true;} //always add toggle on mobile
            this.nav.classList.remove('toggled-menu'); //always use full width navbar for calculations
            var menu = document.querySelector('#'+this.nav.id+' .nav-menu');   
            if(!menu){console.error('menu container not found'); return false;}    
            var ul = menu.querySelector(' ul');
            if(!ul){console.error('menu ul not found'); return false;} 
            this.menuExtWidth = parseInt(getComputedStyle(menu).width);
            this.menuIntWidth = parseInt(getComputedStyle(ul).width);
            if(!this.menuExtWidth || !this.menuIntWidth){console.error('menu size cannot be determined');  return false;} 
            if(this.menuExtWidth <= this.menuIntWidth){this.nav.classList.add('toggled-menu'); return true;}
        
        }
            
        return false;

    }

    addUpdAvatar(){

        if(this.hasAvatar){

            //remove previous avatar
            var prevAvatar = this.nav.querySelector('.kroma-avatar');
            if(prevAvatar){prevAvatar.remove();}

            //add avatar before toggle
            if(this.nav.classList.contains('toggled-menu')){

                this.nav.insertBefore(this.avatar, this.nav.querySelector('.nav-toggle'));
                return true;

            }

            //add avatar at the end
            this.nav.appendChild(this.avatar);
        
        }

        return false;

    }
}




//initialize first available
document.addEventListener("DOMContentLoaded", () => {

    window.KromaNavbar = KromaNavbar;
    if(!window.kromaNavs){ window.kromaNavs = []; }
    var domNavs = document.querySelectorAll('.kroma-navbar');
    if(domNavs && domNavs[0]){  

        domNavs[0].id = (domNavs[0].id ?? '').length > 0 ? domNavs[0].id : ( 'kroma-navbar-' + window.kromaNavs.length );
        window.kromaNavs[window.kromaNavs.length] = new KromaNavbar( domNavs[0].id );
        
    }

});