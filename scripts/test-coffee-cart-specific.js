const { Builder, By, until } = require('selenium-webdriver');

async function testCoffeeCartSpecific() {
    console.log('🧪 PRUEBA ESPECÍFICA PARA COFFEE-CART.APP\n');
    
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get('https://coffee-cart.app/');
        await driver.wait(until.elementLocated(By.css('body')), 10000);
        
        console.log('🔍 ANALIZANDO ESTRUCTURA ESPECÍFICA:\n');
        
        // 1. Encontrar todos los H4 (productos)
        const h4Elements = await driver.findElements(By.css('h4'));
        console.log(`📦 Elementos H4 encontrados: ${h4Elements.length}`);
        
        for (let i = 0; i < Math.min(5, h4Elements.length); i++) {
            const text = await h4Elements[i].getText();
            console.log(`   H4 ${i + 1}: "${text}"`);
        }
        
        // 2. Probar hacer clic en el primer H4
        if (h4Elements.length > 0) {
            console.log('\n🖱️ Probando clic en primer producto...');
            await h4Elements[0].click();
            await driver.sleep(2000);
            
            // 3. Verificar si cambió el carrito
            const payButton = await driver.findElement(By.css('button.pay'));
            const buttonText = await payButton.getText();
            console.log(`   Texto del botón de pago: "${buttonText}"`);
            
            // 4. Verificar si apareció modal
            const modals = await driver.findElements(By.css('.modal'));
            console.log(`   Modales visibles: ${modals.length}`);
            
            if (modals.length > 0) {
                console.log('   ✅ Modal detectado - cerrando...');
                const closeButtons = await driver.findElements(By.css('button.close'));
                if (closeButtons.length > 0) {
                    await closeButtons[0].click();
                    await driver.sleep(1000);
                }
            }
        }
        
        await driver.takeScreenshot().then(image => {
            require('fs').writeFileSync('coffee-cart-test.png', image, 'base64');
            console.log('\n📸 Screenshot guardado: coffee-cart-test.png');
        });
        
        console.log('\n✅ Prueba específica completada');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await driver.quit();
    }
}

testCoffeeCartSpecific();