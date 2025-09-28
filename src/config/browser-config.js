const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class BrowserConfig {
    static async createDriver(browserName = 'chrome') {
        let options = new chrome.Options();
        
        // Configuración del navegador
        options.addArguments('--start-maximized');
        options.addArguments('--disable-notifications');
        options.addArguments('--disable-extensions');
        
        // Para modo headless (opcional)
        // options.addArguments('--headless');
        // options.addArguments('--disable-gpu');

        const driver = await new Builder()
            .forBrowser(browserName)
            .setChromeOptions(options)
            .build();

        // Configurar timeouts
        await driver.manage().setTimeouts({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000 
        });

        return driver;
    }

    static getBaseUrl() {
        return 'https://coffee-cart.app/';
    }
}

module.exports = BrowserConfig;