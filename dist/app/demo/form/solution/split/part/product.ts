import * as clickgo from 'clickgo';

import * as pUser from './user';
import * as pOrder from './order';

/**
 * --- AbstractForm + IUserMixin + IOrderMixin 的构造器类型约束 ---
 * 加入前两个分包的 interface，使本 mixin 内部可通过 this 访问它们的属性
 */
type TConstructor<T = clickgo.form.AbstractForm &
    pUser.IUserMixin &
    pOrder.IOrderMixin
> = abstract new (...args: any[]) => T;

/**
 * --- 商品相关 mixin，将 product 功能模块注入到 form class 中 ---
 * 通过 TConstructor 约束，this 同时具有 AbstractForm、IUserMixin、IOrderMixin 的类型
 */
export function productMixin<
    TBase extends TConstructor<clickgo.form.AbstractForm>
>(base: TBase): TBase & TConstructor<IProductMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements IProductMixin {

        public productName = '';

        /**
         * --- 添加商品 ---
         */
        public async addProduct(): Promise<void> {
            this.loading = true;
            await clickgo.tool.sleep(600);
            // --- 跨分包同时访问 _user.ts 的 userName 和 _order.ts 的 orderId ---
            this.productName = `${this.userName}:${this.orderId}-product`;
            this.loading = false;
        }

    }

    return Mixed as unknown as TBase & TConstructor<IProductMixin>;
}

/**
 * --- productMixin 暴露给其他 mixin 引用的类型声明 ---
 */
export interface IProductMixin {

    /** --- 当前商品名 --- */
    'productName': string;

    /**
     * --- 添加商品 ---
     */
    addProduct(): Promise<void>;

}
