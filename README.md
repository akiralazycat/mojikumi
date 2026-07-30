# Mojikumi

Web上の日本語を出版物に近い字組みへ整える、標準CSS優先のタイポグラフィ基盤です。

Mojikumiは独自の組版エンジンではありません。`text-spacing-trim`、
`text-autospace`、`line-break`、`hanging-punctuation`などの標準CSSを
優先し、ブラウザに足りない部分だけを小さなDOMフォールバックで補います。

> Japanese typography compatibility layer for the Web

## 現在の実装範囲

v0.1の土台として次を実装しています。

- CSS-onlyの`web`、`book`、`editorial`、`minimal`、`native`プリセット
- 書記素クラスタを壊さない文字分割と約物クラス分類
- 重複する約物アキの保守的なペアルール
- 和文とLatin文字・数字の境界検出
- 約物だけをラップするDOMフォールバック
- 段落先頭と折り返し行頭を区別するRangeベースの測定
- Resize、Mutation、フォント読み込み後の再評価
- `refresh()` / `destroy()`を備えた冪等な公開API
- SSR時に本文を変更しないReactコンポーネントとHook
- `lang`とプリセットクラスを付与するrehypeプラグイン
- Before / YakuhanJP / Native CSS / Mojikumiを比較できるPlayground

フォントプロファイルと縦書きの精密対応は次のフェーズです。

## 開発版を試す

```bash
npm install
npm run dev
```

表示されたローカルURLでPlaygroundを開けます。

```bash
npm test
npm run typecheck
npm run build
```

## CSSだけで使う

```ts
import "mojikumi/css";
```

```html
<article lang="ja" class="mjk mjk-book">
  <p>『「引用」』とNext.jsを含む日本語。</p>
</article>
```

`lang="ja"`は禁則処理や`word-break: auto-phrase`の前提になるため、省略しないで
ください。

## DOMフォールバックを使う

```ts
import "mojikumi/css";
import { mojikumi } from "mojikumi";

const instance = mojikumi(".article", {
  preset: "book",
  precision: "auto"
});

instance.refresh();
instance.destroy();
```

`precision`には次を指定できます。

- `native`: 標準CSSだけを使用
- `auto`: ネイティブ対応を検出し、不足機能だけ補完
- `full`: 検証用に常にフォールバックを適用

`code`、`pre`、フォーム部品、`contenteditable`、SVG、MathMLは既定で除外されます。
任意の範囲は`data-no-mojikumi`で除外できます。

```html
<span data-no-mojikumi>console.log("日本語")</span>
```

## Reactで使う

```tsx
import "mojikumi/css";
import { Mojikumi } from "@mojikumi/react";

export function Article({ children }) {
  return (
    <Mojikumi as="article" preset="book">
      {children}
    </Mojikumi>
  );
}
```

SSRでは通常のHTMLとクラスだけを出し、必要なDOM補完はマウント後に行います。
`useMojikumi()` Hookも利用できます。

## Markdown / MDXで使う

```ts
import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [[rehypeMojikumi, { preset: "editorial" }]]
};
```

既定では`article`と`main`へ`lang="ja"`とプリセットクラスを付与します。レスポンシブ
な行頭・行末はビルド時に確定しないため、rehype側では測定しません。

## パッケージ

| パッケージ | 役割 |
| --- | --- |
| `mojikumi` | 通常利用向け統合API |
| `@mojikumi/core` | DOM非依存の分類・解析 |
| `@mojikumi/css` | CSS-onlyプリセット |
| `@mojikumi/dom` | ブラウザ差を補うDOM層 |
| `@mojikumi/presets` | バージョン管理されたプリセット |
| `@mojikumi/react` | ReactコンポーネントとHook |
| `@mojikumi/rehype` | Markdown・MDX向け静的マークアップ |

詳細は[仕様](./SPEC.md)、[互換性方針](./COMPATIBILITY.md)、
[フォント検証表](./FONT-MATRIX.md)、[npm公開手順](./RELEASING.md)を参照してください。

## 設計原則

1. 標準CSSを最優先する
2. 本文の文字列、コピー結果、読み上げ内容を変えない
3. 約物を一律半角化せず、位置と前後関係を扱う
4. ネイティブ実装の進展に合わせてフォールバックを削除できるようにする
5. 未知のフォントでは過度に詰めない

## License

MIT
