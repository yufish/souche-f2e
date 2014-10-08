define(function(){

    return {
        init:function(){
            var lastPic = $(".pics .pic-1");
            var active = function(index){
                if(index=="pic-5"){
                    $(".pic-main").animate({
                        opacity:0
                    })
                }else{
                    $(".pic-main").animate({
                        opacity:1
                    })
                }
                lastPic.animate({
                    opacity:0
                })
                $(".pics").find("."+index).animate({
                    opacity:1
                })
                lastPic = $(".pics").find("."+index)
            }
            $(".trigger").on("mouseover",function(){
//                $(".pics .pic").addClass("hidden");
                var picname = $(this).attr("data-pic");
                nowIndex = picname.replace(/^[0-9]/g,"")*1-1;
                active(picname)
            })
            var arr = [3,4,2,5,1]
            var nowIndex = 0;
            setInterval(function(){
                nowIndex++
                active("pic-"+arr[(nowIndex%5)])
            },3000)
        }
    }
})