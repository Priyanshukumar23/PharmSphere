const fs = require('fs');
const path = require('path');

const srcLogo = 'C:\\Users\\91808\\.gemini\\antigravity\\brain\\470702b2-c6ff-4bf8-b377-bd5ef84da27f\\pharmsphere_logo_1781586137482.png';
const srcBanner = 'C:\\Users\\91808\\.gemini\\antigravity\\brain\\470702b2-c6ff-4bf8-b377-bd5ef84da27f\\pharmsphere_banner_1781586151030.png';
const destDir = path.join(__dirname, 'public', 'images');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(srcLogo, path.join(destDir, 'logo.png'));
  fs.copyFileSync(srcBanner, path.join(destDir, 'banner.png'));
  console.log('Images successfully copied to public/images!');
} catch (error) {
  console.error('Error copying images:', error);
}
