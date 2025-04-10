const path = require("path");

module.exports = {
	root: true,

	// parsing
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true
		}
	},

	env: {
		browser: true,
		node: true
	},

	plugins: ["ban", "prettier", "react-hooks"],
	extends: ["airbnb", "prettier"],

	// custom set of rules
	rules: {
		// let prettier handle the code style errors
		"prettier/prettier": "warn",

		// no curly
		curly: ["warn", "all"],

		// specify for which imports extensions are required
		"import/extensions": [
			"warn",
			{
				js: "never",
				ts: "never",
				json: "always"
			}
		],

		"prefer-template": ["off"],

		// order import statements
		"import/order": [
			"warn",
			{
				"newlines-between": "always-and-inside-groups",
				alphabetize: {
					order: "asc",
					caseInsensitive: true
				},
				groups: [["builtin", "external", "internal"], "parent", "sibling", "index", "object"],
				pathGroups: [
					{
						// Put imported assets last
						pattern: "*.{css,gif,jpeg,png,scss,svg}",
						patternOptions: {
							matchBase: true
						},
						group: "index",
						position: "after"
					}
				]
			}
		],

		"sort-imports": [
			"warn",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
				allowSeparatedGroups: true
			}
		],

		// prefer default exports
		"import/prefer-default-export": ["off"],

		// max length of 120 character
		// eslint max-len
		"max-len": ["warn", 180],

		// deprecate console.log and others
		"no-console": ["warn", { allow: ["warn", "error", "info"] }],

		// allow to use continue statements and plus-plus as well as curly on new line
		"no-continue": "off",
		"no-plusplus": "off",
		"object-curly-newline": "off",
		"no-underscore-dangle": "off",
		"class-methods-use-this": "off",
		"no-else-return": "off",
		"no-lonely-if": "off",
		"no-prototype-builtins": "off",

		// empty lines look bad
		"no-multiple-empty-lines": ["warn", { max: 1, maxBOF: 0, maxEOF: 0 }],

		// restrict some syntax
		"no-restricted-syntax": ["warn", "ForInStatement", "LabeledStatement", "WithStatement"],

		// fix alignments
		"padding-line-between-statements": ["warn", { blankLine: "always", prev: "*", next: "return" }],

		// yoda rule sucks
		yoda: ["off", "never", { onlyEquality: true }],

		// add control on the Link component
		"jsx-a11y/anchor-is-valid": [
			"warn",
			{
				components: [],
				specialLink: ["to"],
				aspects: ["noHref", "invalidHref", "preferButton"]
			}
		],

		// single quotes only
		"jsx-quotes": ["warn", "prefer-double"],

		// help with react
		"react/sort-comp": "off",
		"react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
		"react/jsx-indent": ["warn", "tab", { indentLogicalExpressions: true }],
		"react/jsx-no-useless-fragment": "warn",
		"react/jsx-on-expression-per-line": "off",
		"react/jsx-props-no-spreading": "off",
		"react/jsx-sort-default-props": "warn",
		"react/jsx-sort-props": [
			"warn",
			{
				reservedFirst: true,
				shorthandLast: true
			}
		],
		"react/require-default-props": "off",
		"react/sort-prop-types": "warn",
		"react-hooks/exhaustive-deps": "warn",

		// no need to import React with nextjs
		"react/react-in-jsx-scope": "off",

		"import/no-extraneous-dependencies": [
			"warn",
			{ devDependencies: true, packageDir: path.join(__dirname, "./") }
		],
		"import/no-named-default": "off"
	},

	// override for typescript
	overrides: [
		{
			// parsing
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: 2019,
				sourceType: "module",
				// typescript-eslint specific options
				warnOnUnsupportedTypeScriptVersion: true
			},

			plugins: ["@typescript-eslint"],

			// only for typescript files
			files: ["**/*.ts", "**/*.tsx"],

			// custom rules
			rules: {
				// "@typescript-eslint/no-inferrable-types": "off",

				// TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
				"default-case": "off",
				// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
				"no-dupe-class-members": "off",
				// 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
				"no-undef": "off",
				// 'tsc' already handle this
				// (https://github.com/typescript-eslint/typescript-eslint/releases/tag/v4.0.0)
				"no-shadow": "off",

				// Add TypeScript specific rules (and turn off ESLint equivalents)
				"@typescript-eslint/consistent-type-assertions": "warn",
				"no-array-constructor": "off",
				"@typescript-eslint/no-array-constructor": "warn",
				"no-use-before-define": "off",
				"arrow-body-style": [0],
				"@typescript-eslint/no-use-before-define": [
					"warn",
					{
						functions: false,
						classes: false,
						variables: false,
						typedefs: false
					}
				],
				"no-unused-expressions": "off",
				"@typescript-eslint/no-unused-expressions": [
					"warn",
					{
						allowShortCircuit: true,
						allowTernary: true,
						allowTaggedTemplates: true
					}
				],
				"no-unused-vars": "off",

				"@typescript-eslint/no-unused-vars": [
					"warn",
					{
						args: "none",
						ignoreRestSiblings: true
					}
				],
				"no-useless-constructor": "off",
				"@typescript-eslint/no-useless-constructor": "warn",

				"react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],

				"@typescript-eslint/naming-convention": [
					"warn",
					{
						selector: ["variable"],
						format: ["camelCase", "PascalCase", "UPPER_CASE"],
						leadingUnderscore: "allow",
						trailingUnderscore: "allow"
					}
				],

				"key-spacing": ["error", { beforeColon: false, afterColon: true }],
				"react/jsx-curly-spacing": [
					"off",
					{
						when: "never",
						children: {
							when: "always"
						}
					}
				],

				"react/jsx-no-bind": ["warn", { allowArrowFunctions: false }],
				"react/jsx-boolean-value": "warn",
				"react/jsx-equals-spacing": ["warn", "never"],
				"react/jsx-key": "warn",
				"react/self-closing-comp": "warn",
				"react/jsx-wrap-multilines": "warn",
				"react/no-string-refs": "warn",
				"react/destructuring-assignment": "off",
				"no-param-reassign": "off",
				"react/forbid-component-props": ["warn", { forbid: ["id", "style"] }],
				"react/forbid-dom-props": ["warn", { forbid: ["id", "style"] }],
				"react/prop-types": [0],
				"react/function-component-definition": [
					0,
					{
						namedComponents: ["function-expression", "arrow-function"],
						unnamedComponents: ["function-expression", "arrow-function", "function-declaration"]
					}
				],
				"ban/ban": [
					"warn",
					{
						name: ["window", "addEventListener"],
						message: "Flow the layout with CSS instead of calculating with it with js"
					},
					{
						name: ["*", "setState"],
						message: "Use redux to manage state instead of this.state"
					},
					{
						name: ["*", "forceUpdate"],
						message: "Use redux instead"
					},
					{
						name: ["describe", "only"],
						message: "Do not commit focused test suite"
					},
					{
						name: ["*", "toJS"],
						message: `Avoid conversion when possible. Otherwise, use shallow conversion methods (toArray(), toJSON(), toObject()) instead of deep conversion`
					},
					{
						name: ["test", "only"],
						message: "Do not commit focused test suite"
					},
					{
						name: ["combineReducers"],
						message: "Use runtime/public/redux combineStates() instead"
					},
					{
						name: ["connect"],
						message: "Use runtime/public/redux mconnect() instead"
					},
					{
						name: ["PubSub", "subscribe"],
						message: "Use redux instead of PubSub in react"
					},
					{
						name: ["styled"],
						message: "Use styledComponent from runtime/public/theme instead"
					}
				],

				"@typescript-eslint/ban-types": [
					"warn",
					{
						types: {
							// add a custom message to help explain why not to use it
							Dispatch: "Use common/redux MDispatch instead",
							"(Any)?Action": "Use common/redux IAction instead",
							Reducer: "Use common/redux MReducer instead",
							"React.Component": "Use React.PureComponent instead",
							"{}": {
								message: "Use object instead",
								fixWith: "object"
							}
						}
					}
				],

				"react/jsx-no-duplicate-props": "error",
				"no-redeclare": "error",
				"no-duplicate-case": "error",
				"no-duplicate-imports": "error",
				"use-isnan": "warn",
				eqeqeq: "warn",
				radix: "warn",

				"@typescript-eslint/typedef": [
					"warn",
					{
						parameter: true,
						arrowParameter: true,
						propertyDeclaration: true
					}
				],

				"prefer-const": "warn",
				quotes: ["warn", "double"],
				"@typescript-eslint/no-inferrable-types": ["warn", { ignoreParameters: true }],

				"no-restricted-exports": "error",
				"comma-dangle": ["warn", "never"],
				"no-irregular-whitespace": "warn",
				"no-fallthrough": "warn",
				"no-case-declarations": "off",
				"prefer-destructuring": "off",
				"lines-between-class-members": "off",
				"@typescript-eslint/member-ordering": [
					"warn",
					{
						default: [
							"public-static-field",
							"protected-static-field",
							"private-static-field",
							"public-instance-field",
							"protected-instance-field",
							"private-instance-field",
							"public-constructor",
							"protected-constructor",
							"private-constructor",
							"public-static-method",
							"protected-static-method",
							"private-static-method",
							"public-instance-method",
							"protected-instance-method",
							"private-instance-method"
						]
					}
				]
			}
		}
	],

	globals: {
		React: "writable"
	},

	settings: {
		"import/resolver": {
			node: {
				extensions: [".mjs", ".csj", ".js", ".ts", ".tsx", ".json"],
				moduleDirectory: ["node_modules", "src/"]
			}
		}
	}
};
