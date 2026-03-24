import * as clickgo from 'clickgo';

import * as pUser from './user';

/**
 * --- AbstractForm + IUserMixin 的构造器类型约束 ---
 * 在约束中加入 pUser.IUserMixin，使本 mixin 内部可通过 this 访问 userMixin 的属性
 * abstract new 使抽象基类也能被约束匹配
 */
type TConstructor<T = clickgo.form.AbstractForm &
    pUser.IUserMixin
> = abstract new (...args: any[]) => T;

/**
 * --- 订单相关 mixin，将 order 功能模块注入到 form class 中 ---
 * 通过 TConstructor 约束，this 同时具有 AbstractForm 和 IUserMixin 的类型
 */
export function orderMixin<
    TBase extends TConstructor<clickgo.form.AbstractForm>
>(base: TBase): TBase & TConstructor<IOrderMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements IOrderMixin {

        public orderId = '';

        public async submitOrder(): Promise<void> {
            this.loading = true;
            await clickgo.tool.sleep(800);
            // --- 直接通过 this 跨分包访问 userMixin 中的 userName ---
            this.orderId = `${this.userName}-order-${Date.now()}`;
            this.loading = false;
        }

    }

    return Mixed as unknown as TBase & TConstructor<IOrderMixin>;
}

/**
 * --- orderMixin 暴露给其他 mixin 引用的类型声明 ---
 */
export interface IOrderMixin {

    /** --- 当前订单 ID --- */
    'orderId': string;

    /**
     * --- 提交订单 ---
     */
    submitOrder(): Promise<void>;

}
