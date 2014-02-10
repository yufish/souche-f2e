##jquery mobile 开发模式和经验

###HTML 页面管理

  * 在页面入口的页面（main.html或者index.html）负责引入所有需要的脚本（pages的脚本用Util.use加载，不用引入）和样式。
  * 其他页面可以统一引入所有的脚本和样式，这样方便单页调试，不过如果在phonegap里运行的应用，其他只需要写body内容即可，因为其他部分代码会被过滤忽略掉。不过如果是在线的页面，需要都写入，不过在线页面不推荐此种架构，参考 [[wiki:f2e:guifan:html5|html5移动页面开发指南]]
  * 页面的基本骨架：

```
<body>
  <div data-role="page" id="index">
    <div data-role="header">
      <a href="index.html" data-icon="back" class="sc-back">返回</a>
      <h1>选择品牌</h1>
    </div>
    <div data-role="content">

    </div>
    <script>
      Index.init({
        index_api:"*******"
      })
    </script>
  </div>
</body>
```

###注意事项

 * 每个页面一个id，勿重复
 * 所有连接不要添加 data-ajax = "false" ,这样会导致页面整体脱离，不能成为单页应用。
 * script标签一定要放在data-role="page"这个div里面，否则容易被过滤掉。

###JS和模块（页面）管理


页面之间的关系并不是依赖关系，而只是互相可能传递数据。

所以不需要具备依赖管理的模块管理工具，严格来说，不是模块，而是页面脚本管理。

最后精简到只需要一个功能：根据文件名加载所有的js。方法存在于Util中。在main.js中引入以下脚本即可。

```
//Util.use(pages,baseUrl) 第一个参数是需要加载的js的名字数组，第二个参数是js相对主文档所在的目录
Util.use([
 'BrandSelector','login','LoginOrReg','Main','mySecondHandCar',
 'popDetailA','popDetailB','popPhoto','PopSuccess',
 'popVin','register','Share',
 'Splash','sysMessage','xuanZeKuanShi'],'../js/pages/')

```
###具体JS规则

1.每个页面一个对应的JS全局对象，对象名驼峰式，首字母大写。

2.每个对象的基本结构如下：

```
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
      Util.mixin(config,_config);
      this._create();
      this._bind();
    },
    _create:function(){
      //创建html结构的功能
    },
    _bind:function(){
      //绑定时间的功能
    }
  }
}();
```


###样式管理

利用less管理页面样式，每个页面分离一个less文件出来，然后再main.less里import，最后会统计编译到css里。

编译工具可以用：http://www.lesscss.net/article/home.html 添加文件后，可以实时编译。

注意：icon在普通和retina屏幕上的大小和效果。

###如果在本地的xcode或者ADT中调试代码

在下载的原生代码中，www中的代码是不完整的（空的）.那如何进行调试呢？

用ln命令 将www中的几个文件夹 连接 到WWWROOT文件夹下的www目录中对应的目录即可。

需要连接的目录和文件：html css js img index.html 

命令：ln -s source target

###phoneGap plugin 开发

###JavaScript调用函数

```
cordova.exec(function(winParam) {}, function(error) {}, "service","action", ["firstArgument", "secondArgument", 42,false]);
```               

###参数详情

 * function(winParam) {}: 执行成功回调函数

 * function(error) {}: 执行错误回调函数

 * "service": 服务名称，映射到对应的类

 * "action": 对应的类中相应处理逻辑的方法

 * [/* arguments */]: 传递到参数

###iOS 插件 

参考：http://docs.phonegap.com/en/3.0.0/guide_platforms_ios_plugin.md.html#iOS%20Plugins

###继承CDVPlugin的OC类
```
    @interface Souche : CDVPlugin
        CDVInvokedUrlCommand *smsCommand;
    @end
    
    @implementation Souche
        -(void)sms:(CDVInvokedUrlCommand*)command{
            smsCommand = command;
        }
    @end
```

###config.xml建立插件映射
```
    <feature name="Souche">
        <param name="ios-package" value="Souche" />
    </feature>
```

     * feature name对应js service 的名称
     * param name永远都是iOS-package
     * value对应OC插件类名

###本地类返回结果
```
CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:string];
[self.commandDelegate sendPluginResult:pluginResult callbackId:smsCommand.callbackId];
```

###android 插件 

参考：http://docs.phonegap.com/en/3.0.0/guide_platforms_android_plugin.md.html#Android%20Plugins

###config.xml建立插件映射
```
<feature name="Souche">
    <param name="android-package" value="com.xiangqu.souche.Souche" />
</feature>
```

     * feature name对应js service 的名称
     * param name永远都是android-package
     * value对应android插件的full_name_including_namespace

###继承CordovaPlugin
```
public class Souche extends CordovaPlugin {
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
       callbackContext.success(param);
    }
}
```


