/**
 * 让dom的文字里的数字变化动起来。
 *
 * NumAnimate.animateInnerHTML($(".num"),"2万");
 */
define(function(){
    return {
        animateInnerHTML:function($ele,to){
            var from = $ele.html();
            var num_from = from.replace(/[^-0-9]/g,"");
            var num_to = to.replace(/[^-0-9]/g,"");
            if(num_from!==""&&num_to!==""){
                num_from = num_from*1;
                num_to = num_to*1;
                if(num_from-num_to>50||num_from-num_to<-50){
                    $ele.html(to)
                }else if(num_from<num_to){
                    setTimeout(function(){
                        if(num_from<num_to){
                            num_from++;
                            $ele.html(from.replace(/[-0-9]+/g,num_from))
                            setTimeout(arguments.callee, 10)
                        }
                    },10)
                }else{
                    setTimeout(function(){
                        if(num_from>num_to){
                            num_from--;
                            $ele.html(from.replace(/[-0-9]+/g,num_from))
                            setTimeout(arguments.callee, 10)
                        }
                    },10)
                }

            }else{
                $ele.html(to)
            }

        },
        animateValue:function($ele,to){

        }
    }
})