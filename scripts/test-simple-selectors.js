const { Builder, By, until } = require('selenium-webdriver');

async function testSimple() {
    console.log('🧪 PRUEBA SIMPLE DE SELECTORES\n');
    
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get('https://coffee-cart.app/');
        await driver.wait(until.elementLocated(By.css('body')), 10000);
        
        // Contar elementos básicos
        const divs = await driver.findElements(By.css('div'));
        const buttons = await driver.findElements(By.css('button'));
        const lis = await driver.findElements(By.css('li'));
        const spans = await driver.findElements(By.css('span'));
        
        console.log('📊 ESTADÍSTICAS DE ELEMENTOS:');
        console.log(`   Divs: ${divs.length}`);
        console.log(`   Botones: ${buttons.length}`);
        console.log(`   List items: ${lis.length}`);
        console.log(`   Spans: ${spans.length}`);
        
        // Analizar contenido de botones
        console.log('\n🔘 CONTENIDO DE BOTONES:');
        for (let i = 0; i < Math.min(10, buttons.length); i++) {
            try {
                const text = await buttons[i].getText();
                console.log(`   ${i + 1}. "${text}"`);
            } catch (e) {
                console.log(`   ${i + 1}. [Sin texto]`);
            }
        }
        
        // Buscar elementos que contengan "$" (precios)
        console.log('\n💰 ELEMENTOS CON SIGNOS DE DÓLAR:');
        const allElements = await driver.findElements(By.css('*'));
        let priceElements = 0;
        
        for (let element of allElements) {
            try {
                const text = await element.getText();
                if (text.includes('$')) {
                    priceElements++;
                    if (priceElements <= 5) {
                        console.log(`   ${priceElements}. "${text.trim()}"`);
                    }
                }
            } catch (e) {
                continue;
            }
        }
        console.log(`   Total de elementos con $: ${priceElements}`);
        
        await driver.takeScreenshot().then(image => {
            require('fs').writeFileSync('simple-test.png', image, 'base64');
            console.log('\n📸 Screenshot guardado: simple-test.png');
        });
        
        console.log('\n✅ Prueba simple completada');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await driver.quit();
    }
}

testSimple();