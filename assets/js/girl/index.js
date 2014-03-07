var Index =(function(){
  return {
    init:function(){
      var basepath = 'http://f2e.souche.com/assets/images/girl/';
      var starMap=[
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png',
        'star-cn.png'
      ]

      $('.star .starli').each(function(index,el){
        $(this).click(function(){
          $('.star .detail img').attr('src',basepath+starMap[index]);
        })

      })
    }
  }
})();