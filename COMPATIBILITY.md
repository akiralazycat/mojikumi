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
| ぶら下げ | `hanging-punctuation: first force-end` | 強制再現しない。行末の句読点は行末調整が受け持つ |
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

`hanging`修飾子（`book`の既定）は`hanging-punctuation: first force-end`を当てます。
実装しているのはWebKitだけで、手元にSafariがないため**未確認の項目がひとつ**
残っています。

行末は、それぞれの機構が届く範囲で分担しています。**ぶら下げが句読点を、
DOMフォールバックの行末調整が閉じ括弧を**受け持ちます。`hanging-punctuation`は
閉じ括弧に対して何もしないためで、逆に句読点はぶら下げに渡したほうが安定します
（ぶら下げた字は行の幅を取らないので、行分割をやり直させません）。`allow-end`
ではなく`force-end`なのは、条件付きだと「たまたま収まった読点」だけがどちらの
担当でもなくなるためです。`precision: "full"`はどちらの機能も持たないブラウザの
再現なので、そこではぶら下げを切り、行末調整がすべてを担当します。

残るのは**段落先頭**です。`first`は段落先頭の始め括弧を版面の外へ出しますが、
DOMフォールバックも同じ位置の開き約物に`-0.5em`を当てます。両方が効けば二重に
ずれるはずで、ここはまだ実機で見ていません。

ただし、Safariが`text-spacing-trim`を実装していればフォールバックは起動しない
ので、競合は起きません。**最初に見るべきはそこです。**

### 確認手順

1. Safariで`book`プリセットを適用したページを開く
2. コンソールで`instance.support`（またはルート要素のクラス）を見る
   - `mjk-punctuation-fallback`が**付いていなければ競合は起きない**。ここで終了
   - 付いていれば次へ
3. 段落先頭の開き約物を見る。`『』`で始まる段落で、1文字目が版面の左端より
   半角ぶん外へ出ていれば二重適用
4. 二重適用が確認できた場合は、`hanging`が有効なとき段落先頭の調整も
   ぶら下げへ渡す（行末で句読点をそうしたのと同じ整理）

行末については、`hanging`が有効なときフォールバックが句読点を降りているため、
この二重適用は起きません。同じことをFirefoxで確認する必要もありません。
`hanging-punctuation`を実装していないため、CSSごと無視されます。

## 既知の制約

- フォントの`halt` / `chws`や約物メトリクスにより結果が異なる
- 非表示状態ではRange測定を確定できないため、表示後のリサイズ等で再評価する
- 精密な行判定は横書きを主対象とする
- インライン要素境界をまたぐペアルールは今後の対象
- 疑問符・感嘆符・中点類は保守的に無調整
