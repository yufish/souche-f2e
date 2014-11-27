(function(){
        if(!window.console){window.console ={log:function(){}};return;}
        var me = 19;
      var Star = function(){
        this.x=0;
        this.speed = 1;
        this.y=0;
      }
      var score = 0;
      var strs = function(){
        var result = '';
        for(var i=0;i<20;i++){
        result+="\n"
          for(var n =0;n<40;n++){
            var now = '一'
            if(i==19&&n==me){
              now="码"
            }
            if(i==19&&n==me+1){
              now="农"
            }
            stars.forEach(function(star){
              var x= Math.floor(star.x);
              var y = Math.floor(star.y)
              if(x==n&&y==i){
                if(Math.abs(star.y-19)<1&&(n==me||n==me+1)){
                  die()
                }
                now="车"
              }
            })
            result+=now;
            
          }
          
        }
        result+="       《全民躲车车》得分："+score
        return result;
      }
      window.onkeydown = function(e){
        if(e.keyCode==37){
          me-=1;
          if(me<0) me=0;
        }else if(e.keyCode==39){
          me+=1
          if(me>38) me=38
        }
      }
      var count=0;
      var die = function(){
        clearInterval(timer1)
        clearInterval(timer2)
        clearInterval(timer3)
        setTimeout(function(){
          console.log("游戏结束，您的得分："+score+",分享到微博：%o","http://service.weibo.com/share/share.php?url=http%3A%2F%2Fsouche.com&pic=http%3A%2F%2Fsouche.cdn.aliyuncs.com%2Fimages%2Faaaa.gif&title=%E6%88%91%E5%9C%A8%E3%80%90%E5%A4%A7%E6%90%9C%E8%BD%A6%E3%80%91%E7%8E%A9%E7%A0%81%E5%86%9C%E4%B8%93%E6%9C%89%E6%B8%B8%E6%88%8F%E3%80%8A%E7%A0%81%E5%86%9C%E8%BA%B2%E8%BD%A6%E8%BD%A6%E3%80%8B%E8%8E%B7%E5%BE%97%E4%BA%860%E5%88%86%2C%E5%BF%AB%E6%9D%A5%E6%8C%91%E6%88%98%E6%AF%94%E6%AF%94%E7%9C%8B%E3%80%82%E7%94%A8%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80www.souche.com%E9%A6%96%E9%A1%B5%EF%BC%8C%E6%89%93%E5%BC%80%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%E7%9A%84%E6%8E%A7%E5%88%B6%E5%8F%B0%EF%BC%8C%E8%BE%93%E5%85%A5start()%3B%E5%9B%9E%E8%BD%A6%EF%BC%8C%E7%84%B6%E5%90%8E%E6%8C%89%E7%85%A7%E6%8F%90%E7%A4%BA%E5%8D%B3%E5%8F%AF%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F%E3%80%82%40%E5%A4%A7%E6%90%9C%E8%BD%A6")
        },100)
        
      }
      var stars = []
      var appearP = 1
      var timer1,timer2,timer3;
      var begin = function(){
        timer1 = setInterval(function(){
          var createCount=Math.floor(Math.random()*5*appearP)
          for(var i=0;i<createCount;i++){
            var star = new Star();
          star.x = Math.floor(Math.random()*40)
          star.y = 0;
          star.speed = Math.random()*appearP;//Math.floor(Math.random()*3+1)
          stars.push(star)
          }
          
        },1000)
        timer2 = setInterval(function(){
          stars.forEach(function(star,i){
            star.y+=star.speed;
            if (star.y>=31){
              stars.splice(i,1);
              score++
            }
          })
          console.log(strs())
          count++;
          if(count>300){
            console.clear()
              count = 0;
          }
        },100)
        timer3 = setInterval(function(){
          appearP*=1.1
        },3000)
      }
      console.log("输入 start(); 后即可开始《码农躲车车》游戏！")
      window.start = function(){
      appearP=1.1
      starts=[];
      score=0;
      me = 19;
      count = 0;
        console.log("%c请先用鼠标点击一下页面，游戏需要捕捉桌面上的键盘事件！","font-size:16px;color:#ff6700;")
        console.log("使用键盘左右键移动最下方的码农，躲开所有的汽车，汽车数量和速度会一直增加，看看谁坚持的最久吧！")
          
          var countdown = 6;
          setTimeout(function(){
            if(countdown--<=1){
            begin();
            }else{
            console.log(countdown)
            setTimeout(arguments.callee,1000)
            }
            },1000)
         return ("倒计时！")
      }
        })();