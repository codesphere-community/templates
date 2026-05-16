const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

async function convertImage(inputBuffer, targetFormat) {
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']

  if (!supportedFormats.includes(targetFormat.toLowerCase())) {
    throw new Error(`Unsupported format: ${targetFormat}. Supported: ${supportedFormats.join(', ')}`)
  }

  let pipeline = sharp(inputBuffer)

  switch (targetFormat.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: 90 })
      break
    case 'png':
      pipeline = pipeline.png()
      break
    case 'webp':
      pipeline = pipeline.webp({ quality: 90 })
      break
    case 'gif':
      pipeline = pipeline.gif()
      break
    case 'avif':
      pipeline = pipeline.avif({ quality: 80 })
      break
  }

  return pipeline.toBuffer()
}

async function convertImageBatch(files, targetFormat) {
  const results = []
  for (const file of files) {
    try {
      const converted = await convertImage(file.buffer, targetFormat)
      results.push({
        originalName: file.originalname,
        targetFormat,
        success: true,
        size: converted.length,
      })
    } catch (err) {
      results.push({
        originalName: file.originalname,
        targetFormat,
        success: false,
        error: err.message,
      })
    }
  }
  return results
}

module.exports = { convertImage, convertImageBatch }