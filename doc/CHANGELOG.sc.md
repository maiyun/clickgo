# 更新日志

# 3.11.32

[+] switch 控件新增 map 参数，可分别自定义选中 / 非选中状态的值。  
[+] list 控件新增 map 参数，可分别映射控件所需的 label、value、children 字段为 data 中的其他 key。

# 3.11.31

[+] text 控件新增 beforechange 事件。  
[\*] 修改 loading 样式。  
[\*] 优化 markdownit 控件。  
[\*] 优化 form 库的 notify 的样式。

# 3.11.30

[+]  tool 库新增 postResponseJson 方法。  
[\*] 优化 markdownit 控件。

# 3.11.27

[+] greatlist 控件新增 change、changed 事件。  
[+] greatselect 控件新增 change、changed 事件。  
[+] list 控件新增 change、changed 事件。  
[+] select 控件新增 change、changed 事件。  
[\*] html 控件现在支持 html 参数中的 style 标签样式。  
[\*] 修复 select 控件在 editable 模式下修改了 data 导致值被更新的问题。

# 3.11.26

[+] 新增 markdownit 控件。

# 3.11.25

[\*] 优化 select 控件。  
[\*] 优化 greatlist 控件。  
[\*] 优化 list 控件。  
[\*] 优化 text 控件的 number 模式。

# 3.11.24

[+] list 控件新增 check 属性。  
[\*] 优化 tuieditor 的粘贴事件。  
[\*] 优化 select 控件。

# 3.11.23

[+] 新增 sgroup 控件。  
[\*] 修复 page 控件的一些问题。  
[\*] 优化 text 控件。

# 3.11.22

[\*] 优化 AbstractControl 类的 slotsAll 方法。  
[\*] 修复 text 控件的 min 和 max 参数为 0 时限制无效的问题。

# 3.11.21

[\*] 优化 debug 模式下部分会有警告的问题。  
[\*] 优化 tip 的内容过宽超出的问题。  
[\*] 修复 text 控件的 number 模式下，点击控制按钮修改值不向上响应的问题。  
[\*] 优化 iconview 控件名称过长超出的问题。

# 3.11.20

[+] AbstractBoot 新增 debug 模式，开启后并在浏览器安装 Vue.js devtools 插件后可通过开发者工具进行调试。

# 3.11.19

[\*] 一些优化。

# 3.11.18

[\*] 修复 group、greatlist、text 控件的一些问题。

# 3.11.17

[+] form 库新增 prompt 方法。  
[+] form 库的 dialog 方法新增 autoDialogResult 参数。

# 3.11.16

[+] 破坏性更新：text 控件去除 multi、password 属性，新增 type 属性，type 内容为 text、password、multi 和 number，默认为 text。  
[+] text 控件新增 max 和 min 属性，在 type 为 number 时可限制数字的最大值与最小值。

# 3.11.15

[+] group 控件新增 title、footer 插槽。  
[+] table 控件新增 label 插槽，可定制头部内容。  
[+] dom 库新增 index 方法。  
[+] check 控件新增 changed 事件。  
[\*] 修改 table 控件的 sort 方法为单一 ITableSortEvent 参数。

# 3.11.14

[+] fs.getContent、task.run 新增 cache 参数，可以以有缓存模式加载应用和文件，加快加载速度。  
[+] greatlist、greatselect、levelselect、list、select、table 控件新增 virtual 参数，默认关闭，开启可使用虚拟 DOM 模式加载超大量数据。  
[+] page 控件新增 control 参数，可以自定义翻页按钮数量，默认为 2。  
[+] list 新增 slot:row，可自定义项的内容。  
[\*] 优化 drawer 控件，使内容竖向超出时不会撑开元素。  
[\*] 优化 form.close 方法，多次关闭相同窗体不会报错了。  
[\*] 修复 video 控件加载时 play 为 true 时不自动播放的问题。  
[\*] 优化全局所有控件当被禁用时鼠标指针将自动变为 not-allowed。  
[\*] 修复 select、greatselect、levelselect 控件禁用时样式不明显的问题。

# 3.11.13

[\*] 修改 tuieditor 默认不自动获得焦点。  
[\*] 优化 drawer 控件的一些行为。

# 3.11.12

[+] 新增 switch 控件。  
[+] text 控件新增 maxlength 参数。  
[\*] img 控件在 src 参数为空时将显示默认图像。  
[\*] 重要：修改了 radio 控件的 event 事件为单一 IRadioChangeEvent 参数。  
[\*] 重要：修改了 check 控件的 event 事件为单一 ICheckChangeEvent 参数。  
[\*] 修复 tuieditor 主动修改值时编辑器内容没有改变的问题。

# 3.11.11

[+] tuieditor 控件新增 imgselect 事件。  
[\*] 修复 levelselect 设置值后不会自动找其他层级当中非异步项的问题。  
[\*] 优化拖拽框样式。  
[\*] 优化某些浏览器环境下不存在 TouchEvent 对象会报错的问题。

# 3.11.10

[+] tip 控件新增 content 插槽。

# 3.11.9

[\*] 更新依赖库。

# 3.11.8

[+] 新增 drawer 抽屉控件。  
[\*] 一些异常问题的优化。

# 3.11.7

[+] AbstractForm 类新增 updateStep 方法，允许处于流程中动态修改流程 value 值。  
[+] 新增 group 控件。  
[+] 新增 title 控件。  
[+] AbstractForm 类新增 formHashData 属性，允许在 formHash 之前传递 data 数据。  
[\*] 修改 greatlist 控件在没有内容显示时的图标。  
[\*] 优化 levelselect 控件设置 v-model 时会自动选择非异步的子项。

# 3.11.6

[+] img 控件新增 direction、gutter、align-h、align-v 参数，并且支持在内部插入标签。  
[\*] 修复某些情况下 :class 报错的问题。  
[\*] 优化 light 主题。

# 3.11.5

[+] label 控件新增 `content` 参数，若存在则会替换掉 slot 的内容，若 mode 为 date 模式，则时间戳必须放置在 `content` 参数内。  
[+] form 库的 showPop 方法新增 flow 参数，可通过设置 false 来排除 pop 进入 pop 流。  
[\*] img、svg 现在支持包裹在自定义控件时的 src 参数可以直接指定自定义控件包内路径，但必须以 `/control/` 开头。  
[\*] 一些代码提示优化。

# 3.11.4

[+] AbstractPanel 类新增 formHashBack、clearQs 方法。  
[+] AbstractPanel 类新增 onShowed 事件。  
[\*] 修改了 AbstractPanel 类的 onShow 事件为 AstractPanelShowEvent，可读取前进、后退状态、上一个路由、qs 是否变化等信息。  
[\*] form 控件的 close、min、max 事件优化为单一参数，可用来判断是否是用户点击了窗体按钮而触发的事件。

# 3.11.3

[+] AbstractPanel 类新增 formHash 属性，用来获取和设置母窗体的 formHash。  
[+] AbstractForm 类新增 sendToPanel 方法，可以给一个 panel 控件发送 data，这本质上是 panel 控件的 send 方法。  
[+] AbstractPanel 类新增 sendToRootPanel 方法，用来给基 panel 控件发送 data，使用延迟调用，实现给跳转后的 panel 发送 data。  
[+] tool 库新增 queryStringify、queryParse 方法。用来序列化/反序列化 query string。  
[+] 新增 tip 控件。

# 3.11.2

[+] AbstractPanel 新增 enterStep、doneStep 方法。  
[\*] 修复了 select 控件默认为 search 模式时不显示文本内容也不显示列表的问题。

# 3.11.1

[+] AbstractForm 类新增 ready 方法。  
[+] AbstractForm 新增 enterStep、doneStep。

# 3.11.0

[+] core 库新增 global 属性，用于获取网页设置的全局 clickgoGlobal 变量。  
[+] 新增 tag 控件。  
[+] panel 控件新增 plain 参数。  
[+] alayout-cell 控件新增 align-v、align-h 参数。  
[+] text 控件的 password 模式新增眼睛图标，可点击隐藏/显示密码。  
[+] text 控件新增 prepend 插槽，用来插入图标和文字。  
[+] text 控件新增 before、after 插槽，用来插入不需要内边距的控件。  
[+] levelselect、greatselect、select 控件都增加了 plain 参数。  
[\*] 修复 levelselect 失去焦点时无法选择项的问题。  
[\*] 修改 levelselect 的 level 事件的 event 对象。  
[\*] 优化 nav 控件使某项被选择时如果处于可视区域外则自动滚动到可视区域内。

# 3.10.4

[\*] 优化 select 控件。

# 3.10.3

[+] levelselect 控件新增 selectLevelValue 方法，用于一次性选择多层值。

# 3.10.2

[+] AbstractPanel 新增 onQsChange 事件。  
[+] list 控件数据新增 color 属性，可设置为 CSS 支持的颜色和 tip 字符串。  
[+] list 控件新增 item 事件，可获取选中的数据对象列表。  
[+] table 控件增加 header 和横向 scroll 超出显示区域时也会显示的特性。  
[+] greatlist 控件增加横向 scroll 超出显示区域时也会显示的特性。  
[\*] 重写 levelselect 事件，请注意相关变化。  
[\*] 修复 iconview 控件卡顿的问题。

# 3.10.1

[+] AbstractForm 默认支持 loading 属性，无需再显示传递给 form 的 loading 参数。  
[+] nav 控件新增 default 属性。  
[+] panel 控件新增 go、went 事件，v-model，map 属性。  
[+] nav 控件新增 hash 属性，用来自动关联 formHash 属性。  
[+] nav 控件新增 qs 事件，当 qs 变更时会触发。  
[+] AbstractControl 新增 rootForm 属性。  
[+] AbstractPanel 新增 qs 属性，可获取当前 nav 传递的 qs 值。  
[+] AbstractPanel 新增 rootPanel 属性，用于获取当前 Panel 的 AbstractControl 对象。  
[\*] nav-item 的 select 事件更新为单参数模式。  
[\*] 修复了 select 控件在手机上无法点击的问题。  
[\*] 其他的一些优化。