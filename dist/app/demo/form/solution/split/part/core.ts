/**
 * --- split.ts 主 form 暴露给分包访问的公共接口 ---
 * 分包文件通过 (this as unknown as ISplitForm) 读取主 form 的属性和方法
 */
export interface ISplitForm {

    /** --- 问候语属性 --- */
    'greeting': string;

    /**
     * --- 获取含有当前用户名的窗体标题 ---
     * @returns 标题字符串
     */
    getFormTitle(): string;

}
