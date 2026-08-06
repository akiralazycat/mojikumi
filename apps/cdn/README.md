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
| `/` | ファイルの一覧、読み込むタグ、SRIハッシュ（日本語） |
| `/en/` | 同じ内容の英語版 |
| `/404.html` | 綴り違いのパスに正しい一覧を返す |
| `/robots.txt` | ドメインごと索引から外す |

`/v1/`はマイナー更新で中身が変わります。貼り直さずに修正を受け取れる代わりに、
こちらが壊せば貼った側が壊れます。次を前提にしてください。

1. `/v1/`へ出す前に、各CMSの実ページで確認する
2. `/{version}/`は書き換えず、いつでも戻せるようにする
3. 破壊的変更は`/v2/`として別に出し、`/v1/`は据え置く

`/{version}/`は1年間のimmutableとして配信するため、**npmへ公開済みのバージョンと
中身が一致している必要があります**。このプロジェクトはリポジトリの内容からビルド
するので、未公開のバージョン番号でデプロイすると、npm上の同じ番号と異なるファイル
が恒久的にキャッシュされます。バージョンを上げたら、npmへの公開とCDNのデプロイを
続けて行ってください。

## ページ

HTMLはフレームワークを通していません。`templates/`にあるHTMLとCSSを`build.mjs`が
読み、`{{version}}`のような差し込み口を埋めて`dist/`へ書き出すだけです。

| テンプレート | 出力 |
| --- | --- |
| `templates/index.html` | `/index.html`（日本語） |
| `templates/en.html` | `/en/index.html` |
| `templates/404.html` | `/404.html`（日英併記） |
| `templates/page.css` | 3枚に`{{style}}`として埋め込む |

言語は`mojikumi.jp`と同じく**ページごとに分けます**。1枚に併記すると同じ事実を2回
書くことになり、どちらの言語も対訳めいた文章になるためです。404だけは併記します。
外したパスを叩いた人がどちらの言語を読むのかは分からず、意味の大半はパスの一覧が
担っているからです。

ここは**ファイルの置き場**であって読み物ではなく、`mojikumi.jp`が落ちていても
配信され続ける必要があるので、次を守ります。

- 外部リクエストは0。Webフォントも解析タグも読み込まない
- CSSは`templates/page.css`をインラインで埋め込む。`mojikumi.jp`のCSSは参照しない
- どのページも`noindex`

例外が1つあります。**各ページは、この配信元自身の`/v1/mojikumi.min.js`を読み込み
ます。** 同一オリジンなので外部リクエストは増えず、ページを開くこと自体が「バンド
ルを取得でき、パースでき、走る」ことの確認になります。スクリプトが失敗してもページ
は読めます（CSS優先・DOMは補完というライブラリの方針そのものです）。

SRIハッシュは`build.mjs`が`dist/{version}/`の実バイト列から計算し、トップページ
へ載せます。`/v1/`は中身が変わるため掲載しません。

## ビルド

リポジトリルートで実行します。

```bash
npm run build:cdn
```

生成物は`apps/cdn/dist/`です。バンドル本体は`packages/mojikumi`側で作られ、
ここではCDNのパス構成に並べ替え、ページを書き出すだけです。差し込み口に対応する値
が無い場合はビルドが失敗します（テンプレートの綴り間違いを黙って通さないため）。

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

デプロイ後に確認することが1つあります。**存在しないパスで`404.html`が404ステータス
とともに返るか**です。Vercelの静的配信は出力ルートの`404.html`を使いますが、この
プロジェクトでは実際のデプロイでしか確かめられません。

ビルドコマンドの先頭で`npm ci`を実行しています。Vercelの依存インストールは
Root Directory側で完結し、リポジトリルートのdevDependenciesが揃うとは限らないため
です。バンドルの生成にはesbuildが必要なので、ここで確実に入れています。`apps/web`
はバンドルを使わないため、こうした追加のインストールを行いません。
