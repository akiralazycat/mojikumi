# Compatibility

Mojikumiはブラウザ名やUser-Agentではなく、実行環境の機能検出でフォールバックを
選びます。このためブラウザの実装が改善されると、利用側の変更なしでネイティブ
処理へ移れます。

## 検出する機能

| 機能 | 検出値 | 未対応時 |
| --- | --- | --- |
| 約物の文脈調整 | `text-spacing-trim: normal` | 約物候補だけをラップして補完 |
| 和欧間 | `text-autospace: normal` | 空の疑似要素で0.125emを確保 |
| ぶら下げ | `hanging-punctuation: first allow-end` | v0.1では強制再現しない |
| 見出し文節改行 | `word-break: auto-phrase` | 通常の禁則処理へフォールバック |

CSSの構文対応と実際の字形処理が一致しないブラウザもあるため、Playgroundと
ビジュアルテストで挙動を継続確認します。問題がある環境では`precision: "full"`を
検証用に利用できます。

## 実行環境

- ES2022を実行できるモダンブラウザ
- `Intl.Segmenter`を推奨。ない場合はコードポイント単位へ安全側にフォールバック
- `Range`、`TreeWalker`をDOM補完に使用
- `MutationObserver`、`ResizeObserver`は存在する場合のみ使用

## CSS-only

JavaScriptが無効でも`line-break: strict`、`text-spacing-trim: normal`、
`text-autospace: normal`など、ブラウザが実装する範囲の改善は残ります。

## 既知の制約

- フォントの`halt` / `chws`や約物メトリクスにより結果が異なる
- 非表示状態ではRange測定を確定できないため、表示後のリサイズ等で再評価する
- v0.1の精密な行判定は横書きを主対象とする
- インライン要素境界をまたぐペアルールは今後の対象
- 疑問符・感嘆符・中点類は保守的に無調整
