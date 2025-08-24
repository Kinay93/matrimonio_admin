// script.js

// --- HEX to RGB helper
function hexToRgb(hex) {
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

// --- Funzione per applicare il tema admin
async function applicaTemaAdmin() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const data = await res.json();
        const config = data.config || {};

        const root = document.documentElement;

        // Colori principali
        if (config.bg_color) {
            root.style.setProperty('--bg-color', config.bg_color);
            root.style.setProperty('--bg-color-rgb', hexToRgb(config.bg_color));
            document.body.style.backgroundColor = config.bg_color;
        }

        if (config.bg_color_secondario) {
            root.style.setProperty('--bg-color-secondario', config.bg_color_secondario);
            root.style.setProperty('--bg-color-secondario-rgb', hexToRgb(config.bg_color_secondario));
        }

        if (config.text_color) {
            root.style.setProperty('--text-color', config.text_color);
            document.body.style.color = config.text_color;
        }

        if (config.font_family) {
            root.style.setProperty('--font-family', config.font_family);
            document.body.style.fontFamily = config.font_family;
        }

        // Header
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = config.header_color || '#eee';
            const h1 = header.querySelector('h1');
            if (h1) h1.textContent = config.header_text || 'Amministrazione Matrimonio';
        }

        // Logo
        if (config.logo_url) {
            let logo = document.getElementById('admin-logo');
            if (!logo) {
                logo = document.createElement('img');
                logo.id = 'admin-logo';
                logo.style.height = '40px';
                logo.style.position = 'absolute';
                logo.style.top = '10px';
                logo.style.left = '10px';
                document.body.appendChild(logo);
            }
            logo.src = config.logo_url;
        }

        // Effetti sfondo
        if (config.effetto_sfondo_css) {
            document.body.style.cssText += config.effetto_sfondo_css;
        }

        // Effetti scritta (applicati agli elementi specifici, es: #anteprimaTesto)
        if (config.effetto_scritta_css) {
            const testi = document.querySelectorAll('.titolo, #anteprimaTesto');
            testi.forEach(el => el.style.cssText += config.effetto_scritta_css);
        }

    } catch (err) {
        console.warn("Tema admin non caricato:", err);
    }
}
