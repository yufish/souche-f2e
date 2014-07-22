//loopArray.js
!function(){
    function LoopStack(n){
        this.arr = new Array(n);
        this.len = n;
    }
    LoopArray.prototype={
        constructor:LoopArray,
        push:function(){

        }
    }
}()

//tab.js
!function(){
	//tabNavBar>nav-item
	//nav-item:data-nav-index;
	//tabCover>tabContainer>tabPanel
	//options:{navEvent}
	//tabCover:{overflow:hidden;}
	//tabCtn:{width:numOfPanels*100%;}
	//tabPanel:{width:100/numOfPanels%;float:left;box-sizing:border-box}
	//tabPanel:data-panel-index
	var defaultOptions={niEventType:'touchstart',hMoveOn:true};
	
	var touch_start = 'click';
	if('touchstart' in window){
		touch_start = 'touchstart';
	}
	var transition = 'transition',
		transform='transform';
	if(typeof document.body.style.webkitTransition==='string'){
		transition = 'webkitTransition';
		transform = 'webkitTransform'
	}
	/*else if(typeof document.body.style.MozTransition==='string'){
		transition = 'MozTransition';
		transform = 'MozTransform'
	}*/
	
	function TabLayout($tabNavBar,$tabCover,options){
		//this.tabNavBar = $tabNavBar;
		this.navItems = $tabNavBar.children('.nav-item');
		this.tabCover = $tabCover;
		this.tabCtn = $tabCover.children('.tabContainer');
		this.tabPanels = this.tabCtn.children('.tabPanel');
		this.numOfPanels = this.tabPanels.length;
		//this.options = {};
		//$.extend(this.options,defaultOptions,options);
        this._init();
	}
	TabLayout.prototype = {
		_init:function(){
            this.tabCover.css('overflow','hidden')
			this.tabCtn.css(transition,transform +' 0.6s linear')
                .css({width:this.numOfPanels*100+'%'});
            this.tabPanels.css({width:100/this.numOfPanels+'%',float:'left'})
			this.navItems.on(touch_start,function(){
				var self = $(this);
				var index = +self.attr('data-nav-index');
				this.tabCtn.css(transform,'translateX(-'+index*100+'%)');
			})
		}
	}
}()
