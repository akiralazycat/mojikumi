# Mojikumi Web

`mojikumi.jp`で公開するNext.jsサイトです。

| URL | 内容 |
| --- | --- |
| `/` | LP |
| `/docs/` | 導入ドキュメント |
| `/playground/` | 一般向け比較ツール |
| `/benchmarks/` | 計測方針と結果 |

## ローカル開発

リポジトリルートで実行します。

```bash
npm install
npm run dev
```

静的出力を検証する場合は次を実行します。

```bash
npm run build:web
```

生成物は`apps/web/out/`です。

## Vercel

GitHubリポジトリを1つのVercel Projectとして登録し、次の設定を使用します。

| 設定 | 値 |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Node.js | 22.x |
| Domain | `mojikumi.jp` |

Root Directory設定の「Include source files outside of the Root Directory in
the Build Step」を有効にします。`packages/*`を先にビルドするコマンドは
`vercel.json`に設定済みです。

現在は`output: "export"`を使用するため、全ルートが静的ファイルとして公開されます。
将来SSRやServer Actionsが必要になった場合は、この設定を外してVercelのNext.js
ランタイムへ移行します。
