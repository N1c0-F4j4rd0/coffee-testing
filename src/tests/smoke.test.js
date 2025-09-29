const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ScreenshotManager = require('../utils/screenshot');
const Logger = require('../utils/logger');

describe('Coffee Cart - Smoke Test', () => {
    let driver;
    let screenshotManager;

    beforeAll(async () => {
        Logger.info('🚀 Iniciando Smoke Test');
        
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

        screenshotManager = new ScreenshotManager(driver);
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test('Smoke Test - Agregar un producto', async () => {
        try {
            Logger.info('📍 Navegando a coffee-cart.app');
            await driver.get('https://coffee-cart.app/');
            await driver.sleep(2000);

            await screenshotManager.takeScreenshotWithStep(1, 'smoke-test-inicio');

            const product = await driver.findElement(By.css('div.cup-body'));
            await driver.executeScript('arguments[0].style.background = "yellow";', product);
            await driver.executeScript('arguments[0].click();', product);
            
            Logger.success('Producto agregado al carrito (smoke test)');
            await driver.sleep(1000);

            await screenshotManager.takeScreenshotWithStep(2, 'smoke-test-producto-agregado');

            expect(product).toBeDefined();

        } catch (error) {
            Logger.error(`❌ Error en smoke test: ${error.message}`);
            if (screenshotManager) {
                await screenshotManager.takeScreenshot('error-smoke-test');
            }
            throw error;
        }
    });
});