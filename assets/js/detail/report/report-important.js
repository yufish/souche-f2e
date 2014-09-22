define(function(){

    return {
        init:function(){
            $(".trigger").on("mouseover",function(){
                $(".pics .pic").addClass("hidden");
                var picname = $(this).attr("data-pic");
                if(picname=="pic-5"){
                    $(".pic-main").addClass("hidden")
                }else{
                    $(".pic-main").removeClass("hidden")
                }
                $(".pics").find("."+picname).removeClass("hidden")
            })
        }
    }
})