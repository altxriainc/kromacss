export class KromaSidebar {

    /*
    id (string) = navbar element id
    siteTitle (string) = title to display as alt or instead of image logo

    requires basic preexisting html structure with desired data, such as:

    <!--main sidebar menu-->
    <div class="kroma-sidebar" data-title="The Sidebar">

        <!--logo img-->
        <img src="./src/images/star.png">

        <!--menu links-->
        <i class="fa-solid fa-home"></i>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contacts</a>

        <!--menu links with children-->
        <a>Profile</a>
        <a data-child="true" href="#">Login</a>
        <a data-child="true" href="#">Register</a>


    </div>
    
    */

    constructor(id = 'sdb-main', title = ('x' == 'x' ? undefined : 'x')){

        //get sidebar container
        this.id = id;
        this.sdb = document.getElementById(id);
        if(!this.sdb){ throw new Error(`element "${id}" not found`); }
        if(this.sdb.classList.contains('kroma-sidebar-set')){ throw new Error(`sidebar already set.`); }
        this.sdb.classList.add('kroma-sidebar-set');
        this.sdb.classList.add('collapsed');

        //get logo path/text
        this.hasLogo = (this.sdb.querySelector('img') && this.sdb.querySelector('img').src) ? true : false;
        this.logoPath = this.hasLogo ? this.sdb.querySelector('img').src : undefined;
        this.siteTitle = document.querySelector('head title');
        this.siteTitle = ( this.sdb.dataset.title ?? title ) ?? (this.siteTitle.innerText ?? '');


        //get menu items
        this.hasMenu = this.sdb.querySelector('a') ? true : false;
        this.pages = [];
        this.sdb.querySelectorAll('a').forEach((a)=>{

            var page = {};
            page.href = a.href ?? '';
            page.text = a.innerText ?? 'Page';
            page.title = page.text;
            page.icon = a.previousElementSibling;
            if(!page.icon || (page.icon.tagName ?? '') != 'I' ){
                page.icon = document.createElement('i');
                page.icon.classList.add('fa-solid');
                page.icon.classList.add('fa-link');
            }
            page.isChild = eval(a.dataset.child ?? false);
            this.pages.push(page);
            
        });

        //remove anything else in navbar container
        this.sdb.innerHTML = "";

        //add logo or simple text with site title
        this.addLogo();

        //add menu toggle and list
        if(this.hasMenu){

            
            this.addMenu();

        }

        this.addToggle();

        

    }

    addLogo(){

        var logo_cnt = document.createElement('div');
        logo_cnt.classList.add('sdb-logo');

        if(this.hasLogo){
            
            var logo_img = document.createElement('img');
            logo_img.src = this.logoPath;
            logo_img.alt = this.siteTitle;
            logo_cnt.appendChild(logo_img);

        }

        var logo_txt = document.createElement('span');
        logo_txt.innerText = this.siteTitle;
        logo_cnt.appendChild(logo_txt);

        this.sdb.appendChild(logo_cnt);

    }

    addToggle(){


        var toggle = document.createElement('div');
        

        toggle.classList.add('sdb-toggle');
        toggle.addEventListener('click',function(){if(this.closest('.kroma-sidebar').classList.contains('collapsed')){this.closest('.kroma-sidebar').classList.remove('collapsed');}else{this.closest('.kroma-sidebar').classList.add('collapsed');}});

        var arrow = document.createElement('i');
        arrow.classList.add('fa-solid');
        arrow.classList.add('fa-chevron-right');
        arrow.classList.add('sdb-arrow');
        toggle.appendChild(arrow);

        this.sdb.appendChild(toggle);


    }

    addMenu(){

        var menu = document.createElement('div');
        menu.classList.add('sdb-menu');
        var ul = document.createElement('ul');

        var lastIdParent = 0;
        
        for(var i = 0; i < this.pages.length; i++){

            var li = document.createElement('li');

            //parent page
            if(!this.pages[i].isChild){
                li.classList.add('parent');
                lastIdParent = i;
                li.dataset.myid = i;
                li.addEventListener('click',function(){

                    var children = this.closest('.kroma-sidebar').querySelectorAll('a[idparent="'+this.dataset.myid+'"]');
                    if(children){
                        children.forEach(function(a){

                            if(a.classList.contains('visible')){a.classList.remove('visible');}else{a.classList.add('visible');}

                        });
                    }

                });
            }

            //child page
            else{

                li.dataset.idparent = lastIdParent;

            }
            var a = document.createElement('a');
            var aSpan = document.createElement('span');
            if(this.pages[i].href.length > 0){ a.href = this.pages[i].href; }
            a.title = this.pages[i].title;
            aSpan.innerText = this.pages[i].text;
            a.appendChild(this.pages[i].icon);
            a.appendChild(aSpan);
            li.appendChild(a);
            ul.appendChild(li);

        }

        menu.appendChild(ul);
        this.sdb.appendChild(menu);


    }


    


}


//initialize first available
document.addEventListener("DOMContentLoaded", () => {

    window.KromaSidebar = KromaSidebar;
    if(!window.kromaSides){ window.kromaSides = []; }
    var domSides = document.querySelectorAll('.kroma-sidebar');
    if(domSides && domSides[0]){  

        domSides[0].id = (domSides[0].id ?? '').length > 0 ? domSides[0].id : ( 'kroma-sidebar-' + window.kromaSides.length );
        window.kromaSides[window.kromaSides.length] = new KromaSidebar( domSides[0].id );
        
    }

});


