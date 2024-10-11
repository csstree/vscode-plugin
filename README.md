# VSCode CSSTree Validator

<a href="https://marketplace.visualstudio.com/items?itemName=smelukov.vscode-csstree" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/smelukov.vscode-csstree.svg?label=VSCode%20Marketplace" alt="Visual Studio Marketplace Version" /></a>

An extension for Visual Studio Code that validates CSS according to W3C specifications and browser implementations.

This extension highlights incorrect at-rules, properties, and values in your CSS files. It utilizes the [CSSTree](https://github.com/csstree/validator) capabilities to analyze CSS syntax and report any issues.

> **Note:** If you encounter false positives or false negatives—such as unknown properties being flagged or invalid values not being detected—please report these issues on the [CSSTree issue tracker](https://github.com/csstree/csstree/issues).

> **Note:** Currently, CSSTree does not support selector syntax matching. As a result, this extension does not validate selectors. Selector validation will be added once it becomes available in CSSTree ([see issue #34](https://github.com/csstree/csstree/issues/34)).

![Example](https://github.com/user-attachments/assets/ed92da31-054c-4332-b548-31f2ce427e66)

## Extension Settings

- `csstree.enable`: Enable or disable the CSSTree validator extension.

## Troubleshooting

To prevent overlapping warnings with VSCode's default CSS linting, you can disable the built-in linter by adding the following setting to your configuration:

```json
"css.validate": false
```

## License

MIT
