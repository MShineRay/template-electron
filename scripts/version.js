#!/usr/bin/env node

/**
 * 版本号管理脚本
 * 根据不同环境生成不同的版本号
 * 
 * 使用方法：
 *   node scripts/version.js dev     # 开发环境版本
 *   node scripts/version.js test     # 测试环境版本
 *   node scripts/version.js prod    # 生产环境版本
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 获取环境参数
const env = process.argv[2] || 'dev';
// 提取基础版本号（移除预发布标识，如 -dev.xxx, -beta.xxx）
const currentVersion = packageJson.version || '0.0.1';
const baseVersion = currentVersion.split('-')[0]; // 提取 major.minor.patch 部分

/**
 * 生成版本号
 */
function generateVersion(environment) {
  const [major, minor, patch] = baseVersion.split('.').map(Number);
  
  switch (environment) {
    case 'dev':
    case 'development':
      // 开发环境：使用构建号（日期时间戳，使用本地时间）
      // 格式：1.0.0-dev.20251230143000（符合 SemVer 预发布版本规范）
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const buildNumber = `${year}${month}${day}${hours}${minutes}${seconds}`;
      return {
        version: `${major}.${minor}.${patch}-dev.${buildNumber}`,
        buildVersion: buildNumber,
      };
    
    case 'test':
    case 'testing':
      // 测试环境：使用预发布版本
      // 格式：1.0.0-beta.1
      // 可以从环境变量或文件中读取测试版本号
      const testNumber = process.env.TEST_VERSION_NUMBER || '1';
      return {
        version: `${major}.${minor}.${patch}-beta.${testNumber}`,
        buildVersion: testNumber,
      };
    
    case 'prod':
    case 'production':
      // 生产环境：使用正式版本号
      return {
        version: baseVersion,
        buildVersion: undefined, // 生产环境不使用构建号
      };
    
    default:
      return {
        version: baseVersion,
        buildVersion: undefined,
      };
  }
}

/**
 * 更新 package.json 中的版本号
 */
function updatePackageVersion(version) {
  packageJson.version = version;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf8'
  );
  console.log(`✅ 版本号已更新为: ${version}`);
}

/**
 * 生成环境变量文件
 * 将版本信息追加到对应的 .env 文件中
 */
function generateEnvFile(versionInfo, environment) {
  const now = new Date();
  const localTime = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).replace(/\//g, '-').replace(/, /g, ' ');
  
  // 构建版本信息内容
  const versionContent = `# ============================================
# 构建信息（自动生成，请勿手动修改）
# ============================================
VERSION=${versionInfo.version}
BUILD_VERSION=${versionInfo.buildVersion || ''}
BUILD_TIME=${now.toISOString()}
BUILD_TIME_LOCAL=${localTime}
BUILD_ENV=${environment}
`;
  
  // 确定目标 .env 文件
  const envFileName = environment === 'prod' ? '.env.production' : '.env.development';
  const envPath = path.join(__dirname, `../${envFileName}`);
  
  // 读取现有内容
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    // 文件不存在，使用空内容
  }
  
  // 移除旧的构建信息部分（如果存在）
  const buildInfoRegex = /# ============================================\n# 构建信息.*?BUILD_ENV=.*?\n/s;
  const cleanedContent = existingContent.replace(buildInfoRegex, '').trim();
  
  // 追加新的构建信息
  const newContent = cleanedContent + '\n\n' + versionContent;
  fs.writeFileSync(envPath, newContent, 'utf8');
  console.log(`✅ 版本信息已写入: ${envFileName}`);
}

// 主逻辑
const versionInfo = generateVersion(env);
updatePackageVersion(versionInfo.version);
generateEnvFile(versionInfo, env);

// 导出供 electron-builder 使用
if (versionInfo.buildVersion) {
  process.env.BUILD_VERSION = versionInfo.buildVersion;
  console.log(`✅ 构建号: ${versionInfo.buildVersion}`);
}

console.log(`\n📦 环境: ${env}`);
console.log(`📌 版本: ${versionInfo.version}`);
if (versionInfo.buildVersion) {
  console.log(`🔢 构建号: ${versionInfo.buildVersion}`);
}

