const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function inspectPage() {
    console.log('🔍 INSPECCIÓN DE ESTRUCTURA DE PÁGINA');
    console.log('🌐 URL: https://coffee-cart.app/');
    console.log('='.repeat(50));
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--window-size=1200,800'))
        .build();
    
    try {
        await driver.get('https://coffee-cart.app/');
        await driver.wait(until.elementLocated(By.css('body')), 15000);
        
        console.log('\n📊 ELEMENTOS ENCONTRADOS:');
        
        const elementTypes = ['div', 'button', 'li', 'article', 'section', 'span', 'h1', 'h2', 'h3', 'h4'];
        
        for (let tag of elementTypes) {
            const elements = await driver.findElements(By.css(tag));
            console.log(`   ${tag.toUpperCase()}: ${elements.length} elementos`);
            
            for (let i = 0; i < Math.min(2, elements.length); i++) {
                try {
                    const text = await elements[i].getText();
                    const classes = await elements[i].getAttribute('class');
                    console.log(`      ${i + 1}. Texto: "${text.substring(0, 40)}..." Clases: ${classes}`);
                } catch (e) {
                    console.log(`      ${i + 1}. [Error obteniendo info]`);
                }
            }
        }
        
        // Analizar botones específicamente
        console.log('\n🔘 ANÁLISIS DE BOTONES:');
        const buttons = await driver.findElements(By.css('button'));
        console.log(`   Total de botones: ${buttons.length}`);
        
        for (let i = 0; i < Math.min(10, buttons.length); i++) {
            try {
                const text = await buttons[i].getText();
                const type = await buttons[i].getAttribute('type');
                const classes = await buttons[i].getAttribute('class');
                console.log(`   ${i + 1}. Texto: "${text}" | Tipo: ${type} | Clases: ${classes}`);
            } catch (e) {
                console.log(`   ${i + 1}. [Error]`);
            }
        }
        
        await driver.takeScreenshot().then(image => {
            require('fs').writeFileSync('page-inspection.png', image, 'base64');
            console.log('\n📸 Screenshot guardado: page-inspection.png');
        });
        
        console.log('\n✅ Análisis completado');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await driver.quit();
    }
}

inspectPage();