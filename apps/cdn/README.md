# Mojikumi CDN

`cdn.mojikumi.jp`で配信する静的ファイルです。ビルド設定を持たない利用者が
`<script>`1行でMojikumiを使えるようにするためだけに存在します。

```html
<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>
```

## 配信物

| パス | 内容 |
| --- | --- |
| `/v1/mojikumi.min.js` | 依存を含んだブラウザ向けバンドル（CSS同梱） |
| `/v1/mojikumi.min.css` | CSSのみを使う場合 |
| `/{version}/...` | 同じ内容をバージョンで固定したもの |

`/v1/`はマイナー更新で中身が変わります。貼り直さずに修正を受け取れる代わりに、
こちらが壊せば貼った側が壊れます。次を前提にしてください。

1. `/v1/`へ出す前に、各CMSの実ページで確認する
2. `/{version}/`は書き換えず、いつでも戻せるようにする
3. 破壊的変更は`/v2/`として別に出し、`/v1/`は据え置く

## ビルド

リポジトリルートで実行します。

```bash
npm run build:cdn
```

生成物は`apps/cdn/dist/`です。バンドル本体は`packages/mojikumi`側で作られ、
ここではCDNのパス構成に並べ替えるだけです。

## Vercel

`apps/web`とは**別のProject**として登録します。同じProjectへドメインを追加すると、
サイト全体が`cdn.mojikumi.jp`からも配信され、正規URLが二重になるためです。

| 設定 | 値 |
| --- | --- |
| Framework Preset | Other |
| Root Directory | `apps/cdn` |
| Node.js | 22.x |
| Domain | `cdn.mojikumi.jp` |

Root Directory設定の「Include source files outside of the Root Directory in
the Build Step」を有効にします。ビルドコマンドとキャッシュヘッダーは
`vercel.json`に設定済みです。

ビルドコマンドの先頭で`npm ci`を実行しています。Vercelの依存インストールは
Root Directory側で完結し、リポジトリルートのdevDependenciesが揃うとは限らないため
です。バンドルの生成にはesbuildが必要なので、ここで確実に入れています。`apps/web`
はバンドルを使わないため、こうした追加のインストールを行いません。
