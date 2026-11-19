# Contributing

Mojikumiへの変更は、見た目の好みではなく再現可能なfixtureと根拠を伴うものに
してください。

## 開発

ルートの `package-lock.json` を使います。パッケージ間のimportは公開時と同じ
`dist/` を参照するため、初回はパッケージをビルドしてからテストします。

```bash
npm ci
npm run build:packages
npm test
npm run typecheck
npm run build
```

npmに含めるファイルは `npm run package:check` で確認できます。公開操作は
[RELEASING.md](RELEASING.md) を参照してください。

## ルール変更

文字クラスやペアルールを変更するときは、次を同じPull Requestへ含めます。

- `SPEC.md`の更新
- 最小の単体テスト
- 根拠となるJLREQ、CSS Text、Unicodeの参照
- 影響するフォント・writing mode・ブラウザの範囲

## 原則

- コピーされる本文へ文字や空白を追加しない
- スクリーンリーダーの読み上げを変えない
- DOMラップは必要な境界だけに限定する
- ネイティブCSSで解決できる機能をJavaScriptで再実装しない
- 公開APIを変更する場合は移行方法を記載する
