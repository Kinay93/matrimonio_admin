// script.js

// HEX to RGB helper
function hexToRgb(hex) {
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

// Applica tema admin
async function applicaTemaAdmin() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const data = await res.json();
        if(!data.success) return;

        const config = data;

        // Body
        document.body.style.backgroundColor = config.bg_color || '#ffffff';
        document.body.style.color = config.text_color || '#000000';
        document.body.style.fontFamily = config.font_family || 'Arial, Helvetica, sans-serif';

        // Header
        const header = document.querySelector('header');
        if(header){
            header.style.backgroundColor = config.bg_color_secondario || '#eeeeee';
            const h1 = header.querySelector('h1');
            if(h1) h1.textContent = config.header_text || 'Amministrazione Matrimonio';
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

        // Overlay per eventuale URL nello sfondo
        if(config.effetto_sfondo && config.effetto_sfondo.includes("url(")){
            let overlay = document.querySelector('#tema-overlay');
            if(!overlay){
                overlay = document.createElement('div');
                overlay.id = 'tema-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = 0;
                overlay.style.left = 0;
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.pointerEvents = 'none';
                overlay.style.zIndex = 0;
                document.body.appendChild(overlay);
            }
            overlay.style.backgroundColor = `rgba(${hexToRgb(config.bg_color)},0.3)`; 
        } else {
            const overlay = document.querySelector('#tema-overlay');
            if(overlay) overlay.remove();
        }

    } catch(err){
        console.warn("Tema admin non caricato:", err);
    }
}
