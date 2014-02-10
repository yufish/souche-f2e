##前端框架

以下代码均位于 /js/souche.js

###方法
#####Util
 * Souche.Util.mixin(target,source) 混合两个对象，通常用于混合参数配置到默认配置中。
 * Souche.Util.appear(selector,bindFunction) 设置一个事件，只有滚动到selector所在的div位置的时候才会触发。

#####Form
```
  Souche.Form.submit({
    ele:"loginform",
    messages:{
      j_username:{
        required:"请输入您的用户名{0}"
      }
    },
    isAsync:false, //提交方式，默认同步提交，直接提交form，如果设为true，则异步提交
    beforeSubmit:function(){
      return true;
    },
    validateFail:function(message,element){
      $('.error_remind').html(message).show()
    },
    success:function(data){
      
    },
    error:function(msg){
      
    }
  })
```

说明：
  * messages自定义提示信息,用来覆盖默认的提示信息 （optional）
  * ele是form的id
  * isAsync 是否异步提交，true的话可以设置success和error （optional）
  * beforeSubmit 提交前的自定义检查，返回true则继续提交，返回false则阻止提交。 （optional）
  * validateFail 表单检查失败，第一个参数是失败的信息，第二个元素是失败的元素。 （optional）
  * success 异步提交的时候返回信息成功的方法。参数是返回的json对象。注意接口一定要返回正确的json对象，注意双引号和错误的格式。 （optional）
  * error 异步提交时候失败的方法。（optional）

验证信息：

标准的validate插件的配置模式，配置到dom里面。

例如：`<input type="text" id="login_tel" class="login_text_input email" name="j_username" required minlength="2"/> ` 这其中配置了三个信息 一个是class中的email格式验证，另外是必填和最小长度

扩展验证：

  - exactlength 验证字符长度
  - vin 验证车辆vin编码

依赖于：jquery.js , jquery.validate.js

一个最小的提交代码：
```
Souche.Form.submit({
    ele:"loginform",
    validateFail:function(message,element){
      alert(message);
    }
});
```
###UI

##### Select联动

场景：例如省市联动，品牌车系车型信息联动。

依赖：jquery，fed/common.js

使用：
```
Souche.UI.Select.init({
  eles:['sell_brand','sell_set','sell_type'],
  type:"car-subdivision",
  defaultValues:[]
})

```

解释：
  * eles里面的数组是联动元素的id列表；
  * type是数据类型；
  * defaultValues是默认选中的数据的code数组，可以不设置，也可以设置一个或多个，设置后会默认选中这组数据；
  * 每个页面可以多次调用；

##### Souche.UI.CustomDropdown ，自定义样式的下拉框，不带联动。

会自动识别当前select位置，如果下拉后可能被浏览器遮住，会改变下拉框的下拉位置变为上拉。

调用，写入如下html即可：

```
<div class="sc-option" data-ui="dropdown" id="brand_option">
  <div class="sc-option-hd">
    <div class="sc-option-content">请选择价格</div>
    <div class="sc-option-action"><i></i></div>
  </div>
  <ul class="sc-option-list hidden">
    <li>
    <a href="#">5万以下</a>
    </li>
  </ul>
</div>
```

##### minilogin，网站端貌似已经不在使用，现在都是免登陆

需要引入：`<script type="text/javascript" src="<sc:res value="/js/fed/souche.js"/>"></script>`

使用方法：

```
Souche.MiniLogin.checkLogin(function(){
  //登录成功后需要执行的逻辑，此方法一开始会检查是否登录，如果登陆了会直接执行此回调，如果没登陆弹出登录窗口，登录完成后回调用此回调。
  //相当于一个中断，等待iframe里面的成功消息再继续执行
});

```

供iframe里面调用的方法：
```
//关闭弹出窗口
window.parent.window.Souche.MiniLogin.close();

//登录成功后调用的方法
window.parent.window.Souche.MiniLogin.callback();
```