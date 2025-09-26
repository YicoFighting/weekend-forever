## 提交与代码规范

### 代码格式化

- 执行格式化：`pnpm format`
- 检查格式化：`pnpm format:check`
- pre-commit 会自动执行 lint-staged：先 Prettier 再 ESLint。

### 交互式提交（Commitizen）

- 推荐命令：`pnpm commit` 或直接 `git commit`（将触发交互式向导）。
- 如需跳过交互：`git commit -m "feat: xxx"`（prepare-commit-msg 钩子检测到已有信息会跳过）。

### 提交信息规范

- 使用 Conventional Commits（已通过 commitlint 强制校验）。
- 常见类型：
  - feat: 新功能
  - fix: 修复缺陷
  - docs: 文档变更
  - style: 代码样式（不影响逻辑）
  - refactor: 代码重构（非功能/缺陷）
  - perf: 性能优化
  - test: 测试相关
  - build: 构建/依赖变更
  - ci: CI/CD 变更
  - chore: 其他杂项
  - revert: 回滚提交

### 提交流程

1. 运行 `git add .`
2. 执行 `git commit`（触发交互式向导）
3. Husky 钩子：
   - pre-commit：lint-staged（Prettier → ESLint）
   - commit-msg：commitlint 校验提交信息

### 备注

- 可在 `.cz-config.js` 自定义类型/作用域/提示。
- 可在 `.prettierrc`、`eslint.config.cjs` 调整规则。
