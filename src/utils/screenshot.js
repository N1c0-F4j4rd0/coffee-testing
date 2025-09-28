const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

class ScreenshotManager {
    constructor(driver) {
        this.driver = driver;
        this.screenshotDir = path.join(__dirname, '../../reports/screenshots');
        this.createScreenshotDir();
    }

    createScreenshotDir() {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    async takeScreenshot(name) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `screenshot-${name}-${timestamp}.png`;
            const filepath = path.join(this.screenshotDir, filename);

            const image = await this.driver.takeScreenshot();
            fs.writeFileSync(filepath, image, 'base64');
            
            Logger.success(`Screenshot guardado: ${filename}`);
            return filepath;
        } catch (error) {
            Logger.error(`Error tomando screenshot: ${error.message}`);
            return null;
        }
    }

    async takeScreenshotWithStep(stepNumber, stepDescription) {
        const name = `step-${stepNumber.toString().padStart(2, '0')}-${stepDescription.toLowerCase().replace(/\s+/g, '-')}`;
        return await this.takeScreenshot(name);
    }
}

module.exports = ScreenshotManager;