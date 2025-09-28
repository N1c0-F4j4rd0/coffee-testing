const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const Logger = require('../utils/logger');

class DriverSetup {
    static async createDriver() {
        try {
            Logger.info('🔧 Configurando el driver de Chrome...');
            Logger.info('📋 Versión de Chrome detectada: 140.0.7339.187');
            
            let options = new chrome.Options();
            
            // Configuración optimizada para Chrome 140
            options.addArguments(
                '--start-maximized',
                '--disable-notifications',
                '--disable-extensions',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling'
            );
            
            // Remover el indicador de automatización
            options.excludeSwitches('enable-automation');
            options.setAcceptInsecureCerts(true);

            // Para debugging (opcional)
            // options.addArguments('--remote-debugging-port=9222');
            // options.addArguments('--verbose');

            Logger.info('🔄 Inicializando ChromeDriver...');
            
            const driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            // Configurar timeouts más conservadores
            await driver.manage().setTimeouts({ 
                implicit: 20000,  // Aumentar a 20 segundos
                pageLoad: 40000,
                script: 30000 
            });

            // Esperar a que el navegador esté completamente listo
            await driver.sleep(3000);
            
            Logger.success('✅ Driver configurado correctamente para Chrome 140');
            return driver;

        } catch (error) {
            Logger.error(`❌ Error creando el driver: ${error.message}`);
            
            // Información adicional para debugging
            if (error.message.includes('version')) {
                Logger.error('💡 Problema de versión detectado.');
                Logger.error('   Ejecuta: npm install chromedriver@140.0.0');
            }
            
            throw error;
        }
    }
}

module.exports = DriverSetup;