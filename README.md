# vscode-csstree

Validate CSS according to W3C specs and browser implementations.

Extension highlights wrong properties and values when enabled. Just install the extension and open your CSS file. Validation will be performing in background.

<img width="682" src="https://cloud.githubusercontent.com/assets/6654581/18788246/d0d4c7ca-81ae-11e6-9777-36806fd4cbfb.png">

CSS validator based on [CSSTree](https://github.com/csstree/validator) as [plugin](https://atom.io/packages/csstree-validator) for VSCode.

## Extension Settings

* `csstree.enable`: enable/disable this extension

## Other

If you want to disable VSCode's internal CSS linting then just add

```json
"css.validate": false
```
to your preferences.