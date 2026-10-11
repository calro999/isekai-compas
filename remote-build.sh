#!/bin/bash
set -euo pipefail

# ==========================================
# 汎用リモートビルドスクリプト (Windows ゲーミングPC WSL2)
# Windowsが未起動の場合は自動的にMacローカルビルドへフォールバック
# ==========================================
REMOTE_HOST="${REMOTE_HOST:-192.168.11.16}"
REMOTE_USER="${REMOTE_USER:-matta}"
REMOTE_PORT="${REMOTE_PORT:-2222}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"

PROJECT_NAME="$(basename "$PWD")"
REMOTE_DIR="${REMOTE_DIR:-~/build-workspace/$PROJECT_NAME}"

BUILD_COMMAND="${BUILD_COMMAND:-${1:-npm run build-local}}"
BUILD_OUTPUT_DIR="${BUILD_OUTPUT_DIR:-${2:-}}"

# 出力先ディレクトリの自動判別（Next.jsならoutまたは.next、Vite等ならdist）
if [ -z "$BUILD_OUTPUT_DIR" ]; then
  if [ -d "out" ] || grep -q '"next build"' package.json 2>/dev/null; then
    if grep -q "output: 'export'" next.config.* 2>/dev/null || grep -q 'output: "export"' next.config.* 2>/dev/null; then
      BUILD_OUTPUT_DIR="out"
    else
      BUILD_OUTPUT_DIR=".next"
    fi
  else
    BUILD_OUTPUT_DIR="dist"
  fi
fi

# -------------------------------------------------------------
# ゲーミングPC (Windows WSL2) の死活・接続チェック (タイムアウト: 2秒)
# -------------------------------------------------------------
echo "==> [接続確認] Windows (ゲーミングPC) の接続状態をチェック中..."
set +e
nc -zv -G 2 "${REMOTE_HOST}" "${REMOTE_PORT}" > /dev/null 2>&1
CONNECT_STATUS=$?
set -e

if [ ${CONNECT_STATUS} -ne 0 ]; then
  echo "⚠️ Windows ゲーミングPC が未起動またはオフラインです (${REMOTE_HOST}:${REMOTE_PORT})。"
  echo "==> 自動的に Mac ローカル環境でビルドを実行します [コマンド: ${BUILD_COMMAND}]..."
  eval "${BUILD_COMMAND}"
  echo "==> [完了] Mac ローカル環境でのビルドが完了しました！"
  exit 0
fi

echo "🟢 Windows ゲーミングPC を検知しました (12コア CPUを活用します)"
SSH_CMD="ssh -i ${SSH_KEY} -p ${REMOTE_PORT} -o StrictHostKeyChecking=accept-new"

echo "==> [1/4] Windows側作業ディレクトリを準備中 ($PROJECT_NAME)..."
${SSH_CMD} "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_DIR}"

echo "==> [2/4] ソースコードを差分転送中 (rsync)..."
rsync -avz --delete \
  -e "${SSH_CMD}" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude 'out' \
  --exclude 'dist' \
  --exclude '.env*.local' \
  --exclude '.venv' \
  --exclude '__pycache__' \
  ./ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo "==> [3/4] Windows (ゲーミングPC) でビルドを実行中... [コマンド: ${BUILD_COMMAND}]"
${SSH_CMD} "${REMOTE_USER}@${REMOTE_HOST}" "bash -lc 'cd ${REMOTE_DIR} && if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi && ${BUILD_COMMAND}'"

echo "==> [4/4] 成果物 (${BUILD_OUTPUT_DIR}) をMacへ同期・回収中..."
mkdir -p "./${BUILD_OUTPUT_DIR}"
rsync -avz --delete \
  -e "${SSH_CMD}" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${BUILD_OUTPUT_DIR}/" \
  "./${BUILD_OUTPUT_DIR}/"

# out と .next の両方があるNext.js構成の場合、outも存在すれば回収
if [ "$BUILD_OUTPUT_DIR" = "out" ]; then
  ${SSH_CMD} "${REMOTE_USER}@${REMOTE_HOST}" "[ -d ${REMOTE_DIR}/.next ]" && {
    mkdir -p ./.next
    rsync -avz --delete -e "${SSH_CMD}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/.next/" "./.next/" || true
  }
fi

echo "==> [完了] リモートビルドが正常に完了し、Macへ成果物を回収しました！"
