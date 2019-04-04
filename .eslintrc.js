module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  settings: {
    react: {
      pragma: "React",
      version: "15.6"
    }
  },
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "max-len": [
      "warn",
      {
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true
      }
    ],
    eqeqeq: 1,
    indent: [
      "warn",
      2,
      {SwitchCase: 1, ignoredNodes: ["JSXAttribute", "JSXSpreadAttribute"]}
    ],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    "no-console": ["off"],
    quotes: ["error", "single"],
    "no-case-declarations": 0,
    "react/jsx-indent-props": [1, 1],
    "react/jsx-max-props-per-line": [
      "error",
      {
        maximum: 1,
        when: "always"
      }
    ],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/jsx-closing-bracket-location": [
      1,
      {
        nonEmpty: "after-props",
        selfClosing: "after-props"
      }
    ],
    "react/jsx-closing-tag-location": 1,
    "react/jsx-one-expression-per-line": 1,
    "react/jsx-tag-spacing": [
      1,
      {
        beforeSelfClosing: "never"
      }
    ],
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "parens-new-line",
        logical: "parens-new-line",
        prop: "ignore"
      }
    ],
    "react/no-deprecated": 1,
    "react/no-find-dom-node": 0,
    "no-unused-vars": 0
  }
};
