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
             console.log(data.cars.items)
             var html = Mustache.render (tpl_cars,{cars:data.cars?data.cars.items:[]})
             $(".common-cars").append(html)
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
            $("#load_more").on("click",function(e){
                e.preventDefault();
                loadMore();
            })
            
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
