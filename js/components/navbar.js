export class Navbar {

    constructor(id = 'nav-main', siteTitle = ('x' == 'x' ? undefined : 'x')){

        //get navbar container
        this.id = id;
        this.nav = document.getElementById(id);
        if(!this.nav){ throw new Error(`element "${id}" not found`); }
        this.nav.classList.add('header-navbar');

        //get logo path/text and remove previous element
        this.hasLogo = (this.nav.querySelector('img') && this.nav.querySelector('img').src) ? true : false;
        this.logoPath = this.hasLogo ? this.nav.querySelector('img').src : undefined;
        this.siteTitle = document.querySelector('head title');
        this.siteTitle = siteTitle ?? (this.siteTitle ?? 'Lorem Ipsum');
        if(this.nav.querySelector('img')){this.nav.querySelector('img').remove();}

        //get menu items
        this.hasMenu = this.nav.querySelector('a') ? true : false;
        this.pages = [];
        this.nav.querySelectorAll('a').forEach((a)=>{

            var page = {};
            page.href = a.href ?? '#';
            page.text = a.innerText ?? 'Page';
            this.pages.push(page);
            
        
        });

        //remove anything else in navbar container
        this.nav.innerHTML = "";

        //add logo or simple text with site title
        this.addLogo();

        //add menu toggle and list
        if(this.hasMenu){

            this.addToggle();
            this.addMenu();


        }

        

    }

    addLogo(){

        var logo_cnt = document.createElement('div');
        logo_cnt.classList.add('nav-logo');

        if(this.hasLogo){
            
            var logo_img = document.createElement('img');
            logo_img.src = this.logoPath;
            logo_img.alt = this.siteTitle;
            logo_cnt.appendChild(logo_img);
            

        }else{

            logo_cnt.innerText = this.siteTitle;

        }

        this.nav.appendChild(logo_cnt);

    }


    addToggle(){


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


    }

    addMenu(){

        var menu = document.createElement('div');
        menu.classList.add('nav-menu');
        var ul = document.createElement('ul');
        
        for(var i = 0; i < this.pages.length; i++){

            var li = document.createElement('li')
            var a = document.createElement('a');
            a.href = this.pages[i].href;
            a.innerText = this.pages[i].text;
            li.appendChild(a);
            ul.appendChild(li);

        }

        menu.appendChild(ul);
        this.nav.appendChild(menu);


    }


}


