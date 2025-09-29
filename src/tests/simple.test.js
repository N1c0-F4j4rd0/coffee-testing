const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ScreenshotManager = require('../utils/screenshot');
const Logger = require('../utils/logger');

describe('Coffee Cart - Simple Test', () => {
    let driver;
    let screenshotManager;

    beforeAll(async () => {
        Logger.info('🚀 Iniciando Simple Test');
        
        const options = new chrome.Options();
        options.addArguments(
            '--window-size=1920,1080',
            '--no-sandbox',
            '--disable-dev-shm-usage'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({
            implicit: 15000,
            pageLoad: 30000
        });

        screenshotManager = new ScreenshotManager(driver);
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test('Simple Test - Verificar carga de página', async () => {
        try {
            Logger.info('📍 Navegando a coffee-cart.app');
            await driver.get('https://coffee-cart.app/');
            await driver.sleep(2000);

            await screenshotManager.takeScreenshotWithStep(1, 'simple-test-pagina-cargada');

            const products = await driver.findElements(By.css('div.cup-body'));
            Logger.success(`Página cargada. Productos encontrados: ${products.length}`);

            await screenshotManager.takeScreenshotWithStep(2, 'simple-test-productos-encontrados');

            expect(products.length).toBeGreaterThan(0);

        } catch (error) {
            Logger.error(`❌ Error en simple test: ${error.message}`);
            if (screenshotManager) {
                await screenshotManager.takeScreenshot('error-simple-test');
            }
            throw error;
        }
    });
});