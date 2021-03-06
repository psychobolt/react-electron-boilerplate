module.exports = {
  processors: ['stylelint-processor-styled-components'],
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-styled-components',
  ],
  rules: {
    'selector-type-no-unknown': [true, {
      ignore: ['custom-elements'],
    }],
  },
};
