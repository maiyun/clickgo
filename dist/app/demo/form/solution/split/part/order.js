import * as clickgo from 'clickgo';
/**
 * --- 订单相关 mixin，将 order 功能模块注入到 form class 中 ---
 * 通过 TConstructor 约束，this 同时具有 AbstractForm 和 IUserMixin 的类型
 */
export function orderMixin(base) {
    class Mixed extends base {
        orderId = '';
        async submitOrder() {
            this.loading = true;
            await clickgo.tool.sleep(800);
            // --- 直接通过 this 跨分包访问 userMixin 中的 userName ---
            this.orderId = `${this.userName}-order-${Date.now()}`;
            this.loading = false;
        }
    }
    return Mixed;
}
