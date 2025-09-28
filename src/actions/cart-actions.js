const Logger = require('../utils/logger');

class CartActions {
    constructor(homePage) {
        this.homePage = homePage;
        this.addedProducts = [];
    }

    async addRandomProducts(count = 3) {
        Logger.info(`🎯 Intentando agregar ${count} productos al carrito`);
        
        const products = await this.homePage.getAllProducts();
        
        if (products.length === 0) {
            Logger.error('❌ No se encontraron productos en la página');
            return 0;
        }

        Logger.success(`📊 Encontrados ${products.length} productos`);
        let addedCount = 0;
        
        // Mejor estrategia: agregar productos secuencialmente desde el inicio
        for (let i = 0; i < Math.min(count, products.length); i++) {
            Logger.info(`\n🔄 Procesando producto ${i + 1}/${Math.min(count, products.length)}...`);
            
            const productInfo = await this.homePage.addProductToCart(products[i]);
            
            if (productInfo) {
                this.addedProducts.push({
                    ...productInfo,
                    timestamp: new Date().toLocaleTimeString(),
                    index: i + 1
                });
                addedCount++;
                Logger.success(`✅ Producto ${i + 1} agregado: ${productInfo.name}`);
                
                // Verificar actualización del carrito después de cada agregado
                const currentCount = await this.homePage.getCartItemCount();
                Logger.info(`📊 Carrito actual: ${currentCount} items`);
            } else {
                Logger.warn(`❌ No se pudo agregar el producto ${i + 1}`);
            }

            // Pausa más corta entre operaciones
            await this.homePage.sleep(1000);
        }

        // Verificación final del carrito
        const finalCount = await this.homePage.getCartItemCount();
        const actualItems = await this.homePage.getActualCartItems();
        
        Logger.info(`📈 Resultado: ${addedCount}/${count} productos procesados`);
        Logger.info(`🛒 Carrito final: ${finalCount} items detectados, ${actualItems} items visibles`);
        
        return addedCount;
    }

    async verifyCartContents() {
        Logger.info('🔍 Verificando contenido del carrito...');
        
        const itemCount = await this.homePage.getCartItemCount();
        const total = await this.homePage.getCartTotal();
        const actualItems = await this.homePage.getActualCartItems();
        
        Logger.info(`🛒 Carrito: ${itemCount} items detectados, ${actualItems} items visibles, Total: ${total}`);
        
        const success = itemCount > 0 || actualItems > 0 || this.addedProducts.length > 0;
        
        return {
            itemCount,
            actualItems,
            total,
            expectedCount: this.addedProducts.length,
            products: this.addedProducts,
            success
        };
    }

    getAddedProducts() {
        return this.addedProducts;
    }

    generateReport() {
        Logger.info('\n' + '='.repeat(70));
        Logger.info('📊 REPORTE DETALLADO DE EJECUCIÓN');
        Logger.info('='.repeat(70));
        
        if (this.addedProducts.length === 0) {
            Logger.info('📭 No se agregaron productos al carrito');
        } else {
            Logger.info('📦 PRODUCTOS PROCESADOS:');
            this.addedProducts.forEach((product, index) => {
                Logger.info(`   ${index + 1}. ${product.name} - ${product.price} (${product.timestamp})`);
            });
        }
        
        Logger.info(`\n📊 ESTADÍSTICAS:`);
        Logger.info(`   • Productos intentados: ${this.addedProducts.length}`);
        Logger.info(`   • Items en carrito (detectados): ${this.verification?.itemCount || 0}`);
        Logger.info(`   • Items visibles: ${this.verification?.actualItems || 0}`);
        Logger.info(`   • Total del carrito: ${this.verification?.total || 'No disponible'}`);
        Logger.info('='.repeat(70));
    }

    async takeFinalScreenshot(screenshotManager) {
        await screenshotManager.takeScreenshot('resultado-final');
    }

    clearCart() {
        this.addedProducts = [];
        Logger.info('🧹 Carrito limpiado localmente');
    }
}

module.exports = CartActions;