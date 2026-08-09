const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputPath = '/Users/soroush/Documents/New project/whalert/public/images/whalert-hero-exact.png';
  const outputPath = '/Users/soroush/Documents/New project/whalert/public/images/whalert-hero-exact-transparent.png';

  try {
    // First, get metadata to know width and height
    const metadata = await sharp(inputPath).metadata();
    
    // Crop 5 pixels off the right edge to remove the stray border line
    const cropWidth = metadata.width - 5;
    
    const { data, info } = await sharp(inputPath)
      .extract({ left: 0, top: 0, width: cropWidth, height: metadata.height })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Loop through pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = (r + g + b) / 3;
      
      // Make it much more opaque/visible than last time
      let alpha = brightness * 4.5; 
      
      // Filter out pure background aggressively
      if (brightness < 12) {
         alpha = 0;
      }
      
      if (alpha > 255) alpha = 255;
      
      // Boost colors slightly to make it pop more
      data[i] = Math.min(255, r * 1.2);
      data[i+1] = Math.min(255, g * 1.2);
      data[i+2] = Math.min(255, b * 1.2);
      
      data[i + 3] = Math.floor(alpha);
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      }
    })
    .png()
    .toFile(outputPath);

    console.log("Success! Image processed: brighter and right border removed.");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processImage();
