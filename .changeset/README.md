# Changesets

公開パッケージに影響するPull Requestでは、次を実行して変更内容を記録します。

```bash
npm run changeset
```

Mojikumiの公開パッケージはfixed groupとして同じバージョンを共有します。
リリース準備時に`npm run version-packages`を実行すると、バージョン、内部依存、
各パッケージのCHANGELOGがまとめて更新されます。
