# 注册模块渲染器

PWA 模板不会直接 import 某个逻辑模块或 UI 包，避免模板层越界。

组合项目时，在启动文件里调用：

```tsx
registerModuleRenderer('feature-showcase', 'ui-pack-showcase-greenpink-web', {
  Render: ({ routeId, navigator }) => (
    <ShowcaseHost routeId={routeId} navigator={navigator} ui={GreenpinkShowcaseUiRenderer} />
  )
})
```

这样模板只知道 moduleId/uiPackId，不知道 Supabase、store_id、商品、预约、聊天等业务实现。
