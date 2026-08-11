#!/usr/bin/env bash
# 手动输入版本号 → 更新 package.json → 提交并推送 → 创建并推送 git tag → 触发自动发布npm包

set -euo pipefail

# 仓库根目录（脚本位于 scripts/ 下）
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 红色错误输出并退出
exit_with_error() {
  echo -e "\033[31m错误：$1\033[0m" >&2
  exit 1
}

# 绿色成功输出
print_success() {
  echo -e "\033[32m$1\033[0m"
}

# 仅允许在 main / master 分支打标签发版
cur_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$cur_branch" != "main" && "$cur_branch" != "master" ]]; then
  exit_with_error "当前不是 main 或 master 分支（当前：$cur_branch）"
fi

# 工作区必须干净，避免把无关改动一并提交
if [[ -n "$(git status --porcelain)" ]]; then
  exit_with_error "工作区有未提交的改动，请先处理后再执行发版"
fi

# 读取当前 package.json 版本，便于对照输入
current_version="$(node -p "require('./package.json').version")"
echo "当前 package.json 版本：$current_version"

# 手动输入版本号（即标签名）
read -r -p "请输入版本号（eg：0.0.1 | 0.0.1-beta | 0.0.1-beta.1）：" version

# 版本号格式校验，与 bin/zx/tag.ts 保持一致
tag_name_reg='^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9]+(\.[0-9]+)?)?$'
if [[ ! "$version" =~ $tag_name_reg ]]; then
  exit_with_error "版本号不满足规则（eg：0.0.1 | 0.0.1-beta | 0.0.1-beta.1）"
fi

# 本地已存在同名标签则中止
if git rev-parse "$version" >/dev/null 2>&1; then
  exit_with_error "标签 $version 已存在"
fi

# 远程已存在同名标签则中止（尽量避免推送冲突）
if git ls-remote --tags origin "refs/tags/$version" | grep -q .; then
  exit_with_error "远程已存在标签 $version"
fi

# 更新 package.json 中的 version 字段
npm version "$version" --no-git-tag-version --allow-same-version

# 提交版本号变更
git add package.json
git commit -m "chore: 发布版本 $version"

# 在当前提交上创建同名本地标签
git tag "$version"

# 推送提交与标签到远程（推送 tag 会触发 npm-publish workflow）
git push origin HEAD
git push origin "$version"

print_success "版本 $version 已更新、提交并推送到远程，标签已创建并推送成功！"
