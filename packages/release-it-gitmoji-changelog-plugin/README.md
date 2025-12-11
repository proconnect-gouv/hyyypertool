# @~/release-it-gitmoji-changelog-plugin

A release-it plugin that generates changelog with gitmoji-based commit grouping in French.

## How it works

This plugin parses git commits, extracts gitmoji, groups commits by type, and generates a French-localized changelog.

**Groups:**

- **Ajouté** - Features (✨ :sparkles:, 🎉 :tada:, ➕)
- **Modifié** - Changes (♻️ :recycle:, 🔧 :wrench:, 🎨, ⚡, 🚚, 💄, 🏗️)
- **Corrigé** - Bug fixes (🐛 :bug:, 🚑, 🔒)
- **Supprimé** - Removals (🔥, ➖, 🗑️)
- **Dépendances** - Dependencies (⬆️, ⬇️, 📌, :arrow_upper_right:)
- **Documentation** - Docs (📝, 📚, ✍️)
- **CI/CD** - CI changes (👷, 💚)
- **Divers** - Miscellaneous (🔖, other)

## Configuration

```json
{
  "plugins": {
    "./packages/release-it-gitmoji-changelog-plugin": {
      "infile": "CHANGELOG.md"
    }
  }
}
```

## Output

```markdown
## 2025.12.0 (2025-12-09)

### Ajouté

- ✨ Add new feature (#123) (abc1234)
- ✨ Another feature (def5678)

### Corrigé

- 🐛 Fix login issue (#124) (ghi9012)

### Dépendances

- :arrow_upper_right: [patch](deps): bump lodash from 4.17.0 to 4.17.21 (#125) (jkl3456)
```

## Development

```bash
cd packages/release-it-gitmoji-changelog-plugin
bun test
```
