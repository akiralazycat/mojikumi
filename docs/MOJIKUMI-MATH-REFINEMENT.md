# Mojikumi Math 洗練案

Status: 実装済み（一部は決定のみ） / 2026年8月26日
対象: `apps/math`（MVP実装完了・リリース検証中）

`docs/MOJIKUMI-MATH-PLAN.md`の製品定義とマイルストーンは変えない。本書は
「入力して、持ち出す」一巡をより速く・より正しくするための洗練の記録である。
各項目は、現状の該当箇所、変更の狙い、検証方法、そして結果を持つ。

## 0. 全体

維持したもの:

- MathLiveをアプリ内シームの背後へ隠す`MojikumiExpression`（`lib/expression.ts`）
- Strict βだけから生成する保守的なUnicode Readable（`lib/unicode-readable.ts`）
- 7つの並列な出力タブと`テキスト`という名前（§2の決定）
- 積分・総和の意味スロット選択の**動作**（実装方式だけを見直した。§3）

洗練した点は次の6つ。

1. 変換出力の正しさ（済）
2. 出力IAとAIの位置づけ（見送りを決定）
3. 構造選択の実装方式と操作予算（計測して結論、単一パス化を実施）
4. 状態設計とコンポーネント分割（済）
5. 体験の細部（済）
6. 提示している約束の未実装分（一部済・残りは記録）

---

## 1. 変換の正しさ（済）

### 1.1 MathLive未初期化時のフォールバックが出力を汚す

以前は`field`が`null`のとき、各変換のフォールバックにLaTeX文字列を渡していた。
`strictText`にLaTeXが入り、Readableタブが`toUnicodeReadable(latex)`を実行して
`\pi + \frac{a}{2}`を`\π + \frac{a}{2}`にしていた。MathMLもLaTeXを`<mtext>`へ
入れていた。

**実装**: `createExpression`は欠損した変換を`latex`で埋めない。
`serializeExpression`は、その出力の元になる変換がまだ無いとき`null`を返し、
UIは「この形式への変換を準備しています」を表示してコピーを無効にする。
LaTeXとMarkdownはLaTeXだけで作れるため、常に利用できる。

**検証**: `lib/expression.test.ts`「does not stand in for a converter the engine
has not produced」。

### 1.2 未入力欄がLaTeXから黙って消える

以前の`cleanLatex`は`\placeholder{}`を空文字へ置換していた。
`\placeholder{}x^2+3`が`x^2+3`（係数1と読める別の式）になり、情報が落ちたことが
コピー先に残らなかった。

**実装**: 未入力欄を出力形式ごとに可視な記号へ写像する。LaTeX・Markdownは
`\square`、テキスト系は`□`、Embedは両方を含む。走査は正規表現ではなく
`lib/latex-scan.ts`のブレース走査に置き換え、`\placeholder{\frac{a}{b}}`のような
入れ子も壊さない。MathLiveが出す`❑`も`□`へ揃える。

**検証**: `lib/latex-scan.test.ts`、`lib/expression.test.ts`、
e2e「未入力の欄は出力にも残る」。

### 1.3 読み上げ・AIテキストが英語

`spokenText`にはMathLive由来の英語読み下し（`x squared plus 5 x plus 6 equals 0`）
が入り、日本語の依頼文へ連結されていた。

**決定**: 日本語の読み下し器（`lib/spoken-ja.ts`）は作らない。Strict βから
自然言語へ落とす変換は、括弧や作用域の解釈を必ず伴う。それはUnicode Readableで
守っている「推測して意味を補わない」という不変条件と衝突する。

**実装**: AIプロンプトは、画面に見えているテキストをそのまま本文に使い、
その下にLaTeXを添える。英語の読み下しはどの出力にも現れない。

```
次の数式を簡約し、変形の根拠を説明してください。

sqrt(π) / 2

LaTeX:
\frac{\sqrt{\pi}}{2}
```

未入力欄があるときは「□ は未入力の箇所です。」を末尾に足す。`spokenText`は
`MojikumiExpression`には残す（将来の読み上げ用途のため）が、出力には使わない。

**検証**: `lib/expression.test.ts`「keeps the visible text in the AI prompt」
および「falls back to LaTeX alone before the text converter is available」。

---

## 2. 出力IAとAIの位置づけ（見送り・2026年8月26日決定）

7つの出力を「渡す／書く／埋める」へ再編し、AI用テキストを前面へ出す案は採らない。

`テキスト`はAIへ渡すためだけの出力ではなく、ブログ・メモ・チャットへ貼るための
プレーンテキストである。名前と位置はその用途を素直に表しており、AIはそこへ
依頼文を足せる選択肢という位置づけが正しい。形式を目的別に束ねると、
「テキスト＝AI用」という誤った対応づけを作ってしまう。

したがって、7つの並列なタブと`テキスト`という名前、Plainタブ内の依頼文
チェックボックスは現状のまま維持する。

---

## 3. 構造選択の実装方式（計測して結論）

意味スロット選択（積分の下限・上限・式・変数など）は、mathfieldのオフセット範囲を
総当りし、`parseSemanticStructure`が構造として読める範囲を探す実装だった。
`docs/MOJIKUMI-MATH-PLAN.md`が定めるp75 100ms以下という保証に対して、
この総当りが妥当かどうかを確かめた。

### 試して退けた案: LaTeX側で構造を索引化する

LaTeXを一度読んで構造とスロットの位置を確定し、mathfieldへの問い合わせを
数回の写像だけに減らす案を実装し、退けた。**mathfieldのオフセットは、その
mathfield自身が出力するLaTeXの位置と対応しない**ためである。空の積分
`\int_{□}^{□}□\,d□`で確認した接頭辞は次のようになる。

```
prefix[0,2]=\placeholder{}                       ← 下限だけ
prefix[0,4]=\placeholder{}\placeholder{}         ← 下限と上限
prefix[0,5]=\int_{\placeholder{}}^{\placeholder{}}
```

上下限は演算子より前のオフセットに現れ、直列化された文字列は元のLaTeXの接頭辞に
ならない。同じ内容のスロット（未入力欄はすべて`\placeholder{}`）が複数あると、
写像先を内容の一致では区別できず、下限への入力が上限へ入った。
**構造の範囲はフィールドから読むしかない**というのが結論である。

### 実施した変更

- 種別ごとに独立していた走査を、式が含む種別だけを対象にした**単一パス**へ統合し、
  結果を式の値でキャッシュする（`lib/structure-search.ts`）。
  積分と総和を両方含む式で、走査は2回から1回になった。
- 式が含む構造種別の判定を`structureKindsIn`（`lib/math-structure.ts`）へ集約し、
  UIと探索が同じ判定を使う。
- 操作予算をe2eで固定した（下記）。

### 計測

`\frac{1}{n}\sum_{i=1}^{n}\frac{x_i-\mu}{\sigma}+\int_{0}^{1}\frac{x^2+3x+2}{1+x^2}\,dx`
に対する1操作の所要時間（デスクトップChromium）:

| 操作 | 所要 |
| --- | --- |
| 積分の変数を選択（この式で最初の1回） | 23.0ms |
| シグマの上限を選択（同じパスを再利用） | 0.4ms |
| 積分の変数を再選択 | 0.9ms |

e2e「長い数式でも構造要素の選択が操作予算に収まる」が、初回400ms・再選択150msを
上限として固定する。CIの余裕を見た値であり、実測との差が予算の余白である。

---

## 4. 状態設計とコンポーネント分割（済）

### 4.1 レンダー中のDOM読み取り

レンダー本体で`fieldRef.current`から4つの変換を同期的に読んでいた。現在は
`input`・LaTeXソース編集・フィールド生成時に読み、状態として保持する。

### 4.2 1ファイル1144行

`components/math-workspace.tsx`が6つの関心を抱えていた。現在の構成:

| ファイル | 役割 |
| --- | --- |
| `lib/latex-scan.ts` | ブレース走査と`\placeholder`の置換 |
| `lib/keyboard.ts` | キーボード・構造キー・開始候補の定義 |
| `lib/mathfield.ts` | MathLive要素の型と読み取りヘルパー |
| `lib/structure-search.ts` | 構造とスロットの探索 |
| `hooks/use-draft.ts` | 端末内下書きの復元と保存 |
| `hooks/use-structure-selection.ts` | 選択状態と読み上げ文言 |
| `components/math-keyboard.tsx` | キーボードとバリエーション |
| `components/structure-navigator.tsx` | 選択ナビゲーション |
| `components/output-panel.tsx` | 出力タブと本文 |
| `components/math-workspace.tsx` | 上記の組み立て |

### 4.3 キーボード定義をデータへ

`lib/keyboard.ts`へ移した。`Π`が`calculus`のキーと`Σ`のバリエーションに二重に
あった重複は、キーだけを残して解消した。

### 4.4 Strict βの扱い

Plan §9の未決事項1（Strict文法の所有）は未決のまま。注記は現状を維持し、
タブ構成も変えない（§2）。

---

## 5. 体験の細部（済）

| 箇所 | 以前 | 現在 |
| --- | --- | --- |
| 新規作成 | `window.confirm`で確認 | 確認せずに消し、「消した数式を戻す」を含む通知を8秒表示する |
| `Untitled equation` | 命名も複数保持も未実装なのに名前を示唆 | `数式`という静的な語 |
| キーボードの群 | `Basic` / `Algebra` / `Calculus` / `Greek` | `基本` / `代数` / `解析` / `ギリシャ` |
| ライブリージョン | 単一の領域を保存状態と操作結果が奪い合い、1秒の優先権で回避していた | 保存状態は`role="status"`、操作結果は`aria-live="polite"`。優先権の回避策は削除。可視の保存表示は`aria-hidden` |
| 触覚 | 挿入時のみ | 挿入・構造選択・コピー成功で8ms |
| LaTeXモードの案内 | Visualと同じ「タップして編集」 | 「LaTeXを貼り付けると読み込みます」 |

---

## 6. 提示している約束の未実装分

- **Embed（済）**: `<mojikumi-math>`はまだ公開していないため、要素の中に生成済み
  MathMLをフォールバックとして入れ、タブに「Web Componentの公開前です」と明示した。
  貼り付け先では少なくともMathMLが表示される。
- **LaTeX取り込み（済・最小）**: LaTeXモードの`textarea`が取り込み口であることを
  画面の案内文で明示した。専用の導線は作っていない。
- **`/guide/` `/accessibility/` `/about/`（未）**: トップの`#use-cases`・`#privacy`が
  代替しているため、Plan §3の表記を「トップ内セクションで代替中」に更新した。
- **共有URL（未）**: Milestone 2。長さとプライバシーの上限を先に決める。

---

## 7. 残っている判断

1. Strict文法をMojikumiが所有するか、外部仕様に従うか（Plan §9-1）。
2. `/guide/`などの独立ページを公開する時期。
3. 共有URLをクライアント符号化に限るか、期限付きサーバー保存を許すか（Plan §9-3）。
4. `packages/math-core`の抽出時期（2つ目の利用者が現れてから）。

いずれも入力とコピーのMVPを止めない。

## 8. 検証状況

- `npm test`（ユニット、56件）
- `apps/math`の`tsc --noEmit`と本番静的ビルド
- `npx playwright test`（desktop・390px・320pxの66件、うち6件は他プロジェクトで実行済みのためスキップ）
- axe WCAG 2 A/AAスキャン

`apps/math/RELEASE-CHECKLIST.md`の手動ゲート（実機・スクリーンリーダー・
ユーザビリティ・プライバシー）は、本書の変更後に再実施が必要である。
