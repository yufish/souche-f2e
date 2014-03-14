var List = function() {
    var config = {
            page:1,
            moreURL:""
    }
    var tpl_cars;
    var loadMore = function(){
       SM.LoadingTip.show("正在加载中")
       $.ajax({
         url:config.moreURL+"&index="+(++config.page),
         dataType:"json",
         success:function(data){
             console.log(data)
             var html = Mustache.render (tpl_cars,{cars:data.page?data.page.items:[],yushouCars:data.yushouPage?data.yushouPage.items:[]})
             $(".cars").append(html)
             if(data.totalPage==config.page){
                 $("#load_more").addClass("hidden")
             }
             SM.LoadingTip.hide();
         },
         error:function(){
             SM.LoadingTip.hide();
         }
       }) 
    }
    return {

        init : function(_config) {
            for ( var i in _config) {
                config[i] = _config[i]
            }
            tpl_cars = $("#tpl_cars").html();
           this.bind() 
        },
        bind:function(){
            $("#filter").css("left",-$(window).width())
            $("#list .filter .t").on("click",function(e){
            		setTimeout(function(){
                        $("#content").css("height",0)
                    },400)
                    $("#filter").animate({left:0},300)
                    $("html,body").scrollTop(0)
                    // $("#filter .action").css({
                    //         top:$(window).height()+$(window).scrollTop()-70
                    //     })
                    window.history.pushState({time:new Date().getTime()},"",window.location.href.replace(/#filter/g,"")+"#filter");
                    $("#xuan").addClass("hidden")
                
            })
            $("#xuan").on("click",function(e){
                e.preventDefault()
               // if($("#filter").height()<$(window).height()){
                    //$("#filter").css("height",$(window).height())
                //}
                setTimeout(function(){
                    $("#content").css("height",0)
                },400)
                $("#filter").animate({left:0},300)
                $("html,body").scrollTop(0)
                // $("#filter .action").css({
                //         top:$(window).height()+$(window).scrollTop()-70
                //     })
                window.history.pushState({time:new Date().getTime()},"",window.location.href.replace(/#filter/g,"")+"#filter");
                $("#xuan").addClass("hidden")
            })
            $("#filter .back").on("click",function(){
                $("#filter").animate({left:-$(window).width()},300)
                $("#content").css("height","auto")
                $("#xuan").removeClass("hidden")
            })
            $("#load_more").on("click",function(e){
                e.preventDefault();
                loadMore();
            })
            
            window.onpopstate=function()
            {
                
                if(window.location.hash!="#filter"){
               // $("#filter").css("left",-$(window).width())
                $("#filter").animate({left:-$(window).width()},300)
                $("#content").css("height","auto")
                $("#xuan").removeClass("hidden")
                }
                
            }
            if(window.location.hash=="#filter"){
                setTimeout(function(){
                    $("#content").css("height",0)
                },400)
                // $("#filter").css("left",0)
                $("html,body").scrollTop(0)
                $("#filter").css({left:0})
                $("#xuan").addClass("hidden")
                // $("#filter .action").css({
                //         top:$(window).height()+$(window).scrollTop()-70
                //     })
            }
            // $(window).on("scroll",function(e){
            //     if($("#filter").offset().left==0){
            //         $("#filter .action").css({
            //             top:$(window).height()+$(window).scrollTop()-70
            //         })
            //     }
            // })
        }

    }
}();

var Filter = function() {
    var filters = {
        carBrand : null,
        carSeries : null,
        carPrice : null,
        carModel : null,
        carMileage : null,
        carYear : null,
        carTime:null,
        saleType:null
    }
    var options = {
        sellType : null,
        isFenqi : null
    }
    var config = {
        sortName : "",
        sortType : "",
        baseURL:""
    }
    var showFilters = function(){
        var html = "";
        for(var i in filters){
            if(filters[i]){
                $("#"+i).parent().find(".value").html(filters[i].name)
                html+='<a class="item" data-id="'+i+'">'+filters[i].name+'<s class="close" href=""><span></span></s></a>'
            }else{
                $("#"+i).parent().find(".value").html("")
            }
            
        }

        $("#filter_list").html(html)
    }
    var resetFilters = function(){
           filters = {
            carBrand : null,
            carSeries : null,
            carPrice : null,
            carModel : null,
            carMileage : null,
            carYear : null,
            carTime:null,
            saleType:null
        } 
        showFilters();
    }
    var historyKey = 'filter_history'
    var historys = []
    var checkFilterEqual = function(a1,a2){
    	var r = true;
    	
    		for(var i in a1){
    			try{
        		if(a1[i]!=a2[i]){
        			if(a1[i]==null){
        				r = false
        			}else if(a2[i]==null){
        				r = false;
        			}else{
        				if(a1[i].code!=a2[i].code){
        					r = false;
        				}
        			}
        		}
    			}catch(e){
    	    		alert(e)
    	    	}
        	}
    	
    	
    	return r;
    }  
    var buildHistory = function(){
         historys = historys.splice(0, 5);
         if(historys.length!=0){
            $("#history_group").html("")
         }
        historys.forEach (function(history){
            var _filters = [];
            for(var i in history.filters){
                if(history.filters[i]){
                    _filters.push(history.filters[i].name)
                }
            }
            
            // $("#history").append($("<option value='"+JSON.stringify(history)+"'>"+filters.join("+")+"</option>"))
            var option = $("<div class=option data-attr='"+JSON.stringify(history)+"''><div class=name >"+_filters.join("+")+"</div><i></i></div>")
            option.on("click",function(){
                var d = JSON.parse($(this).attr("data-attr"))
               filters =d.filters
               showFilters();
               window.location.href=config.baseURL+(function(){
                    var params = []
                    for(var i in filters){
                        if (filters[i]){
                            params.push(i+"="+filters[i].code)
                        }else{
                            params.push(i+"=")
                        }
                    }
                    return params.join("&")
                })();
            })

            $("#history_group").append(option)
        })
        
    }
    var buildSeries = function(brand_code){
    	 $("#carSeries").html("<option>选项正在加载中，请稍候</option>")
        $.ajax({
            url:config.seriesURL,
            type:"post",
            data:{
                request_message:'{"code":"'+brand_code+'","type":"car-subdivision"}'
            },
            dataType:"json",
            success:function(data){
            	$("#carSeries").html("<option>-请选择-</option>")
                for(var i in data.codes){
                	
                    var optgroup= $('<optgroup label="'+i+'"/>');
                    data.codes[i].forEach(function(c){
                        optgroup.append("<option value="+c.code+">"+c.name+"</option>")
                    })
                    $("#carSeries").append(optgroup)
                }
            }
        })
    }
    return {
        
        init : function(_config) {
            for ( var i in _config) {
                config[i] = _config[i]
            }
            this.bind();
            try{
                historys = JSON.parse(localStorage.getItem(historyKey))
                if(!historys||!historys.length) throw new Error("error")
            }catch(e){
                historys = []
            }
            buildHistory()
            //初始化

            filters = {
            carBrand : null,
            carSeries : null,
            carPrice : null,
            carModel : null,
            carMileage : null,
            carYear : null,
            carTime:null,
            saleType:null
        } 
           
        for(var i in filters){
            if(_config.defaultParams[i]&&_config.defaultParams[i].name){
                filters[i]=_config.defaultParams[i]
                if(i=="carBrand"){
                    buildSeries(filters[i].code)
                }
            }
        }
        showFilters();
        },
        bind : function() {
            var self = this;
            Souche.UI.Select.init({
            eles:['carBrand','carSeries'],
            type:"car-subdivision",
            defaultValues:[]
            })
            for ( var id in filters) {
                $("#" + id).on("change", function() {
                    if (this.value !== "") {
                        filters[this.id] = {
                            code : this.value,
                            name : this.options[this.selectedIndex].innerHTML
                        }
                    } else {
                        filters[this.id] = null;
                    }
                    
                    

                    if(this.id=="carBrand"){
                    	filters["carSeries"] = null;
                        buildSeries(this.value)
                    }
                    showFilters();
                })
            }
            $("#filter_list").on("click",function(e){
                e.preventDefault();
                if($(e.target).hasClass("item")||$(e.target).hasClass("close")){
                	var dataid = $(e.target).attr("data-id")||$(e.target.parentNode).attr("data-id")
                    filters[dataid]=null
                    if(dataid=="carBrand"){
                        filters['carBrand']=null
                        filters['carSeries']=null
                        $("#carSeries").html("")
                    }
                    //
                    $("#"+$(e.target).attr("data-id")).find("option").attr("selected",false)
                }
                showFilters();
            })
            $("#reset_filters").on("click",function(){
                resetFilters();
            })
            $("#submit_filters,#submit_filters2").on("click",function(){
            	var isIn = false;
                for(var i=0;i<historys.length;i++){
                	
                	if(checkFilterEqual(historys[i].filters,filters)){
                		historys.splice(i,1)
                	}
                }
                	historys.unshift({
                        filters:filters,
                        options:options
                    })
                    historys = historys.splice(0, 5);
                	try{
                		 localStorage.setItem(historyKey,JSON.stringify(historys))
                	}catch(e){
                		
                	}
                   
                
                window.location.href=config.baseURL+(function(){
                    var params = []
                    for(var i in filters){
                        if (filters[i]){
                            params.push(i+"="+filters[i].code)
                        }else{
                            params.push(i+"=")
                        }
                    }
                    return params.join("&")
                })();
            })
            $("#history").on("change",function(){
               var d = JSON.parse(this.value)
               console.log(d.filters)
               filters =d.filters
               showFilters();
            })
            // $(window).on("resize",function(){
            //     if($("#filter").height()<$(window).height())
            //     $("#filter").css("height",$(window).height())
            // })
        }
    }
}();