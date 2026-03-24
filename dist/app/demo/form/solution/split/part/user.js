import * as clickgo from 'clickgo';
/**
 * --- 用户相关 mixin，将 user 功能模块注入到 form class 中 ---
 * 在 mixin 内部通过 this 可完整访问 AbstractForm 的所有属性和方法
 */
export function userMixin(base) {
    class Mixed extends base {
        userName = '';
        userList = [];
        /** --- 演示：通过 ISplitForm 读取主 form 属性和方法后合成的欢迎语 --- */
        welcomeMsg = '';
        async loadUser() {
            // --- this 具有完整 AbstractForm 类型，可直接访问 loading 等属性 ---
            this.loading = true;
            await clickgo.tool.sleep(800);
            this.userName = 'admin';
            this.userList = ['admin', 'user1', 'user2'];
            /**
             * --- 通过 ISplitForm 接口反向读取主 form 的属性和方法 ---
             * 运行时 this 就是最终 split.ts 实例，类型上需显式转换
             */
            const splitForm = this;
            this.welcomeMsg = `${splitForm.getFormTitle()} — ${splitForm.greeting}`;
            this.loading = false;
        }
    }
    return Mixed;
}
