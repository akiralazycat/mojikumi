# Release guide

この文書は、npm上で`@mojikumi`スコープを取得してからGitHub Actionsの
Trusted Publishingへ移行するまでの手順です。

## 1. `@mojikumi`を取得する

共同管理と将来の権限分離を考え、npm上で`mojikumi`というOrganizationを作成します。
npmではユーザーまたはOrganizationの名前が、そのまま`@名前`スコープになります。

1. npmアカウントで2要素認証を有効にする
2. npmjs.comで`mojikumi` Organizationを作成する
3. `akiralazycat`をOwnerまたは公開権限のあるTeamへ追加する
4. Organizationの全メンバーに2要素認証を要求する

Organization名が取得できない場合は、別スコープへ勝手に変更せず、プロジェクト名と
公開パッケージ名の方針を再決定します。

参考:

- [About scopes](https://docs.npmjs.com/about-scopes/)
- [Creating scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)
- [Package scope and access](https://docs.npmjs.com/package-scope-access-level-and-visibility/)

## 2. 初回公開前の確認

```bash
npm whoami
npm ci
npm run typecheck
npm test
npm run build
```

各パッケージについて、公開物を確認します。

```bash
npm pack --dry-run --workspace @mojikumi/core
npm pack --dry-run --workspace @mojikumi/css
npm pack --dry-run --workspace @mojikumi/presets
npm pack --dry-run --workspace @mojikumi/dom
npm pack --dry-run --workspace @mojikumi/react
npm pack --dry-run --workspace @mojikumi/rehype
npm pack --dry-run --workspace mojikumi
```

`dist`、README、LICENSE、型定義、CSS以外の不要物や秘密情報が含まれていないことを
確認します。公開バージョンは同じリリース内で揃え、内部依存のバージョンも一致させます。

## 3. 初回だけ手元から公開する

npmのパッケージ設定画面でTrusted Publisherを登録するには、対象パッケージが先に
存在している必要があります。そのため初回は2FAを使って依存順に公開します。

```bash
npm publish --workspace @mojikumi/core --access public
npm publish --workspace @mojikumi/css --access public
npm publish --workspace @mojikumi/presets --access public
npm publish --workspace @mojikumi/dom --access public
npm publish --workspace @mojikumi/react --access public
npm publish --workspace @mojikumi/rehype --access public
```

スコープ付きパッケージは既定で非公開扱いになるため、初回公開では
`--access public`が必要です。現在の各`package.json`にも
`publishConfig.access: "public"`を設定しています。

統合パッケージ`mojikumi`はスコープとは別のグローバル名です。名前を所有できた場合だけ
次を実行します。取得できない場合は公開せず、`@mojikumi/mojikumi`への変更を別PRで
検討します。

```bash
npm publish --workspace mojikumi
```

直接公開には、2FAを有効にした対話的なログイン、または2FA回避を明示したGranular
Access Tokenが必要です。初回は長期トークンを作らず、対話的な2FAを推奨します。

参考:

- [Publishing organization-scoped packages](https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package/)
- [2FA requirements](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)

## 4. GitHub Actionsと紐付ける

初回公開後、npmjs.comで各パッケージのSettings → Trusted Publisherを開き、
次を設定します。

| 項目 | 値 |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `akiralazycat` |
| Repository | `mojikumi` |
| Workflow filename | `release.yml` |
| Environment | `npm` |
| Allowed action | `npm publish` |

対象は`@mojikumi/core`、`css`、`presets`、`dom`、`react`、`rehype`です。
統合パッケージ`mojikumi`も公開した場合は、同じ設定を追加します。

GitHub側ではRepository Settings → Environmentsに`npm`環境を作り、必要なら
Required reviewersとmainブランチ制限を設定します。Release workflowにはOIDCに必要な
`id-token: write`だけを付与しており、`NPM_TOKEN`は保存しません。

設定後はActionsの`Publish packages`を手動実行します。実行前に必ず未公開の
バージョンへ更新してください。同じバージョンを再公開することはできません。

Trusted Publishingにはnpm CLI 11.5.1以上とNode.js 22.14以上が必要です。
このリポジトリのworkflowはNode.js 24を使用します。またGitHubから公開するため、
各`package.json`の`repository.url`をGitHubリポジトリと一致させています。

参考:

- [Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)

## 5. 変更を記録する

公開パッケージに影響するPull RequestではChangesetを追加します。

```bash
npm run changeset
```

変更対象、SemVerの更新種別、CHANGELOGへ載せる要約を入力します。Mojikumiの7つの
公開パッケージはfixed groupとして設定されているため、同じバージョンで公開されます。
Playgroundはprivate workspaceとしてリリース対象から除外されています。

## 6. Release PRを作る

未消費のChangesetがある状態で、リリース専用ブランチから次を実行します。

```bash
npm run version-packages
npm install --package-lock-only
npm run typecheck
npm test
npm run build
npm run package:check
```

`version-packages`はChangesetを消費し、全パッケージのversion、内部依存、
CHANGELOGを更新します。`package:check`は全7パッケージについて`npm pack
--dry-run`を実行し、README、LICENSE、CHANGELOG、distの存在とテスト成果物の除外を
確認します。

結果をRelease PRとしてレビューし、versionとCHANGELOGが意図どおりであることを
確認してからmainへマージします。

## 7. Trusted Publishingで公開する

Release PRのマージ後、GitHub Actionsから`Publish packages`を手動実行します。
GitHubの`npm` EnvironmentにRequired reviewersが設定されている場合は、承認後に
処理が始まります。

workflowは型検査、テスト、ビルド、package dry-runを再実行してから
`changeset publish`を呼び出します。npm上に存在しないversionだけをOIDCで公開し、
生成されたGit tagをGitHubへpushします。`NPM_TOKEN`は使用しません。

公開後は次を確認します。

```bash
npm view mojikumi version
npm view @mojikumi/core version
npm view @mojikumi/react version
```

すべて同じversionであることを確認します。レジストリの反映に数分かかる場合があるため、
公開直後の404だけを理由に同じversionを再publishしないでください。

## 実装ロードマップ

### 次の実装PR

1. Chromium・Firefox・WebKitのPlaywright fixtureを追加
2. コピー文字列、スクリーンリーダー向けDOM、CLSの受け入れテストを追加
3. パッケージごとのREADMEと最小利用例を追加

### v0.1公開前

1. Noto Sans JP / Serif JP、Hiragino、Yu Gothic / Minchoの実測
2. `text-spacing-trim`の構文対応と実動作を分ける機能テスト
3. インライン要素境界をまたぐ約物処理
4. Next.js、Astro、Viteのexampleアプリ
5. APIレビューと破壊的変更の凍結

### v0.2以降

1. フォントプロファイルと安全側フォールバック
2. 縦書きfixtureと`vertical-rl`対応
3. ルビ、縦中横、ぶら下げの段階的対応
4. 実ブラウザ互換性データの公開
