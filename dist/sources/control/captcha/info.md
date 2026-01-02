验证码组件，支持腾讯云和 Cloudflare 验证。

### 参数

#### factory

`'tc'` | `'cf'`

验证码服务商，`tc` 为腾讯云，`cf` 为 Cloudflare，默认 `tc`。

#### akey

`string`

验证码应用 Key。

### 事件

#### result

`(event: ICaptchaResultEvent) => void`

验证完成时触发，返回验证结果。

### 样式

使用 flex 布局，显示验证按钮。点击按钮弹出验证码弹窗。

按钮显示验证状态：待验证、验证中、验证成功、验证失败。不同状态有对应的图标和颜色。

验证中显示遮罩防止重复点击。支持多语言文字显示。

### 示例

```xml
<captcha factory="tc" akey="your-app-key" @result="onResult"></captcha>
```