import * as clickgo from 'clickgo';

import * as pCore from './core';

/**
 * --- 支持 abstract class 的构造器类型 ---
 * abstract new 使 AbstractForm 这类抽象类也能被约束匹配
 */
type TConstructor<T = clickgo.form.AbstractForm> = abstract new (...args: any[]) => T;

/**
 * --- 用户相关 mixin，将 user 功能模块注入到 form class 中 ---
 * 在 mixin 内部通过 this 可完整访问 AbstractForm 的所有属性和方法
 */
export function userMixin<
    TBase extends TConstructor
>(base: TBase): TBase & TConstructor<IUserMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements IUserMixin {

        public userName = '';

        public userList: string[] = [];

        /** --- 演示：通过 ISplitForm 读取主 form 属性和方法后合成的欢迎语 --- */
        public welcomeMsg = '';

        public async loadUser(): Promise<void> {
            // --- this 具有完整 AbstractForm 类型，可直接访问 loading 等属性 ---
            this.loading = true;
            await clickgo.tool.sleep(800);
            this.userName = 'admin';
            this.userList = ['admin', 'user1', 'user2'];
            /**
             * --- 通过 ISplitForm 接口反向读取主 form 的属性和方法 ---
             * 运行时 this 就是最终 split.ts 实例，类型上需显式转换
             */
            const splitForm = this as unknown as pCore.ISplitForm;
            this.welcomeMsg = `${splitForm.getFormTitle()} — ${splitForm.greeting}`;
            this.loading = false;
        }

    }

    return Mixed as unknown as TBase & TConstructor<IUserMixin>;
}

/**
 * --- userMixin 暴露给其他 mixin 引用的类型声明 ---
 * 其他 mixin 可将此 interface 加入自身的 TConstructor 约束，从而通过 this 访问 user 相关属性
 */
export interface IUserMixin {

    /** --- 当前用户名 --- */
    'userName': string;

    /** --- 用户列表 --- */
    'userList': string[];

    /** --- 从主 form 读取后合成的欢迎语 --- */
    'welcomeMsg': string;

    /**
     * --- 加载用户数据 ---
     */
    loadUser(): Promise<void>;

}
