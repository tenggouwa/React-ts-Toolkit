const chalk = require('chalk');
console.log(
  chalk.red(`commit格式错误，正确示例：git commit -m 'fix: 修复bug'`),
  chalk.green(` 
  type （只允许下列7个标识）：
  feat：新功能（feature）
  fix：修补bug
  docs：文档（documentation）
  style： 格式（不影响代码运行的变动）
  refactor：重构（即不是新增功能，也不是修改bug的代码变动）
  test：增加测试
  chore：构建过程或辅助工具的变动
  `)
)