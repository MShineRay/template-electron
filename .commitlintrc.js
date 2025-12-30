module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式变更（不影响代码运行）
        'refactor', // 重构（既不是新功能也不是 bug 修复）
        'perf', // 性能优化
        'test', // 添加或修改测试
        'build', // 构建系统或外部依赖变更
        'ci', // CI 配置文件和脚本变更
        'chore', // 其他变更（不修改 src 或 test 文件）
        'revert', // 回滚之前的提交
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
