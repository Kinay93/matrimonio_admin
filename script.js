// script.js
async function applicaTemaAdmin() {
    try {
        // 1. Carica il tema admin
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const config = (await res.json()) || {};

        // 2. Applica colori e font principali
        document.body.style.backgroundColor = config.bg_color || '#ffffff';
        document.body.style.color = config.text_color || '#000000';
        document.body.style.fontFamily = config.font_family || 'Arial, Helvetica, sans-serif';

        // 3. Applica header e logo
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = config.header_color || '#f5f5f5';
            const h1 = header.querySelector('h1');
            if (h1) h1.textContent = config.header_text || 'Amministrazione Matrimonio';
        }

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

        // 4. Carica effetti scritta e sfondo
        const effettiRes = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_effetti');
        const effettiData = await effettiRes.json();
        const effettiScritta = effettiData.scritta || [];
        const effettiSfondo = effettiData.sfondo || [];

        // --- Applica effetto scritta
        if (config.effetto_scritta) {
            const effScritta = effettiScritta.find(e => e.id === config.effetto_scritta);
            if (effScritta && effScritta.css) {
                let css = effScritta.css.replace(/var\(--text-color\)/g, config.text_color || '#000000');
                css.split(';').forEach(rule => {
                    if (rule.trim()) {
                        let [prop, ...rest] = rule.split(':');
                        let val = rest.join(':');
                        if (prop && val) document.body.style.setProperty(prop.trim(), val.trim());
                    }
                });
            }
        }

        // --- Applica effetto sfondo
        if (config.effetto_sfondo) {
            const effSfondo = effettiSfondo.find(e => e.id === config.effetto_sfondo);
            if (effSfondo && effSfondo.css) {
                let css = effSfondo.css
                    .replace(/var\(--bg-color\)/g, config.bg_color || '#ffffff')
                    .replace(/var\(--bg-color-secondario\)/g, config.bg_color_secondario || '#eeeeee')
                    .replace(/var\(--bg-color-rgb\)/g, hexToRgb(config.bg_color || '#ffffff'))
                    .replace(/var\(--bg-color-secondario-rgb\)/g, hexToRgb(config.bg_color_secondario || '#eeeeee'));
                
                css.split(';').forEach(rule => {
                    if (rule.trim()) {
                        let [prop, ...rest] = rule.split(':');
                        let val = rest.join(':');
                        if (prop && val) document.body.style.setProperty(prop.trim(), val.trim());
                    }
                });

                // --- Overlay automatico se c'è immagine
                const urlMatch = css.match(/url\(([^)]+)\)/);
                if (urlMatch) {
                    let overlay = document.getElementById('admin-theme-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'admin-theme-overlay';
                        overlay.className = 'overlay';
                        overlay.style.position = 'fixed';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.right = '0';
                        overlay.style.bottom = '0';
                        overlay.style.pointerEvents = 'none';
                        overlay.style.zIndex = '0';
                        overlay.style.backgroundColor = `rgba(${hexToRgb(config.bg_color || '#ffffff')},0.3)`;
                        document.body.appendChild(overlay);
                    } else {
                        overlay.style.backgroundColor = `rgba(${hexToRgb(config.bg_color || '#ffffff')},0.3)`;
                    }
                } else {
                    const existingOverlay = document.getElementById('admin-theme-overlay');
                    if (existingOverlay) existingOverlay.remove();
                }
            }
        }
// script.js
async function applicaTemaAdmin() {
    try {
        // 1. Carica il tema admin
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const config = (await res.json()) || {};

        // 2. Applica colori e font principali
        document.body.style.backgroundColor = config.bg_color || '#ffffff';
        document.body.style.color = config.text_color || '#000000';
        document.body.style.fontFamily = config.font_family || 'Arial, Helvetica, sans-serif';

        // 3. Applica header e logo
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = config.header_color || '#f5f5f5';
            const h1 = header.querySelector('h1');
            if (h1) h1.textContent = config.header_text || 'Amministrazione Matrimonio';
        }

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

        // 4. Carica effetti scritta e sfondo
        const effettiRes = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_effetti');
        const effettiData = await effettiRes.json();
        const effettiScritta = effettiData.scritta || [];
        const effettiSfondo = effettiData.sfondo || [];

        // --- Applica effetto scritta
        if (config.effetto_scritta) {
            const effScritta = effettiScritta.find(e => e.id === config.effetto_scritta);
            if (effScritta && effScritta.css) {
                let css = effScritta.css.replace(/var\(--text-color\)/g, config.text_color || '#000000');
                css.split(';').forEach(rule => {
                    if (rule.trim()) {
                        let [prop, ...rest] = rule.split(':');
                        let val = rest.join(':');
                        if (prop && val) document.body.style.setProperty(prop.trim(), val.trim());
                    }
                });
            }
        }

        // --- Applica effetto sfondo
        if (config.effetto_sfondo) {
            const effSfondo = effettiSfondo.find(e => e.id === config.effetto_sfondo);
            if (effSfondo && effSfondo.css) {
                let css = effSfondo.css
                    .replace(/var\(--bg-color\)/g, config.bg_color || '#ffffff')
                    .replace(/var\(--bg-color-secondario\)/g, config.bg_color_secondario || '#eeeeee')
                    .replace(/var\(--bg-color-rgb\)/g, hexToRgb(config.bg_color || '#ffffff'))
                    .replace(/var\(--bg-color-secondario-rgb\)/g, hexToRgb(config.bg_color_secondario || '#eeeeee'));
                
                css.split(';').forEach(rule => {
                    if (rule.trim()) {
                        let [prop, ...rest] = rule.split(':');
                        let val = rest.join(':');
                        if (prop && val) document.body.style.setProperty(prop.trim(), val.trim());
                    }
                });

                // --- Overlay automatico se c'è immagine
                const urlMatch = css.match(/url\(([^)]+)\)/);
                if (urlMatch) {
                    let overlay = document.getElementById('admin-theme-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'admin-theme-overlay';
                        overlay.className = 'overlay';
                        overlay.style.position = 'fixed';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.right = '0';
                        overlay.style.bottom = '0';
                        overlay.style.pointerEvents = 'none';
                        overlay.style.zIndex = '0';
                        overlay.style.backgroundColor = `rgba(${hexToRgb(config.bg_color || '#ffffff')},0.3)`;
                        document.body.appendChild(overlay);
                    } else {
                        overlay.style.backgroundColor = `rgba(${hexToRgb(config.bg_color || '#ffffff')},0.3)`;
                    }
                } else {
                    const existingOverlay = document.getElementById('admin-theme-overlay');
                    if (existingOverlay) existingOverlay.remove();
                }
            }
        }

    } catch (err) {
        console.warn("Tema admin non caricato:", err);
    }
// --- Aggiornamento elementi con tema admin
function applicaTemaAdminExtra(bgColor, bgColorSecondario, font) {
    const rgb1 = hexToRgb(bgColor);
    const rgb2 = hexToRgb(bgColorSecondario);
    const coloreTerzo = `rgb(${mixColors(rgb1, rgb2)})`;
    const contrastText = getContrastColor(mixColors(rgb1, rgb2));

    document.querySelectorAll('button, a, th, td, p, span, h1, h2, h3, h4, h5, h6, label, input, select, textarea').forEach(el=>{
        // Bottoni, link, celle tabella -> colore terzo di sfondo
        if(el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'TH' || el.tagName === 'TD'){
            el.style.backgroundColor = coloreTerzo;
            el.style.color = contrastText;
        }
        // Tutti gli elementi -> font admin
        el.style.fontFamily = font;
    });
}

// --- Modifica applicaTemaAdmin per chiamare la funzione extra
async function applicaTemaAdmin() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const data = await res.json();
        const config = data || {};

        const bgColor = config.bg_color || '#ffffff';
        const bgColorSecondario = config.bg_color_secondario || '#eeeeee';
        const textColor = config.text_color || '#000000';
        const font = config.font_family || 'Arial, Helvetica, sans-serif';

        // Applicazione colori e font al body e header
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
        document.body.style.fontFamily = font;

        const header = document.querySelector('header');
        if(header){
            header.style.backgroundColor = config.header_color || '#eee';
            const h1 = header.querySelector('h1');
            if(h1) h1.textContent = config.header_text || 'Amministrazione Matrimonio';
            h1.style.fontFamily = font;
        }

        // Logo
        if(config.logo_url){
            let logo = document.getElementById('admin-logo');
            if(!logo){
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

        // Chiamata extra per bottoni, link e font globale
        applicaTemaAdminExtra(bgColor, bgColorSecondario, font);

    } catch(err){
        console.warn("Tema admin non caricato:", err);
    }
}

}

// Helper: HEX to RGB
function hexToRgb(hex) {
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}


    } catch (err) {
        console.warn("Tema admin non caricato:", err);
    }

}

// Helper: HEX to RGB
function hexToRgb(hex) {
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}
