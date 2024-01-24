# 更新日志

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