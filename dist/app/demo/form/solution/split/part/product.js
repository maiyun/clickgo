import * as clickgo from 'clickgo';
/**
 * --- 商品相关 mixin，将 product 功能模块注入到 form class 中 ---
 * 通过 TConstructor 约束，this 同时具有 AbstractForm、IUserMixin、IOrderMixin 的类型
 */
export function productMixin(base) {
    class Mixed extends base {
        productName = '';
        /**
         * --- 添加商品 ---
         */
        async addProduct() {
            this.loading = true;
            await clickgo.tool.sleep(600);
            // --- 跨分包同时访问 _user.ts 的 userName 和 _order.ts 的 orderId ---
            this.productName = `${this.userName}:${this.orderId}-product`;
            this.loading = false;
        }
    }
    return Mixed;
}
