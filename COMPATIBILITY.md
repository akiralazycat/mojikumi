# Compatibility

Mojikumiはブラウザ名やUser-Agentではなく、実行環境の機能検出でフォールバックを
選びます。このためブラウザの実装が改善されると、利用側の変更なしでネイティブ
処理へ移れます。

## 検出する機能

| 機能 | 検出値 | 未対応時 |
| --- | --- | --- |
| 約物の文脈調整 | `text-spacing-trim: normal` | 約物候補だけをラップして補完 |
| 行頭 | `text-spacing-trim: trim-start` | 行頭候補をラップして補完 |
| 行末 | `text-spacing-trim: trim-both` | 両端揃えのプリセットでのみ補完 |
| 和欧間 | `text-autospace: normal` | 空の疑似要素で0.125emを確保 |
| ぶら下げ | `hanging-punctuation: first allow-end` | v0.1では強制再現しない |
| 見出し文節改行 | `word-break: auto-phrase` | 通常の禁則処理へフォールバック |

2026年8月時点のChromium 148は`normal`、`space-first`、`trim-start`を実装し、
`trim-both`と`trim-all`は未実装です。行末を詰めるのはこの2つなので、行末は
今のところどのブラウザでもCSSだけでは揃いません。`hanging-punctuation`も
Chromiumは未対応です。

CSSの構文対応と実際の字形処理が一致しないブラウザもあるため、Playgroundと
ビジュアルテストで挙動を継続確認します。問題がある環境では`precision: "full"`を
検証用に利用できます。

## 実行環境

- ES2022を実行できるモダンブラウザ
- `Intl.Segmenter`を推奨。ない場合はコードポイント単位へ安全側にフォールバック
- `Range`、`TreeWalker`をDOM補完に使用
- `MutationObserver`、`ResizeObserver`は存在する場合のみ使用

## ルート要素が公開する状態

検出結果と、その結果としてどの経路を通っているかは、ルート要素のクラスから
読めます。デバッグと計測のための観測点で、スタイルは持ちません。

| クラス | 意味 |
| --- | --- |
| `mjk-tst-native` | `text-spacing-trim: normal`が実際に効いている |
| `mjk-tst-start-native` | `trim-start`が実際に効いている |
| `mjk-autospace-native` | `text-autospace`に対応している |
| `mjk-punctuation-fallback` | 約物の補完が動いている |
| `mjk-autospace-fallback` | 和欧間の補完が動いている |
| `mjk-force-fallback` | `precision: "full"` |

`mjk-punctuation-fallback`が付いていなければ、本文にはDOM要素が一切追加されて
いません。

## CSS-only

JavaScriptが無効でも`line-break: strict`、`text-spacing-trim: normal`、
`text-autospace: normal`など、ブラウザが実装する範囲の改善は残ります。

## 未検証：WebKitでのぶら下げ

`hanging`修飾子（`book`の既定）は`hanging-punctuation: first allow-end`を当てます。
実装しているのはWebKitだけで、手元にSafariがないため**未確認の競合がひとつ**
残っています。

`first`は段落先頭の始め括弧を版面の外へ出します。一方でDOMフォールバックは、
同じ位置の開き約物に`-0.5em`を当てます。両方が効くと二重にずれるはずです。
`allow-end`と行末調整の`-0.5em`も同じ関係にあります。

ただし、Safariが`text-spacing-trim`を実装していればフォールバックは起動しない
ので、競合は起きません。**最初に見るべきはそこです。**

### 確認手順

1. Safariで`book`プリセットを適用したページを開く
2. コンソールで`instance.support`（またはルート要素のクラス）を見る
   - `mjk-punctuation-fallback`が**付いていなければ競合は起きない**。ここで終了
   - 付いていれば次へ
3. 段落先頭の開き約物を見る。`『』`で始まる段落で、1文字目が版面の左端より
   半角ぶん外へ出ていれば二重適用
4. 行末の句読点も同様に、右端より半角ぶん余分に出ていないか見る
5. 二重適用が確認できた場合は、`hanging`が有効なときフォールバック側の
   行頭・行末調整を降ろす（どちらか一方だけが担当する）

同じことをFirefoxで確認する必要はありません。`hanging-punctuation`を実装して
いないため、CSSごと無視されます。

## 既知の制約

- フォントの`halt` / `chws`や約物メトリクスにより結果が異なる
- 非表示状態ではRange測定を確定できないため、表示後のリサイズ等で再評価する
- v0.1の精密な行判定は横書きを主対象とする
- インライン要素境界をまたぐペアルールは今後の対象
- 疑問符・感嘆符・中点類は保守的に無調整
