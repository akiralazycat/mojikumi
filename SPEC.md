# Mojikumi v0.1 Specification

この文書は実装判断を再現可能にするための規範的なサブセットです。組版上の根拠は
JLREQとCSS Textを参照し、Mojikumi固有の処理は保守的な互換レイヤーに限定します。

## 対象

- 横書き日本語
- 連続約物の重複アキ
- 折り返された行頭の開き約物
- 行末の閉じ約物・句読点
- 和文とLatin文字・数字の境界
- CSS標準機能のプリセット

縦書き、ルビの高度な配置、全文字種のアキ量、追込み・追出し、形態素解析は
v0.1の対象外です。

## 文字クラス

| 内部クラス | 初期対象 |
| --- | --- |
| `opening` | `（［｛〈《「『【〔〖〘〚` |
| `closing` | `）］｝〉》」』】〕〗〙〛` |
| `comma` | `、，` |
| `period` | `。．` |
| `middle` | `・：；` |
| `question` | `？！⁉⁈` |
| `ideograph` | Han、Hiragana、Katakanaと反復記号 |
| `latin` | Unicode Script=Latin |
| `numeric` | Unicode Number |
| `space` | Unicode空白 |
| `other` | 上記以外 |

入力は`Intl.Segmenter`の書記素クラスタ単位で分割します。結合文字、異体字
セレクタ、ZWJを含む絵文字を分断しません。

## ペアルール

境界の調整量はemで表します。v0.1の汎用フォールバックは、全角約物が持つ
半em相当のアキが隣接して重複するケースだけを`-0.5em`調整します。

| 左 | 右 | 調整 |
| --- | --- | ---: |
| opening | opening | -0.5em |
| closing | closing | -0.5em |
| closing | opening | -0.5em |
| comma | opening | -0.5em |
| period | opening | -0.5em |
| closing | comma | -0.5em |
| closing | period | -0.5em |

中点・疑問符・感嘆符は一律に詰めません。フォントプロファイルがない環境では
この表より積極的な調整を行いません。

## 行コンテキスト

`paragraph-start`と`wrapped-line-start`を区別します。

- ブロック内に先行する文字がなければ`paragraph-start`
- 先行文字があり、Rangeの矩形が別行なら`wrapped-line-start`
- 段落先頭の開き約物は既定で保持
- 折り返し行頭の開き約物だけを`-0.5em`調整

行末も現在文字と後続文字のRange矩形が別行かどうかで判定します。スクロール
イベントでは再測定しません。

## 和欧間

`ideograph`または和文約物と、`latin`または`numeric`の境界に`0.125em`の
視覚的アキを入れます。ネイティブの`text-autospace: normal`が利用可能なら
ブラウザへ委譲します。フォールバックは空の疑似要素を使うため、コピーされる
文字列へ空白を追加しません。

## プリセット

| 値 | web | book | editorial | minimal | native |
| --- | --- | --- | --- | --- | --- |
| 連続約物 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 行頭調整 | ✓ | ✓ | ✓ | — | ✓ |
| 行末調整 | 条件付き | ✓ | ✓ | — | ✓ |
| 和欧間 | ✓ | ✓ | — | — | ✓ |
| 段落字下げ | — | 1em | — | — | — |
| 見出し文節改行 | — | — | ✓ | — | — |
| JSフォールバック | ✓ | ✓ | ✓ | ✓ | — |

## DOM不変条件

- 文字列を変更しない
- 生成要素は`data-mjk-generated`で識別できる
- 同じ要素への`refresh()`を繰り返しても結果が増殖しない
- `destroy()`で生成要素とルート属性を復元する
- 除外要素と`data-no-mojikumi`の内部を処理しない
