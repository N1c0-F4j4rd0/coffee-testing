const { By } = require('selenium-webdriver');
const BasePage = require('./base-page');
const Logger = require('../utils/logger');

class HomePage extends BasePage {
    constructor(driver) {
        super(driver);
        this.url = 'https://coffee-cart.app/';
    }

    // SELECTORES ESPECÍFICOS PARA COFFEE-CART.APP
    get productCards() { 
        return By.css('h4'); // Los productos están en elementos H4
    }
    
    get productName() { 
        return By.css('strong'); // Los nombres están en strong dentro del H4
    }
    
    get productPrice() { 
        return By.xpath('./following-sibling::text()[contains(., "$")]'); // Precio después del H4
    }
    
    get addToCartButton() { 
        // El botón está en el elemento padre del H4
        return By.xpath('./ancestor::div[contains(@class, "coffee")]//button');
    }
    
    get cartIcon() { 
        return By.css('[class*="cart"], .cart');
    }
    
    get cartItems() { 
        return By.css('.cart-item, [class*="item"]');
    }
    
    get cartTotal() { 
        return By.css('.pay'); // El botón de pago muestra el total
    }

    get checkoutButton() {
        return By.css('button.pay');
    }

    get closeModalButton() {
        return By.css('button.close');
    }

    async open() {
        Logger.info('📖 Abriendo página principal');
        await this.navigateTo(this.url);
        
        // Esperar a que cargue la página
        await this.waitForElement(this.productCards, 20000);
        await this.sleep(2000);
        Logger.success('✅ Página cargada correctamente');
    }

    async getAllProducts() {
        Logger.info('🔍 Buscando productos en la página...');
        
        try {
            // Los productos están en elementos H4 que contienen nombres de café
            const productElements = await this.findElements(this.productCards);
            
            if (productElements.length === 0) {
                Logger.error('❌ No se encontraron elementos H4 (productos)');
                return [];
            }

            Logger.success(`✅ Encontrados ${productElements.length} elementos H4 (potenciales productos)`);
            
            // Filtrar solo los H4 que tienen precios (son los productos reales)
            const validProducts = [];
            for (let element of productElements) {
                try {
                    const text = await element.getText();
                    // Los productos reales tienen nombres de café y precios
                    if (text && text.length > 0 && text.includes('$')) {
                        validProducts.push(element);
                    }
                } catch (e) {
                    continue;
                }
            }

            Logger.success(`🎯 Filtrados ${validProducts.length} productos válidos`);
            return validProducts;
            
        } catch (error) {
            Logger.error(`❌ Error buscando productos: ${error.message}`);
            return [];
        }
    }

    async getProductInfo(productElement) {
        try {
            const fullText = await productElement.getText();
            const lines = fullText.split('\n');
            
            // Extraer nombre (primera línea antes del $)
            let name = 'Producto';
            let price = '$0.00';
            
            if (lines.length > 0) {
                name = lines[0].split('$')[0].trim();
            }
            
            // Extraer precio (buscar patrón $número)
            const priceMatch = fullText.match(/\$\d+/);
            if (priceMatch) {
                price = priceMatch[0];
            }
            
            Logger.info(`📦 Producto identificado: ${name} - ${price}`);
            return { name, price, element: productElement };
            
        } catch (error) {
            Logger.error(`❌ Error obteniendo info del producto: ${error.message}`);
            return { name: 'Producto', price: '$0.00', element: productElement };
        }
    }

    async addProductToCart(productElement) {
        try {
            const productInfo = await this.getProductInfo(productElement);
            Logger.info(`🛒 Intentando agregar: ${productInfo.name}`);
            
            // Estrategia mejorada: hacer clic directamente en el elemento H4
            // En esta página, hacer clic en el nombre del producto lo agrega al carrito
            await productElement.click();
            Logger.success(`✅ Clic realizado en: ${productInfo.name}`);
            
            // Esperar a que se actualice el carrito
            await this.sleep(1500);
            
            // Verificar si apareció el modal y cerrarlo si es necesario
            await this.closeModalIfPresent();
            
            return productInfo;
            
        } catch (error) {
            Logger.error(`💥 Error agregando producto: ${error.message}`);
            
            // Intentar alternativa: buscar botón específico
            try {
                Logger.info('🔄 Intentando método alternativo...');
                const parentElement = await productElement.findElement(By.xpath('..'));
                const buttons = await parentElement.findElements(By.css('button'));
                
                if (buttons.length > 0) {
                    await buttons[0].click();
                    Logger.success('✅ Producto agregado (método alternativo)');
                    await this.sleep(1000);
                    await this.closeModalIfPresent();
                    return productInfo;
                }
            } catch (altError) {
                Logger.error('❌ Método alternativo también falló');
            }
            
            return null;
        }
    }

    async closeModalIfPresent() {
        try {
            const closeButtons = await this.findElements(this.closeModalButton);
            if (closeButtons.length > 0) {
                await closeButtons[0].click();
                Logger.info('✅ Modal cerrado');
                await this.sleep(500);
            }
        } catch (error) {
            // Si no hay modal, continuar silenciosamente
        }
    }

    async getCartItemCount() {
        try {
            // Buscar el contador del carrito en el texto del botón o en elementos span
            const cartElements = await this.findElements(this.cartIcon);
            
            for (let element of cartElements) {
                try {
                    const text = await element.getText();
                    // Buscar patrón como "cart (2)" o similar
                    const match = text.match(/\((\d+)\)/);
                    if (match) {
                        const count = parseInt(match[1]);
                        Logger.info(`🛒 Items en carrito detectados: ${count}`);
                        return count;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            // Si no encuentra contador, buscar en el botón de pago
            const payButton = await this.findElements(this.checkoutButton);
            if (payButton.length > 0) {
                const buttonText = await payButton[0].getText();
                if (buttonText.includes('$') && !buttonText.includes('$0.00')) {
                    Logger.info('💰 Carrito tiene items (total no es $0.00)');
                    return 1; // Asumir que tiene al menos 1 item
                }
            }
            
            return 0;
        } catch (error) {
            return 0;
        }
    }

    async getCartTotal() {
        try {
            const payButton = await this.findElements(this.checkoutButton);
            if (payButton.length > 0) {
                const buttonText = await payButton[0].getText();
                const totalMatch = buttonText.match(/\$\d+\.?\d*/);
                if (totalMatch) {
                    return totalMatch[0];
                }
            }
            return 'No disponible';
        } catch (error) {
            return 'Error';
        }
    }

    async getActualCartItems() {
        try {
            // Intentar encontrar elementos de productos en el carrito
            const cartItems = await this.findElements(By.css('.cart-item, [class*="cart"] li, [class*="item"]'));
            return cartItems.length;
        } catch (error) {
            return 0;
        }
    }
}

module.exports = HomePage;