# 更新日志

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