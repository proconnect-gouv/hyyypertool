# Changelog

## [2026.2.6](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.5...2026.2.6) (2026-02-17)

### Changements

- 🐛 Correction de bug sur la modération des non bloquante

### Corrigé

- 🐛 bug on moderation of already linked members (#1405) (82cdf79c)

## [2026.2.5](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.4...2026.2.5) (2026-02-17)

### Changements

- ♻️ Clarrification du comportement lorsqu'un nouveau membre rejoint une organisation
- ⚡️🐛 Optimisation du filtrage des domaines gratuits et correction du rafraîchissement du tableau des domaines à vérifier

### Modifié

- ⚡️🐛 [domains] Fix table disappearing on refresh and optimize free domain filtering (#1404) (c02bf61a)
- ♻️ remove legacy force join organization (#1393) (78c42a51)

### Dépendances

- :arrow_upper_right: [patch](deps): Bump @proconnect-gouv/proconnect.identite (#1403) (c8649e11)
- :arrow_upper_right: [patch](deps): Bump type-fest from 5.4.2 to 5.4.4 (#1401) (235cc8bc)
- :arrow_upper_right: [patch](deps): Bump openid-client (#1400) (87d7a892)
- :arrow_upper_right: [patch](deps): Bump pg from 8.17.2 to 8.18.0 (#1399) (db510eb8)
- :arrow_upper_right: [patch](deps): Bump @preact/signals (#1395) (cdb27d2f)
- :arrow_upper_right: [patch](deps-dev): Bump @happy-dom/global-registrator (#1396) (171eb73e)
- :arrow_upper_right: [patch](deps): Bump dotenv from 17.2.3 to 17.2.4 (#1398) (14104183)
- :arrow_upper_right: [patch](deps): Bump @preact/signals-core (#1397) (225dfe73)
- :arrow_upper_right: [patch](deps-dev): Bump drizzle-kit (#1394) (1b583285)
- :arrow_upper_right: [patch](deps): Bump pg from 8.17.2 to 8.18.0 in /e2e (#1385) (a7e85024)
- :arrow_upper_right: [patch](deps): Bump cypress in /e2e (#1388) (112bee0e)
- :arrow_upper_right: [patch](deps): Bump oxc-parser (#1391) (f67b9698)
- :arrow_upper_right: [patch](deps): Bump @types/bun from 1.3.7 to 1.3.8 (#1389) (a68189a3)
- :arrow_upper_right: [patch](deps): Bump preact from 10.28.2 to 10.28.3 (#1387) (5013fbc8)
- :arrow_upper_right: [patch](deps): Bump the sentry group with 2 updates (#1386) (29001121)

### Divers

- 🚥 e2e(mockserver): fix notification verification flakiness (#1392) (b4124b3d)

## [2026.2.4](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.3...2026.2.4) (2026-02-10)

### Changements

- ✨ Ajout d'un lien de recherche annuaire EHPAD sur la fiche modération

### Modifié

- 🔧 update tailwind config (#1380) (655ba9d1)

### Corrigé

- 🐛 typo in component name (#1374) (0553a4be)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): Bump @happy-dom/global-registrator (#1377) (cd4ce47c)
- :arrow_upper_right: [patch](deps): Bump type-fest from 5.4.1 to 5.4.2 (#1378) (62a00972)
- :arrow_upper_right: [patch](deps): Bump @types/bun from 1.3.6 to 1.3.7 (#1379) (908ae20d)
- :arrow_upper_right: [patch](deps): Bump cypress-io/github-action (#1375) (f26a8f9f)
- :arrow_upper_right: [patch](deps): Bump the sentry group with 2 updates (#1376) (dde20550)

### Divers

- feat: add EHPAD link in Investigation actions (#1383) (555c0594)
- ⏪️ e2e: revert build script to use specific database migrator (#1384) (20a74ede)

## [2026.2.3](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.2...2026.2.3) (2026-02-03)

### Changements

- ✨ use moderation status in moderations table

### Ajouté

- ✨ use moderation status in moderations table (#1372) (88991bf1)

### Corrigé

- 🐛 treat unknown moderation status as exotic moderation type (#1373) (8a19f521)

## [2026.2.2](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.1...2026.2.2) (2026-02-02)

### Changements

- ✨ Ajoute du tag Domaine d'ordre professionnel lors de l'acceptation de moderations

### Ajouté

- ✨ add ordre_professionnel_domain verification type on accepted moderation (#1370) (49d87602)

### Modifié

- 💄 format the gherkin files with prettier (#1371) (d3ed789f)

## [2026.2.1](https://github.com/proconnect-gouv/hyyypertool/compare/2026.2.0...2026.2.1) (2026-02-02)

### Changements

- 🐛 Correction de l'action du bouton "🔄 vérif: verified by coop mediation numerique"

Après confirmation, le bouton "🔄 vérif: verified by coop mediation numerique"
doit bien alterer le champ "verification_type" de la base de données pour y indiquer
"verified_by_coop_mediation_numerique".

### Corrigé

- 🐛 restore verified_by_coop_mediation_numerique action (#1369) (288f88b1)
- 🐛 fix deforestation workflow permissions and scheduled run behavior (#1364) (9b9f667c)

### Dépendances

- :arrow_upper_right: [patch](deps): Bump @proconnect-gouv/proconnect.identite from 1.4.0 to 1.5.0 (#1368) (f93b1ec4)
- :arrow_upper_right: [patch](deps-dev): Bump @happy-dom/global-registrator from 20.3.7 to 20.3.9 (#1366) (ffbc14d9)
- :arrow_upper_right: [patch](deps): Bump oxc-parser from 0.110.0 to 0.111.0 (#1367) (ff2bf74c)
- :arrow_upper_right: [patch](deps): Bump @proconnect-gouv/proconnect.identite.database from 1.1.0 to 1.2.0 in /e2e (#1365) (fe6373da)

## [2026.2.0](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.6...2026.2.0) (2026-02-02)

### Changements

- 🐛 Correction d'un problème d'affichage dans la table des membres lorsque le type de vérification n'est pas reconnu

### Corrigé

- 🐛 use safeParse for verification type in members table (#1362) (d3be3b8e)

### Dépendances

- :arrow_upper_right: [patch](deps): Bump zod from 4.3.5 to 4.3.6 (#1354) (30273f38)

### Documentation

- 📝 add release note for verification type fix (#1363) (792f4f6f)

## [2026.1.6](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.5...2026.1.6) (2026-01-30)

### Changements

- ✨ Ajouter des données partiel FranceConnect sur la page du profile
- 🐛 Autorisation de nom d'utilisateur vide sur les overtures de conversation crisp

### Ajouté

- ✨ add franceconnect section (#1360) (80ad0a3a)

### Corrigé

- 🐛 allow username to be null (#1361) (87a24017)

### Documentation

- 📝 refine the release it changeset examples [skip ci] (#1358) (2b4bec1c)

### Divers

- 🧪 reintroduce hx_url unit tests (#1359) (fdb12ce5)

## [2026.1.5](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.4...2026.1.5) (2026-01-30)

### Changements

- ✨ Ajouter la possibilité de sélectionner les modérations traitées par chargé de modérations
- 🐛 Correction d'une désynchronisation avec la base de données PCI sur les types de vérifications entre profile et organisation.

### Corrigé

- 🐛 missing extension on changeset files [skip ci] (#1357) (210d6bdc)

## [2026.1.4](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.3...2026.1.4) (2026-01-30)

### Ajouté

- ✨ use a fixed list of allowed users (#1307) (454b5ea3)

### Modifié

- ⚡ fix lagging script by removing wild intalls (#1356) (40f9c12a)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): Bump @happy-dom/global-registrator (#1355) (92400dda)
- :arrow_upper_right: [patch](deps): Bump @proconnect-gouv/proconnect.identite from 1.2.0 to 1.4.0 (#1352) (13d057d6)
- :arrow_upper_right: [patch](deps): Bump @proconnect-gouv/proconnect.identite.database (#1351) (dec1064b)
- :arrow_upper_right: [patch](deps): Bump @preact/signals (#1350) (3c8bcc43)
- :arrow_upper_right: [patch](deps): Bump actions/checkout (#1345) (c5f6ac50)
- :arrow_upper_right: [patch](deps): Bump cypress-io/github-action (#1346) (32124861)
- :arrow_upper_right: [patch](deps): Bump the sentry group with 2 updates (#1347) (d6f3fabd)
- :arrow_upper_right: [patch](deps-dev): Bump release-it (#1348) (72a7fcdd)
- :arrow_upper_right: [patch](deps-dev): Bump prettier from 3.8.0 to 3.8.1 (#1349) (8e54991d)
- :arrow_upper_right: [patch](deps): bump @gouvfr/dsfr (#1312) (90a742e1)
- :arrow_upper_right: [patch](deps): bump pg from 8.16.3 to 8.17.2 (#1341) (58e0ea68)
- :arrow_upper_right: [patch](deps-dev): bump @happy-dom/global-registrator (#1343) (09bbcf6d)
- :arrow_upper_right: [patch](deps-dev): bump prettier from 3.7.4 to 3.8.0 (#1342) (d69e25cf)
- :arrow_upper_right: [patch](deps): bump @preact/signals-core (#1340) (0050d350)
- :arrow_upper_right: [patch](deps): bump pg from 8.17.1 to 8.17.2 in /e2e (#1331) (4e1dbd44)
- :arrow_upper_right: [patch](deps): bump zod from 4.1.12 to 4.3.5 (#1298) (acfc2a53)
- :arrow_upper_right: [patch](deps-dev): bump @electric-sql/pglite (#1330) (0d7250bf)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1328) (e66cbc78)
- :arrow_upper_right: [patch](deps): bump oxc-parser (#1329) (657ffb1e)
- :arrow_upper_right: [patch](deps): bump preact-render-to-string (#1323) (5769d10f)
- :arrow_upper_right: [patch](deps): bump oxc-parser (#1325) (22dc247b)
- :arrow_upper_right: [patch](deps): bump pg from 8.17.0 to 8.17.1 in /e2e (#1326) (d4413de5)
- :arrow_upper_right: [patch](deps): bump dotenv from 17.2.2 to 17.2.3 (#1324) (270415dc)

### Documentation

- 📝 docs: Update changeset command format in README (7407dcfd)
- 📝 docs: use a fixed list of allowed users [skip ci] (#1344) (9e3fda11)

### Divers

- dependabot: make prettier happy (#1353) (07823b53)
- dependabot: exclude @proconnect-gouv/\* from cooldown (15ba838d)
- chore(deps): bump hono from 4.11.4 to 4.11.7 (#1339) (76f37c74)

## [2026.1.3](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.2...2026.1.3) (2026-01-23)

### Changements

- Amélioration de l'affichage des commentaires de modération

- Les anciens commentaires s'affichent avec une opacité réduite (50%)
- Le commentaire le plus récent reste à pleine opacité

### Modifié

- :lipstick: improve commentaire section readability with opacity levels (#1317) (9792f739)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): bump release-it (#1321) (0f943b82)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1320) (0373d0a9)
- :arrow_upper_right: [patch](deps): bump cypress-io/github-action (#1318) (13533ed4)
- :arrow_upper_right: [patch](deps): bump pg from 8.16.3 to 8.17.0 in /e2e (#1319) (c549310c)
- :arrow_upper_right: [patch](deps): bump htmx-ext-sse from 2.2.3 to 2.2.4 (#1322) (9201b782)

### Divers

- ↗️ (deps): bump @proconnect-gouv/proconnect.identite.database from 1.1.0 (#1327) (3d46c3da)

## [2026.1.2](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.1...2026.1.2) (2026-01-21)

### Corrigé

- 🐛 eye icon bug with siblings checkbox (#1316) (e52b98b8)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): bump prettier-plugin-organize-imports (#1314) (02560295)
- :arrow_upper_right: [patch](deps): bump ts-pattern from 5.8.0 to 5.9.0 (#1311) (4b593466)
- :arrow_upper_right: [patch](deps): bump type-fest from 5.3.1 to 5.4.1 (#1315) (0e82ee09)
- :arrow_upper_right: [patch](deps): bump actions/setup-node (#1310) (9cda8d91)
- :arrow_upper_right: [patch](deps): bump cypress in /e2e (#1313) (4beb90cc)
- :arrow_upper_right: [patch](deps): bump oven-sh/setup-bun (#1308) (e3c88ecb)

### Divers

- 🪧 main is the new default branch (142b402a)

## [2026.1.1](https://github.com/proconnect-gouv/hyyypertool/compare/2026.1.0...2026.1.1) (2026-01-21)

### Changements

- Ajout d'un filtre "Filtrer par modérateur" sur la liste des modérations

- Permet de filtrer les modérations par l'adresse email du modérateur (correspondance partielle)
- Coche automatiquement "Voir les demandes traitées" lors de la saisie
- 💄 Utilisation des tags dsfr sur les filtres de la table des modérations

### Ajouté

- ✨ moderations: add moderated by filter (#1293) (39dcb03b)

### Modifié

- 💄 Use DSFR icon size utility classes instead of CSS variable (#1294) (b5688a32)
- 🔧 Add prettier formatting hook to release process (#1292) (c89d0252)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): bump drizzle-kit (#1305) (ecc793b0)
- :arrow_upper_right: [patch](deps-dev): bump @happy-dom/global-registrator (#1303) (f4ae5d34)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1302) (c9086776)
- :arrow_upper_right: [patch](deps): bump @types/bun from 1.2.21 to 1.3.6 (#1304) (ad2f9413)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.crisp (#1297) (b8e9e3d3)
- :arrow_upper_right: [patch](deps): bump @hono/zod-validator (#1296) (e6ba4cc1)
- :arrow_upper_right: [patch](deps): bump tsx from 4.20.5 to 4.21.0 (#1300) (8573853f)
- :arrow_upper_right: [patch](deps): bump drizzle-orm (#1301) (6575d4a0)
- :arrow_upper_right: [patch](deps): bump cypress in /e2e (#1299) (4db11427)
- ⬆️ Bump hono from 4.10.6 to 4.11.4 (#1291) (a9761d85)

### Divers

- 🚮 did the bun team fixed the duplicat export issue (#1306) (76fc11f8)
- ✅ add missing e2e tests to workflow (#1295) (677fcfc0)
- chore(deps): bump preact from 10.28.0 to 10.28.2 in /sources/web (#1284) (9efba852)

## [2026.1.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.12.4...2026.1.0) (2026-01-09)

### Changements

- Affichage des dates d'ajout et de modification des membres dans le tableau des membres d'une organisation

### Ajouté

- ✨ Add member dates to organization members table (#1283) (6a5b9e75)

### Corrigé

- 🔒️ add cooldown option on dependabot (#1278) (17d644d8)

### Dépendances

- :arrow_upper_right: [patch](deps-dev): bump prettier-plugin-tailwindcss from 0.6.14 to 0.7.2 (#1281) (b411b518)
- :arrow_upper_right: [patch](deps-dev): bump @electric-sql/pglite (#1280) (a38023b3)
- :arrow_upper_right: [patch](deps): bump @hono/node-server (#1275) (9c340d6d)
- :arrow_upper_right: [patch](deps-dev): bump @types/pg (#1276) (2b5a3b71)
- :arrow_upper_right: [patch](deps): bump the tailwindcss group with 2 updates (#1274) (600c823a)
- :arrow_upper_right: [patch](deps): bump drizzle-orm in /e2e (#1273) (883daabd)
- :arrow_upper_right: [patch](deps): bump oven-sh/setup-bun (#1282) (efc61bca)
- :arrow_upper_right: [patch](deps): bump actions/upload-artifact (#1271) (e0a9964f)
- :arrow_upper_right: [patch](deps): bump cypress-io/github-action (#1270) (438e9b05)
- :arrow_upper_right: [patch](deps): bump htmx.ext...chunked-transfer (#1259) (61d4bf24)
- :arrow_upper_right: [patch](deps): bump cypress in /e2e (#1277) (829f2be0)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1272) (9c69b46b)

### Divers

- style: make prettier happy (98ff0780)

## [2025.12.4](https://github.com/proconnect-gouv/hyyypertool/compare/2025.12.3...2025.12.4) (2025-12-11)

### Changements

- Le champs d'ajout de domain est au dessus du tableau

### Modifié

- 🎨 Move add domain component before to add pagination (#1269) (ae8f986c)

## [2025.12.3](https://github.com/proconnect-gouv/hyyypertool/compare/2025.12.2...2025.12.3) (2025-12-11)

### Modifié

- 🔧 fix: remove debug extension from main layout snapshot (52b7022e)
- 🔧 chore: update asset paths to use import map resolution (1029c706)

### Documentation

- 📝 docs: update README and fix asset paths (4d1ccb13)
- 📝 docs: fix CHANGELOG.md formatting (9c98606f)

## [2025.12.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.12.1...2025.12.2) (2025-12-11)

### Changements

- Un nouveau test de mon release-it changeset

### Modifié

- 🔧 chore: add prettier formatting and improve changeset handling (f06f3a47)

### Documentation

- 📝 docs: add test changeset for release-it (c366e8e4)

## [2025.12.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.12.0...2025.12.1) (2025-12-11)

### Changements

- Nouveau system de collection de changements : release-it-changeset-plugin

### Modifié

- 🔧 fix: move git add to release phase and improve changeset cleanup (8ddc23fb)
- 🔧 fix: update plugin types and changelog extraction logic (d820b5eb)

### Documentation

- 📝 docs: update changelog with recent changes (0ccff78d)

## [2025.12.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.11.2...2025.12.0) (2025-12-11)

### Changements

- Nouveau system de collection de changements : release-it-changeset-plugin

### Ajouté

- ✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267) (5fa1ccb1)
- ✨ release-it-changeset-plugin (#1216) (95917842)
- ✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267) (efbb6cd9)
- ✨ release-it-changeset-plugin (#1266) (e70f7c9c)
- ✨ feat: add prettier formatting to CI pipeline and apply code formatting (#1265) (f8bc1bba)
- ✨ add Preact notification system with reliable test isolation (#1234) (8b713eb5)
- ✨ add live reload functionality for development (#1230) (b53451f0)
- ✨ Add FranceConnect reset button (#1228) (4c51656e)
- ✨ Client scripts Level Up (#1227) (e3be58f1)

### Modifié

- 🔧 chore(ci): update release workflow and changelog formatting (2ddddb9f)
- 🔧 chore(ci): add build steps for release plugins in CI workflow (7167ce53)
- 🔧 fix: update release workflow and changelog formatting (b45556cc)
- 🔧 test: add deterministic date to gitmoji changelog plugin test (60e365da)
- 🔧 refactor: remove build:tsc script and inline tsc command (#1249) (75f732cd)
- ♻️ use preact moderation filter (#1236) (0ef00fcf)
- 🔧 refactor: replace console.log with consola.trace for better logging (c1a8c097)
- ♻️ use preact notif system for htmx events (#1235) (1b065def)
- ♻️ Consolidate clipboard to CopyButton component (#1231) (fa05616e)
- 🔧 refactor: migrate moderation page from hyperscript to Alpine.js (#1229) (b4323fde)

### Corrigé

- 🐛 Fixes a title that was displayed twice after an action (#1268) (287c298f)
- 🐛 add duplicate export on bun splitting build fix (#1239) (8d7882fd)
- 🐛 add preact/jsx-runtime in production (#1238) (c6f29504)
- 🐛 add retry button if we have an fetching leader error (#1237) (b5366635)
- 🐛 buggy back button (33351add)
- 🐛 correct the live reload hell (#1232) (09482c25)

### Dépendances

- :arrow_upper_right: [patch](deps): bump htmx.org from 2.0.7 to 2.0.8 (#1263) (d675b489)
- :arrow_upper_right: [patch](deps): bump @tsconfig/bun from 1.0.7 to 1.0.10 (#1261) (dd64648c)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.identite (#1262) (e3acfaaf)
- :arrow_upper_right: [patch](deps): bump tailwind-merge (#1264) (46994247)
- :arrow_upper_right: [patch](deps-dev): bump typescript (#1258) (26a7ef8e)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.insee (#1260) (3c603293)
- :arrow_upper_right: [patch](deps-dev): bump prettier from 3.6.2 to 3.7.4 (#1257) (e0b2f133)
- :arrow_upper_right: [patch](deps): bump type-fest from 5.2.0 to 5.3.1 (#1254) (61fe2999)
- :arrow_upper_right: [patch](deps): bump drizzle-orm in /e2e (#1250) (0a7e1986)
- :arrow_upper_right: [patch](deps): bump @bahmutov/cypress-esbuild-preprocessor (#1251) (97b57975)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1252) (41dea3c8)
- :arrow_upper_right: [patch](deps): bump drizzle-orm (#1253) (9b0ffcbc)
- :arrow_upper_right: [patch](deps): bump tailwind-variants (#1255) (6a2c8acf)
- :arrow_upper_right: [patch](deps-dev): bump release-it (#1256) (f73de750)
- :arrow_upper_right: [patch](deps): bump actions/checkout (#1240) (e3942ce5)
- :arrow_upper_right: [patch](deps): bump actions/setup-node (#1241) (8f9312f5)
- :arrow_upper_right: [patch](deps): bump cypress in /e2e (#1246) (7078153e)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.identite.database from 0.1.0 to 1.0.0 (#1206) (f110450d)
- :arrow_upper_right: [patch](deps): remove autoprefixer (#1218) (5ca3865f)
- :arrow_upper_right: [patch](deps): bump @badeball/cypress-cucumber-preprocessor (#1226) (b27ba721)
- :arrow_upper_right: [patch](deps-dev): bump @types/pg (#1219) (2a3c3892)
- :arrow_upper_right: [patch](deps-dev): bump @release-it/conventional-changelog (#1214) (d0251b8c)

### Documentation

- ✍️ Fix little coquille (#1225) (72125e49)

### Divers

- Revert "✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267)" (4143d5ff)
- chore(dependabot): update package ecosystem to bun (46658b7a)
- Revert "chore(dependabot): use enable-beta-ecosystems" (12c4b30b)
- chore(lock): update lockfile (dec181be)

## [2025.12.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.11.2...2025.12.0) (2025-12-11)

### Ajouté

- ✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267) (5fa1ccb1)
- ✨ release-it-changeset-plugin (#1216) (95917842)
- ✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267) (efbb6cd9)
- ✨ release-it-changeset-plugin (#1266) (e70f7c9c)
- ✨ feat: add prettier formatting to CI pipeline and apply code formatting (#1265) (f8bc1bba)
- ✨ add Preact notification system with reliable test isolation (#1234) (8b713eb5)
- ✨ add live reload functionality for development (#1230) (b53451f0)
- ✨ Add FranceConnect reset button (#1228) (4c51656e)
- ✨ Client scripts Level Up (#1227) (e3be58f1)

### Modifié

- 🔧 chore(ci): add build steps for release plugins in CI workflow (7167ce53)
- 🔧 fix: update release workflow and changelog formatting (b45556cc)
- 🔧 test: add deterministic date to gitmoji changelog plugin test (60e365da)
- 🔧 refactor: remove build:tsc script and inline tsc command (#1249) (75f732cd)
- ♻️ use preact moderation filter (#1236) (0ef00fcf)
- 🔧 refactor: replace console.log with consola.trace for better logging (c1a8c097)
- ♻️ use preact notif system for htmx events (#1235) (1b065def)
- ♻️ Consolidate clipboard to CopyButton component (#1231) (fa05616e)
- 🔧 refactor: migrate moderation page from hyperscript to Alpine.js (#1229) (b4323fde)

### Corrigé

- 🐛 Fixes a title that was displayed twice after an action (#1268) (287c298f)
- 🐛 add duplicate export on bun splitting build fix (#1239) (8d7882fd)
- 🐛 add preact/jsx-runtime in production (#1238) (c6f29504)
- 🐛 add retry button if we have an fetching leader error (#1237) (b5366635)
- 🐛 buggy back button (33351add)
- 🐛 correct the live reload hell (#1232) (09482c25)

### Dépendances

- :arrow_upper_right: [patch](deps): bump htmx.org from 2.0.7 to 2.0.8 (#1263) (d675b489)
- :arrow_upper_right: [patch](deps): bump @tsconfig/bun from 1.0.7 to 1.0.10 (#1261) (dd64648c)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.identite (#1262) (e3acfaaf)
- :arrow_upper_right: [patch](deps): bump tailwind-merge (#1264) (46994247)
- :arrow_upper_right: [patch](deps-dev): bump typescript (#1258) (26a7ef8e)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.insee (#1260) (3c603293)
- :arrow_upper_right: [patch](deps-dev): bump prettier from 3.6.2 to 3.7.4 (#1257) (e0b2f133)
- :arrow_upper_right: [patch](deps): bump type-fest from 5.2.0 to 5.3.1 (#1254) (61fe2999)
- :arrow_upper_right: [patch](deps): bump drizzle-orm in /e2e (#1250) (0a7e1986)
- :arrow_upper_right: [patch](deps): bump @bahmutov/cypress-esbuild-preprocessor (#1251) (97b57975)
- :arrow_upper_right: [patch](deps): bump the sentry group with 2 updates (#1252) (41dea3c8)
- :arrow_upper_right: [patch](deps): bump drizzle-orm (#1253) (9b0ffcbc)
- :arrow_upper_right: [patch](deps): bump tailwind-variants (#1255) (6a2c8acf)
- :arrow_upper_right: [patch](deps-dev): bump release-it (#1256) (f73de750)
- :arrow_upper_right: [patch](deps): bump actions/checkout (#1240) (e3942ce5)
- :arrow_upper_right: [patch](deps): bump actions/setup-node (#1241) (8f9312f5)
- :arrow_upper_right: [patch](deps): bump cypress in /e2e (#1246) (7078153e)
- :arrow_upper_right: [patch](deps): bump @proconnect-gouv/proconnect.identite.database from 0.1.0 to 1.0.0 (#1206) (f110450d)
- :arrow_upper_right: [patch](deps): remove autoprefixer (#1218) (5ca3865f)
- :arrow_upper_right: [patch](deps): bump @badeball/cypress-cucumber-preprocessor (#1226) (b27ba721)
- :arrow_upper_right: [patch](deps-dev): bump @types/pg (#1219) (2a3c3892)
- :arrow_upper_right: [patch](deps-dev): bump @release-it/conventional-changelog (#1214) (d0251b8c)

### Documentation

- ✍️ Fix little coquille (#1225) (72125e49)

### Divers

- Revert "✨ feat: extract release-it plugin types and add gitmoji changelog plugin (#1267)" (4143d5ff)
- chore(dependabot): update package ecosystem to bun (46658b7a)
- Revert "chore(dependabot): use enable-beta-ecosystems" (12c4b30b)
- chore(lock): update lockfile (dec181be)

## [2025.11.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.11.1...2025.11.2) (2025-11-26)

## [2025.11.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.11.0...2025.11.1) (2025-11-05)

### Bug Fixes

- add timeout handling to HTTP client functions ([#1163](https://github.com/proconnect-gouv/hyyypertool/issues/1163)) ([d943fec](https://github.com/proconnect-gouv/hyyypertool/commit/d943fec5f09291fd8e3a1907a634bb3a0799d9e7))
- wrong tsconfig at start ([444bb72](https://github.com/proconnect-gouv/hyyypertool/commit/444bb72faaf51894183c2d805c90f43199ab2579))
- wrong tsconfig at start (2) ([47a79bb](https://github.com/proconnect-gouv/hyyypertool/commit/47a79bb495317798df19637c97453db31cae981e))

# [2025.11.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.10.1...2025.11.0) (2025-11-04)

## [2025.10.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.10.0...2025.10.1) (2025-10-30)

# [2025.10.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.9.0...2025.10.0) (2025-10-30)

### Bug Fixes

- **lib:** remove app.\* dependency ([08846fa](https://github.com/proconnect-gouv/hyyypertool/commit/08846fa2a39a72aa26989f296661ced8fad23882))
- **libs:** update imports to use @~/app.middleware compatibility shim ([b435eb8](https://github.com/proconnect-gouv/hyyypertool/commit/b435eb8e30fa68a8ded31247810fe98e3f9b9d3f))
- skip Tailwind build if already built to prevent OOM on Scalingo ([f44bdf7](https://github.com/proconnect-gouv/hyyypertool/commit/f44bdf7783f5ebd47197d91b17c56aef340ee249))
- **web:** correct config import path in moderations context ([6648286](https://github.com/proconnect-gouv/hyyypertool/commit/66482863babac1d3f98fcfd557fdb7eb27ad3874))
- **web:** correct error class names in errors module ([7ceab92](https://github.com/proconnect-gouv/hyyypertool/commit/7ceab9241b39f36277c4ee53197a6131b494b86f))
- **web:** update imports to use #src/middleware patterns ([d19fdb3](https://github.com/proconnect-gouv/hyyypertool/commit/d19fdb3b7a1c0bc82ef017297c8a5dfeb428bf2b))
- **web:** update routes.d.ts imports after middleware migration ([154cc8d](https://github.com/proconnect-gouv/hyyypertool/commit/154cc8db93b7864217d64d33f3873dd549abe0ca))
- **welcome:** overlapping welcome ([#1139](https://github.com/proconnect-gouv/hyyypertool/issues/1139)) ([8ab7f7e](https://github.com/proconnect-gouv/hyyypertool/commit/8ab7f7e7ff25fb1e275431bc5a60451c24c40f4f))
- **welcome:** testable webcomponent ([136c123](https://github.com/proconnect-gouv/hyyypertool/commit/136c123f3f634ce349b53209480eb384b543e42f))
- **welcome:** testable webcomponent (2) ([3351d60](https://github.com/proconnect-gouv/hyyypertool/commit/3351d60562df4b67e3a4684180a2bdb1d5be1ca2))

### Features

- **database:** use @proconnect-gouv/proconnect.identite.database ([#1116](https://github.com/proconnect-gouv/hyyypertool/issues/1116)) ([4e458d1](https://github.com/proconnect-gouv/hyyypertool/commit/4e458d17c9cf90e83e5c7f794a3e867e5b3d51eb))
- **web:** add NotAuthorized and vip_list_guard auth UI components ([4fbcd8c](https://github.com/proconnect-gouv/hyyypertool/commit/4fbcd8cf80d39b5839a84dbda791feb21a431c14))

# [2025.9.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.7.2...2025.9.0) (2025-09-18)

### Bug Fixes

- **moderation:** send notification typo ([#1095](https://github.com/proconnect-gouv/hyyypertool/issues/1095)) ([0d0e480](https://github.com/proconnect-gouv/hyyypertool/commit/0d0e480de5a43a8a92b68776365b827c07ae947c))
- **test:** just avoid using mock.module for now ([#1058](https://github.com/proconnect-gouv/hyyypertool/issues/1058)) ([e50b498](https://github.com/proconnect-gouv/hyyypertool/commit/e50b498859895dc0f4d042d3344f806ff9ce91ff))

### Features

- **moderations:** auto validate pending moderation for same organization and domain ([#1101](https://github.com/proconnect-gouv/hyyypertool/issues/1101)) ([28ec9a0](https://github.com/proconnect-gouv/hyyypertool/commit/28ec9a00f354ef8ba9111d5d50bfe06d862dffbc))
- **moderations:** improve UX with auto go back component ([#1066](https://github.com/proconnect-gouv/hyyypertool/issues/1066)) ([2c3f264](https://github.com/proconnect-gouv/hyyypertool/commit/2c3f2648afd5a32dad4219843eb5fe37b2e8c3fc))
- rename modules to sources ([200772e](https://github.com/proconnect-gouv/hyyypertool/commit/200772e9ab2b29a4508d1a1edc20f035df57208b))

## [2025.7.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.7.1...2025.7.2) (2025-07-25)

## [2025.7.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.7.0...2025.7.1) (2025-07-24)

# [2025.7.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.6.2...2025.7.0) (2025-07-24)

### Bug Fixes

- **typo:** add accent to vérifier ([#947](https://github.com/proconnect-gouv/hyyypertool/issues/947)) ([e2db914](https://github.com/proconnect-gouv/hyyypertool/commit/e2db914f3d6a081a0fcd6e2a703daca4414fc1a2))

### Features

- migrate from MonComptePro to Identité ProConnect ([#971](https://github.com/proconnect-gouv/hyyypertool/issues/971)) ([48bce06](https://github.com/proconnect-gouv/hyyypertool/commit/48bce0683e771d7aea71f46a0de19871afbe21b8))
- **moderation:** update agent_comcom_comaglo ([#961](https://github.com/proconnect-gouv/hyyypertool/issues/961)) ([734c5f5](https://github.com/proconnect-gouv/hyyypertool/commit/734c5f5cab9e45a3d3763c11425d5921805b4048))

### Reverts

- Revert "🔧 improve dependabot config for bun monorepo support (#975)" (#990) ([8df2db2](https://github.com/proconnect-gouv/hyyypertool/commit/8df2db2121173fa8aa87085fa92ee1d4781c6922)), closes [#975](https://github.com/proconnect-gouv/hyyypertool/issues/975) [#990](https://github.com/proconnect-gouv/hyyypertool/issues/990)

## [2025.6.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.6.1...2025.6.2) (2025-06-17)

### Bug Fixes

- **app:** redirect_uri missmatch issue ([#927](https://github.com/proconnect-gouv/hyyypertool/issues/927)) ([f99b009](https://github.com/proconnect-gouv/hyyypertool/commit/f99b009e1bba27175c4a300d64eaa777049bf540))
- **readme:** fix error in doc links ([#923](https://github.com/proconnect-gouv/hyyypertool/issues/923)) ([5d0c1c5](https://github.com/proconnect-gouv/hyyypertool/commit/5d0c1c51185227e500df1f3cd67156c41e2b981d))

### Features

- **moderation:** add new verification type ([#937](https://github.com/proconnect-gouv/hyyypertool/issues/937)) ([2334540](https://github.com/proconnect-gouv/hyyypertool/commit/2334540210204aedcaeb9dd50512a7d8f431920b))

## [2025.6.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.6.0...2025.6.1) (2025-06-11)

### Bug Fixes

- **moderation:** add sendNotification component ([#919](https://github.com/proconnect-gouv/hyyypertool/issues/919)) ([c16c108](https://github.com/proconnect-gouv/hyyypertool/commit/c16c108eb2ed56db25281ce1c782da2223830768))

# [2025.6.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.5.2...2025.6.0) (2025-06-10)

## [2025.5.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.5.1...2025.5.2) (2025-05-28)

## [2025.5.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.5.0...2025.5.1) (2025-05-28)

### Bug Fixes

- **moderation:** improvement ui ([#897](https://github.com/proconnect-gouv/hyyypertool/issues/897)) ([bcf9ad3](https://github.com/proconnect-gouv/hyyypertool/commit/bcf9ad3da4b85ffc729a2ca7973b1ced4b17b6e3))

# [2025.5.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.4.2...2025.5.0) (2025-05-20)

### Bug Fixes

- **moderation:** hide the modal if the request is successful ([#879](https://github.com/proconnect-gouv/hyyypertool/issues/879)) ([6fcf0a3](https://github.com/proconnect-gouv/hyyypertool/commit/6fcf0a3456c35d6a56563afce8072aed52803e4c))

## [2025.4.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.4.1...2025.4.2) (2025-04-30)

### Bug Fixes

- **moderation:** use keydow and change to detect input changes ([#878](https://github.com/proconnect-gouv/hyyypertool/issues/878)) ([5e7eaac](https://github.com/proconnect-gouv/hyyypertool/commit/5e7eaac6178bd2cd835de56557bfdd85702a6e27))

### Features

- **ui:** add toasters ([#877](https://github.com/proconnect-gouv/hyyypertool/issues/877)) ([5f3c73f](https://github.com/proconnect-gouv/hyyypertool/commit/5f3c73f69e6aa3a71ba3e10e943ae1841d4327a9))

## [2025.4.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.4.0...2025.4.1) (2025-04-30)

### Bug Fixes

- **button:** add type="button" on button to close modal and not submit ([#875](https://github.com/proconnect-gouv/hyyypertool/issues/875)) ([57cb658](https://github.com/proconnect-gouv/hyyypertool/commit/57cb65850b57345e1ffd990c00b6f76503cf65a0))
- **moderation:** replace subject by raison in comments ([#864](https://github.com/proconnect-gouv/hyyypertool/issues/864)) ([7a17836](https://github.com/proconnect-gouv/hyyypertool/commit/7a17836a31f4a8c41de3ebf0d91f435434bf3739))

# [2025.4.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.3.1...2025.4.0) (2025-04-22)

### Features

- **moderation:** design flow 2 💥 ([#832](https://github.com/proconnect-gouv/hyyypertool/issues/832)) ([15b9931](https://github.com/proconnect-gouv/hyyypertool/commit/15b99310e745f7238eb8be716a18492d91cb758a))
- **moderations:** add why its rejected ([#846](https://github.com/proconnect-gouv/hyyypertool/issues/846)) ([1db1ec7](https://github.com/proconnect-gouv/hyyypertool/commit/1db1ec78df6528031383883027dd9e4716e39f49))

## [2025.3.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.3.0...2025.3.1) (2025-03-24)

### Features

- **moderation:** update responses types ([#826](https://github.com/proconnect-gouv/hyyypertool/issues/826)) ([b74541c](https://github.com/proconnect-gouv/hyyypertool/commit/b74541cfe8a36b849c47eee9e5d930a0cb242cc9))

# [2025.3.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.5...2025.3.0) (2025-03-07)

### Features

- **moderation:** replace old mcp link with pc link ([#811](https://github.com/proconnect-gouv/hyyypertool/issues/811)) ([2212e40](https://github.com/proconnect-gouv/hyyypertool/commit/2212e4039187f9ac67fa343aceda1c125af0b604))
- **moderation:** update content of mail from user_with_existing_pc_account ([#810](https://github.com/proconnect-gouv/hyyypertool/issues/810)) ([3e16854](https://github.com/proconnect-gouv/hyyypertool/commit/3e16854bb2cb220a7333e197798b13817178fc9c))

## [2025.2.5](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.4...2025.2.5) (2025-02-27)

### Bug Fixes

- **organization:** list by user id pagination ([#803](https://github.com/proconnect-gouv/hyyypertool/issues/803)) ([546eb58](https://github.com/proconnect-gouv/hyyypertool/commit/546eb58e1e1c42e83ecb05deb3ad7c046c61dea4))

## [2025.2.4](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.3...2025.2.4) (2025-02-26)

## [2025.2.3](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.2...2025.2.3) (2025-02-19)

## [2025.2.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.1...2025.2.2) (2025-02-19)

### Features

- **infra:** use @gouvfr-lasuite/proconnect.identite ([#792](https://github.com/proconnect-gouv/hyyypertool/issues/792)) ([8a9272d](https://github.com/proconnect-gouv/hyyypertool/commit/8a9272d88456946eb227d9087d7735f3586d898d))
- **moderation:** list organisation domain in reponse type ([#783](https://github.com/proconnect-gouv/hyyypertool/issues/783)) ([b74138c](https://github.com/proconnect-gouv/hyyypertool/commit/b74138c578d58f22e5216d5ab6f13e9292d49bcb))

## [2025.2.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.2.0...2025.2.1) (2025-02-05)

### Bug Fixes

- **crips:** add CRISP_RESOLVE_DELAY ([#774](https://github.com/proconnect-gouv/hyyypertool/issues/774)) ([cd141b1](https://github.com/proconnect-gouv/hyyypertool/commit/cd141b14d10e6862b1458f786ef73518c40347f1))

# [2025.2.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.7...2025.2.0) (2025-02-03)

### Bug Fixes

- **moderation:** existing email response ([#768](https://github.com/proconnect-gouv/hyyypertool/issues/768)) ([24355a7](https://github.com/proconnect-gouv/hyyypertool/commit/24355a7cd99b899f10041c1f220889b3ddf5f170))

## [2025.1.7](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.6...2025.1.7) (2025-01-27)

## [2025.1.6](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.5...2025.1.6) (2025-01-21)

### Features

- **moderation:** delete unused responses type ([#753](https://github.com/proconnect-gouv/hyyypertool/issues/753)) ([52b4170](https://github.com/proconnect-gouv/hyyypertool/commit/52b4170025f2d424f52fddd3f38c8c02439b08a6))

## [2025.1.5](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.4...2025.1.5) (2025-01-21)

### Features

- **moderation:** Agent “ComCom, ComAgglo, Métropole” —> Communes ([#752](https://github.com/proconnect-gouv/hyyypertool/issues/752)) ([1afe024](https://github.com/proconnect-gouv/hyyypertool/commit/1afe0241a0c8857e7c460153fdb80fd9fbd80d68))

## [2025.1.4](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.3...2025.1.4) (2025-01-21)

### Bug Fixes

- **moderation:** fix wrong label and describe test on moderation ([#751](https://github.com/proconnect-gouv/hyyypertool/issues/751)) ([77fa403](https://github.com/proconnect-gouv/hyyypertool/commit/77fa4030affa1667ecb38e3efbd5d222d9602598))

### Features

- **moderation:** Agent - departmental e-mail address -> Admin centrale ([#740](https://github.com/proconnect-gouv/hyyypertool/issues/740)) ([aea9285](https://github.com/proconnect-gouv/hyyypertool/commit/aea9285b13981cc3b943217763f2a93a156a03a6))

## [2025.1.3](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.2...2025.1.3) (2025-01-21)

### Features

- **users:** display totp verified at ([#750](https://github.com/proconnect-gouv/hyyypertool/issues/750)) ([fac20da](https://github.com/proconnect-gouv/hyyypertool/commit/fac20da72475afbbeaefc16a0f6e3299a0d100d8))

## [2025.1.2](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.1...2025.1.2) (2025-01-20)

### Bug Fixes

- **typo:** replace agentConnect with ProConnect ([#748](https://github.com/proconnect-gouv/hyyypertool/issues/748)) ([f4ad32d](https://github.com/proconnect-gouv/hyyypertool/commit/f4ad32d4ecf16dcf7f4381c177104eea5f883d63))

## [2025.1.1](https://github.com/proconnect-gouv/hyyypertool/compare/2025.1.0...2025.1.1) (2025-01-20)

# [2025.1.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.5...2025.1.0) (2025-01-20)

### Bug Fixes

- **user:** typo on sent messages ([10d66f5](https://github.com/proconnect-gouv/hyyypertool/commit/10d66f56330029d7da5b5bdb76816fc26b0764f9))

### Features

- **moderation:** add more precise existing establishment CNRS response ([#733](https://github.com/proconnect-gouv/hyyypertool/issues/733)) ([8f2e803](https://github.com/proconnect-gouv/hyyypertool/commit/8f2e803fa071555232f4c8c24285dba9e3796eb6))
- **moderation:** add university email cnrs response ([#730](https://github.com/proconnect-gouv/hyyypertool/issues/730)) ([d9d48b2](https://github.com/proconnect-gouv/hyyypertool/commit/d9d48b27b692368f02c64751dfbf2274e08d7488))
- **moderation:** add user with existing account moderation ([#729](https://github.com/proconnect-gouv/hyyypertool/issues/729)) ([9242528](https://github.com/proconnect-gouv/hyyypertool/commit/924252893079883b27678bb77d8e59edd5b860c1))
- **moderation:** Agent outside Min Finances -> Chorus Pro ([#743](https://github.com/proconnect-gouv/hyyypertool/issues/743)) ([4866930](https://github.com/proconnect-gouv/hyyypertool/commit/4866930fa55f9aaa98e6e3e896ff6a6561068686))
- **moderation:** association with staff but no domain name : ordinary person ([#736](https://github.com/proconnect-gouv/hyyypertool/issues/736)) ([ca0f95f](https://github.com/proconnect-gouv/hyyypertool/commit/ca0f95ffe70b03d963eed9c85301cc1fe55c1c2a))
- **moderation:** association with staff but no domain name ([#735](https://github.com/proconnect-gouv/hyyypertool/issues/735)) ([615d96a](https://github.com/proconnect-gouv/hyyypertool/commit/615d96aeae975e2f9fb96ba2a42fdbaf0e0eccbe))
- **moderation:** E-mail Public administration - Employing organisation ([#744](https://github.com/proconnect-gouv/hyyypertool/issues/744)) ([29589ce](https://github.com/proconnect-gouv/hyyypertool/commit/29589cea603104215b1df1a5139d001caa813227))
- **moderation:** existing domain name response ([#734](https://github.com/proconnect-gouv/hyyypertool/issues/734)) ([4fb852c](https://github.com/proconnect-gouv/hyyypertool/commit/4fb852c4bde1de706422de772bad9cd9fe1b9d1c))
- **moderation:** presta E-mail Employing organisation or beta.gouv ([#745](https://github.com/proconnect-gouv/hyyypertool/issues/745)) ([3598025](https://github.com/proconnect-gouv/hyyypertool/commit/3598025e72b5fd270848a9726d1f806f4141bd79))
- **moderation:** Reservist or other - Personal e-mail ([#746](https://github.com/proconnect-gouv/hyyypertool/issues/746)) ([6331134](https://github.com/proconnect-gouv/hyyypertool/commit/6331134adea51fa7de80d0445e549f2d7efe3cc3))
- **moderation:** Seconded agent diplomatie.gouv -> Ministry of the Interior ([#739](https://github.com/proconnect-gouv/hyyypertool/issues/739)) ([a980a13](https://github.com/proconnect-gouv/hyyypertool/commit/a980a13c876fc4007de97eee64f3b6b91e276a2b))
- **moderation:** Student - Host organisation ([#741](https://github.com/proconnect-gouv/hyyypertool/issues/741)) ([b91742a](https://github.com/proconnect-gouv/hyyypertool/commit/b91742a284e0cefc3bb04249395427111e916bcd))
- **moderation:** Student - School or training establishment ([#742](https://github.com/proconnect-gouv/hyyypertool/issues/742)) ([6449c3f](https://github.com/proconnect-gouv/hyyypertool/commit/6449c3f3d7fefbb5e21f44398b247e3061b78963))
- **ui:** expect navigator.writeText to exist ([e3c6aa1](https://github.com/proconnect-gouv/hyyypertool/commit/e3c6aa15f4888cd35174a8d1082c5dbcffcc4e92))

## [2024.12.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.4...2024.12.5) (2024-12-17)

### Bug Fixes

- **organization:** correct verified_by_coop_mediation_numerique label ([#701](https://github.com/proconnect-gouv/hyyypertool/issues/701)) ([0fd162b](https://github.com/proconnect-gouv/hyyypertool/commit/0fd162b3d357ac865486a62169da5e3cab628bb4))
- **organization:** eol after domain creation date ([#707](https://github.com/proconnect-gouv/hyyypertool/issues/707)) ([f0d18ff](https://github.com/proconnect-gouv/hyyypertool/commit/f0d18ff7547894ed233946dbc2df24305ad751f2))
- **users:** notify the user of the password reset ([#704](https://github.com/proconnect-gouv/hyyypertool/issues/704)) ([df76994](https://github.com/proconnect-gouv/hyyypertool/commit/df76994d6fd3166a6d99dfae9e485e7e6482670f))

## [2024.12.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.3...2024.12.4) (2024-12-11)

### Bug Fixes

- **organization:** always see verified_by_coop_mediation_numerique ([#700](https://github.com/proconnect-gouv/hyyypertool/issues/700)) ([403038c](https://github.com/proconnect-gouv/hyyypertool/commit/403038c155fe93a0f559454b27e217364c406e03))

## [2024.12.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.2...2024.12.3) (2024-12-04)

### Features

- **users:** reset user password ([#694](https://github.com/proconnect-gouv/hyyypertool/issues/694)) ([af7a9b1](https://github.com/proconnect-gouv/hyyypertool/commit/af7a9b1801304e0e4c9538586c26f47273d7c08f))

## [2024.12.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.1...2024.12.2) (2024-12-04)

### Features

- **organization:** add verified_by_coop_mediation_numerique ([#693](https://github.com/proconnect-gouv/hyyypertool/issues/693)) ([184a4bb](https://github.com/proconnect-gouv/hyyypertool/commit/184a4bbe5f792cc09cca250dcf8b5654f959ca37))

## [2024.12.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.12.0...2024.12.1) (2024-12-04)

### Bug Fixes

- **organization:** add domain count in the title ([#688](https://github.com/proconnect-gouv/hyyypertool/issues/688)) ([29b09d7](https://github.com/proconnect-gouv/hyyypertool/commit/29b09d77639a057ffc83f3e1404549865801dff8))

### Features

- add card in about pages ([#689](https://github.com/proconnect-gouv/hyyypertool/issues/689)) ([8b9f2d5](https://github.com/proconnect-gouv/hyyypertool/commit/8b9f2d5850cc2553ca13d76296b669091ff84989))

# [2024.12.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.5...2024.12.0) (2024-12-04)

### Bug Fixes

- **users:** auto close conversation after notification ([#687](https://github.com/proconnect-gouv/hyyypertool/issues/687)) ([46b75a0](https://github.com/proconnect-gouv/hyyypertool/commit/46b75a02b21bf960eca4f1f21f3d327b3cff3530))

### Features

- **infra:** update identite schema ([#683](https://github.com/proconnect-gouv/hyyypertool/issues/683)) ([c1dd743](https://github.com/proconnect-gouv/hyyypertool/commit/c1dd7436d81ab4b6aeb501cfb61a2d6fefc11518))
- **organization:** display verificated at date ([#685](https://github.com/proconnect-gouv/hyyypertool/issues/685)) ([53e127d](https://github.com/proconnect-gouv/hyyypertool/commit/53e127dd5e2f3647acb53c0d1992f572c0be04ee))
- **users:** send crips message to informe the user ([#686](https://github.com/proconnect-gouv/hyyypertool/issues/686)) ([75db022](https://github.com/proconnect-gouv/hyyypertool/commit/75db022cd05bf815c1a17eed11d8e14e7d4722b5))
- **users:** update user page ([#684](https://github.com/proconnect-gouv/hyyypertool/issues/684)) ([c6dad3f](https://github.com/proconnect-gouv/hyyypertool/commit/c6dad3f9f6cc7e2ac49c9f5acdd25f79e8d0968b))

### Reverts

- Revert "chore(database): update dependencies" ([da8449e](https://github.com/proconnect-gouv/hyyypertool/commit/da8449e2e85626275a7a30bf7a6c615fbfdbb83b))
- Revert "chore(lock): update lockfile" ([c1a172d](https://github.com/proconnect-gouv/hyyypertool/commit/c1a172de79470b72c5959ce6fa69dbbbc3bad04d))

## [2024.11.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.4...2024.11.5) (2024-11-27)

### Features

- **organization:** remove free email domains from the table ([#661](https://github.com/proconnect-gouv/hyyypertool/issues/661)) ([7250ed1](https://github.com/proconnect-gouv/hyyypertool/commit/7250ed1fbc744686b4e1c767444c7bec8a322ca7))

## [2024.11.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.3...2024.11.4) (2024-11-21)

### Features

- **moderation:** add gendarmerie agent response ([#656](https://github.com/proconnect-gouv/hyyypertool/issues/656)) ([241e7d8](https://github.com/proconnect-gouv/hyyypertool/commit/241e7d89223071a31cc0f26dd8bbb3b022181a29))
- **moderation:** update deprecated [@conseiller-numerique](https://github.com/conseiller-numerique).fr ([#660](https://github.com/proconnect-gouv/hyyypertool/issues/660)) ([6f67195](https://github.com/proconnect-gouv/hyyypertool/commit/6f671956c45b5709e490f8f04bafc627309f8759))

## [2024.11.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.2...2024.11.3) (2024-11-19)

### Features

- **moderation:** add invalid teacher email response ([#645](https://github.com/proconnect-gouv/hyyypertool/issues/645)) ([166cf46](https://github.com/proconnect-gouv/hyyypertool/commit/166cf469337d0e3ccf5b604464883d3ad7f495a9))
- **moderation:** add min armee pec response ([#649](https://github.com/proconnect-gouv/hyyypertool/issues/649)) ([2bd0c2f](https://github.com/proconnect-gouv/hyyypertool/commit/2bd0c2f0c7a74ea6dad714ae827d35e2f1989f82))
- **moderation:** add min armee terre marine musee response ([#648](https://github.com/proconnect-gouv/hyyypertool/issues/648)) ([a0eafe9](https://github.com/proconnect-gouv/hyyypertool/commit/a0eafe95530c77aae4e43f62da2d2584a9dfcd5d))
- **moderation:** add non teaching agent response ([#647](https://github.com/proconnect-gouv/hyyypertool/issues/647)) ([ca81079](https://github.com/proconnect-gouv/hyyypertool/commit/ca8107986866cf937bd5c52956f1e523098b5e50))
- **moderation:** add refusal france travail response ([#646](https://github.com/proconnect-gouv/hyyypertool/issues/646)) ([bfb89d1](https://github.com/proconnect-gouv/hyyypertool/commit/bfb89d1a65d785a72ee7463531bd562be3f90360))

## [2024.11.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.1...2024.11.2) (2024-11-15)

### Features

- **moderation:** add bad email admin centrale response ([#640](https://github.com/proconnect-gouv/hyyypertool/issues/640)) ([8419722](https://github.com/proconnect-gouv/hyyypertool/commit/8419722079a01a519ff0fe658ab708e5e36aab52))
- **moderation:** add min armee response ([#639](https://github.com/proconnect-gouv/hyyypertool/issues/639)) ([dd40ded](https://github.com/proconnect-gouv/hyyypertool/commit/dd40dedba23f792291d085b8682e41c98de784c7))
- **moderation:** add link with chosen orga response ([#644](https://github.com/proconnect-gouv/hyyypertool/issues/644)) ([e15cbd6](https://github.com/proconnect-gouv/hyyypertool/commit/e15cbd6310129f24d28544939798adaada206510))
- **moderation:** add public or private orga response ([#642](https://github.com/proconnect-gouv/hyyypertool/issues/642)) ([388be47](https://github.com/proconnect-gouv/hyyypertool/commit/388be4764df92dc048a94201b217ecf509522126))
- **ui:** hide the menu when you click elsewhere ([#643](https://github.com/proconnect-gouv/hyyypertool/issues/643)) ([b913f1b](https://github.com/proconnect-gouv/hyyypertool/commit/b913f1b7bfea637f3f70efbfb43fe74297c0be3b))

## [2024.11.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.11.0...2024.11.1) (2024-11-14)

### Bug Fixes

- **moderations:** bold needs spaces ([#632](https://github.com/proconnect-gouv/hyyypertool/issues/632)) ([8081ffa](https://github.com/proconnect-gouv/hyyypertool/commit/8081ffa67fa638da055e2bab9623f79f29a18e51))

### Features

- **moderation:** add occupation incorrectly entered not blocking re… ([#638](https://github.com/proconnect-gouv/hyyypertool/issues/638)) ([e9906d1](https://github.com/proconnect-gouv/hyyypertool/commit/e9906d1096f348fdf41c84d041db53398f637f52))
- **moderation:** add occupation incorrectly entered response ([#637](https://github.com/proconnect-gouv/hyyypertool/issues/637)) ([69df1a4](https://github.com/proconnect-gouv/hyyypertool/commit/69df1a4d3ae736271c6f289794bf01010581a2e7))
- **moderation:** add response name incorrectly entered ([#636](https://github.com/proconnect-gouv/hyyypertool/issues/636)) ([60a1a60](https://github.com/proconnect-gouv/hyyypertool/commit/60a1a60f997f8af73ecb7f9b228b9f99e0a133f9))
- **moderation:** add enseignant agricole response ([#630](https://github.com/proconnect-gouv/hyyypertool/issues/630)) ([c72dd88](https://github.com/proconnect-gouv/hyyypertool/commit/c72dd88d2ce6c9a71e61a3014d5f6781de6d12d2))
- **moderation:** add first name & last name reversed response ([#635](https://github.com/proconnect-gouv/hyyypertool/issues/635)) ([945c9f0](https://github.com/proconnect-gouv/hyyypertool/commit/945c9f0e99482f5a07e1c3489b50336d238b55c8))
- **moderation:** add missing name response ([#633](https://github.com/proconnect-gouv/hyyypertool/issues/633)) ([6ea5bf5](https://github.com/proconnect-gouv/hyyypertool/commit/6ea5bf5312f22feb0978d2c2c2c021e977fe9f1a))

# [2024.11.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.8...2024.11.0) (2024-11-05)

### Features

- **moderation:** add deprecated conseiller numerique email ([#624](https://github.com/proconnect-gouv/hyyypertool/issues/624)) ([a78eb04](https://github.com/proconnect-gouv/hyyypertool/commit/a78eb041be4bbe70df98f5c87dc841b8adab52c9))

## [2024.10.8](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.7...2024.10.8) (2024-10-29)

### Bug Fixes

- **moderations:** rename MonComptePro to ProConnect in responses ([#618](https://github.com/proconnect-gouv/hyyypertool/issues/618)) ([d8286fe](https://github.com/proconnect-gouv/hyyypertool/commit/d8286fe78e2de3fe3536751b957679b85e0dc619))
- **organization:** do not allow domains with @ char ([#609](https://github.com/proconnect-gouv/hyyypertool/issues/609)) ([ab2ce83](https://github.com/proconnect-gouv/hyyypertool/commit/ab2ce83345b054ef8259aadaa71ad387daa3092f))

## [2024.10.7](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.6...2024.10.7) (2024-10-16)

### Features

- **organization:** remove domain email ([#598](https://github.com/proconnect-gouv/hyyypertool/issues/598)) ([521ac37](https://github.com/proconnect-gouv/hyyypertool/commit/521ac37b72785bb1f80d59d448210ea95e5ce61c))

## [2024.10.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.5...2024.10.6) (2024-10-15)

### Features

- **users:** allow search on family and given name too ([#597](https://github.com/proconnect-gouv/hyyypertool/issues/597)) ([4be0653](https://github.com/proconnect-gouv/hyyypertool/commit/4be06531336901f881aa411efedcd5773bf069a4))

## [2024.10.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.4...2024.10.5) (2024-10-09)

### Bug Fixes

- **moderation:** validate user as internal by default ([#588](https://github.com/proconnect-gouv/hyyypertool/issues/588)) ([68822e0](https://github.com/proconnect-gouv/hyyypertool/commit/68822e0be08e28e4cc5285428dcd2ccb119632cb))

## [2024.10.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.3...2024.10.4) (2024-10-08)

### Bug Fixes

- **api:** hx_urls regression ([a31591d](https://github.com/proconnect-gouv/hyyypertool/commit/a31591d6f5511774465c60710db812eb22de35a4))

### Features

- **moderation:** reduce spacing size ([#576](https://github.com/proconnect-gouv/hyyypertool/issues/576)) ([551d1bc](https://github.com/proconnect-gouv/hyyypertool/commit/551d1bc485878b1f38cf326e72d78e1a1f820bcf))
- **moderation:** remove member when reproessing a moderation ([#577](https://github.com/proconnect-gouv/hyyypertool/issues/577)) ([09b9f31](https://github.com/proconnect-gouv/hyyypertool/commit/09b9f313221f77516eac0281a44092e3253fbfb0))
- **ui:** active page indicator ([#573](https://github.com/proconnect-gouv/hyyypertool/issues/573)) ([16792ed](https://github.com/proconnect-gouv/hyyypertool/commit/16792ed0ce46b0bb5a1b5f8a9e911635c3085abd))
- **ui:** move moderation header to ui layeur ([#574](https://github.com/proconnect-gouv/hyyypertool/issues/574)) ([c5ba4d3](https://github.com/proconnect-gouv/hyyypertool/commit/c5ba4d305a6aecbb931b33da9955335ac05262e7))

## [2024.10.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.2...2024.10.3) (2024-10-03)

### Bug Fixes

- **organization:** display the libelle of NAF/APE again ([#569](https://github.com/proconnect-gouv/hyyypertool/issues/569)) ([2a442db](https://github.com/proconnect-gouv/hyyypertool/commit/2a442dbd822c39350acf335c80e77ad5f14ba30a))

## [2024.10.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.1...2024.10.2) (2024-10-02)

### Features

- **welcome:** proconnect button ([#566](https://github.com/proconnect-gouv/hyyypertool/issues/566)) ([43714e1](https://github.com/proconnect-gouv/hyyypertool/commit/43714e107188041a5825fefe289b81378250203c))

## [2024.10.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.10.0...2024.10.1) (2024-10-02)

### Features

- **welcome:** proconnect button ish ([#565](https://github.com/proconnect-gouv/hyyypertool/issues/565)) ([a23333f](https://github.com/proconnect-gouv/hyyypertool/commit/a23333fbed27d2bcd314862cd871f292e324eaa8))

# [2024.10.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.8...2024.10.0) (2024-10-02)

### Bug Fixes

- **organization:** display the libelle of NAF/APE ([#562](https://github.com/proconnect-gouv/hyyypertool/issues/562)) ([797f070](https://github.com/proconnect-gouv/hyyypertool/commit/797f0703551b38dba4784f1459ad6473e3611236))

### Features

- **domains:** add refused verification type ([#553](https://github.com/proconnect-gouv/hyyypertool/issues/553)) ([4726159](https://github.com/proconnect-gouv/hyyypertool/commit/47261591f3c63b7cd3ca10d792c4add39380cf58))
- **moderation:** hide domaines by default ([#564](https://github.com/proconnect-gouv/hyyypertool/issues/564)) ([72bcc5b](https://github.com/proconnect-gouv/hyyypertool/commit/72bcc5b002b79ed167b77f89169a8f91b51cab2e))
- **moderation:** hide exchanges by default ([#563](https://github.com/proconnect-gouv/hyyypertool/issues/563)) ([29b16ed](https://github.com/proconnect-gouv/hyyypertool/commit/29b16edaca0ef1241c28e261d402579e1fdb7e18))
- **users:** gmail gouv users kpi ([#561](https://github.com/proconnect-gouv/hyyypertool/issues/561)) ([881dbde](https://github.com/proconnect-gouv/hyyypertool/commit/881dbdea9015405ef01bb26aa14ae908254ac632))

## [2024.9.8](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.7...2024.9.8) (2024-09-30)

### Bug Fixes

- **organization:** keep the same ids for table and search ([#551](https://github.com/proconnect-gouv/hyyypertool/issues/551)) ([624d8a7](https://github.com/proconnect-gouv/hyyypertool/commit/624d8a75f47a74703ccd5d895dd8962fca1d6efc))

### Features

- **app:** add set_context_variables middleware ([#547](https://github.com/proconnect-gouv/hyyypertool/issues/547)) ([42d8dbe](https://github.com/proconnect-gouv/hyyypertool/commit/42d8dbef4979f809c2184cc9fab7ddf5c6904e82))
- **domains:** remove free domains from the list ([#541](https://github.com/proconnect-gouv/hyyypertool/issues/541)) ([7fa8c2f](https://github.com/proconnect-gouv/hyyypertool/commit/7fa8c2fafe9efc55b6784db25f51cb2b0a62c18c))
- **organization:** change action wording ([#548](https://github.com/proconnect-gouv/hyyypertool/issues/548)) ([54066f1](https://github.com/proconnect-gouv/hyyypertool/commit/54066f1baf9f498c2b4e44988543d11a25b70851))
- **organization:** change clipboard icon ([#550](https://github.com/proconnect-gouv/hyyypertool/issues/550)) ([7a7efce](https://github.com/proconnect-gouv/hyyypertool/commit/7a7efceb32c4f309797125cf8df8ea3fc1f86a13))

## [2024.9.7](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.6...2024.9.7) (2024-09-25)

### Bug Fixes

- **users:** sort by id for same created at date ([#528](https://github.com/proconnect-gouv/hyyypertool/issues/528)) ([4c09935](https://github.com/proconnect-gouv/hyyypertool/commit/4c099350d09e5fdd76af92723f10c67ceaa398ad))

### Features

- **organisation:** fold organization members by default ([#539](https://github.com/proconnect-gouv/hyyypertool/issues/539)) ([d8418aa](https://github.com/proconnect-gouv/hyyypertool/commit/d8418aa1255c40fc9b136c048586b23f29a4e8b6))
- **organisation:** share organization info from moderation ([#500](https://github.com/proconnect-gouv/hyyypertool/issues/500)) ([92037e7](https://github.com/proconnect-gouv/hyyypertool/commit/92037e7794c35a6f351baca9cee3f9779255bb8a)), closes [#459](https://github.com/proconnect-gouv/hyyypertool/issues/459)

## [2024.9.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.5...2024.9.6) (2024-09-17)

### Bug Fixes

- **icon:** display icons from dsfr 🤓 ([#526](https://github.com/proconnect-gouv/hyyypertool/issues/526)) ([77f5c31](https://github.com/proconnect-gouv/hyyypertool/commit/77f5c31c9beed94ab410fe6ff389385782850e9f))

## [2024.9.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.4...2024.9.5) (2024-09-17)

### Features

- **moderation:** auto mark as resolved ([#525](https://github.com/proconnect-gouv/hyyypertool/issues/525)) ([1d6301e](https://github.com/proconnect-gouv/hyyypertool/commit/1d6301ee5fbebadb575fb8b3fb244c0f8181ff0f))

## [2024.9.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.3...2024.9.4) (2024-09-12)

## [2024.9.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.2...2024.9.3) (2024-09-12)

### Features

- **email:** add invalid_job template ([93ca782](https://github.com/proconnect-gouv/hyyypertool/commit/93ca782093fcdb2f05fa9e22a840a5daeb802806))

## [2024.9.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.1...2024.9.2) (2024-09-10)

### Bug Fixes

- **organization:** retrict user organization field select query ([#512](https://github.com/proconnect-gouv/hyyypertool/issues/512)) ([83ad426](https://github.com/proconnect-gouv/hyyypertool/commit/83ad426bc9234d6f16308cb8e674eb4518811169))

## [2024.9.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.9.0...2024.9.1) (2024-09-09)

### Bug Fixes

- **organization:** retrict user field select query ([#502](https://github.com/proconnect-gouv/hyyypertool/issues/502)) ([4f9d81a](https://github.com/proconnect-gouv/hyyypertool/commit/4f9d81a9256e5899b1606df76ca2588bbb89a7bd))

# [2024.9.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.8.4...2024.9.0) (2024-09-09)

### Reverts

- Revert "chore(deps): bump @happy-dom/global-registrator from 14.12.3 to 15.7.…" (#496) ([faa1ec6](https://github.com/proconnect-gouv/hyyypertool/commit/faa1ec640216e15dbc64e94208b4b716e6f56584)), closes [#496](https://github.com/proconnect-gouv/hyyypertool/issues/496)

## [2024.8.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.8.3...2024.8.4) (2024-08-29)

### Bug Fixes

- **moderation:** add nickname to new conversatino ([a5337f4](https://github.com/proconnect-gouv/hyyypertool/commit/a5337f43f786aed9282f7815ff652ff72c4ce794))

## [2024.8.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.8.2...2024.8.3) (2024-08-29)

### Features

- **domains:** add copy button next the domain name ([#472](https://github.com/proconnect-gouv/hyyypertool/issues/472)) ([f9bb9bb](https://github.com/proconnect-gouv/hyyypertool/commit/f9bb9bb40cf8d3be2bd1adb08a9b6900cba58473)), closes [#463](https://github.com/proconnect-gouv/hyyypertool/issues/463)
- **domains:** exclude unipersonnelle organizations ([#475](https://github.com/proconnect-gouv/hyyypertool/issues/475)) ([f50c6f2](https://github.com/proconnect-gouv/hyyypertool/commit/f50c6f2eecaba640b121ffbdec19f226eeb72c76)), closes [#457](https://github.com/proconnect-gouv/hyyypertool/issues/457)
- **domains:** order by member_count ([#474](https://github.com/proconnect-gouv/hyyypertool/issues/474)) ([08d7f8b](https://github.com/proconnect-gouv/hyyypertool/commit/08d7f8b905ab225f51fdb1c26a4ef5654ee97946))
- **moderation:** support crisp tickets ([#485](https://github.com/proconnect-gouv/hyyypertool/issues/485)) ([9dfd604](https://github.com/proconnect-gouv/hyyypertool/commit/9dfd604a4b6e9a4042316ee10ce5d2fdcedf20fe))

## [2024.8.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.8.1...2024.8.2) (2024-08-21)

### Bug Fixes

- **domain:** line order and crazy refresh ([#470](https://github.com/proconnect-gouv/hyyypertool/issues/470)) ([cf0b10c](https://github.com/proconnect-gouv/hyyypertool/commit/cf0b10c89a71218a3e3c32f6f8ea8501b3494c7b)), closes [#465](https://github.com/proconnect-gouv/hyyypertool/issues/465)
- **domains:** search not working due to query typo ([#468](https://github.com/proconnect-gouv/hyyypertool/issues/468)) ([e5a0f1f](https://github.com/proconnect-gouv/hyyypertool/commit/e5a0f1fafbf85f82c00f8005ff3c88de1676d480)), closes [#461](https://github.com/proconnect-gouv/hyyypertool/issues/461)

### Features

- **domains:** add verification link on the row ([#471](https://github.com/proconnect-gouv/hyyypertool/issues/471)) ([9505c44](https://github.com/proconnect-gouv/hyyypertool/commit/9505c4430132304dc0a5ef3304ca324fb6a82e37)), closes [#464](https://github.com/proconnect-gouv/hyyypertool/issues/464)

## [2024.8.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.8.0...2024.8.1) (2024-08-06)

### Bug Fixes

- **domains:** list null verification_type ([7556c83](https://github.com/proconnect-gouv/hyyypertool/commit/7556c83b9140343d5f1b7223bada6f0fd4a68e93))

### Features

- **domains:** autorized if null ([ed417e0](https://github.com/proconnect-gouv/hyyypertool/commit/ed417e067fba4871f8e6fab82ce20fe48095b3b6))

# [2024.8.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.6...2024.8.0) (2024-08-01)

### Bug Fixes

- **ui:** use fr-FR rules ([#429](https://github.com/proconnect-gouv/hyyypertool/issues/429)) ([6a57496](https://github.com/proconnect-gouv/hyyypertool/commit/6a574968cc7eb8d50c9726a527b57a1d54307dfd))

### Features

- **moderation:** use details on organization members ([#424](https://github.com/proconnect-gouv/hyyypertool/issues/424)) ([a0dbaec](https://github.com/proconnect-gouv/hyyypertool/commit/a0dbaecafc725b573f7f0294d96ace6741ded3e7))
- **users:** add confirm before deleting a user account ([#423](https://github.com/proconnect-gouv/hyyypertool/issues/423)) ([72177da](https://github.com/proconnect-gouv/hyyypertool/commit/72177dac4c010a876d7694f03d4aefa3dc0e733e))

## [2024.7.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.5...2024.7.6) (2024-07-29)

### Bug Fixes

- **database:** uncomment migration script ([02719b6](https://github.com/proconnect-gouv/hyyypertool/commit/02719b6cbd8aedf9b19e801097ebbc74fa29a742))
- **organization:** update the updated_at ([#410](https://github.com/proconnect-gouv/hyyypertool/issues/410)) ([dd4e95d](https://github.com/proconnect-gouv/hyyypertool/commit/dd4e95d56f728851dd6c257373fa5b1f8a115776))

### Features

- **moderation:** use identite sdk ([2ccca91](https://github.com/proconnect-gouv/hyyypertool/commit/2ccca9102a74f8f33f66310b0b940794affd3b0a))
- **identite:** refactor moderations ([#411](https://github.com/proconnect-gouv/hyyypertool/issues/411)) ([f193b79](https://github.com/proconnect-gouv/hyyypertool/commit/f193b7934690d79e884c16477995e66d34300d53))

## [2024.7.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.4...2024.7.5) (2024-07-19)

### Bug Fixes

- **organization:** keep page after row action ([#409](https://github.com/proconnect-gouv/hyyypertool/issues/409)) ([47c2008](https://github.com/proconnect-gouv/hyyypertool/commit/47c20081981b56be8e751a36503c896279083c6a)), closes [#347](https://github.com/proconnect-gouv/hyyypertool/issues/347)

### Features

- **moderations:** add profile detail section ([#407](https://github.com/proconnect-gouv/hyyypertool/issues/407)) ([445c84e](https://github.com/proconnect-gouv/hyyypertool/commit/445c84ef94a41110fe609eb8d711c0cc11f93769)), closes [#330](https://github.com/proconnect-gouv/hyyypertool/issues/330) [#84](https://github.com/proconnect-gouv/hyyypertool/issues/84)

### Performance Improvements

- **user:** exact column user query ([#405](https://github.com/proconnect-gouv/hyyypertool/issues/405)) ([a8b5f23](https://github.com/proconnect-gouv/hyyypertool/commit/a8b5f23c7377a7d932b3d51c4829a5fbf193b76e))

## [2024.7.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.3...2024.7.4) (2024-07-18)

### Bug Fixes

- **app:** do not overwrite existing env variables ([#402](https://github.com/proconnect-gouv/hyyypertool/issues/402)) ([cc404f6](https://github.com/proconnect-gouv/hyyypertool/commit/cc404f6613e9d47f0622caa54d0182658ea3555f))

## [2024.7.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.2...2024.7.3) (2024-07-17)

### Features

- **organisations:** add google search per domain ([#401](https://github.com/proconnect-gouv/hyyypertool/issues/401)) ([1142674](https://github.com/proconnect-gouv/hyyypertool/commit/1142674b8e877b9e75acb5a75676ffe2266402f0)), closes [#377](https://github.com/proconnect-gouv/hyyypertool/issues/377)
- **organisations:** add no_validation_means_available ([#400](https://github.com/proconnect-gouv/hyyypertool/issues/400)) ([99c9605](https://github.com/proconnect-gouv/hyyypertool/commit/99c9605eb0b062dd3ec2163160575d7de159c277)), closes [#21](https://github.com/proconnect-gouv/hyyypertool/issues/21) [#378](https://github.com/proconnect-gouv/hyyypertool/issues/378)

## [2024.7.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.1...2024.7.2) (2024-07-04)

### Bug Fixes

- **sentry:** use global scope on HEAD and OPTIONS requests ([#386](https://github.com/proconnect-gouv/hyyypertool/issues/386)) ([4c58d0b](https://github.com/proconnect-gouv/hyyypertool/commit/4c58d0b13546caa9520215acf7aca716af843b24))

### Features

- **organizations:** preview unverified domaines in the table ([#385](https://github.com/proconnect-gouv/hyyypertool/issues/385)) ([9249283](https://github.com/proconnect-gouv/hyyypertool/commit/92492830299ef313956d73bd8dd98a92071ef567))

## [2024.7.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.7.0...2024.7.1) (2024-07-03)

### Bug Fixes

- **organization:** wrong moderated member calc ([#379](https://github.com/proconnect-gouv/hyyypertool/issues/379)) ([b00b804](https://github.com/proconnect-gouv/hyyypertool/commit/b00b804ecb5175daf78f39e72a510bfcbf57ea3c))

# [2024.7.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.6.4...2024.7.0) (2024-07-03)

### Features

- **organizations:** new /organizations/domaines page ([#366](https://github.com/proconnect-gouv/hyyypertool/issues/366)) ([a9e3c9a](https://github.com/proconnect-gouv/hyyypertool/commit/a9e3c9a64f467d9e9eb207825b6996fd526523a4))

## [2024.6.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.6.3...2024.6.4) (2024-06-27)

### Features

- **moderation:** add chorus pro error response ([#365](https://github.com/proconnect-gouv/hyyypertool/issues/365)) ([4b65294](https://github.com/proconnect-gouv/hyyypertool/commit/4b652947fcb39580df4343fd4289ec37e726a609))
- **moderation:** remove chorus pro response ([#364](https://github.com/proconnect-gouv/hyyypertool/issues/364)) ([56afda6](https://github.com/proconnect-gouv/hyyypertool/commit/56afda6c6540071998746fb25ca2206a3a488eb1))

## [2024.6.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.6.2...2024.6.3) (2024-06-27)

## [2024.6.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.6.1...2024.6.2) (2024-06-26)

### Features

- **moderation:** only list email of user with the same family name ([#342](https://github.com/proconnect-gouv/hyyypertool/issues/342)) ([84c9e15](https://github.com/proconnect-gouv/hyyypertool/commit/84c9e15e490ca37ff8c195c127ce47100e62da8b))
- **moderations:** remoe datapass link ([#361](https://github.com/proconnect-gouv/hyyypertool/issues/361)) ([ed30786](https://github.com/proconnect-gouv/hyyypertool/commit/ed30786cbd2ca9f3e146e451fe13e7c63c54f564))

## [2024.6.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.6.0...2024.6.1) (2024-06-21)

### Bug Fixes

- **moderations:** leader list link use siren ([#344](https://github.com/proconnect-gouv/hyyypertool/issues/344)) ([9e84b1e](https://github.com/proconnect-gouv/hyyypertool/commit/9e84b1ec36ee550562294baba27046320499df39))

### Features

- **moderation:** replace id by adresse ([#341](https://github.com/proconnect-gouv/hyyypertool/issues/341)) ([7cdad68](https://github.com/proconnect-gouv/hyyypertool/commit/7cdad685c3b0881e521c2c0cc6cb8aa76ee11803))
- **moderations:** add see leader list link ([#343](https://github.com/proconnect-gouv/hyyypertool/issues/343)) ([78c486e](https://github.com/proconnect-gouv/hyyypertool/commit/78c486e66d90fecb1c8f65b68f64a57879618068))

# [2024.6.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.5.0...2024.6.0) (2024-06-17)

### Bug Fixes

- **zammad:** no more immutable errors ([#294](https://github.com/proconnect-gouv/hyyypertool/issues/294)) ([1b4f5f3](https://github.com/proconnect-gouv/hyyypertool/commit/1b4f5f3847eea0aa639e11e655e81b2a375c6efe))

# [2024.5.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.4.3...2024.5.0) (2024-05-21)

### Bug Fixes

- **app:** typo on error page ([5397afa](https://github.com/proconnect-gouv/hyyypertool/commit/5397afaea10fe936c3bcfdbf8bda07cf3bcdeed3))
- **pkg:** update dependencies ([#276](https://github.com/proconnect-gouv/hyyypertool/issues/276)) ([fb35235](https://github.com/proconnect-gouv/hyyypertool/commit/fb352355feedbe62470f6da4a5acd7b257b31dff))

### Features

- **identite:** update database schema ([#284](https://github.com/proconnect-gouv/hyyypertool/issues/284)) ([4f1fea1](https://github.com/proconnect-gouv/hyyypertool/commit/4f1fea1e33eb3fa76500121902c62e0c69f17629))

### Reverts

- Revert "chore(deps-dev): bump drizzle-kit from 0.20.17 to 0.21.1 (#270)" ([5054e51](https://github.com/proconnect-gouv/hyyypertool/commit/5054e5184f130680ee4e1fc23e61a8a89082a522)), closes [#270](https://github.com/proconnect-gouv/hyyypertool/issues/270)

## [2024.4.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.4.2...2024.4.3) (2024-04-26)

## [2024.4.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.4.1...2024.4.2) (2024-04-25)

### Features

- **app:** allow sentry tracing ([#233](https://github.com/proconnect-gouv/hyyypertool/issues/233)) ([184f9a3](https://github.com/proconnect-gouv/hyyypertool/commit/184f9a326805cd4b4ca7f7c882ee984a6bd7abe3))

## [2024.4.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.4.0...2024.4.1) (2024-04-22)

### Features

- **app:** try attachStacktrace on sentry ([e932238](https://github.com/proconnect-gouv/hyyypertool/commit/e9322382fb568cae9a242445f240d9f4c6007f65))
- **app:** use hono/compress ([#191](https://github.com/proconnect-gouv/hyyypertool/issues/191)) ([16e3013](https://github.com/proconnect-gouv/hyyypertool/commit/16e301397abe84e3f5dede129a51f8817076d7b7))

# [2024.4.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.14...2024.4.0) (2024-04-15)

### Features

- **moderation:** add reponse for Chorus Pro ([#190](https://github.com/proconnect-gouv/hyyypertool/issues/190)) ([4c532f9](https://github.com/proconnect-gouv/hyyypertool/commit/4c532f90eb3ee247a3ebd527fba7290de4ede839))

## [2024.3.14](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.13...2024.3.14) (2024-03-28)

### Features

- **moderation:** list the family similar user ([#171](https://github.com/proconnect-gouv/hyyypertool/issues/171)) ([b0cccf9](https://github.com/proconnect-gouv/hyyypertool/commit/b0cccf9594f776b7089d3a050773df1516ce9af8))

## [2024.3.13](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.12...2024.3.13) (2024-03-28)

### Bug Fixes

- **organization:** ensure to remove unknow depot date form the document list ([#169](https://github.com/proconnect-gouv/hyyypertool/issues/169)) ([590b88a](https://github.com/proconnect-gouv/hyyypertool/commit/590b88a4cd86715904624b9c535b8338b7053255))

## [2024.3.12](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.11...2024.3.12) (2024-03-28)

### Features

- **moderation:** detect same user name ([#167](https://github.com/proconnect-gouv/hyyypertool/issues/167)) ([fe49d69](https://github.com/proconnect-gouv/hyyypertool/commit/fe49d690677362bffefcd91c7c328a96ea4af61a))

## [2024.3.11](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.10...2024.3.11) (2024-03-27)

### Bug Fixes

- **moderation:** go back after mark as processed ([#164](https://github.com/proconnect-gouv/hyyypertool/issues/164)) ([8cacecd](https://github.com/proconnect-gouv/hyyypertool/commit/8cacecdda3c15b7ff1e6c1bd8ea260e8118bdd15)), closes [#161](https://github.com/proconnect-gouv/hyyypertool/issues/161)
- **moderations:** force autoreload on load ([#165](https://github.com/proconnect-gouv/hyyypertool/issues/165)) ([431b3dc](https://github.com/proconnect-gouv/hyyypertool/commit/431b3dc23636bcd2aefc0aab3ff3e9554b7bbdb0))

## [2024.3.10](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.9...2024.3.10) (2024-03-27)

### Bug Fixes

- **moderation:** allow to refuse without notifying the user ([#162](https://github.com/proconnect-gouv/hyyypertool/issues/162)) ([dda6df2](https://github.com/proconnect-gouv/hyyypertool/commit/dda6df2ecf4f6bb16fbe56568b46ae5f4913cc9b))

## [2024.3.9](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.8...2024.3.9) (2024-03-27)

### Features

- **moderation:** guess if already member ([#157](https://github.com/proconnect-gouv/hyyypertool/issues/157)) ([a1a7a72](https://github.com/proconnect-gouv/hyyypertool/commit/a1a7a72b49852877fb599d748fb31da1712f2022))

## [2024.3.8](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.7...2024.3.8) (2024-03-26)

### Features

- **app:** update api pattern ([#155](https://github.com/proconnect-gouv/hyyypertool/issues/155)) ([169eab8](https://github.com/proconnect-gouv/hyyypertool/commit/169eab806cd49b7c85abfdc516af26bce0cd1300))
- **moderation:** send notification with a checkbox ([#156](https://github.com/proconnect-gouv/hyyypertool/issues/156)) ([5ff96da](https://github.com/proconnect-gouv/hyyypertool/commit/5ff96da77a7b0383f8deea1bafa2641bd7f66525))

## [2024.3.7](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.6...2024.3.7) (2024-03-25)

### Features

- **moderation:** use comment field as history ([#154](https://github.com/proconnect-gouv/hyyypertool/issues/154)) ([5136473](https://github.com/proconnect-gouv/hyyypertool/commit/5136473060fe0db957b5d7ef3e18e57540ef230a))

## [2024.3.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.5...2024.3.6) (2024-03-25)

### Bug Fixes

- **app:** do not change header of finalized context ([f303930](https://github.com/proconnect-gouv/hyyypertool/commit/f30393099a8f46f5e79df316774642b92b06eeb6))
- **app:** type error immutable header ([1f1f8ad](https://github.com/proconnect-gouv/hyyypertool/commit/1f1f8ada8f4a4ce4115e93b52179403ec34d73f3))
- **ui:** Rrrr typo ([831bd46](https://github.com/proconnect-gouv/hyyypertool/commit/831bd460acb9e51db389e94a949e2456d8f39c56))
- **users:** false empty organization ([#146](https://github.com/proconnect-gouv/hyyypertool/issues/146)) ([1ed11c2](https://github.com/proconnect-gouv/hyyypertool/commit/1ed11c2df5357936916e0e45cb9a8ef934d14b5b))

### Features

- **infra:** use join to concat path ([41262fa](https://github.com/proconnect-gouv/hyyypertool/commit/41262fa99ca3728fe4962591e799ed727f925d2a))
- **moderation:** add domain through the action panel ([#142](https://github.com/proconnect-gouv/hyyypertool/issues/142)) ([a4ffcdc](https://github.com/proconnect-gouv/hyyypertool/commit/a4ffcdc96c4d00ea6123b9fad5e9f44774b5b150))
- **moderation:** add extra reject fields ([3e92517](https://github.com/proconnect-gouv/hyyypertool/commit/3e925172249128062799d376469b6738ead1ab2c))
- **moderation:** desicison section first iteration ([#141](https://github.com/proconnect-gouv/hyyypertool/issues/141)) ([5d43bba](https://github.com/proconnect-gouv/hyyypertool/commit/5d43bba2b604bae36293cfa73e6fadeb580a3786))
- **moderation:** each response is a file ([8dcd263](https://github.com/proconnect-gouv/hyyypertool/commit/8dcd26388aab90326c9c1decf6fa9e202f787136))
- **moderation:** refresh user oganization table ([#136](https://github.com/proconnect-gouv/hyyypertool/issues/136)) ([11767b6](https://github.com/proconnect-gouv/hyyypertool/commit/11767b6947059596bdcf214f7b4533b915c5ac25))
- **moderation:** rejected behavior ([#148](https://github.com/proconnect-gouv/hyyypertool/issues/148)) ([f114e92](https://github.com/proconnect-gouv/hyyypertool/commit/f114e92d90c09104c817fce740e2999e6e60b892))
- **moderation:** use checkbox too add member ([#153](https://github.com/proconnect-gouv/hyyypertool/issues/153)) ([b8b6606](https://github.com/proconnect-gouv/hyyypertool/commit/b8b66067a4b4ac19689ea0770d7cddc73019518a))
- **ui:** add copy_to_clipboard script ([#143](https://github.com/proconnect-gouv/hyyypertool/issues/143)) ([f325046](https://github.com/proconnect-gouv/hyyypertool/commit/f3250467f2fe7cb80bbd795b7b1f416879ad2464))
- **user:** change job label ([384ac9c](https://github.com/proconnect-gouv/hyyypertool/commit/384ac9cf9838bbc991de12b6dfdad831954cf176))
- **user:** change job label (2) ([04c444c](https://github.com/proconnect-gouv/hyyypertool/commit/04c444c9b627bed0e928121c885d850b9a642277))

### Reverts

- Revert "chore(deps): update dependencies" ([5148feb](https://github.com/proconnect-gouv/hyyypertool/commit/5148febe00ba47faecdf3531899b2f9cdda88768))

## [2024.3.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.4...2024.3.5) (2024-03-12)

### Bug Fixes

- **moderation:** safe parse pagination ([27ee0ec](https://github.com/proconnect-gouv/hyyypertool/commit/27ee0ece52372e0c4f4095740b13ee816f2eeb73))
- **moderation:** to is undefined for tsx ([3442486](https://github.com/proconnect-gouv/hyyypertool/commit/34424860ed17fb13894ef4a55c1f19b579312f35))

## [2024.3.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.3...2024.3.4) (2024-03-12)

### Bug Fixes

- **scalingo:** use bun v1.0.21 ([5d7c875](https://github.com/proconnect-gouv/hyyypertool/commit/5d7c875f42544cea55cf8a275c3c6f25d296fc73))
- **scalingo:** use bun v1.0.22 ([668d3db](https://github.com/proconnect-gouv/hyyypertool/commit/668d3dbdd5916ef0e3f2ba2f816a596ef6c548f9))
- **scalingo:** use bun v1.0.23 ([56e7615](https://github.com/proconnect-gouv/hyyypertool/commit/56e7615e251a5c5d38e8d82a3a9f0cb8c32c5c2d))

### Features

- **ui:** add refresh button ([#138](https://github.com/proconnect-gouv/hyyypertool/issues/138)) ([8d1ba3d](https://github.com/proconnect-gouv/hyyypertool/commit/8d1ba3d9ce09c50dbb5f79f86f865c0763802649))

### Reverts

- **scalingo:** node id needed now ([61d714f](https://github.com/proconnect-gouv/hyyypertool/commit/61d714f70a6946cba69d473f7c81ecfaa7347011))
- **scalingo:** use bun v1.0.30 ([1f5905d](https://github.com/proconnect-gouv/hyyypertool/commit/1f5905daa29b906f2d71a9c0f8ea2ebaed5cfb89))

## [2024.3.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.2...2024.3.3) (2024-03-08)

### Bug Fixes

- **moderation:** include the day in page request ([#137](https://github.com/proconnect-gouv/hyyypertool/issues/137)) ([9c217b4](https://github.com/proconnect-gouv/hyyypertool/commit/9c217b445ed8573d2198c3ae8a82ab83e5ed930c))

## [2024.3.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.1...2024.3.2) (2024-03-08)

### Bug Fixes

- **moderation:** ensure to use the current page on refresh ([#135](https://github.com/proconnect-gouv/hyyypertool/issues/135)) ([f7ea811](https://github.com/proconnect-gouv/hyyypertool/commit/f7ea8112632b2186d09ccbfbd558346e0f1ee89f))
- **moderation:** organization member stays empty ([#133](https://github.com/proconnect-gouv/hyyypertool/issues/133)) ([177f8ca](https://github.com/proconnect-gouv/hyyypertool/commit/177f8ca2a6d94907a36fbe72019073adb7a245a4))

### Features

- **moderation:** popover menu ([#129](https://github.com/proconnect-gouv/hyyypertool/issues/129)) ([788f664](https://github.com/proconnect-gouv/hyyypertool/commit/788f6640fb1aa24b909b490eed5036c8e9bac610))
- **moderation:** trigger reload user in organization ([#134](https://github.com/proconnect-gouv/hyyypertool/issues/134)) ([106e34c](https://github.com/proconnect-gouv/hyyypertool/commit/106e34cefa24a1ea8a95c9d8c1055da6ea0cd2e8))
- **ui:** share menu item style ([#130](https://github.com/proconnect-gouv/hyyypertool/issues/130)) ([434bb29](https://github.com/proconnect-gouv/hyyypertool/commit/434bb29b97fa75726696773aa25a4946b00d1a7c))

## [2024.3.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.3.0...2024.3.1) (2024-03-05)

### Features

- **hono-slotify:** initialisation ([#127](https://github.com/proconnect-gouv/hyyypertool/issues/127)) ([a5a461b](https://github.com/proconnect-gouv/hyyypertool/commit/a5a461bf6bdad55363c16c05a214358a46f08a84))
- **moderation:** add reponse for existing account ([#128](https://github.com/proconnect-gouv/hyyypertool/issues/128)) ([04b9cfd](https://github.com/proconnect-gouv/hyyypertool/commit/04b9cfddc96a5858e6f5f9e15ebdc5b63c7a60aa)), closes [#126](https://github.com/proconnect-gouv/hyyypertool/issues/126)

# [2024.3.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.9...2024.3.0) (2024-03-05)

### Bug Fixes

- **moderation:** parsed search query can't be nullish ([#119](https://github.com/proconnect-gouv/hyyypertool/issues/119)) ([fb8ce3f](https://github.com/proconnect-gouv/hyyypertool/commit/fb8ce3f85c14b1f406db0a491a660861ed764d5f))
- **moderation:** wrong day filter timezone ([4f05b6c](https://github.com/proconnect-gouv/hyyypertool/commit/4f05b6cfb078591369d263de7ccdfc54eebc239c)), closes [#120](https://github.com/proconnect-gouv/hyyypertool/issues/120) [#117](https://github.com/proconnect-gouv/hyyypertool/issues/117)
- **scalingo:** use bun v1.0.24 ([#118](https://github.com/proconnect-gouv/hyyypertool/issues/118)) ([474e99d](https://github.com/proconnect-gouv/hyyypertool/commit/474e99d622a94a608c51498c26c6856eecb0fec3))

### Features

- **moderation:** change organization members table ([#124](https://github.com/proconnect-gouv/hyyypertool/issues/124)) ([7d9132c](https://github.com/proconnect-gouv/hyyypertool/commit/7d9132cfd9a775b012dbc98789d3a92ce0132134))
- **moderation:** isolate action button ([#125](https://github.com/proconnect-gouv/hyyypertool/issues/125)) ([1288aeb](https://github.com/proconnect-gouv/hyyypertool/commit/1288aebe5ff8dfe57b391fa7dada2e8067918dc2))

## [2024.2.9](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.8...2024.2.9) (2024-02-29)

### Bug Fixes

- **moderation:** typo missing e to plateforme ([#113](https://github.com/proconnect-gouv/hyyypertool/issues/113)) ([c44eb76](https://github.com/proconnect-gouv/hyyypertool/commit/c44eb76e96f65cd12425268c3425e964517700cc))
- **scalingo:** use bun v1.0.25 ([#108](https://github.com/proconnect-gouv/hyyypertool/issues/108)) ([71fc4a4](https://github.com/proconnect-gouv/hyyypertool/commit/71fc4a4e6966a7d64387c38c8a83ee452b3ebdae))

### Features

- **moderations:** add day filter ([#109](https://github.com/proconnect-gouv/hyyypertool/issues/109)) ([81cb54e](https://github.com/proconnect-gouv/hyyypertool/commit/81cb54e3354bd0f926878bc44b2b89886d1c3014))

## [2024.2.8](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.7...2024.2.8) (2024-02-27)

### Bug Fixes

- **moderation:** scroll to latest message ([#104](https://github.com/proconnect-gouv/hyyypertool/issues/104)) ([0c498e6](https://github.com/proconnect-gouv/hyyypertool/commit/0c498e6872340b7a36537b786c71d27d3ba9cb7e))

## [2024.2.7](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.6...2024.2.7) (2024-02-27)

### Features

- **app:** introduce hx_urls ([#96](https://github.com/proconnect-gouv/hyyypertool/issues/96)) ([45f6461](https://github.com/proconnect-gouv/hyyypertool/commit/45f646115b7be8fc4890fb8f411994e9fe77b24f))
- **app:** upgrade ui internal code ([88eec80](https://github.com/proconnect-gouv/hyyypertool/commit/88eec80dc3588aec8db150c5bc9836c5710d1af1))
- **moderation:** add not found page ([#95](https://github.com/proconnect-gouv/hyyypertool/issues/95)) ([4f87e33](https://github.com/proconnect-gouv/hyyypertool/commit/4f87e3300579506cbad57892c6e82c793a67548e))
- **moderation:** auto go back after marked as proceseed ([#98](https://github.com/proconnect-gouv/hyyypertool/issues/98)) ([62b2fd2](https://github.com/proconnect-gouv/hyyypertool/commit/62b2fd227ecf32ff5301017d4220086f6da0a999)), closes [#12](https://github.com/proconnect-gouv/hyyypertool/issues/12)
- **moderation:** better action button behaviour ([#94](https://github.com/proconnect-gouv/hyyypertool/issues/94)) ([a05ec29](https://github.com/proconnect-gouv/hyyypertool/commit/a05ec29f678024974f797eca0a964c5138dc05e2))
- **moderation:** force check show processed requests on search ([#97](https://github.com/proconnect-gouv/hyyypertool/issues/97)) ([af4ec3e](https://github.com/proconnect-gouv/hyyypertool/commit/af4ec3ee6ebf350702f4babe4ccc7ac8f3d56cc2))

## [2024.2.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.5...2024.2.6) (2024-02-20)

### Features

- **moderation:** add moderation type emoji in header ([#70](https://github.com/proconnect-gouv/hyyypertool/issues/70)) ([e0037a0](https://github.com/proconnect-gouv/hyyypertool/commit/e0037a04a37ccf0bc6b9e8b72aef12be3fbe4fda))
- **moderation:** add refus comptable response ([#72](https://github.com/proconnect-gouv/hyyypertool/issues/72)) ([d20803e](https://github.com/proconnect-gouv/hyyypertool/commit/d20803ec4d6d7af8e1bfc2ed4b46d4a34fcd9f26))
- **moderation:** inline filter form ([#74](https://github.com/proconnect-gouv/hyyypertool/issues/74)) ([49969e7](https://github.com/proconnect-gouv/hyyypertool/commit/49969e70990e32eed3a278f49a7abf2813b906a2))
- **moderations:** show the processed moderation on search ([#75](https://github.com/proconnect-gouv/hyyypertool/issues/75)) ([9a36f74](https://github.com/proconnect-gouv/hyyypertool/commit/9a36f7404d2f2405e6c441443ab2cc492f97e124))

## [2024.2.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.4...2024.2.5) (2024-02-16)

### Features

- **moderation:** add search organization and email domaine ([#69](https://github.com/proconnect-gouv/hyyypertool/issues/69)) ([7e2113f](https://github.com/proconnect-gouv/hyyypertool/commit/7e2113f08f1c76ae641c5d7916bf242042615d0b))

## [2024.2.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.3...2024.2.4) (2024-02-14)

### Bug Fixes

- **moderation:** duplicate_warning not found ([#66](https://github.com/proconnect-gouv/hyyypertool/issues/66)) ([dd252d1](https://github.com/proconnect-gouv/hyyypertool/commit/dd252d182cbe9400a244a01aefab88a42a823010))

## [2024.2.3](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.2...2024.2.3) (2024-02-12)

### Bug Fixes

- **database:** use new Date(0) ([1c9339f](https://github.com/proconnect-gouv/hyyypertool/commit/1c9339febc5844ca11d44d80d9193b587daef579))

### Features

- **database:** update identite schema ([#58](https://github.com/proconnect-gouv/hyyypertool/issues/58)) ([2814b0b](https://github.com/proconnect-gouv/hyyypertool/commit/2814b0bf27d0be3798040d45c456336ea0219272))
- **moderation:** create ticket from moderation reponse ([#61](https://github.com/proconnect-gouv/hyyypertool/issues/61)) ([3812f2b](https://github.com/proconnect-gouv/hyyypertool/commit/3812f2b9b1d60b7f4f3e0d873c3a2adcd599a8d4)), closes [#45](https://github.com/proconnect-gouv/hyyypertool/issues/45)

## [2024.2.2](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.1...2024.2.2) (2024-02-09)

### Bug Fixes

- **organization:** use common pagination schema ([#41](https://github.com/proconnect-gouv/hyyypertool/issues/41)) ([5799d4d](https://github.com/proconnect-gouv/hyyypertool/commit/5799d4d68b1d65feedb5c5b1f5d5d9acd56233ae))

### Features

- **moderation:** add refus prestataires response ([#50](https://github.com/proconnect-gouv/hyyypertool/issues/50)) ([ade5c49](https://github.com/proconnect-gouv/hyyypertool/commit/ade5c498a710330004b4d283c3a55af4a460b950))

### Reverts

- **deps:** hono dependency update ([9ea5638](https://github.com/proconnect-gouv/hyyypertool/commit/9ea5638534b11d5080b442b58c8a3b7468ffe538))

## [2024.2.1](https://github.com/proconnect-gouv/hyyypertool/compare/2024.2.0...2024.2.1) (2024-02-01)

### Features

- **moderation:** add livreurs / mobilic response ([#37](https://github.com/proconnect-gouv/hyyypertool/issues/37)) ([be490cc](https://github.com/proconnect-gouv/hyyypertool/commit/be490cc72a834d1d91c1672d7f3261965aaa816c))

# [2024.2.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.22...2024.2.0) (2024-02-01)

### Features

- allow case-insensitive search ([379c64f](https://github.com/proconnect-gouv/hyyypertool/commit/379c64ffb23b7cbb079f3f1b3474b2ec5c1ebdf0))
- **users:** display iso string ([7fbbc6b](https://github.com/proconnect-gouv/hyyypertool/commit/7fbbc6b5bbc72568fc1563118f91fc486a5ca009))

## [2024.1.22](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.21...2024.1.22) (2024-01-31)

### Bug Fixes

- link icon is just to tiny ([#34](https://github.com/proconnect-gouv/hyyypertool/issues/34)) ([57fcfaa](https://github.com/proconnect-gouv/hyyypertool/commit/57fcfaa435aa0ed3027eb19c43c9b19274ff6a34))

### Features

- **moderation:** try to guest the owner of the ticket ([#33](https://github.com/proconnect-gouv/hyyypertool/issues/33)) ([1982e35](https://github.com/proconnect-gouv/hyyypertool/commit/1982e3568f78f7d50450fe05191f9cbac87a9b14))

## [2024.1.21](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.20...2024.1.21) (2024-01-30)

### Features

- **auth:** add unauthorized page ([#30](https://github.com/proconnect-gouv/hyyypertool/issues/30)) ([49a10a7](https://github.com/proconnect-gouv/hyyypertool/commit/49a10a728c304da978733864e5718289fcc83514))

## [2024.1.20](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.19...2024.1.20) (2024-01-30)

### Features

- **moderations:** add hide join organization filter the table ([#27](https://github.com/proconnect-gouv/hyyypertool/issues/27)) ([58051ed](https://github.com/proconnect-gouv/hyyypertool/commit/58051ed930cc6d97f66321e916987a08defec7dc))

## [2024.1.19](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.18...2024.1.19) (2024-01-29)

### Bug Fixes

- **moderation:** ensure zammad send an email ([#26](https://github.com/proconnect-gouv/hyyypertool/issues/26)) ([a1a05bb](https://github.com/proconnect-gouv/hyyypertool/commit/a1a05bb9a23a553f0fcffc3f081ad475ced1a483))
- **moderations:** refresh the table when visible ([#19](https://github.com/proconnect-gouv/hyyypertool/issues/19)) ([e5a3b04](https://github.com/proconnect-gouv/hyyypertool/commit/e5a3b048e036b84fa17ccaef8533003bd4f8a0e8))
- **moderations:** the table pagination starts at 1 ([#23](https://github.com/proconnect-gouv/hyyypertool/issues/23)) ([0ae26c8](https://github.com/proconnect-gouv/hyyypertool/commit/0ae26c80432adf6cacf7de0291a522c385f0a296))
- **users:** organization member pathname bug in user routes ([8b20f41](https://github.com/proconnect-gouv/hyyypertool/commit/8b20f41fdb33acd778ec512f58c52970c0ee8ba5))

### Features

- add background activity indicator ([#22](https://github.com/proconnect-gouv/hyyypertool/issues/22)) ([8989e3f](https://github.com/proconnect-gouv/hyyypertool/commit/8989e3f9cf1434c23c47f91853f151329af6499e))
- **moderations:** make the whole moderation line clickable ([#24](https://github.com/proconnect-gouv/hyyypertool/issues/24)) ([8482d1e](https://github.com/proconnect-gouv/hyyypertool/commit/8482d1e20371f910bdd11c6efbc2e61d5af24b61))

### Reverts

- **legacy:** add confirm prompt on mark as processed buttons ([#25](https://github.com/proconnect-gouv/hyyypertool/issues/25)) ([6c6cf3d](https://github.com/proconnect-gouv/hyyypertool/commit/6c6cf3db6fc23ffec91025b615a40428182fd219))

## [2024.1.18](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.17...2024.1.18) (2024-01-26)

### Bug Fixes

- **moderation:** pathname bug in organization routes ([b319edf](https://github.com/proconnect-gouv/hyyypertool/commit/b319edfc287ba06b934b46f6b55c2180f4630672))

## [2024.1.17](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.16...2024.1.17) (2024-01-26)

### Bug Fixes

- **moderation:** extract members email in reponse ([b7e4430](https://github.com/proconnect-gouv/hyyypertool/commit/b7e443040104428cbd8f79fa1b292cec9b72ed42))
- **moderation:** list authorized_email_domains in reponse template ([8d264d0](https://github.com/proconnect-gouv/hyyypertool/commit/8d264d081139f8d25f9b48ab1e0c52225588cfb8))

### Features

- **ui:** activate globalViewTransitions ([3df9eaf](https://github.com/proconnect-gouv/hyyypertool/commit/3df9eaf995870680c33f450bb0d67336cc92fc08))

## [2024.1.16](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.15...2024.1.16) (2024-01-25)

### Bug Fixes

- **moderation:** next page ignore part of the filter ([ef326bd](https://github.com/proconnect-gouv/hyyypertool/commit/ef326bd000b767cc6f468c65f4c98a9fec16c10b))
- **moderation:** next page ignore part of the filter (2) ([50d5e31](https://github.com/proconnect-gouv/hyyypertool/commit/50d5e317532e834d0f22ee738cc76964e8641621))

## [2024.1.15](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.14...2024.1.15) (2024-01-25)

### Bug Fixes

- **moderation:** typo on moderation type label ([220d7e6](https://github.com/proconnect-gouv/hyyypertool/commit/220d7e6b930b625a977c72bd8073d6f97652ff3d))

## [2024.1.14](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.13...2024.1.14) (2024-01-25)

### Features

- **moderations:** add hide non_verified_domain ([101046d](https://github.com/proconnect-gouv/hyyypertool/commit/101046df6d021f413749266084d2107a553e75e5))

## [2024.1.13](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.12...2024.1.13) (2024-01-25)

### Bug Fixes

- **moderation:** change magic color number ([302645d](https://github.com/proconnect-gouv/hyyypertool/commit/302645d697f32b34c1b3777ef40524d4ea87007b))

### Features

- **welcome:** auto redirect to /moderation if already logged ([58973a6](https://github.com/proconnect-gouv/hyyypertool/commit/58973a678415d242a211eb602bfbcb7b447b1dcd))

## [2024.1.12](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.11...2024.1.12) (2024-01-25)

### Bug Fixes

- **common:** rename UserError to HTTPError ([2928c7e](https://github.com/proconnect-gouv/hyyypertool/commit/2928c7edf1fdde505d309788c0af28e291784bab))
- **services:** ensure to log the method on error ([ef837f3](https://github.com/proconnect-gouv/hyyypertool/commit/ef837f39ca627cede226729d0ff88bd36028403f))

- feat(moderations)!: move /legacy to /moderations (#9) ([f3aa797](https://github.com/proconnect-gouv/hyyypertool/commit/f3aa797ba0caa0abedc29b42cbf3bbe30022ab51)), closes [#9](https://github.com/proconnect-gouv/hyyypertool/issues/9)
- feat(legacy)!: change moderation navigation (#8) ([86af83e](https://github.com/proconnect-gouv/hyyypertool/commit/86af83e4183ad124c6ef23b9ccb858f1e87a57d2)), closes [#8](https://github.com/proconnect-gouv/hyyypertool/issues/8)

### Features

- **legacy:** add confirm prompt on mark as processed buttons ([f75e864](https://github.com/proconnect-gouv/hyyypertool/commit/f75e8648190ef6bc553267bf87beb6ea19ae15d4))
- **legacy:** centrelize moderation id name ([1b6f889](https://github.com/proconnect-gouv/hyyypertool/commit/1b6f8895d9a5b5c51c11b6186f3131ffa17a4476))

### BREAKING CHANGES

- the `/legacy` is no more `/moderations`
- the `/legacy?id=xxxx` is no more `/legacy/moderations/xxxx`

## [2024.1.11](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.10...2024.1.11) (2024-01-24)

### Features

- **legacy:** display latest users and organizations first ([3c2d76b](https://github.com/proconnect-gouv/hyyypertool/commit/3c2d76b5a84292256b3228454c17fb18966cb28f))
- **legacy:** separate row and links ([d8010a4](https://github.com/proconnect-gouv/hyyypertool/commit/d8010a4243c5e9f648b2fb31d0574765dbc2a4a0))

## [2024.1.10](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.9...2024.1.10) (2024-01-24)

### Features

- **legacy:** show more moderations ([c8e3532](https://github.com/proconnect-gouv/hyyypertool/commit/c8e3532fe6459a1599014e89efe5fefdf734ea72))

## [2024.1.9](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.8...2024.1.9) (2024-01-24)

### Features

- **legacy:** mark rejected moderations ([226343b](https://github.com/proconnect-gouv/hyyypertool/commit/226343bba888d7f2c04794b8a8eb13e04c8677a5))

## [2024.1.8](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.7...2024.1.8) (2024-01-24)

### Features

- **legacy:** add comment field in the shadow ([53b84d3](https://github.com/proconnect-gouv/hyyypertool/commit/53b84d37209e72a0d96f411e27186a518e5f3ce3))
- **legacy:** durty dsfr hack for the 01 section ([bffb204](https://github.com/proconnect-gouv/hyyypertool/commit/bffb204281dd13fea53355fafe3257e312d52e80))
- **legacy:** hold the session userinfo in a context through the stream ([b7218f3](https://github.com/proconnect-gouv/hyyypertool/commit/b7218f36a4ee7d26c6277333a6413440ea20370c))
- **legacy:** smooth markers ([4b55378](https://github.com/proconnect-gouv/hyyypertool/commit/4b55378bb00e92aed86862fa8b6688145d1447db))
- **legacy:** wait 2s for the input to change ([3a3dd18](https://github.com/proconnect-gouv/hyyypertool/commit/3a3dd18a55124e3aa2d385fda0c5c839d1e9b554))
- **ui:** add input group hint ([c8e238e](https://github.com/proconnect-gouv/hyyypertool/commit/c8e238e271160d32345387b3f1c8053ca10eea1d))

## [2024.1.7](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.6...2024.1.7) (2024-01-23)

### Features

- **legacy:** duplicate warning list the moderation with state ([ce89ebb](https://github.com/proconnect-gouv/hyyypertool/commit/ce89ebbbe5da34ff95302c5985b63ab482520c5b))
- **legacy:** isolate duplicate warning ([c461944](https://github.com/proconnect-gouv/hyyypertool/commit/c461944e86083248eb4717e56fa2b5a272f8e4c3))

## [2024.1.6](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.5...2024.1.6) (2024-01-22)

### Bug Fixes

- **legacy:** display moderation created_at not user's ([40ad9ca](https://github.com/proconnect-gouv/hyyypertool/commit/40ad9ca09dc8f87b4dc92da078a47a7367897dbb))

## [2024.1.5](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.4...2024.1.5) (2024-01-22)

### Features

- **health:** add zammad me check ([c92bcb1](https://github.com/proconnect-gouv/hyyypertool/commit/c92bcb156a1df80c1d1bad3b0cd0c856d8296e42))

## [2024.1.4](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.3...2024.1.4) (2024-01-22)

# [2024.2.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.1.2...2024.2.0) (2024-01-22)

### Features

- **sentry:** better sentry tags ([7220125](https://github.com/proconnect-gouv/hyyypertool/commit/72201253871ac1aa7cca3d88c4f9c0693d8014eb))

# [2024.2.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.01.18.0...2024.2.0) (2024-01-22)

### Features

- **legacy:** major zammad power ([8a58122](https://github.com/proconnect-gouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
- restrict users ([49d7b2c](https://github.com/proconnect-gouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))

## [2024.1.22-0.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.01.18.0...null) (2024-01-22)

### Features

- **legacy:** major zammad power ([8a58122](https://github.com/proconnect-gouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
- restrict users ([49d7b2c](https://github.com/proconnect-gouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))

# [2024.01.18.0](https://github.com/proconnect-gouv/hyyypertool/compare/2024.01.11.0...2024.01.18.0) (2024-01-22)

### Bug Fixes

- **legacy:** inversed is_external action ([e81e3bd](https://github.com/proconnect-gouv/hyyypertool/commit/e81e3bda6b9094cb9b30aa14870266801df88c69))
- **legacy:** remove host prefixes from action buttons ([7d10cdd](https://github.com/proconnect-gouv/hyyypertool/commit/7d10cddb4e0007e444fc5209696fa3101f56b06d))
- make email and name required by default ([b604606](https://github.com/proconnect-gouv/hyyypertool/commit/b604606eb3d5ecd009ac4c2ffa2d181c54b35e9c))
- **organizations:** add verified route ([0da5c0a](https://github.com/proconnect-gouv/hyyypertool/commit/0da5c0a509df8e0fa2e7ce0772a5e6bbed99df54))
- use AGENTCONNECT_OIDC_SCOPE as scope ([b411e25](https://github.com/proconnect-gouv/hyyypertool/commit/b411e259f589c5abc4881514148edcf80d9ee59d))
- use direct env version number ([a0ca6b4](https://github.com/proconnect-gouv/hyyypertool/commit/a0ca6b404c35ec4559144d3da02e586aaff93eda))

### Features

- add reel 404 page ([5211d7d](https://github.com/proconnect-gouv/hyyypertool/commit/5211d7d6ebabf0833cb048ac8c4e64ad1867fbe3))
- dummy orange buttons ([83743a8](https://github.com/proconnect-gouv/hyyypertool/commit/83743a8fd2c50141a807671045cc81c2d67ca0b2))
- force major version update ([b23c390](https://github.com/proconnect-gouv/hyyypertool/commit/b23c390868739657dc33fe9d054c89fcf685829f))
- introduce sentry error catcher ([3525d0c](https://github.com/proconnect-gouv/hyyypertool/commit/3525d0caa5d20584032c90692b1dc08c8b2cee46))
- **legacy:** major zammad power ([8a58122](https://github.com/proconnect-gouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
- **legacy:** remove 4th section ([79bda07](https://github.com/proconnect-gouv/hyyypertool/commit/79bda071340bacc050dabffae3c26ad369d8f69e))
- **legacy:** sort by last created at by default ([4a85a9c](https://github.com/proconnect-gouv/hyyypertool/commit/4a85a9c876bbcfa70b760838e85a972e386ba21e))
- **moderations:** display is_external if defined ([371b4ea](https://github.com/proconnect-gouv/hyyypertool/commit/371b4ead59f4fe52d8634634562358ae2c4c5b48))
- **moderations:** share type to emoji ([bc15afa](https://github.com/proconnect-gouv/hyyypertool/commit/bc15afa59f54256d04d391707fca2403375fb52a))
- **moderations:** support legacy types ([d22e8e9](https://github.com/proconnect-gouv/hyyypertool/commit/d22e8e97721f2f60523198ccf25d9c0fd312136a))
- **organizations:** add join_organization ([8f10142](https://github.com/proconnect-gouv/hyyypertool/commit/8f10142560e6e38cce5ad59c729c315c39ebfc40))
- **organizations:** add link to organization ([9c9f8fc](https://github.com/proconnect-gouv/hyyypertool/commit/9c9f8fc78ab92a2a02298230d15d037f9300f83e))
- **organizations:** add remove verified button ([8f2ed28](https://github.com/proconnect-gouv/hyyypertool/commit/8f2ed284f95da28a8e2b3a57c8e0853a1b832185))
- **organizations:** add see annuaire fiche link ([1e7b126](https://github.com/proconnect-gouv/hyyypertool/commit/1e7b126c8dde0dd1b531d2b6dc7c1173ac896a7b))
- **organizations:** add verified route ([6c7b437](https://github.com/proconnect-gouv/hyyypertool/commit/6c7b437a2ddf5fb794e7a377a77d26b427790a6e))
- **organizations:** call mark-domain-as-verified ([71d7b75](https://github.com/proconnect-gouv/hyyypertool/commit/71d7b758281e52a8e643b6ac0338d842243de0c2))
- **organizations:** share events ([736ca45](https://github.com/proconnect-gouv/hyyypertool/commit/736ca451fe46fefc319feec5cbd70c5ae4c0380f))
- **organizations:** share events using z.enum ([341f325](https://github.com/proconnect-gouv/hyyypertool/commit/341f325867c5ea0c24c3bb32f10a48e153774244))
- **organizations:** use members updated event ([a9224eb](https://github.com/proconnect-gouv/hyyypertool/commit/a9224eb465123a53177daec2450b8ad68105e2cc))
- **proxy:** ensure to proxy before the legacy guard route ([aaed65e](https://github.com/proconnect-gouv/hyyypertool/commit/aaed65ee1382a088b76241f4d1b92e0c1e6d4593))
- **proxy:** ensure to set the guard on legacy routes only ([7d0612a](https://github.com/proconnect-gouv/hyyypertool/commit/7d0612aaa12578f99f65016c557244c3339193f4))
- restrict users ([49d7b2c](https://github.com/proconnect-gouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))
- **sentry:** add dummy sentry endpoint test ([d4dad64](https://github.com/proconnect-gouv/hyyypertool/commit/d4dad64b027ff85c66c9e65a5da184cc830372b5))
- share the nonce ([86b9be6](https://github.com/proconnect-gouv/hyyypertool/commit/86b9be67306911e1810884470b9db61b55846de5))
- share the nonce (2) ([c9d9d39](https://github.com/proconnect-gouv/hyyypertool/commit/c9d9d39bd3280123fd21d3845ec7f79a7203fabb))
- share the nonce (3) ([cd7149b](https://github.com/proconnect-gouv/hyyypertool/commit/cd7149b82c2e2e884246dc3f896e516cedcccf60))
- share the nonce (4) ([b9a3a52](https://github.com/proconnect-gouv/hyyypertool/commit/b9a3a5208dcafc57b2fe8dedade424de285b0b60))
- **users:** link to moderations ([ab9bebf](https://github.com/proconnect-gouv/hyyypertool/commit/ab9bebf5a8a85563097d07a1018df48c38ee1951))
- **users:** remove and reset button ([5c98475](https://github.com/proconnect-gouv/hyyypertool/commit/5c984750806b738c530f7540628dd28ebf3952d0))

### Reverts

- Revert "ci(github): zdd incremental flag to release-it command" ([916449b](https://github.com/proconnect-gouv/hyyypertool/commit/916449bbcff24dd4465ca7df9b6066e003efde51))

## [2024.1.18](https://github.com/proconnect-gouv/hyyypertool/compare/2024.01.11.0...null) (2024-01-18)

### Bug Fixes

- **legacy:** inversed is_external action ([e81e3bd](https://github.com/proconnect-gouv/hyyypertool/commit/e81e3bda6b9094cb9b30aa14870266801df88c69))
- **legacy:** remove host prefixes from action buttons ([7d10cdd](https://github.com/proconnect-gouv/hyyypertool/commit/7d10cddb4e0007e444fc5209696fa3101f56b06d))
- make email and name required by default ([b604606](https://github.com/proconnect-gouv/hyyypertool/commit/b604606eb3d5ecd009ac4c2ffa2d181c54b35e9c))
- **organizations:** add verified route ([0da5c0a](https://github.com/proconnect-gouv/hyyypertool/commit/0da5c0a509df8e0fa2e7ce0772a5e6bbed99df54))
- use AGENTCONNECT_OIDC_SCOPE as scope ([b411e25](https://github.com/proconnect-gouv/hyyypertool/commit/b411e259f589c5abc4881514148edcf80d9ee59d))
- use direct env version number ([a0ca6b4](https://github.com/proconnect-gouv/hyyypertool/commit/a0ca6b404c35ec4559144d3da02e586aaff93eda))

### Features

- add reel 404 page ([5211d7d](https://github.com/proconnect-gouv/hyyypertool/commit/5211d7d6ebabf0833cb048ac8c4e64ad1867fbe3))
- dummy orange buttons ([83743a8](https://github.com/proconnect-gouv/hyyypertool/commit/83743a8fd2c50141a807671045cc81c2d67ca0b2))
- force major version update ([b23c390](https://github.com/proconnect-gouv/hyyypertool/commit/b23c390868739657dc33fe9d054c89fcf685829f))
- introduce sentry error catcher ([3525d0c](https://github.com/proconnect-gouv/hyyypertool/commit/3525d0caa5d20584032c90692b1dc08c8b2cee46))
- **legacy:** remove 4th section ([79bda07](https://github.com/proconnect-gouv/hyyypertool/commit/79bda071340bacc050dabffae3c26ad369d8f69e))
- **legacy:** sort by last created at by default ([4a85a9c](https://github.com/proconnect-gouv/hyyypertool/commit/4a85a9c876bbcfa70b760838e85a972e386ba21e))
- **moderations:** display is_external if defined ([371b4ea](https://github.com/proconnect-gouv/hyyypertool/commit/371b4ead59f4fe52d8634634562358ae2c4c5b48))
- **moderations:** share type to emoji ([bc15afa](https://github.com/proconnect-gouv/hyyypertool/commit/bc15afa59f54256d04d391707fca2403375fb52a))
- **moderations:** support legacy types ([d22e8e9](https://github.com/proconnect-gouv/hyyypertool/commit/d22e8e97721f2f60523198ccf25d9c0fd312136a))
- **organizations:** add join_organization ([8f10142](https://github.com/proconnect-gouv/hyyypertool/commit/8f10142560e6e38cce5ad59c729c315c39ebfc40))
- **organizations:** add link to organization ([9c9f8fc](https://github.com/proconnect-gouv/hyyypertool/commit/9c9f8fc78ab92a2a02298230d15d037f9300f83e))
- **organizations:** add remove verified button ([8f2ed28](https://github.com/proconnect-gouv/hyyypertool/commit/8f2ed284f95da28a8e2b3a57c8e0853a1b832185))
- **organizations:** add see annuaire fiche link ([1e7b126](https://github.com/proconnect-gouv/hyyypertool/commit/1e7b126c8dde0dd1b531d2b6dc7c1173ac896a7b))
- **organizations:** add verified route ([6c7b437](https://github.com/proconnect-gouv/hyyypertool/commit/6c7b437a2ddf5fb794e7a377a77d26b427790a6e))
- **organizations:** call mark-domain-as-verified ([71d7b75](https://github.com/proconnect-gouv/hyyypertool/commit/71d7b758281e52a8e643b6ac0338d842243de0c2))
- **organizations:** share events ([736ca45](https://github.com/proconnect-gouv/hyyypertool/commit/736ca451fe46fefc319feec5cbd70c5ae4c0380f))
- **organizations:** share events using z.enum ([341f325](https://github.com/proconnect-gouv/hyyypertool/commit/341f325867c5ea0c24c3bb32f10a48e153774244))
- **organizations:** use members updated event ([a9224eb](https://github.com/proconnect-gouv/hyyypertool/commit/a9224eb465123a53177daec2450b8ad68105e2cc))
- **proxy:** ensure to proxy before the legacy guard route ([aaed65e](https://github.com/proconnect-gouv/hyyypertool/commit/aaed65ee1382a088b76241f4d1b92e0c1e6d4593))
- **proxy:** ensure to set the guard on legacy routes only ([7d0612a](https://github.com/proconnect-gouv/hyyypertool/commit/7d0612aaa12578f99f65016c557244c3339193f4))
- **sentry:** add dummy sentry endpoint test ([d4dad64](https://github.com/proconnect-gouv/hyyypertool/commit/d4dad64b027ff85c66c9e65a5da184cc830372b5))
- share the nonce ([86b9be6](https://github.com/proconnect-gouv/hyyypertool/commit/86b9be67306911e1810884470b9db61b55846de5))
- share the nonce (2) ([c9d9d39](https://github.com/proconnect-gouv/hyyypertool/commit/c9d9d39bd3280123fd21d3845ec7f79a7203fabb))
- share the nonce (3) ([cd7149b](https://github.com/proconnect-gouv/hyyypertool/commit/cd7149b82c2e2e884246dc3f896e516cedcccf60))
- share the nonce (4) ([b9a3a52](https://github.com/proconnect-gouv/hyyypertool/commit/b9a3a5208dcafc57b2fe8dedade424de285b0b60))
- **users:** link to moderations ([ab9bebf](https://github.com/proconnect-gouv/hyyypertool/commit/ab9bebf5a8a85563097d07a1018df48c38ee1951))
- **users:** remove and reset button ([5c98475](https://github.com/proconnect-gouv/hyyypertool/commit/5c984750806b738c530f7540628dd28ebf3952d0))

### Reverts

- Revert "ci(github): zdd incremental flag to release-it command" ([916449b](https://github.com/proconnect-gouv/hyyypertool/commit/916449bbcff24dd4465ca7df9b6066e003efde51))

## [2023.11.12](https://github.com/proconnect-gouv/hyyypertool/compare/2023.11.11...2023.11.12) (2024-01-11)

### Reverts

- Revert "ci(github): force no increment version every release" ([90c40ca](https://github.com/proconnect-gouv/hyyypertool/commit/90c40ca32bcb627afc2725a5883c34b88784b64f))

## [2023.11.11](https://github.com/proconnect-gouv/hyyypertool/compare/8fc248ad305391b85d7d96f25ce07d1336180481...2023.11.11) (2024-01-11)

### Bug Fixes

- broken jsx ([c575889](https://github.com/proconnect-gouv/hyyypertool/commit/c5758892c7fe7fa2e2e1253d789ecdaa03e6d807))
- display empty moderation section ([3f2192f](https://github.com/proconnect-gouv/hyyypertool/commit/3f2192f334dd4b019dba67529503b8424ba91d0d))
- **env:** no default host ([19f3b69](https://github.com/proconnect-gouv/hyyypertool/commit/19f3b69c61f17996af0eaec88ab8b96bae254be2))
- fixed auth calls ([c14dc62](https://github.com/proconnect-gouv/hyyypertool/commit/c14dc62f92b3a585b410e757442b1e595993f5b8))
- **layout:** logout ([04d68f0](https://github.com/proconnect-gouv/hyyypertool/commit/04d68f08717a24a56048e63d1f19def9c09fb559))
- **legacy:** remove duplicate info ([287a54c](https://github.com/proconnect-gouv/hyyypertool/commit/287a54c55e23cb23ead9c3fc28634839e3cf80d9))
- **proxy:** use req.url ([ff4ff11](https://github.com/proconnect-gouv/hyyypertool/commit/ff4ff1141563459b74bd29a0ee72a72185a88fff))
- **proxy:** use req.url (2) ([bf653f8](https://github.com/proconnect-gouv/hyyypertool/commit/bf653f8c652db5e395dfa3cc1a40745ed6750228))
- **proxy:** use req.url (3) ([c0ce829](https://github.com/proconnect-gouv/hyyypertool/commit/c0ce829c6ad99e02f4cc7d1407aa410f4e773173))
- **scalingo:** write the GIT_SHA ([c5260f0](https://github.com/proconnect-gouv/hyyypertool/commit/c5260f048a8a8d6be8dba2523cbea9d1892d69da))
- **users:** organizations authorized_email_domains display ([0e0a228](https://github.com/proconnect-gouv/hyyypertool/commit/0e0a228314c5c1058454f555ccebc3f0d7f0f194))

### Features

- dummy pages ([8fc248a](https://github.com/proconnect-gouv/hyyypertool/commit/8fc248ad305391b85d7d96f25ce07d1336180481))
- extra fields ([af4856c](https://github.com/proconnect-gouv/hyyypertool/commit/af4856c28630ca92d51c4530883aa6698e1f7079))
- **legacy:** add users explorer page ([ddc097c](https://github.com/proconnect-gouv/hyyypertool/commit/ddc097c2129ea20fa8b9ecceb1df340643592dd0))
- **legacy:** better decision part ([24fd645](https://github.com/proconnect-gouv/hyyypertool/commit/24fd645b18e24e049939caa08e0d9d47e257d7d8))
- **legacy:** better navigation between pages ([9c5baf0](https://github.com/proconnect-gouv/hyyypertool/commit/9c5baf0550e198094724beb95607cfbb22e9b515))
- **legacy:** bulk section page update ([6da4433](https://github.com/proconnect-gouv/hyyypertool/commit/6da4433e8f495320ec1edf379953686a086a3d0e))
- **legacy:** bulk section page update (2) ([3b0eabf](https://github.com/proconnect-gouv/hyyypertool/commit/3b0eabf8a01ef8d918cd7bd731f77ebd4f282495))
- **legacy:** bulk section page update (3) ([ecc2ec7](https://github.com/proconnect-gouv/hyyypertool/commit/ecc2ec72fcf43bcc527c649f32cf1075ec54d263))
- **legacy:** show archived moderations ([15acbe8](https://github.com/proconnect-gouv/hyyypertool/commit/15acbe8b3634a7a7900b100f6d1c4e319b5fd15a))
- make it better ([8aa35e2](https://github.com/proconnect-gouv/hyyypertool/commit/8aa35e286509679209a8c2635be6b6b53161f97f))
- **organizations:** add organizations pages ([7382340](https://github.com/proconnect-gouv/hyyypertool/commit/7382340fc0adadde16c19dc1e3228b1d1a2c5329))
- use lit as client component provider ([f67301c](https://github.com/proconnect-gouv/hyyypertool/commit/f67301cf7de664b0b7f90dc09f3c7950d62642df))
- **www:** add cache control ([3c80886](https://github.com/proconnect-gouv/hyyypertool/commit/3c80886ffea250f234ca4b360bad2f40a1cb5011))
- **www:** add localhost proxy ([5ccee4c](https://github.com/proconnect-gouv/hyyypertool/commit/5ccee4c11d2193472597c82a1dcde25d3693ad55))
- **www:** dummy flagged agentconnect login ([9a930fb](https://github.com/proconnect-gouv/hyyypertool/commit/9a930fb80403b5ecbc11dd4c6d0a8a9de906aea4))
- **www:** make agentconnect work :) ([a9c897b](https://github.com/proconnect-gouv/hyyypertool/commit/a9c897b4c2fe501e9425c083fc7f1ba9be8b080f))

### Performance Improvements

- **legacy:** delay database calls ([15ea123](https://github.com/proconnect-gouv/hyyypertool/commit/15ea123053b9b91563b80d1df87516ad5d31e549))

### Reverts

- Revert "debug(www): redirect uri" ([2c2ce3c](https://github.com/proconnect-gouv/hyyypertool/commit/2c2ce3c62dba845f976dffc62f575f5a80088e15))
- Revert "debug(scalingo): SIGSEGV (5)" ([6d18cf7](https://github.com/proconnect-gouv/hyyypertool/commit/6d18cf724dbe6bbc65b2e9be031b71aab143d398))
- Revert "debug(scalingo): test multi-buildpack" ([1451111](https://github.com/proconnect-gouv/hyyypertool/commit/14511116a505b12a4619f1e61215642ce5b778d8))
- Revert "debug(scalingo): test multi-buildpack (2)" ([17d7d0d](https://github.com/proconnect-gouv/hyyypertool/commit/17d7d0d16a25273ad8c43ae805dceced8b7050b2))

## 2023.11.11 (2024-01-11)

### Bug Fixes

- broken jsx ([c575889](https://github.com/proconnect-gouv/hyyypertool/commit/c5758892c7fe7fa2e2e1253d789ecdaa03e6d807))
- display empty moderation section ([3f2192f](https://github.com/proconnect-gouv/hyyypertool/commit/3f2192f334dd4b019dba67529503b8424ba91d0d))
- **env:** no default host ([19f3b69](https://github.com/proconnect-gouv/hyyypertool/commit/19f3b69c61f17996af0eaec88ab8b96bae254be2))
- fixed auth calls ([c14dc62](https://github.com/proconnect-gouv/hyyypertool/commit/c14dc62f92b3a585b410e757442b1e595993f5b8))
- **layout:** logout ([04d68f0](https://github.com/proconnect-gouv/hyyypertool/commit/04d68f08717a24a56048e63d1f19def9c09fb559))
- **legacy:** remove duplicate info ([287a54c](https://github.com/proconnect-gouv/hyyypertool/commit/287a54c55e23cb23ead9c3fc28634839e3cf80d9))
- **proxy:** use req.url ([ff4ff11](https://github.com/proconnect-gouv/hyyypertool/commit/ff4ff1141563459b74bd29a0ee72a72185a88fff))
- **proxy:** use req.url (2) ([bf653f8](https://github.com/proconnect-gouv/hyyypertool/commit/bf653f8c652db5e395dfa3cc1a40745ed6750228))
- **proxy:** use req.url (3) ([c0ce829](https://github.com/proconnect-gouv/hyyypertool/commit/c0ce829c6ad99e02f4cc7d1407aa410f4e773173))
- **scalingo:** write the GIT_SHA ([c5260f0](https://github.com/proconnect-gouv/hyyypertool/commit/c5260f048a8a8d6be8dba2523cbea9d1892d69da))
- **users:** organizations authorized_email_domains display ([0e0a228](https://github.com/proconnect-gouv/hyyypertool/commit/0e0a228314c5c1058454f555ccebc3f0d7f0f194))

### Features

- dummy pages ([8fc248a](https://github.com/proconnect-gouv/hyyypertool/commit/8fc248ad305391b85d7d96f25ce07d1336180481))
- extra fields ([af4856c](https://github.com/proconnect-gouv/hyyypertool/commit/af4856c28630ca92d51c4530883aa6698e1f7079))
- **legacy:** add users explorer page ([ddc097c](https://github.com/proconnect-gouv/hyyypertool/commit/ddc097c2129ea20fa8b9ecceb1df340643592dd0))
- **legacy:** better decision part ([24fd645](https://github.com/proconnect-gouv/hyyypertool/commit/24fd645b18e24e049939caa08e0d9d47e257d7d8))
- **legacy:** better navigation between pages ([9c5baf0](https://github.com/proconnect-gouv/hyyypertool/commit/9c5baf0550e198094724beb95607cfbb22e9b515))
- **legacy:** bulk section page update ([6da4433](https://github.com/proconnect-gouv/hyyypertool/commit/6da4433e8f495320ec1edf379953686a086a3d0e))
- **legacy:** bulk section page update (2) ([3b0eabf](https://github.com/proconnect-gouv/hyyypertool/commit/3b0eabf8a01ef8d918cd7bd731f77ebd4f282495))
- **legacy:** bulk section page update (3) ([ecc2ec7](https://github.com/proconnect-gouv/hyyypertool/commit/ecc2ec72fcf43bcc527c649f32cf1075ec54d263))
- **legacy:** show archived moderations ([15acbe8](https://github.com/proconnect-gouv/hyyypertool/commit/15acbe8b3634a7a7900b100f6d1c4e319b5fd15a))
- make it better ([8aa35e2](https://github.com/proconnect-gouv/hyyypertool/commit/8aa35e286509679209a8c2635be6b6b53161f97f))
- **organizations:** add organizations pages ([7382340](https://github.com/proconnect-gouv/hyyypertool/commit/7382340fc0adadde16c19dc1e3228b1d1a2c5329))
- use lit as client component provider ([f67301c](https://github.com/proconnect-gouv/hyyypertool/commit/f67301cf7de664b0b7f90dc09f3c7950d62642df))
- **www:** add cache control ([3c80886](https://github.com/proconnect-gouv/hyyypertool/commit/3c80886ffea250f234ca4b360bad2f40a1cb5011))
- **www:** add localhost proxy ([5ccee4c](https://github.com/proconnect-gouv/hyyypertool/commit/5ccee4c11d2193472597c82a1dcde25d3693ad55))
- **www:** dummy flagged agentconnect login ([9a930fb](https://github.com/proconnect-gouv/hyyypertool/commit/9a930fb80403b5ecbc11dd4c6d0a8a9de906aea4))
- **www:** make agentconnect work :) ([a9c897b](https://github.com/proconnect-gouv/hyyypertool/commit/a9c897b4c2fe501e9425c083fc7f1ba9be8b080f))

### Performance Improvements

- **legacy:** delay database calls ([15ea123](https://github.com/proconnect-gouv/hyyypertool/commit/15ea123053b9b91563b80d1df87516ad5d31e549))

### Reverts

- Revert "debug(www): redirect uri" ([2c2ce3c](https://github.com/proconnect-gouv/hyyypertool/commit/2c2ce3c62dba845f976dffc62f575f5a80088e15))
- Revert "debug(scalingo): SIGSEGV (5)" ([6d18cf7](https://github.com/proconnect-gouv/hyyypertool/commit/6d18cf724dbe6bbc65b2e9be031b71aab143d398))
- Revert "debug(scalingo): test multi-buildpack" ([1451111](https://github.com/proconnect-gouv/hyyypertool/commit/14511116a505b12a4619f1e61215642ce5b778d8))
- Revert "debug(scalingo): test multi-buildpack (2)" ([17d7d0d](https://github.com/proconnect-gouv/hyyypertool/commit/17d7d0d16a25273ad8c43ae805dceced8b7050b2))
