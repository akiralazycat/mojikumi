# 導入動線の整備計画

初めての利用者が5分以内にMojikumiを自分のサイトへ入れられる状態を作るための計画
です。この文書は計画のみで、実装は含みません。

## 現状の確認

| 項目 | 状態 |
| --- | --- |
| 公開パッケージ | `mojikumi`と`@mojikumi/*`の7つをnpmへ公開済み（0.1.1） |
| ビルド | `tsc -b`と`scripts/build-css.mjs`のみ。バンドラーは未使用 |
| 配布形式 | ESMのみ。`<script>`で直接読み込める成果物はない |
| CSS | `packages/css/dist/mojikumi.css`（136行）。`.mjk` / `.mjk-*`クラス前提 |
| プリセット | `web` / `book` / `editorial` / `minimal` / `native` |
| サイト | Next.js静的書き出し。日英2言語、ページは6種 |
| サイトの文言 | `apps/web/content/{ja,en}.ts`に集約。両言語の構造一致をテストで強制 |

つまり不足しているのは実装そのものではなく、**ビルド環境を持たない人が使える
配布物**と、**どれを選ぶかを決めさせない導線**の2つです。

## 元の構想からの変更点

1. WordPress専用プラグインは保留します。WordPressも他のCMSと同じく、コード貼り
   付けを主経路にします。プラグイン化はPhase 5で改めて判断します。
2. 新パッケージは作らず、既存の`mojikumi`パッケージへブラウザ向け成果物を追加し
   ます。changesetsのfixed groupとTrusted Publisherの設定を増やさずに済みます。

## 決定事項

| 論点 | 決定 |
| --- | --- |
| 配信URL | 最初から`cdn.mojikumi.jp`を使う。jsDelivrは上級者向けの代替として`/docs/`にだけ記載 |
| バージョン指定 | 初心者向けは`/v1/`、固定したい人向けに`/0.1.2/`とSRIを併記 |
| 言語 | 新規ページは日英同時に用意する。既存の構造一致テストはそのまま維持 |

---

## Phase 1：貼るだけ版（ブラウザバンドル）

### 完成形

```html
<script
  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
  data-target=".entry-content"
  data-style="article"
></script>
```

これ1つでCSSの読み込み、対象要素の検出、DOM補完、再評価まで完了します。

### 成果物

| 追加物 | 内容 |
| --- | --- |
| `packages/mojikumi/src/browser.ts` | 自動初期化のエントリーポイント |
| `packages/mojikumi/dist/mojikumi.browser.js` | IIFE、CSS同梱、最小化済み |
| `packages/mojikumi/dist/mojikumi.browser.js.map` | ソースマップ |
| `scripts/build-browser.mjs` | esbuildによるバンドル |
| `exports["./browser"]` | npm経由でも参照できるように追加 |

- 形式はIIFE、グローバル名は`Mojikumi`、ターゲットは`es2022`（COMPATIBILITYの
  実行環境要件と一致）。
- CSSは文字列として埋め込み、実行時に`<style data-mojikumi>`として`<head>`の先頭
  へ挿入します。タグ1つで完結させるためで、`data-css="false"`で無効化できます。
- サイズ目標は brotli 15KB 以下。Web Fontは読み込みません。
- `npm run build:packages`と`scripts/check-packages.mjs`へ組み込み、CIで成果物の
  存在とサイズ上限を検査します。

### 配信構成

サイト本体はNext.jsの静的書き出し（`output: "export"`）をVercelへ載せています。
配信は同じ仕組みを使いますが、**CDN専用のプロジェクトを分けます**。本体サイトへ
ドメインを追加すると、サイト全体が`cdn.mojikumi.jp`からも見えてしまい、正規URLが
二重になるためです。

| 項目 | 内容 |
| --- | --- |
| 置き場所 | `apps/cdn/public/`（静的ファイルのみ） |
| 生成 | ビルド時に`packages/mojikumi/dist/mojikumi.browser.js`から配置 |
| パス | `/v1/mojikumi.min.js`と`/{version}/mojikumi.min.js`の両方 |
| CSS単体 | 同じ規則で`/v1/mojikumi.min.css` |
| ドメイン | `cdn.mojikumi.jp`をこのプロジェクトへ割り当て |

キャッシュは`vercel.json`の`headers`で指定します（静的書き出しでは
`next.config.ts`の`headers()`が効かないため）。

- `/{version}/` … `public, max-age=31536000, immutable`
- `/v1/` … `max-age=600, s-maxage=86400, stale-while-revalidate=86400`
- 両方に`Access-Control-Allow-Origin: *`（SRI付きで`crossorigin`を使う場合に必要）

`/v1/`はマイナー更新で中身が変わります。これは「利用者が貼り直さずに修正を受け
取れる」ことと引き換えなので、次を前提条件にします。

1. `/v1/`へ出す前に、Phase 3で確認した全CMSのページで実機確認を通す。
2. 問題が出た場合に前のファイルへ戻せるよう、`/{version}/`を常に残す。
3. 破壊的変更は`/v2/`として別パスに出し、`/v1/`は据え置く。

npmの`mojikumi`パッケージにも同じ成果物が入るため、CDNを使いたくない人は
ダウンロードして自分のサーバーへ置けます。この経路もガイドに載せます。

### スクリプトタグの設定項目

| 属性 | 既定値 | 内容 |
| --- | --- | --- |
| `data-target` | `auto` | 対象セレクター。`auto`は既知の本文セレクター一覧 |
| `data-style` | `article` | `article` / `book` / `headline`（内部の`web` / `book` / `editorial`） |
| `data-precision` | `auto` | `native` / `auto` / `full` |
| `data-exclude` | なし | 追加の除外セレクター |
| `data-css` | `true` | 同梱CSSの挿入可否 |
| `data-auto` | `true` | `false`で自動実行せず`Mojikumi.start()`を待つ |

プリセット名は利用者向けに「記事向け（article）」「書籍風（book）」「見出し重視
（headline）」として説明し、内部名は上級者向けドキュメントにだけ載せます。

### 安全側の要件

- **多重初期化の防止**：`WeakMap<Element, MojikumiInstance>`のレジストリを
  `window`上に1つだけ持ち、同じ要素へ二重にmountしません。スニペットを2回貼って
  も結果は変わりません。
- **動的追加への追従**：`document`直下に間引き付きのMutationObserverを1つ置き、
  新しく条件に合った要素だけをmountします。要素ごとの再評価は、既存のDOM層が持つ
  Observerがそのまま担当します。
- **編集画面の除外**：既定の除外（`code` / `pre` / フォーム / `contenteditable` /
  SVG / MathML）に加え、`#wpadminbar`、`body.wp-admin`、`.block-editor`、
  各CMSの編集モード用要素を含む祖先を持つ場合は初期化しません。
- **失敗の隔離**：初期化全体を`try`で囲み、例外を握りつぶします。対象が見つから
  ない場合も例外を投げません（現在の`mojikumi()`は投げるため、自動初期化では
  投げない経路を用意します）。CSSの挿入を最初に行うため、JS側が途中で落ちても
  CSSだけの改善は残ります。
- **レイアウトシフト**：CSSは同期挿入し、DOM処理は`DOMContentLoaded`以降に回し
  ます。フッターへしか差し込めない環境向けに、CSSを別の`<link>`で先に読む手順を
  併記します。実測はPhase 3の検証項目に含めます。

### 検証

- `packages/mojikumi/src/browser.test.ts`（jsdom）で属性解釈、二重初期化、
  除外条件、対象なし時に例外を投げないことを確認します。
- 既存のDOM不変条件（文字列を変えない、`destroy()`で復元できる）はDOM層の
  テストが担保しているため、ここでは自動初期化層だけを対象にします。

---

## Phase 2：`/start/`とHTMLガイド

### 情報設計

```
/start/                      何でサイトを作っていますか？
/start/html/                 通常のHTMLサイト
/start/wordpress/            WordPress
/integrations/               対応環境の一覧
/integrations/{webflow,shopify,ghost,wix,squarespace,studio}/
/docs/                       開発者向け（現状のまま）
/troubleshooting/            表示されない、範囲が違う、遅い
```

トップページの主導線は「自分のサイトへ導入する」と「効果を試してみる」の2本に
します。

### 先に必要なリファクタ

現在の`apps/web/lib/site.ts`の`buildMetadata`は、ページごとの`if`分岐で辞書を
引いています。ページが6から18へ増えると破綻するため、先に
`Record<PageKey, { title, description }>`の参照へ置き換えます。`pagePaths`、
`pagePriority`、sitemapは`pageKeys`から自動生成されているため、追加はキーの追加
だけで済みます。

### ガイドの共通化

すべてのガイドを同じ7項目に統一します。

1. 所要時間と必要な権限
2. 管理画面のどこを開くか
3. 貼り付けるコード
4. 記事ページでの確認方法
5. 適用範囲の変更方法
6. 元に戻す方法
7. よくある問題

これはページごとのJSXではなく、`Guide`型のデータとして`content/{ja,en}.ts`へ
置き、`components/pages/guide.tsx`が描画します。ガイドを1つ増やす作業が、文言を
1つ足すだけになります。コピーボタンはクライアントコンポーネントとして分離します。

### 言語

新規ページは日英同時に用意します。`content.test.ts`の構造一致テストはそのまま
維持できますが、ガイド1本あたりの文言が2言語分になります。共通フォーマットを
`Guide`型のデータへ寄せる理由はここにもあります。7項目の見出しは辞書側で1度だけ
定義し、各ガイドは中身だけを持たせます。

英語版のCMS手順は、管理画面の項目名を英語UIの表記に合わせる必要があります。
実機確認は日英どちらのUIでも行い、スクリーンショットではなく文字で経路を書きます
（UIの変更に強くするため）。

### この段階の範囲

Phase 2ではHTMLガイドと`/start/`の選択画面までを作り、CMS個別ページは骨格だけ
用意して「準備中」とはせず、Phase 3で実機確認を終えたものから公開します。

---

## Phase 3：CMSごとのコピペ手順

WordPressを含め、すべて同じブラウザバンドルを使います。差分は「どこへ貼るか」と
「本文セレクターは何か」だけです。

| 環境 | 貼り付け場所 | 想定セレクター |
| --- | --- | --- |
| WordPress | スニペット系プラグイン、またはテーマのヘッダー | `.entry-content`、`.wp-block-post-content` |
| Shopify | `theme.liquid` | `.rte`、`.article__content` |
| Ghost | Code Injection（Site Header） | `.gh-content` |
| Webflow | Project Settings → Custom Code | `.w-richtext` |
| Squarespace | Code Injection | `.sqs-block-content` |
| Wix | カスタムコード | 要検証 |
| STUDIO | カスタムコード | 要検証 |

セレクターはいずれも**実機で確定**します。上表は調査の出発点で、確認前に
ドキュメントへは載せません。WixとSTUDIOは、そもそもカスタムコードで本文DOMへ
到達できるか自体を先に確認します。到達できない場合は、非対応であることを
`/integrations/`で明示します。

### WordPressの扱い

- 主経路：ヘッダーへスクリプトを1行。
- 副経路：カスタマイズの「追加CSS」しか触れない利用者向けに、CSSだけの版を用意
  します。ただし現在のCSSは`.mjk`クラスを前提としており、追加CSS欄からはクラスを
  付けられません。そのため、既知の本文セレクターへ直接あたる
  `mojikumi.selectors.css` を別途生成する必要があります。これはPhase 3の設計判断
  として扱い、Phase 1の要件には含めません。
- プラグイン化（ZIP配布、設定画面、Before/After確認）はPhase 5で再検討します。

### `/troubleshooting/`

実機検証で実際に出た症状だけを載せます。想定は「変化が見えない（セレクター違い、
JSブロック）」「範囲が広すぎる（ナビやフッターまで適用）」「編集画面が乱れる」
「表示が遅い」の4系統です。

---

## Phase 4：フレームワーク向け

既存のnpmパッケージで足りているため、必要なのは動く最小例です。

- Next.js（App Router、SSRで本文を変えないことの確認を含む）
- Astro
- Vue / Nuxt
- SvelteKit
- Markdown / MDX（`@mojikumi/rehype`）

`examples/`配下にコピーして動かせる最小プロジェクトを置き、CIのビルド対象に含める
かどうかは、リポジトリの重さを見て決めます。

---

## Phase 5：正式配布

- 環境ごとの互換性表（確認日、対象バージョン付き）。
- WordPressプラグインの再検討。判断材料は、コピペ手順で実際に何人が詰まったか。
- 導入事例、更新通知。

---

## 完了基準

| 基準 | 確認方法 |
| --- | --- |
| 未経験者が5分以内に導入できる | 手順を知らない人に実機で試してもらう |
| 本文の文字列とコピー結果を変えない | 既存のDOM不変条件テスト |
| 削除すれば完全に元へ戻る | `destroy()`と、タグを外した状態のDOM比較 |
| 管理画面や編集画面へ影響しない | 各CMSの編集画面で実機確認 |
| JSが失敗しても本文が読める | スクリプトを404にした状態で表示確認 |
| レイアウトシフトを起こさない | 主要ガイドの構成でCLSを実測 |
| CMSごとに実機確認済みの手順がある | 確認日をガイドに記載 |
| 初心者向けガイドに専門用語を出さない | プリセット名、precision、DOMフォールバックを本文へ出さない |

---

## 残る未決事項

1. **本文セレクターの既定値**：`data-target="auto"`が既定で拾う一覧。実機確認前に
   確定できないため、Phase 1では最小限（`.entry-content`、`article`、`main`）から
   始め、Phase 3の確認結果で追加します。
2. **CSSのみ版の生成方針**：WordPressの「追加CSS」欄向けに、既知の本文セレクター
   へ直接あたるCSSを生成するか。生成する場合、セレクター一覧の更新が
   `mojikumi.css`とCDN配信物の両方に波及します。
3. **WixとSTUDIO**：カスタムコードから本文DOMへ到達できるか未確認。到達できない
   場合は非対応として明記します。

## 最初の実装単位

Phase 1（ブラウザバンドルと自動初期化、配信構成）を単独のPull Requestにします。
Phase 2以降はすべてこの成果物の上に乗るため、ここで属性名、`/v1/`の運用規則、
セレクターの既定値を確定させることが、後続の手戻りを防ぎます。

`cdn.mojikumi.jp`のDNSとVercelのドメイン設定は実装と並行して進められます。ガイド
の公開だけが配信の稼働を待ちます。
