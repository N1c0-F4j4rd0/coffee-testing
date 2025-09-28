const Logger = require('../utils/logger');

class CheckoutActions {
    constructor(checkoutPage) {
        this.checkoutPage = checkoutPage;
    }

    async completeCheckout(userData = {}) {
        Logger.info('💰 Completando proceso de checkout...');
        
        try {
            const fieldsFilled = await this.checkoutPage.fillCheckoutForm(userData);
            
            if (fieldsFilled > 0) {
                const orderSubmitted = await this.checkoutPage.submitOrder();
                
                if (orderSubmitted) {
                    Logger.success('🎉 Checkout completado exitosamente');
                    return true;
                }
            }
            
            Logger.warn('⚠️ Checkout no pudo ser completado completamente');
            return false;
            
        } catch (error) {
            Logger.error(`❌ Error en checkout: ${error.message}`);
            return false;
        }
    }

    async validateOrderConfirmation() {
        try {
            await this.checkoutPage.sleep(3000);
            
            const currentUrl = await this.checkoutPage.getCurrentUrl();
            const pageTitle = await this.checkoutPage.getPageTitle();
            
            Logger.info(`📄 Página actual: ${currentUrl}`);
            Logger.info(`🏷️ Título: ${pageTitle}`);
            
            // Buscar elementos de confirmación
            const confirmationSelectors = [
                'h1', 'h2', 'h3', '[class*="success"]', '[class*="confirmation"]',
                '[class*="thank"]', '[class*="complete"]'
            ];
            
            for (let selector of confirmationSelectors) {
                const elements = await this.checkoutPage.findElements(By.css(selector));
                for (let element of elements) {
                    const text = await element.getText();
                    if (text.toLowerCase().includes('thank') || 
                        text.toLowerCase().includes('success') ||
                        text.toLowerCase().includes('confirmation')) {
                        Logger.success('✅ Confirmación de orden encontrada');
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            Logger.error(`❌ Error validando confirmación: ${error.message}`);
            return false;
        }
    }
}

module.exports = CheckoutActions;