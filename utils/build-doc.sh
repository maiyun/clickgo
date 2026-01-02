#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

API_DOC_OUTPUT_DIR=doc/sc/api

# check if any files in src is not stashed in git
if [[ -n $(git status --porcelain "./dist") ]]; then
    echo "Error: You have unstaged changes. Please commit or stash them before generating API docs."
    exit 1
fi

rm -rf $API_DOC_OUTPUT_DIR
rm -f doc/clickgo-rag.md

mkdir -p $(dirname $API_DOC_OUTPUT_DIR)

npx typedoc \
  --entryPoints "dist/clickgo.ts" "dist/lib/*.ts" \
  --exclude "**/*.d.ts" \
  --out $API_DOC_OUTPUT_DIR \
  --readme none \
  --name "Documents for clickgo" \
  --hostedBaseUrl "https://maiyun.github.io/clickgo/" \
  --plugin typedoc-plugin-markdown \
  --sourceLinkTemplate "https://github.com/maiyun/clickgo/blob/master/{path}#L{line}" \
  --entryFileName "index"

# --- 去除前导尾随 ---

find $API_DOC_OUTPUT_DIR -name "*.md" -type f | while read file; do
    sed -i 's/^--- *//; s/ *---$//' "$file"
done

# --- 定义额外的单文件列表 ---
extra_files=("doc/README.sc.md")

# --- 处理单文件 ---
for f in "${extra_files[@]}"; do
  if [ -f "$f" ]; then
    # --- 去掉路径和 .md ---
    # filename=$(basename "$f" .md)
    filename=$(basename "$f")
    printf "\n%s\n---\n\n" "$filename" >> "doc/clickgo-rag.md"
    cat "$f" >> "doc/clickgo-rag.md"
  fi
done

# --- 处理控件目录下的 info.md（总标题及每个控件子标题） ---
if [ -d "dist/sources/control" ]; then
  printf "\n\n%s\n---" "# 控件" >> "doc/clickgo-rag.md"

  # 遍历 dist/sources/control 下的一层目录，按字母顺序
  find dist/sources/control -maxdepth 1 -mindepth 1 -type d | sort | while read dir; do
    name=$(basename "$dir")
    info_file="$dir/info.md"
    if [ -f "$info_file" ]; then
      printf "\n\n%s\n---\n\n" "## $name" >> "doc/clickgo-rag.md"
      cat "$info_file" >> "doc/clickgo-rag.md"
    fi
  done
fi

# --- 合并所有 md 成一个文件，保留模块标题 ---
find "$API_DOC_OUTPUT_DIR" -name "*.md" | sort | while read file; do
  # --- 计算相对路径（相对于 API_DOC_OUTPUT_DIR） ---
  relpath="${file#$API_DOC_OUTPUT_DIR/}"
  
  printf "\n%s\n---\n\n" "$relpath" >> "doc/clickgo-rag.md"
  cat "$file" >> "doc/clickgo-rag.md"
done
