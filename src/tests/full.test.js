const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ScreenshotManager = require('../utils/screenshot');
const Logger = require('../utils/logger');

describe('Coffee Cart - Full Test', () => {
    let driver;
    let screenshotManager;

    beforeAll(async () => {
        Logger.info('🚀 Iniciando Full Test');
        
        // Configuración del driver
        const options = new chrome.Options();
        options.addArguments(
            '--window-size=1920,1080',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-features=VizDisplayCompositor'
        );

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({
            implicit: 20000,
            pageLoad: 30000,
            script: 30000
        });

        screenshotManager = new ScreenshotManager(driver);
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
            Logger.info('🔚 Driver cerrado');
        }
    });

    test('Full Test - Agregar productos al carrito', async () => {
        try {
            // Paso 1: Navegar a la página
            Logger.info('📍 PASO 1: Navegando a coffee-cart.app');
            await driver.get('https://coffee-cart.app/');
            await driver.sleep(3000);
            await screenshotManager.takeScreenshotWithStep(1, 'pagina-cargada');

            // Paso 2: Buscar productos
            Logger.info('📍 PASO 2: Buscando productos');
            const products = await driver.findElements(By.css('div.cup-body'));
            Logger.success(`Productos encontrados: ${products.length}`);
            
            expect(products.length).toBeGreaterThan(0);

            // Paso 3: Agregar productos
            Logger.info('📍 PASO 3: Agregando productos al carrito');
            let addedCount = 0;
            const maxProducts = Math.min(3, products.length);

            for (let i = 0; i < maxProducts; i++) {
                try {
                    await driver.executeScript(
                        'arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', 
                        products[i]
                    );
                    await driver.sleep(500);
                    
                    await driver.executeScript('arguments[0].style.background = "yellow";', products[i]);
                    await driver.executeScript('arguments[0].click();', products[i]);
                    
                    Logger.info(`🛒 Producto ${i + 1} agregado`);
                    addedCount++;
                    await driver.sleep(1000);
                } catch (error) {
                    Logger.warn(`⚠️ Error agregando producto ${i + 1}: ${error.message}`);
                }
            }

            await screenshotManager.takeScreenshotWithStep(2, 'productos-agregados');

            // Paso 4: Verificar carrito
            Logger.info('📍 PASO 4: Verificando carrito');
            await driver.sleep(2000);
            
            const payButton = await driver.findElement(By.css('button.pay'));
            const totalText = await payButton.getText();
            Logger.info(`💰 Total en carrito: ${totalText}`);

            await screenshotManager.takeScreenshotWithStep(3, 'verificacion-final');

            // Assertions
            expect(addedCount).toBeGreaterThan(0);
            expect(totalText).toBeDefined();
            
            Logger.success(`✅ Test completado: ${addedCount} productos agregados`);

        } catch (error) {
            Logger.error(`❌ Error en test: ${error.message}`);
            if (screenshotManager) {
                await screenshotManager.takeScreenshot('error-full-test');
            }
            throw error;
        }
    });
});