###JS规范

所有页面都应该引入如下js：

```
/js/common/jquery-1.7.1.min.js
/js/fed/souche.js
```

也就是所有JS都基于这二者，其中jquery.js 提供基础的dom操作，souche.js 提供一些基本的工具组件。这并非业界的最佳实践，只是在我们业务比较简单的情况下的简单方案。

souche.js中有注释，部分文档在这里：http://wiki.souche.com/doku.php?id=wiki:f2e:framework

###基本规范

  * 通用的js引用在页面顶部的head标签中。
  * 每个类型相似的页面使用一个单独的js文件，称为 页面JS。负责页面级别的功能和交互。页面js放在页面最底下，body结束之前，统计代码之前。
  * 尽量不要在html中夹杂内联的script，特殊情况除外，内联js不是魔鬼，需灵活运用，而不是一巴掌拍死。重耦合和不耦合都是极端，适当耦合。
  * 全站基于jquery开发，jquery的主要角色是dom操作，关于一些页面效果，大部分自己来实现，尽量不引入其他依赖，例如首页的slide之类的可以引入一个jquery插件来实现。

###js脚本的基本结构

并不排斥更先进的代码结构，以下所述也不一定是业界最佳，只是为了团队合作的便利性，所以制定这些指导。

#####1.页面js的基本结构：


```
//单例的页面js，在普通前端页面中的“页面脚本”中，一般都是单例，代表整个页面。
//例如详情页叫detail，则定义一个detail.js，其中返回一个Detail的单例对象。
var Example = function(){
  //接口配置和其他配置信息
  var config = {
    xx_api:""
  };
  //局部变量，局部方法，
  var checkUser = function(user){
    if(user=="sb"){
      return true;
    }
  }
  return {
    //总入口，在页面底部调用
    init:function(_config){
      //混合配置
      Souche.Util.mixin(config,_config);
      this._create();
      this._bind();
    },
    _create:function(){
      //创建html结构的功能
    },
    _bind:function(){
      //绑定事件的功能
    }
  }
}();
```

#####2.页面中的引用和调用

例如：详情页，页面脚本的名字就叫detail.js 在detail.jsp中得最后引入此js，然后下面跟一个调用页面单例对象的script脚本，将一些动态参数传进去。

```
<script src="<sc:res value="/js/mob/detail.js"/>"></script>
<script>
    Detail.init({
        isLoginURL:"<c:url value="/pages/evaluateAction/isLogin.json" />",
        loginURL:"<c:url value="/pages/mobile/login.html?redirect=" />"+encodeURIComponent(window.location.href),
        reportURL:"<c:url value="/pages/mobile/report.html?carId=${views.saleInfo.id }&ajax=1" />"
    })
</script>
```