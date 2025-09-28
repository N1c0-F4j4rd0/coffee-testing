const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const Logger = require('../utils/logger');

class AutoDriverSetup {
    static async createDriver() {
        try {
            Logger.info('🚗 Configurando driver con detección automática...');
            
            let options = new chrome.Options();
            
            // Configuración mínima y compatible
            options.addArguments(
                '--window-size=1920,1080',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-features=VizDisplayCompositor',
                '--disable-blink-features=AutomationControlled'
            );
            
            // Remover el indicador de automatización
            options.excludeSwitches('enable-automation');
            options.setAcceptInsecureCerts(true);

            Logger.info('🔄 Inicializando ChromeDriver...');
            const driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();
            
            // Timeouts generosos
            await driver.manage().setTimeouts({ 
                implicit: 25000,
                pageLoad: 45000,
                script: 30000 
            });
            
            // Espera inicial
            await driver.sleep(3000);
            
            Logger.success('✅ Driver configurado exitosamente');
            return driver;
            
        } catch (error) {
            Logger.error(`❌ Error crítico: ${error.message}`);
            throw error;
        }
    }
}

module.exports = AutoDriverSetup;