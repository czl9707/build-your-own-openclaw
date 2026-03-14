#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..', '..')
const publicDir = path.resolve(__dirname, '..', 'public', 'steps')

// Ensure public/steps directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Get all step directories
const stepDirs = fs.readdirSync(rootDir).filter(dir => {
  const fullPath = path.join(rootDir, dir)
  return fs.statSync(fullPath).isDirectory() && /^\d{2}-/.test(dir)
})

console.log(`Found ${stepDirs.length} step directories`)

// Copy SVG and other asset files from each step directory
let copiedCount = 0
for (const stepDir of stepDirs) {
  const stepPath = path.join(rootDir, stepDir)
  const files = fs.readdirSync(stepPath)

  // Create destination directory for this step
  const destStepDir = path.join(publicDir, stepDir)
  if (!fs.existsSync(destStepDir)) {
    fs.mkdirSync(destStepDir, { recursive: true })
  }

  // Copy image files (svg, png, jpg, gif)
  const imageFiles = files.filter(file =>
    /\.(svg|png|jpe?g|gif|webp)$/i.test(file)
  )

  for (const file of imageFiles) {
    const srcPath = path.join(stepPath, file)
    const destPath = path.join(destStepDir, file)
    fs.copyFileSync(srcPath, destPath)
    copiedCount++
    console.log(`Copied: ${stepDir}/${file}`)
  }
}

console.log(`\nDone! Copied ${copiedCount} files to public/steps/`)
