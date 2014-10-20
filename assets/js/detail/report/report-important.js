define(function(){
    var PIC_TST_DURATION = 200;

    var toAppear = {
        opacity:1,
        duration: PIC_TST_DURATION
    };
    var toDisappear = {
        opacity:0,
        duration: PIC_TST_DURATION
    };

    return {
        init:function(){
            var lastPic = $(".pics .pic-3");
            var active = function(index){
                if(index=="pic-5"){
                    $(".pic-main").animate(toDisappear)
                }else{
                    $(".pic-main").animate(toAppear)
                }
                lastPic.animate(toDisappear)
                $(".pics").find("."+index).animate(toAppear)
                lastPic = $(".pics").find("."+index)
            }
            $(".trigger").on("mouseover",function(){
//                $(".pics .pic").addClass("hidden");
                clearInterval(timer);
                var picname = $(this).attr("data-pic");
                var index = picname.replace(/[^0-9]/g,"")*1;

                active("pic-"+index);
                for(var i=0;i<arr.length;i++){
                    if(arr[i]==index){
                        nowIndex = i;
                        break;
                    }
                }
            }).on("mouseleave",function(){
                timer = setInterval(function(){
                    nowIndex++
                    active("pic-"+arr[(nowIndex%5)])
                },3000)
            })
            var arr = [3,4,2,5,1]
            var nowIndex = 0;
            var timer = setInterval(function(){
                nowIndex++
                active("pic-"+arr[(nowIndex%5)])
            },3000)
        }
    }
})