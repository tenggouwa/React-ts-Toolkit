// 配置简化转换
function conversion(url: string, method: 'post' | 'get', inUrl?: boolean) {
    return {
        url,
        method,
        inUrl,
    }
}

// ajax通用配置
export default {
    /* -------- 账户 ------- */
    // 账户 / 登录
    userLogin: conversion('/auth/login', 'post'),
    // 账户 / 登出
    userLoginOut: conversion('/auth/logout', 'post'),
    // 修改管理用户密码
    userChangePass: conversion('/auth/password/modify', 'post', true),
    // 获取权限列表 / 获取用户认证信息
    getMenuInfo: conversion('/auth/info', 'get'),
    // 获取个人权限列表
    getPersonMenuInfo: conversion('/sys/permission/list', 'get'),
    /* -------- 角色 ------- */
    // 新增角色
    addRole: conversion('/backstage/role/create', 'post'),
    // 删除角色
    deleteRole: conversion('/backstage/role/delete', 'post', true),
    // 为角色分配权限
    setRolePermission: conversion('/backstage/role/distribute/permission', 'post'),
    // 角色列表
    getRoleList: conversion('/backstage/role/list', 'get'),
    /* -------- 管理用户 ------- */
    // 添加用户
    addUser: conversion('/backstage/user/add', 'post'),
    // 为用户分配角色
    setUserRole: conversion('/backstage/user/distribute/role', 'post'),
    // 用户查询角色
    fetchUserRole: conversion('/backstage/role/permission', 'get'),
    // 管理用户列表
    fetchUserList: conversion('/backstage/user/list', 'get'),
    // 冻结管理用户
    freezeUser: conversion('/backstage/user/password/freeze', 'post', true),
    // 重置管理用户密码
    resetUserPwd: conversion('/backstage/user/password/reset', 'post', true),
    // 解除冻结管理用户
    reFreezeUser: conversion('/backstage/user/password/unfreeze', 'post', true),
    // 获取合伙人成员信息
    getUserEmailInfo: conversion('/backstage/user/email', 'get'),
    // 合伙人升级
    upgradeUser: conversion('/backstage/user/upgrade/user/type', 'post'),
    /* -------- 伞下 ------- */
    // 查询伞下用户
    fetchUnderList: conversion('/umbrella/list/user', 'get'),
    // 查询伞下二级用户
    fetchUnderChildList: conversion('/umbrella/list/child/user', 'get'),
    // 查询伞下用户合约账户权益
    fetchUnderContract: conversion('/umbrella/list/contract-acc', 'get'),
    // 查询伞下用户成交额
    fetchUnderContractVol: conversion('/umbrella/list/trade-vol', 'get'),
    // 查询伞下二级用户成交额
    fetchUnderChildContractVol: conversion('/umbrella/list/child/trade-vol', 'get'),
    // 查询伞下用户信息
    fetchUnderChildInfo: conversion('/umbrella/contract/account/rights', 'get'),
    // 查询当前用户信息
    fetchUnderUserInfo: conversion('/umbrella/list/summary/trade-vol', 'get'),
    // 查询当前用户伞下信息
    fetchAllUnderUserInfo: conversion('/umbrella/all/lower/summary/trade-vol', 'get'),
    // 伞下净头寸
    fetchUmbrellaNetPosition: conversion('/umbrella/contract/order/net/position', 'get'),
    /* -------- 合伙人 ------- */
    // 添加合伙人团队
    addMember: conversion('/partner/admin/add/member', 'post'),
    // 新增合伙人
    addPartner: conversion('/partner/admin/add/partner', 'post'),
    // 修改成员反佣比例
    setMemberCommission: conversion('/partner/admin/change/member/commission', 'post'),
    // 改变合伙人比例
    setPartnerCommission: conversion('/partner/admin/change/partner/commission', 'post'),
    // 禁用合伙人
    disPartner: conversion('/partner/admin/disable/partner', 'post', true),
    // 查询合伙人团队
    fetchMemberList: conversion('/partner/admin/get/member', 'get'),
    // 查询合伙人
    fetchPartnerList: conversion('/partner/admin/get/partner', 'get'),
    // 获取合伙人成员信息
    getMemberInfo: conversion('/partner/admin/member/info', 'get'),
    // 获取返佣成员信息
    getPartnerInfo: conversion('/partner/admin/partner/email', 'get'),
    // 开通管理权限
    openUserPermission: conversion('/partner/admin/open/member/manage/authority', 'post', true)
}
