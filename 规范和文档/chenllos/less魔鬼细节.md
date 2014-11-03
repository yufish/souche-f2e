## 魔鬼细节
使用`box-sizing:border-box;`, 这样的盒模型更有利于计算, 在改革的早期不方便全局reset时, 可以现在新页面的主样式文件中引入. 这个reset就不要下放到各个模块中去了, 后期不方便查找哪些还没有实现`border-box`的布局, 不利于添加最终全局reset的可行性的判断.

善于使用`&`, 除了可以减少几个代码字符, 也可以保持嵌套的连贯性. 同时希望在使用`&`时也留一个空行. 示例:

    .parent{
        color: #999;

        &:hover{
            color: @soucheOrange;
        }
        &.active{  // ...  }

        .child-1{  // ...  }
        .child-2{  // ...  }
    }

用伪元素实现/替换小图标等装饰性dom, 如果兼容性要求不那么严格的话(IE7仅可看/可用), 建议使用`:before / :after`实现小图标, 比如尾部的小三角. 可以减少零散的dom元素.

    .with-tail{
        position: relative;
        // some rules

        &:after{
            content: '';
            position: absolute;
            width: @iconW;
            top: 0;
            bottom: 0;
            right: -( @iconW + @dis );
            background-image: url('../images/deial/trangle.png');
            background-repeat: no-repeat;
            background-position: center;
        }
    }

更严谨的规则排序. 本人最开始也对`css rule declaration order`规范不屑一顾(也因为最开始都没有体会出css规则也可以分类的..., 也因为自己看到的文写的不够专业...), 后来试着按照规范来写, 同时自己总结最适合自己的顺序, 慢慢开始习惯和喜欢这样严谨的写代码. 这里有一份[code guide](http://mdo.github.io/code-guide/#css-declaration-order), 可以研读一下. 一下是我个人的理解和总结, 和guide大同小异:
    
    // 不同类型规则之间不用空行
    .target{
        // ------ 定位/显示 这三个属性很少同时出现  -----
        // display
        // position
        // float

        // ------ 盒模型  -----
        // width height
        // padding margin

        // ------ 排版  -----
        // font-size
        // line-hegiht
    
        // ------ 外观  -----
        // color
        // background
        // border

        // ------ mixin  -----
        // .text-collpase
        // .tst
    }

规范好css规则声明顺序后, 在维护时可以很快的定位规则, 也不用遍历所有的规则去查找可能造成某一现象的规则, 因为都剧集在某三行五行内.