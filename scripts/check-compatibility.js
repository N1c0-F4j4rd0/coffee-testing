const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 VERIFICANDO COMPATIBILIDAD DEL SISTEMA\n');
console.log('='.repeat(50));

try {
    // Verificar Node.js
    console.log('1. ✅ Node.js:');
    const nodeVersion = execSync('node --version').toString().trim();
    console.log(`   Versión: ${nodeVersion}`);

    // Verificar npm
    console.log('\n2. ✅ npm:');
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`   Versión: ${npmVersion}`);

    // Verificar Chrome
    console.log('\n3. 🔍 Google Chrome:');
    let chromeVersion = 'No detectada';
    try {
        if (process.platform === 'win32') {
            const command = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version';
            chromeVersion = execSync(command).toString().split('REG_SZ')[1].trim();
        } else {
            chromeVersion = execSync('google-chrome --version').toString().trim();
        }
        console.log(`   Versión: ${chromeVersion}`);
    } catch (error) {
        console.log('   ❌ Chrome no encontrado');
    }

    // Verificar dependencias
    console.log('\n4. 📦 Dependencias:');
    if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log(`   Proyecto: ${packageJson.name} v${packageJson.version}`);
        
        if (packageJson.dependencies) {
            console.log('   Dependencias instaladas:');
            Object.keys(packageJson.dependencies).forEach(dep => {
                console.log(`     - ${dep}: ${packageJson.dependencies[dep]}`);
            });
        }
    } else {
        console.log('   ❌ package.json no encontrado');
    }

    // Verificar node_modules
    console.log('\n5. 📁 node_modules:');
    if (fs.existsSync('node_modules')) {
        console.log('   ✅ Directorio node_modules existe');
        
        // Verificar chromedriver
        try {
            const chromedriverVersion = execSync('npx chromedriver --version').toString().trim();
            console.log(`   ✅ ChromeDriver: ${chromedriverVersion}`);
        } catch (error) {
            console.log('   ❌ ChromeDriver no funciona correctamente');
        }
    } else {
        console.log('   ❌ node_modules no existe. Ejecuta: npm install');
    }

    console.log('\n' + '='.repeat(50));
    console.log('💡 RECOMENDACIONES:');
    console.log('   - Ejecuta "npm run fix-deps" si hay problemas de versiones');
    console.log('   - Ejecuta "npm run inspect" para analizar la página');
    console.log('   - Ejecuta "npm start" para la automatización completa');

} catch (error) {
    console.error('❌ Error en la verificación:', error.message);
}