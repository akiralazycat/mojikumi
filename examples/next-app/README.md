# Mojikumi + Next.js

Mojikumiを組み込んだ最小構成のNext.js（App Router）プロジェクトです。そのまま
コピーして自分のプロジェクトの出発点にできます。

```bash
npm install
npm run dev
```

## 見るところ

| ファイル | 内容 |
| --- | --- |
| `app/layout.tsx` | `mojikumi/css`の読み込みと`lang="ja"` |
| `app/page.tsx` | `<Mojikumi>`で囲んだ本文と、囲んでいない同じ文章 |

ページを開くと、囲んだほうだけ約物のアキが詰まっています。ブラウザの「ページの
ソースを表示」で確認すると、サーバーが出力しているのは通常のHTMLだけで、余分な
要素は入っていません。DOMの調整はハイドレーション後に行われます。

## 自分のプロジェクトへ移すとき

必要なのは次の3つだけです。

1. `npm install mojikumi @mojikumi/react`
2. どこかで一度`import "mojikumi/css"`
3. 本文を`<Mojikumi as="article" preset="book">`で囲む

既存の要素に適用したい場合は`useMojikumi()`が使えます。プリセットや適用範囲の
指定は[Docs](https://mojikumi.jp/docs/)を参照してください。

## 注意

このディレクトリはリポジトリのワークスペースに含めていません。公開済みの
`mojikumi`をnpmから取得するため、リポジトリ側のビルドとは独立しています。
