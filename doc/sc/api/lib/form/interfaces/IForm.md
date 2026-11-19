[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IForm

# Interface: IForm

Defined in: [lib/form/types.ts:51](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L51)

运行时 task 中的 form 对象

## Properties

### closed

> **closed**: `boolean`

Defined in: [lib/form/types.ts:56](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L56)

是否已经执行过了关闭窗体方法，此处加判断为了防止重复执行 close 导致的 bug

***

### dialog?

> `optional` **dialog?**: `object`

Defined in: [lib/form/types.ts:58](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L58)

本次模态的返回值、打开前的焦点和层级，隐藏后释放

#### bottomMost

> **bottomMost**: `boolean`

#### finish

> **finish**: () => `void`

##### Returns

`void`

#### focus

> **focus**: `string` \| `null`

#### result

> **result**: `Promise`\<`string`\>

#### topMost

> **topMost**: `boolean`

***

### id

> **id**: `string`

Defined in: [lib/form/types.ts:52](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L52)

***

### vapp

> **vapp**: [`IVApp`](../../core/interfaces/IVApp.md)

Defined in: [lib/form/types.ts:53](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L53)

***

### vroot

> **vroot**: [`IVue`](../../core/interfaces/IVue.md)

Defined in: [lib/form/types.ts:54](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L54)
