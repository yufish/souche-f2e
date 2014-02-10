###基础

html有一些固定的基本结构。也就是整体框架，例如：

```
<!doctype html>
<html>
    <head>
        <meta charset="" />
        <title>页面名称</title>
        <link rel="stylesheet" href="css_example_url" />
        <script src="js_example_url"></script>
    </head>
    <body id="page_name">
      <div id="header">
          页头
      </div>
      <div id="content">
          主体
      </div>
      <div id="footer">
          页尾
      </div>
      <script src="页面脚本url">
      <script>
          //你的代码，代码入口
      </script>
    </body>
</html>

```

这是最基本的页面结构，还有一些内部的固定全局命名，例如：header里面的`nav（导航）``subNav（子导航）``topNav（顶部导航）`

例如一个模块里一般会加一个div，叫做wrapper，用来包裹内容，方便做一些padding之类的操作。

其他的可以参考现在一些页面里的名称定义。

###模块化。


###一些准则
 * 避免使用常用词做局部的class，特别是表示位置的词，例如left，right之类的class。不过可以用lft，rht之类的缩写代替。
 * 除了主结构用id外，所有页面的样式尽量使用class，而不要使用id。
 * 需要为html元素添加自定义属性的时候，使用以”data-“为前缀的命名方式，如需要添加json数据接口，定义属性名为：data-xx【xx的内容如果是多个单词使用驼峰的方法】
 * 命名使用英文，使用简写时请保证一目了然，必要时请加上注释

 * id名独一无二，禁止重复，多单词使用驼峰法命名（首单词首字母小写，其余单词首字母大写），如shopName
 * class名 多单词也使用驼峰法命名（首单词首字母小写，其余单词首字母大写），如shopName
 * js引用的id钩子统一使用“J_”开头，后面每个单词首字母大写，如J_ShopName
 * js使用的class钩子，统一使用“j_”开头，后面每个单词首字母大写，如j_ShopName

 * 注意图片的alt。
