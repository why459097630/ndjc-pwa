# NDJC PWA Core Template

这是把 `Core-Templates` Android 模板壳转换成的 PWA / Web 版模板壳。

它只负责模板层，不负责 UI 包样式，也不负责 feature-showcase 的业务实现。对应关系如下：

| Android 模板文件 | PWA 模板文件 |
|---|---|
| `app/src/main/java/com/ndjc/app/MainActivity.kt` | `src/app/page.tsx`、`src/app/pwa/[storeId]/page.tsx`、`src/core/runtime/AppRoot.tsx` |
| `core-skeleton/AssemblyLoader.kt` | `src/core/assembly/loader.ts` |
| `core-skeleton/Contract.kt` | `src/core/assembly/types.ts` |
| `core-skeleton/Hooks.kt` | `src/core/runtime/hooks.ts` |
| `core-skeleton/Host.kt` | `src/core/runtime/host.tsx` |
| `core-skeleton/Navigator.kt` | `src/core/routing/navigator.tsx` |
| `core-skeleton/Routes.kt` | `src/core/routing/routes.tsx` |
| `core-skeleton/ModuleRegistry.kt` | `src/core/runtime/moduleRegistry.ts` |
| `core-skeleton/UiPackRegistry.kt` | `src/core/runtime/uiPackRegistry.ts` |
| `core/ui/UiPack.kt` | `src/core/ui/UiPack.tsx` |
| `AndroidManifest.xml` | `src/app/manifest.ts`、`public/sw.js` |
| `NdjcFirebaseMessagingService.kt` | `public/sw.js`、`src/pwa/pushRouter.ts` |

## 边界

- 模板壳只负责：assembly、路由、hooks、manifest、service worker、模块渲染器注册、PWA 入口。
- 模板壳不负责：商品/公告/预约/聊天业务逻辑，也不负责 greenpink UI 样式。
- 业务逻辑应放在 `feature-showcase-web`。
- UI 样式应放在 `ui-pack-showcase-greenpink-web`。

## 与现有 NDJC 分层对应

```txt
pwa-core-template
  ↓
feature-showcase-web
  ↓
ui-pack-showcase-greenpink-web
```

PWA 版仍然保持：

```txt
模板只负责壳子
逻辑模块只负责操作逻辑
UI 包只负责长相
```

## 启动

```powershell
npm install
npm run dev
```

默认入口：

```txt
/
/pwa/store_showcase_paid_000001
/privacy/store_showcase_paid_000001
```

## 如何接入 feature-showcase-web 和 ui-pack-showcase-greenpink-web

模板通过 `registerModuleRenderer(moduleId, uiPackId, renderer)` 注册模块渲染器。

示例：

```tsx
import { registerModuleRenderer } from '@/core/runtime/moduleScreenRegistry'
import { ShowcaseHost } from '@/features/showcase/showcaseHost'
import { GreenpinkShowcaseUiRenderer } from '@/ui-packs/showcase-greenpink-web/GreenpinkShowcaseUiRenderer'

registerModuleRenderer('feature-showcase', 'ui-pack-showcase-greenpink-web', {
  Render: ({ routeId, navigator }) => (
    <ShowcaseHost
      routeId={routeId}
      navigator={navigator}
      ui={GreenpinkShowcaseUiRenderer}
    />
  )
})
```

如果你继续使用 `ui-greenpowder-web` 这个 id，也可以注册：

```tsx
registerModuleRenderer('feature-showcase', 'ui-greenpowder-web', renderer)
```

## 原始 Android 文件

原模板文件已保留在：

```txt
original-android-template/
```

用于后续逐文件核对迁移边界。
