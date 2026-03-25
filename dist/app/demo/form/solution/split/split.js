import * as clickgo from 'clickgo';
import * as pUser from './part/user';
import * as pOrder from './part/order';
import * as pProduct from './part/product';
/**
 * --- 演示 form 分包模式 ---
 * 通过 TypeScript mixin 将 form 的 data 和方法拆分到分包文件中，
 * 每个分包文件导出一个 mixin 函数，主 form 通过逐步组合构建基类。
 *
 * 分包规则：
 * 1. 分包文件在 part 目录下，表示非独立 form，仅作为 mixin 片段
 * 2. 每个分包导出 xxxMixin 函数和 IXxxMixin 接口
 * 3. 若分包 B 需访问分包 A 的属性，在 B 的 TConstructor 约束中加入 IA 接口即可
 * 4. 主 form 用逐步赋值方式组合，每步 TS 类型均可正确推导，无论分多少包
 * 5. 若分包需反向读取主 form 的属性/方法，在 core.ts 声明 ISplitForm 接口，
 *    分包内通过 (this as unknown as ISplitForm) 进行有类型的访问
 *
 * 若继续拆分，只需追加一行：
 * const base4 = mixin4Part.mixin4(base3);
 * 然后将 extends base4 即可，不影响其他分包。
 */
// --- 逐步组合分包，可无限追加，不会形成嵌套地狱 ---
const base1 = pUser.userMixin(clickgo.form.AbstractForm);
const base2 = pOrder.orderMixin(base1);
const base3 = pProduct.productMixin(base2);
// --- implements ISplitForm 保证主 form 实现了对分包承诺的接口契约 ---
// --- /* AbstractForm */ 注释需在 implements 之前，否则 tsc 删除 implements 子句时会连带删掉注释 ---
export default class extends base3 /* AbstractForm */ {
    /** --- 分包可通过 ISplitForm.greeting 读取本属性 --- */
    greeting = 'Hello from split.ts';
    /**
     * --- 分包可通过 ISplitForm.getFormTitle() 调用本方法 ---
     * @returns 含当前用户名的标题字符串
     */
    getFormTitle() {
        return `Split Demo (${this.userName})`;
    }
    onMounted() {
        this.loadUser().catch(() => { });
    }
}
