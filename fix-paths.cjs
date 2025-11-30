const fs = require('fs');
const path = require('path');

// Configuration: Path to your products folder relative to where you run this script
const PRODUCTS_DIR = path.join(__dirname, 'src', 'content', 'products');

// Helper function to process the image strings
function fixImagePath(imagePath) {
    if (!imagePath || typeof imagePath !== 'string') return imagePath;

    // 1. If it is a URL, keep as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // 2. If it already starts with "../", keep as is
    if (imagePath.startsWith('../')) {
        return imagePath;
    }

    // 3. If it starts with "src/", replace the first occurrence with "../../"
    if (imagePath.startsWith('src/')) {
        // .replace replaces only the first occurrence by default, which is what we want
        return imagePath.replace('src/', '../../'); 
    }

    return imagePath;
}

async function processFiles() {
    try {
        // Check if directory exists
        if (!fs.existsSync(PRODUCTS_DIR)) {
            console.error(`❌ Error: Could not find directory: ${PRODUCTS_DIR}`);
            return;
        }

        const files = fs.readdirSync(PRODUCTS_DIR);
        let updatedCount = 0;

        for (const file of files) {
            // Only process .json files
            if (path.extname(file).toLowerCase() === '.json') {
                const filePath = path.join(PRODUCTS_DIR, file);
                
                // Read and Parse
                const rawContent = fs.readFileSync(filePath, 'utf8');
                let jsonData;
                
                try {
                    jsonData = JSON.parse(rawContent);
                } catch (e) {
                    console.error(`⚠️ Error parsing JSON in ${file}, skipping.`);
                    continue;
                }

                let hasChanges = false;

                // --- PROCESS: Root "image" property ---
                if (jsonData.image) {
                    const newPath = fixImagePath(jsonData.image);
                    if (newPath !== jsonData.image) {
                        jsonData.image = newPath;
                        hasChanges = true;
                    }
                }

                // --- PROCESS: "images" array ---
                if (jsonData.images && Array.isArray(jsonData.images)) {
                    jsonData.images.forEach((imgObj) => {
                        if (imgObj && imgObj.image) {
                            const newPath = fixImagePath(imgObj.image);
                            if (newPath !== imgObj.image) {
                                imgObj.image = newPath;
                                hasChanges = true;
                            }
                        }
                    });
                }

                // Write file back only if something changed
                if (hasChanges) {
                    // JSON.stringify(data, null, 2) keeps formatting pretty
                    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
                    console.log(`✅ Updated: ${file}`);
                    updatedCount++;
                }
            }
        }

        console.log(`\n🎉 Job Done! Updated ${updatedCount} files.`);

    } catch (error) {
        console.error("An unexpected error occurred:", error);
    }
}

// Run the function
processFiles();