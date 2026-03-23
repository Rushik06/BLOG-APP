module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'chore', // tooling, config, deps
        'docs', // documentation only
        'style', // formatting, no logic change
        'refactor', // code change, not fix or feat
        'perf', // performance improvement
        'test', // adding or fixing tests
        'ci', // CI/CD changes
        'revert', // revert a commit
      ],
    ],

    // subject line length
    'header-max-length': [2, 'always', 100],

    // don't end subject with a period
    'subject-full-stop': [2, 'never', '.'],

    // subject must not be empty
    'subject-empty': [2, 'never'],

    // type must not be empty
    'type-empty': [2, 'never'],

    // lowercase type
    'type-case': [2, 'always', 'lower-case'],
  },
};