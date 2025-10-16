# webpix-cli

🎨 **webpix** is a simple, fast, and efficient command-line tool for compressing images to WebP or JPEG using [Sharp](https://github.com/lovell/sharp).

Whether you're prepping assets for your website, reducing file sizes for performance, or simply converting formats, **webpix** gives you a reliable one-command solution.

---

## ✨ Features

- Convert to **WebP** (default) or **JPEG**
- Automatically resizes large images to a max width
- Customize quality level
- Supports folders or single image input
- Clean progress output and summary
- Default behaviors for quick use
- Written in Node.js, powered by `sharp`

---

## 📦 Installation

```bash
npm install -g webpix-cli
```

Or run directly from your project:

```bash
git clone https://github.com/happyuser/webpix-cli.git
cd webpix-cli
npm install
node webpix.js ./path-to-images
```

---

## 🚀 Usage

### Basic usage

```bash
webpix ./my-images
```

This will:

- Convert all `.jpg`, `.jpeg`, `.png`, `.tiff` files in `./my-images`
- Resize to max-width `1600px`
- Compress to `WebP` format
- Output to `./exported`

### Convert a single file

```bash
webpix photo.jpg
```

### Use custom options

```bash
webpix --jpeg --quality 80 --max-width 1200 ./photos
```

---

## ⚙️ Options

| Flag              | Description                                  | Default     |
|-------------------|----------------------------------------------|-------------|
| `-w`, `--webp`     | Convert to WebP format                       | ✅ (default) |
| `-j`, `--jpeg`     | Convert to JPEG format                       |             |
| `-q`, `--quality`  | Image quality (1–100)                        | `70`        |
| `-m`, `--max-width`| Resize image to max width in pixels         | `1600`      |
| `-o`, `--out`      | Output directory path                        | `./exported`|

---

## 🖼️ Supported Formats

Input: `.jpg`, `.jpeg`, `.png`, `.tiff`  
Output: `.webp` or `.jpeg`

---

## 📊 Output Summary

After processing, you'll see a summary:

```
📊 Summary:
   ✅ Processed: 8
   ⚠️ Skipped:   2
   ❌ Failed:    0
   📦 Output:    ./exported
```

---

## 🛠 Example Workflow

```bash
mkdir raw-images
# add your images
webpix raw-images
# done! check ./exported
```

---

## 📄 License

MIT © Happy User
