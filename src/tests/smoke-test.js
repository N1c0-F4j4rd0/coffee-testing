const CoffeeCartAutomation = require('../index');

async function runSmokeTest() {
    console.log('🧪 INICIANDO PRUEBA SMOKE...\n');
    
    const automation = new CoffeeCartAutomation();
    
    try {
        const initialized = await automation.initialize();
        if (!initialized) {
            console.error('❌ No se pudo inicializar la automatización');
            return;
        }

        // Prueba básica: abrir página y verificar elementos
        await automation.homePage.open();
        
        const products = await automation.homePage.getAllProducts();
        console.log(`✅ Página cargada. Productos encontrados: ${products.length}`);
        
        if (products.length > 0) {
            // Probar agregar un producto
            const result = await automation.homePage.addProductToCart(products[0]);
            if (result) {
                console.log('✅ Producto agregado al carrito exitosamente');
            } else {
                console.log('❌ No se pudo agregar el producto al carrito');
            }
        }
        
        console.log('\n🎉 PRUEBA SMOKE COMPLETADA');
        
    } catch (error) {
        console.error('❌ Error en prueba smoke:', error);
    } finally {
        await automation.close();
    }
}

runSmokeTest().catch(console.error);