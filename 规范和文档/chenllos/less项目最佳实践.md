## 组织结构
良好的文件结构组织和模块划分可以大大增加复用性和可维护性.

    | - less/
    |----- detail/                   ----\
    |----- index/                    ------ #2
    |----- list/                     ----/
    |
    |----- base/                     ----\  #3
    |----- souche/                   ----/
    |
    |---------detail-layout.less     ----\
    |---------index-layout.less      ------ #1
    |---------list-layout.less       ----/
    |

### 1 主样式文件
`./less`目录根一层放页面的主样式文件`pageName-layout.less`, 多少个页面就多少的文件. 一般不会太多. 活动可以在`./less`目录下建`./act`目录, H5端可以建`./mobile`目录, 然后再按该规则组织文件. 这个主样式文件尽量保持内容只有`@import "moduleName.less"`.

### 2 分模块的子样式文件
将各页面的样式代码分成模块, 一般按区域划分(header, aside, main, report等...), 放在文件夹中. 最后由主样式文件import. 当页面过于复杂时, 可以进一步划分为文件夹. 页面内公用的部分可以抽离为`xxx-common.less`.

### 3 base 与 ui-kit
`./base`中放置变量定义`config.less`, 公用函数`mixin.less`, 工具类`tool.less`. 其中工具类中放置的是类似`.clear-flt`等常用的类定义. 短期内变量和公用函数较少, 可以都放置在`config.less`中.

`ui`中放置成型的组件, 如弹出层, 下拉框等. 在组件积累到一定阶段后可以整理为soucheUI库. 到时候工具类也可以放在里面.



## 代码编写
如上所说,主样式文件尽量保持只有`@import`, demo: detail-layout.less
    
    // 引入变量和函数
    @import "base/config.less";
    @import "base/mixin.less";
    // 引入基础类
    @import "base/tool.less";

    // 页面内的各个模块
    @import "detail/detail_main.less";
    @import "base/report/report.less";
    @import "base/detail-mediaquery.less";

其中`detail/report`文件夹再细分模块. 这样书写, 所有的分模块都可以使用config中的变量, mixin中的函数, 而且因为主样式文件在根目录下, 所以所有的img引用都是基于样式根目录的, 可以避免`../`上层文件追溯的错误.

写分模块的时候注意抽离`xxx-common.less`. 以report这样做新页面/模块开发举栗子, 由项目领头人分发模块到不同的人, 大家在参阅设计图的时候注意公用的部分, 论定之后指派一个人去`report-common.less`中去实现, 其余人将这部分跳过, 去实现其他的细节. 负责实现的人务必下好文档(简单的说明也可)和demo, 方便其他人使用.

只在局部使用的变量, 请在文件最开始定义. 在编码过程中发现其公用性不止于此的时候, 可以一层层提高它的层级, 到模块common中, 到页面common中, 最终提升到`base/config.less`中.

建议使用四个空格缩进, 可以更明显的显示层级, 同时强迫自己不要写太深的嵌套. 缩进/嵌套是个好东西, 但也要注意使用有度, 明显的层次嵌套可以和html结构保持同步, 但是太深的层次也有弊端: 后期维护时通过权重覆盖原来的样式时要追溯所有的层次; 太深的层次也会造成css代码量的增加. 总之要有个度量, 这个度量需要个人自己控制, 自己细细体会.

建议在本元素和子元素的样式定义间留一个空行, 同样是方便区域/层次的划分.