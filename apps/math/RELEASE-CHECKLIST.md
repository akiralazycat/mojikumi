# Mojikumi Math public release gate

Use the protected Vercel Preview before connecting `math.mojikumi.jp`.

## Automated gate

- [x] Math typecheck and production static export
- [x] 83 repository unit tests
- [x] Playwright flows at desktop, 390 px, and 320 px
- [x] axe WCAG 2 A/AA scan (MathLive composite-editor false positive documented in the test)
- [x] PWA registration, first-visit precache, offline reload, and local draft recovery
- [x] Formula sentinel absent from requests and Cache Storage
- [x] Local MathLive font delivery and zero known npm vulnerabilities

## Manual device gate

- [ ] iPhone Safari: add to Home Screen, enable airplane mode, edit and copy every output
- [ ] Android Chrome: install PWA, enable airplane mode, edit and copy every output
- [ ] macOS VoiceOver + Safari: Visual input → placeholder movement → output tab → copy
- [ ] iOS VoiceOver + Safari: Visual input → LaTeX mode → output tab → copy
- [ ] Light/dark preference survives reload on each target device
- [ ] Long press opens variants and short tap inserts the primary symbol

## Usability gate

Ask five mobile participants to reproduce the specified quadratic or integral and copy it.
Record seconds from first interaction to successful copy. Connect the production domain only
when the median is 30 seconds or less and no participant encounters an inoperable control.

## Privacy gate

- [ ] Keep Vercel Analytics and third-party analytics disabled
- [ ] Do not add accounts, formula APIs, or server-side draft storage
- [ ] Confirm the production Network panel contains no formula content
