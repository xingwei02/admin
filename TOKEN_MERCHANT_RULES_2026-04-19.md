# Token 商三态与折扣配置规则记录（2026-04-19）

## 目的

本文件用于给 admin 仓库保留一份可直接参考的规则摘要，避免后续再次把 Token 商三态访问、折扣配置、页面开关混成一套错误语义。

## 一、三态访问固定规则

1. 游客
   - 不能访问 `TokenMerchantGuestV2.vue`
   - 不能访问 `zhengye.vue`
2. 注册客户
   - 可以访问 `TokenMerchantGuestV2.vue`
   - 不能访问 `zhengye.vue`
   - 可申请成为 Token 商
3. Token 商
   - 可以访问 `TokenMerchantGuestV2.vue`
   - 可以访问 `zhengye.vue`

## 二、admin 端当前负责的配置语义

admin 当前管理的 Token 商客户优惠配置，统一落到：

- `affiliate_discounts`

字段包括：

- `discount_rate`
- `merchant_page_enabled`
- `group_section_enabled`

其中：

- `discount_rate` 范围固定为 `0 ~ 5`
- `merchant_page_enabled`：控制命中该 Token 商推广归因的注册客户，是否还能继续看到 Token 商宣传页
- `group_section_enabled`：控制首页底部官方群栏目是否展示

## 三、本轮修正结论

本轮已修正以下偏差：

1. admin 接口不再读写错误的平行语义字段
2. admin 前端不再只更新单个折扣值
3. admin 前后端已统一到 `affiliate_discounts`

## 四、后续禁止事项

未经明确确认，不要：

1. 把 Token 商客户优惠重新写回其他平行表
2. 把 `merchant_page_enabled` 理解成 Token 商身份总权限开关
3. 把 `discount_rate 0~5` 与其他折扣体系混淆