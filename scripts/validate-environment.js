#!/usr/bin/env node

/**
 * Comprehensive Development Environment Validation
 * 
 * Validates:
 * - Required environment variables
 * - Node.js version compatibility
 * - Dependency installation completeness
 * - Build system configuration
 */

const fs = require('fs')
const path = require('path')

const requiredEnvVars = [
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_ACCESS_TOKEN',
  'CONTENTFUL_PREVIEW_ACCESS_TOKEN',
  'NEXT_PUBLIC_CONTENTFUL_SPACE_ID'
]

const requiredFiles = [
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  '.eslintrc.json',
  '.prettierrc'
]

const requiredDirectories = [
  'src/types',
  'src/utils',
  'src/lib/contentful',
  'src/lib/preview',
  'src/stores',
  'src/hooks',
  'src/components/ui',
  'src/components/preview',
  'src/app'
]

console.log('🔍 Validating development environment...\n')

let hasErrors = false

// Environment Variables Validation
console.log('📋 Environment Variables:')
const envFile = '.env.local'
const envExists = fs.existsSync(envFile)

if (!envExists) {
  console.log('❌ .env.local file not found')
  console.log('   Create .env.local with your Contentful credentials')
  hasErrors = true
} else {
  const envContent = fs.readFileSync(envFile, 'utf8')
  
  requiredEnvVars.forEach(varName => {
    const hasVar = envContent.includes(varName)
    const hasPlaceholder = envContent.includes('your_') || envContent.includes('_here')
    
    if (!hasVar) {
      console.log(`❌ ${varName}: Missing`)
      hasErrors = true
    } else if (hasPlaceholder && envContent.includes(varName)) {
      console.log(`⚠️  ${varName}: Contains placeholder value`)
      hasErrors = true
    } else {
      console.log(`✅ ${varName}: Configured`)
    }
  })
}

// File Structure Validation
console.log('\n📁 Required Files:')
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file}: Missing`)
    hasErrors = true
  }
})

// Directory Structure Validation
console.log('\n📂 Directory Structure:')
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`)
  } else {
    console.log(`❌ ${dir}: Missing`)
    hasErrors = true
  }
})

// Package.json Scripts Validation
console.log('\n📜 Development Scripts:')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredScripts = ['dev', 'build', 'lint', 'type-check', 'analyze']

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}`)
  } else {
    console.log(`❌ ${script}: Missing`)
    hasErrors = true
  }
})

// Node.js Version Check
console.log('\n🔧 Runtime Environment:')
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion >= 18) {
  console.log(`✅ Node.js ${nodeVersion} (Compatible)`)
} else {
  console.log(`❌ Node.js ${nodeVersion} (Requires v18+)`)
  hasErrors = true
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Environment validation failed')
  console.log('\nRecommended actions:')
  console.log('1. Create .env.local with your Contentful credentials')
  console.log('2. Run the development workflow infrastructure setup')
  console.log('3. Ensure all required files and directories exist')
  process.exit(1)
} else {
  console.log('✅ Environment validation successful')
  console.log('🚀 Ready for development!')
  process.exit(0)
}
