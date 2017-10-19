# 中文
## 简介
全新重构！年度巨献！  
快速优雅的构建管理面板，拥有大量常用组件，XML标准化编写，界面代码完全分离，快速构建后台应用。  
重磅：一次编写，电脑手机同时支持访问！  
  
## 依赖别的第三方库吗
不依赖。  
  
## 类似 Desktop 开发风格
虽然是个前端库，使用的是类似 Desktop 程序的编写风格，只需要在页面引用 deskui.min.js 和 deskui.min.css 即可进行使用。  
  
## 命名空间
每个 Page 的命名空间相互独立，您定义的 class 和 id 名可以和别的页面重复而且互相不影响。这同样作用于 js，在 js 代码中，定义的变量也互相不影响。
  
## 例子
以下例子展示了一个简单的页面：  
  
```xml
<Page>
    <Style>
        .btns{margin-top: 10px; padding: 10px;}
        .btns > Button{margin-right: 10px; flex: 1;}
        .btns > Button:last-child{margin-right: 0;}
    </Style>
    <FlexRow class="btns">
        <Button text="Button 1"></Button>
        <Button text="Button 2"></Button>
        <Button text="Button 3"></Button>
    </FlexRow>
</Page>
```