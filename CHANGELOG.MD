## next

- Bumped csstree-validator version to 4.0.1 (css-tree 3.0.0)
    - Added support for the `@container`, `@starting-style`, `@scope`, `@position-try` and `@layer` at-rules
    - Added support for `layer`, `layer()` and `supports()` in the `@media` at-rule
    - Added CSS Nesting support (requires `@nest` or `&` selector, relaxed syntax is not supported yet)
    - Added support for CSS wide keywords `revert` and `revert-layer`
    - Added new units according to current state of CSS Values and Units 4: `rex`, `cap`, `rcap`, `rch`, `ic`, `ric`, `lh`, `rlh`, `vi`, `vb`, `sv*`, `lv*`, `dv*`
    - Added container relative length units from CSS Containment 3: `cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`
    - Aligned `<'font'>` to CSS Fonts 4
    - Aligned `<color>` to CSS Color 5
    - Many new CSS properties and fixes in syntaxes

## 1.1.0 (November 18, 2020)

- Bumped csstree-validator version to 2.0.0 (css-tree 1.1.1)
- Added validation for at-rules: prelude and descriptors

## 1.0.0 (October 27, 2020)

- Bumped csstree-validator version to 1.6.0 (css-tree 1.0)

## 0.8.0 (October 23, 2019)

- Bumped csstree-validator version to 1.5.1

## 0.7.0 (May 31, 2018)

- Bumped csstree-validator version to 1.4.0

## 0.6.0 (February 20, 2018)

- Bumped csstree-validator version to 1.3.1

## 0.5.0 (November 12, 2017)

- Bumped csstree-validator version to 1.2.2 (enhanced tolerance parsing mode)

## 0.4.0 (September 15, 2017)

- Bumped csstree-validator version to 1.2.1 (enhanced tolerance parsing mode)

## 0.3.0 (September 14, 2017)

- Bumped csstree-validator version to 1.2.0 (supports tolerance parsing mode)

## 0.2.0 (July 26, 2017)

- Pinned css-tree version to 1.0.0-alpha19
- Improved accuracy and fixed edge-cases
- Updated TypeScript version to 2.4

## 0.1.7 (January 20, 2017)

- Updated csstree-validator version to 1.0.8
- Improved highlighting range calculation
- Updated TypeScript version to 2.0.3

## 0.1.6 (November 03, 2016)

- Updated csstree-validator version to 1.0.5

## 0.1.5 (October 10, 2016)

- Fixed readme

## 0.1.4 (October 10, 2016)

- Updated csstree-validator version to 1.0.4
- Improved highlighting range calculation
- Renamed repo

## 0.1.3 (September 23, 2016)

- Updated csstree-validator version to 1.0.3

## 0.1.0 (September 18, 2016)

- Added `TextDocuments.onDidClose` support (#1)
- Code refactoring

## 0.0.0 (September 18, 2016)

- Initial release - base validation with csstree-validator 1.0.1
