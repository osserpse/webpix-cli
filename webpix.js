#!/usr/bin/env node
// webpix v1.3.0 – Compress images to WebP (default) using sharp with progress and simplified output path

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { program } = require("commander");

program
  .name("webpix")
  .description("Compress images to WebP or JPEG using sharp")
  .option("-w, --webp", "Convert to WebP format")
  .option("-j, --jpeg", "Convert to JPEG format")
  .option("-q, --quality <number>", "Image quality (default: 70)", "70")
  .option("-m, --max-width <number>", "Resize to max width (default: 1600px)", "1600")
  .option("-o, --out <folder>", "Custom output folder (default: ./exported)")
  .argument("<inputPath>", "Input folder or single image")
  .parse();

const options = program.opts();
const inputPath = program.args[0];
const format = options.jpeg ? "jpeg" : "webp"; // default to webp if neither is set
const quality = parseInt(options.quality || "70");
const maxWidth = parseInt(options.maxWidth || "1600");

// Always resolve output relative to where CLI is run
const outputDir = path.resolve(process.cwd(), options.out || "exported");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

let total = 0;
let processed = 0;
let skipped = 0;
let failed = 0;

const processImage = (inputFile, outputDir, index, totalCount) => {
  const ext = path.extname(inputFile).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".tiff"].includes(ext)) {
    console.log(`⚠️ [${index}/${totalCount}] Skipped (unsupported): ${inputFile}`);
    skipped++;
    return;
  }

  const outputPath = path.join(
    outputDir,
    path.basename(inputFile, ext) + `.${format}`
  );

  sharp(inputFile)
    .resize({ width: maxWidth })
    .toFormat(format, { quality })
    .toFile(outputPath)
    .then(() => {
      processed++;
      console.log(`✅ [${index}/${totalCount}] ${path.basename(inputFile)} → ${path.relative(process.cwd(), outputPath)}`);
    })
    .catch((err) => {
      failed++;
      console.error(`❌ [${index}/${totalCount}] Failed: ${path.basename(inputFile)} – ${err.message}`);
    });
};

(async () => {
  try {
    const stats = fs.statSync(inputPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(inputPath);
      total = files.length;

      if (!total) {
        console.warn("⚠️ No files found in the directory.");
        process.exit(0);
      }

      console.log(`📂 Processing folder: ${inputPath} (${total} files)`);
      files.forEach((file, i) => {
        processImage(path.join(inputPath, file), outputDir, i + 1, total);
      });
    } else if (stats.isFile()) {
      total = 1;
      console.log(`🖼️ Processing file: ${inputPath}`);
      processImage(inputPath, outputDir, 1, 1);
    } else {
      console.error("❌ Invalid input path. Must be a file or directory.");
      process.exit(1);
    }

    // Wait a moment for all sharp tasks to complete
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await wait(500);
    const interval = setInterval(() => {
      if (processed + skipped + failed >= total) {
        clearInterval(interval);
        console.log("\n📊 Summary:");
        console.log(`   ✅ Processed: ${processed}`);
        console.log(`   ⚠️ Skipped:   ${skipped}`);
        console.log(`   ❌ Failed:    ${failed}`);
        console.log(`   📦 Output:    ${outputDir}`);
      }
    }, 300);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();