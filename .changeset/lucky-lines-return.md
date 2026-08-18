---
"@mojikumi/dom": patch
---

Stop one unstable comma from costing a paragraph its line trims

Verification of line-start and line-end adjustments could only withdraw them.
When one adjustment re-broke the lines around it, every decision measured
against the old layout went stale and was withdrawn in turn — and the tokens
the new layout had put on a line boundary could never be trimmed by a pass
that only takes away. On a phone-width paragraph with half-width digits in it,
that cascade left most line starts and ends untrimmed.

The candidates are now settled in document order, each measured in the layout
the earlier decisions have already produced. The browser breaks lines front to
back, so a settled decision cannot be disturbed by a later one; an adjustment
that undoes its own reason is still withdrawn on the spot, and stays withdrawn.
