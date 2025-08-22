// script.js
async function applicaTemaAdmin() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default');
        const data = await res.json();
        const config = data.config || {};

        document.body.style.backgroundColor = config.bg_color || '#fff';
        document.body.style.color = config.text_color || '#000';
        document.body.style.fontFamily = config.font_family || 'Arial, Helvetica, sans-serif';

        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = config.header_color || '#eee';
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
    } catch (err) {
        console.warn("Tema admin non caricato:", err);
    }
}
