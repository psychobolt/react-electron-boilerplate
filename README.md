# React Electron Boilerplate

[![Dependencies Status](https://david-dm.org/psychobolt/react-electron-boilerplate.svg)](https://david-dm.org/psychobolt/react-electron-boilerplate)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/react-electron-boilerplate/dev-status.svg)](https://david-dm.org/psychobolt/react-electron-boilerplate?type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/react-electron-boilerplate/peer-status.svg)](https://david-dm.org/psychobolt/react-electron-boilerplate?type=peer)

[![Build Status](https://travis-ci.org/psychobolt/react-electron-boilerplate.svg?branch=master)](https://travis-ci.org/psychobolt/react-electron-boilerplate)
[![codecov](https://codecov.io/gh/psychobolt/react-electron-boilerplate/branch/master/graph/badge.svg)](https://codecov.io/gh/psychobolt/react-electron-boilerplate)

The essential framework for React-Electron development.

## Included

- Example App based on Redux's [tutorial](http://redux.js.org/docs/basics/UsageWithReact.html)
- [React](https://facebook.github.io/react/) with [recompose](https://github.com/acdlite/recompose) utility and [Redux support](https://github.com/reactjs/react-redux) libraries: 
  - [React Router Redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux)
  - [Electron Redux](https://github.com/hardchor/electron-redux)
  - [Redux Undo](https://github.com/omnidan/redux-undo)
  - [Reselect](https://github.com/reactjs/reselect)
- CSS-in-JS using [Styled Components](https://www.styled-components.com/)
- [Webpack](https://webpack.js.org/) + [Babel-loader](https://webpack.js.org/loaders/babel-loader/) with presets:
  - [Env](https://babeljs.io/docs/plugins/preset-env/) with [stage-0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0) features 
  - [Flow](https://flow.org/) Type support
  - [Sass](http://sass-lang.com/) support
  - [Hot Module Reloading](https://webpack.js.org/guides/hot-module-replacement/) enabled with [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- Babel plugins: 
  - [Module Resolver](https://github.com/tleunen/babel-plugin-module-resolver)
  - Regenerator Runtime support with [Tranform Runtime](https://babeljs.io/docs/plugins/transform-runtime/)
- Simple app persistence using [electron-store](https://github.com/sindresorhus/electron-store#readme)
- Logfile support using [electron-log](https://github.com/megahertz/electron-log)
- Packaging support: [electron-builder](https://github.com/electron-userland/electron-builder)
- Test runner: [Jest](https://facebook.github.io/jest)
- e2e runner: [Spectron](https://electron.atom.io/spectron/) + [EVA](https://github.com/avajs/ava)
- [Enzyme](https://github.com/airbnb/enzyme)
- Code Coverage reporter: [Codecov](https://codecov.io/)
- ES Linting: [ESLint](http://eslint.org/) using [AirBnb style guide](https://github.com/airbnb/javascript)
- Style Linting: [stylelint](https://stylelint.io)
- Install extensions using [electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer), including:
  - [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  - [Redux DevTools Extension](http://extension.remotedev.io/)

## Setup

1. Clone the repository
2. Install the latest [Node JS](https://nodejs.org/) and [Yarn](https://yarnpkg.com) and simply run ```yarn``` or ```yarn install``` command in the project directory.
3. ```git remote add base https://github.com/psychobolt/electron-boilerplate```

## Local development

During development, run watch task:
```sh
yarn app # compile new code changes and reloads the app
```

> Alternatively, you can run watch task (npm: app) in Visual Studio Code.

Then, in another terminal, launch Electron:
```sh
yarn dev # same as 'yarn start'
```

> Alternatively, you can launch in Visual Studio Code in debug mode.

Tesing only with production code (watch and debug unnecessary):

```sh
yarn prod
```

## Adding dependencies (libraries)

```sh
yarn add [package-name] --dev # for dev tools
yarn add [package-name] # for app
```

## Adding DevTools

Modify the file [devtools.json](devtools.json). For example:
```json
{
    "Redux DevTools": {
        "id": "lmhkpmbekcpmknklioeibfkpmmfibljd",
        "version": "2.17.0"
    }
}
```

## Merging from base project

This project is a fork from psychobolt's [electron-boilerplate](https://github.com/psychobolt/electron-boilerplate). To fetch latest changes, ```git remote add base https://github.com/psychobolt/electron-boilerplate.git```. On a clean working branch, ```git pull base master```, and fix any conflicts before commit.

## Static Type Checker

```sh
yarn flow
```

> Some extensions such as in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode) detect ```.flowconfig``` and run type checking in the editor.

## Static Types

```sh
yarn flow # performs type checking on files
```

See [official documentation](https://flow.org/) for a usage guide.

Yarn will usually run postinstall for updating flowtype definitions when new packages are added. To manually update typed definitions yourself:

```sh
yarn flow-typed-install:dev # installs development flowtypes
yarn flow-typed-install:app # installs app flowtypes
```

See additional [documentation](https://github.com/flowtype/flow-typed) for adding type definitions.

## Lint

The watch task will automatically lint on file changes. However, you can invoke the linter directly:

```sh
yarn lint # runs linter to detect any style issues (CSS & JSS)

yarn lint:css # lint only CSS
yarn lint:css --fix # tries to fix CSS lint issues

yarn lint:js # lint only JS
yarn lint:js --fix # tries to fix CSS lint issues
```

See [official documentation](https://eslint.org/) for a usage guide.

## Test

```sh
yarn test # runs functional/unit tests using Jest
yarn test --coverage # with coverage
yarn test-e2e # run end-to-end tests. (build required)
```

## Build

```sh
yarn build
```

For configuration details, see [electron-builder](https://github.com/electron-userland/electron-builder).
