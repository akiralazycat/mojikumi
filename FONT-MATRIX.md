# Font Matrix

フォント固有の調整を推測で有効にしないための検証台帳です。初期状態ではすべて
「未検証」とし、OS、ブラウザ、フォント版、OpenType機能、スクリーンショットを
揃えた結果だけを記録します。

| Font family | Category | halt | chws | Horizontal | Vertical | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Noto Sans JP | Gothic | TBD | TBD | TBD | TBD | 未検証 |
| Noto Serif JP | Mincho | TBD | TBD | TBD | TBD | 未検証 |
| Hiragino Sans | Gothic | TBD | TBD | TBD | TBD | 未検証 |
| Hiragino Mincho | Mincho | TBD | TBD | TBD | TBD | 未検証 |
| Yu Gothic | Gothic | TBD | TBD | TBD | TBD | 未検証 |
| Yu Mincho | Mincho | TBD | TBD | TBD | TBD | 未検証 |
| BIZ UDPGothic | Gothic | TBD | TBD | TBD | TBD | 未検証 |
| BIZ UDMincho | Mincho | TBD | TBD | TBD | TBD | 未検証 |
| Source Han Sans | Gothic | TBD | TBD | TBD | TBD | 未検証 |
| Source Han Serif | Mincho | TBD | TBD | TBD | TBD | 未検証 |

## 記録要件

1. フォントの正式名称とバージョン
2. OSとブラウザのバージョン
3. `halt`、`chws`の有無と実動作
4. 連続約物、行頭、行末、和欧間のfixture
5. 100%、125%、150%ズームのスクリーンショット
6. ネイティブCSSとMojikumi補完の差

## 全角字形への差し替え（`fwid`）

半角約物を全角の字組みに合わせられるか、実測した記録です。**実装はしていません。**

`font-variant-east-asian: full-width`（OpenTypeの`fwid`）は、半角約物を全角の
字形そのものに差し替えます。マージンで0.5em足すのとは結果が違い、送りだけでなく
**墨の大きさまで**全角と一致します。文字列は変わらないため、コピーされる文章と
読み上げの内容は`｡`のままです。

計測日: 2026年8月4日 / Chromium 148.0.7778.280 / macOS

| Font family | `｡｢｣､･` そのまま | `fwid`適用後 | 全角`。「」、・`（対照） |
| --- | ---: | ---: | ---: |
| Hiragino Mincho ProN | 0.5em | **1em** | 1em |
| Hiragino Sans | 0.5em | **1em** | 1em |
| Noto Sans JP | 0.5em | **1em** | 1em |

3書体とも、約物だけに当てた行は最初から全角で書いた行と見分けがつきませんでした。

### 実装するなら必要な条件

**約物のトークンだけに当てること。** 要素全体に当てると巻き添えが出ます。

| 対象 | そのまま | 要素全体に`fwid` |
| --- | ---: | ---: |
| 半角カナ `ｱｲｳ` | 0.5em | 0.9〜1em |
| ラテン `Abc1` | 0.53〜0.74em | すべて1em |

**前後が全角の日本語のときだけ変換すること。** 半角カナと併用されている本文は
もともと半角のリズムで組まれており、約物だけ全角にすると`ｶﾀｶﾅ表記。 ｱｲｳ。`のように
約物だけが浮きます。半角カナはU+FF66–FF9Fの範囲判定で区別できます。

### 見送った理由

ここまでMojikumiが行ってきたのは「字と字のあいだの空き」の調整で、これは
「どの字形を描くか」の変更です。種類の違う介入であり、前後の文脈で守れるとはいえ、
書き手が打った文字の形を変えることに変わりはありません。判断材料として、計測した
書体がまだ3つしかありません。

既定をオンにする条件は、この表の主要書体が埋まり、実サイトで誤変換が出ないことを
確かめてからです。

### 未決の設計

全角化した約物は1emになり二分アキを持つため、以降はペアルールや行頭・行末調整の
対象になるのが筋です。そうすると文字クラスの判定が修飾子の状態に依存します。
実装前に決める必要があります。
