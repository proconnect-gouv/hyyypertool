# @~/release-it-plugin-types

Shared TypeScript type definitions for release-it plugins in this monorepo.

## Usage

Add as a dev dependency in your plugin's `package.json`:

```json
{
  "devDependencies": {
    "@~/release-it-plugin-types": "workspace:*"
  }
}
```

The types will be automatically available when you import from `release-it`:

```typescript
import { Plugin } from "release-it";

export default class MyPlugin extends Plugin {
  // ...
}
```
