// script.js

// --- Helper: parse JWT payload
function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch (e) {
        console.warn("Impossibile decodificare JWT:", e);
        return null;
    }
}

// --- Helper: HEX to RGB
function hexToRgb(hex) {
    if (!hex) return "255,255,255";
    hex = hex.replace('#','').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const bigint = parseInt(hex,16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}

// --- Calcola colore terzo mix tra due RGB
function mixColors(rgb1, rgb2) {
    const [r1,g1,b1] = rgb1.split(',').map(Number);
    const [r2,g2,b2] = rgb2.split(',').map(Number);
    return `${Math.floor((r1+r2)/2)},${Math.floor((g1+g2)/2)},${Math.floor((b1+b2)/2)}`;
}

// --- Calcola colore del testo a contrasto (bianco/nero)
function getContrastColor(rgb) {
    const [r,g,b] = rgb.split(',').map(Number);
    return (r*0.299 + g*0.587 + b*0.114) > 186 ? '#000000' : '#ffffff';
}

// --- Applica regole CSS da una stringa tipo "prop:val;prop2:val2;"
function applyCssStringToElement(element, cssString, replacements = {}) {
    if (!cssString || !element) return;
    let css = cssString;
    // replacements: object of token->value (e.g. { "var(--bg-color)": "#fff" })
    for (const k in replacements) {
        css = css.replace(new RegExp(k, 'g'), replacements[k]);
    }
    css.split(';').forEach(rule => {
        if (rule.trim()) {
            const [prop, ...rest] = rule.split(':');
            const val = rest.join(':');
            if (prop && val) {
                try {
                    element.style.setProperty(prop.trim(), val.trim());
                } catch(e){
                    // Some properties may not be valid as direct style props - ignore
                }
            }
        }
    });
}

// --- Aggiornamento elementi con tema admin (bottoni, link, tabelle, font)
function applicaTemaAdminExtra(bgColor, bgColorSecondario, font) {
    const rgb1 = hexToRgb(bgColor);
    const rgb2 = hexToRgb(bgColorSecondario);
    const coloreTerzo = `rgb(${mixColors(rgb1, rgb2)})`;
    const contrastText = getContrastColor(mixColors(rgb1, rgb2));

    document.querySelectorAll('button, a, th, td, p, span, h1, h2, h3, h4, h5, h6, label, input, select, textarea')
        .forEach(el => {
            // elementi che vogliamo evidenziare con background
            const tag = el.tagName;
            if(tag === 'BUTTON' || tag === 'A' || tag === 'TH' || tag === 'TD'){
                el.style.backgroundColor = coloreTerzo;
                el.style.color = contrastText;
                // rimuoviamo eventuali bordi troppo evidenti
                el.style.border = 'none';
            }
            // font globale
            el.style.fontFamily = font;
        });
}

// --- Controllo login admin
async function checkLoginAdmin() {
    const token = localStorage.getItem("auth_token");
    let usernameStored = localStorage.getItem("admin_username");

    if (!token) {
        // se non c'è token vai al login
        window.location.href = "login.html";
        return null;
    }

    // prova a decodificare il token per estrarre username
    const payload = parseJwt(token);
    let usernameFromToken = null;
    if (payload) {
        // preferiamo username se presente, altrimenti email
        usernameFromToken = payload.username || payload.email || payload.admin || null;
    }

    // sceglie la priorità:
    // 1) usernameFromToken (dal JWT)
    // 2) usernameStored (dal localStorage)
    const username = usernameFromToken || usernameStored;

    if (!username) {
        // se proprio non riusciamo a risalire all'admin, logout e redirect
        localStorage.removeItem("auth_token");
        localStorage.removeItem("admin_username");
        window.location.href = "login.html";
        return null;
    }

    // salva eventuale valore estratto dal token in localStorage per future chiamate
    if (usernameFromToken && usernameFromToken !== usernameStored) {
        localStorage.setItem("admin_username", usernameFromToken);
    }

    return { token, username };
}

// --- Applica tema admin principale (carica tema dell'admin corrente)
async function applicaTemaAdmin() {
    try {
        const loginData = await checkLoginAdmin();
        if (!loginData) return;

        const { token, username } = loginData;

        // --- Prendi tema admin (prova con username, se non trovato fallback su default)
        let res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=${encodeURIComponent(username)}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        // se il tema specifico non esiste, prova fallback 'default'
        if (res.status === 404) {
            res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/get_theme?admin=default`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
        }

        if (!res.ok) {
            console.warn("Impossibile ottenere il tema (status)", res.status);
            return;
        }

        const config = await res.json();

        const bgColor = config.bg_color || '#ffffff';
        const bgColorSecondario = config.bg_color_secondario || '#eeeeee';
        const textColor = config.text_color || '#000000';
        const font = config.font_family || 'Arial, Helvetica, sans-serif';

        // --- Applica stili base
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
        document.body.style.fontFamily = font;

        // --- Header
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = config.header_color || '#eee';
            header.style.color = getContrastColor(hexToRgb(config.header_color || '#eeeeee'));
            const h1 = header.querySelector('h1, .brand-title');
            if (h1) {
                h1.textContent = config.header_text || 'Amministrazione';
                h1.style.fontFamily = font;
            }
        }

        // --- Logo
        if (config.logo_url) {
            let logo = document.getElementById('admin-logo');
            if (!logo) {
                logo = document.createElement('img');
                logo.id = 'admin-logo';
                logo.style.height = '40px';
                logo.style.position = 'absolute';
                logo.style.top = '10px';
                logo.style.left = '10px';
                logo.style.zIndex = '50';
                document.body.appendChild(logo);
            }
            logo.src = config.logo_url;
        } else {
            const existingLogo = document.getElementById('admin-logo');
            if (existingLogo) existingLogo.remove();
        }

        // --- Prendi effetti scritta e sfondo
        const effettiRes = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_effetti', {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const effettiData = (effettiRes.ok) ? await effettiRes.json() : {};
        const effettiScritta = effettiData.scritta || [];
        const effettiSfondo = effettiData.sfondo || [];

        // --- Applica effetto scritta (se presente)
        if (config.effetto_scritta) {
            const effScritta = effettiScritta.find(e => e.id === config.effetto_scritta);
            if (effScritta && effScritta.css) {
                // alcune regole potrebbero usare var(--text-color)
                const cssWithColors = effScritta.css.replace(/var\(--text-color\)/g, textColor);
                applyCssStringToElement(document.body, cssWithColors);
            }
        }

        // --- Applica effetto sfondo (se presente)
        if (config.effetto_sfondo) {
            const effSfondo = effettiSfondo.find(e => e.id === config.effetto_sfondo);
            if (effSfondo && effSfondo.css) {
                // sostituzioni comuni nelle regole
                const css = effSfondo.css
                    .replace(/var\(--bg-color\)/g, bgColor)
                    .replace(/var\(--bg-color-secondario\)/g, bgColorSecondario)
                    .replace(/var\(--bg-color-rgb\)/g, hexToRgb(bgColor))
                    .replace(/var\(--bg-color-secondario-rgb\)/g, hexToRgb(bgColorSecondario));

                // Applichiamo le regole sulla body
                applyCssStringToElement(document.body, css);

                // Se lo sfondo include un'immagine, gestiamo l'overlay
                const urlMatch = css.match(/url\(([^)]+)\)/);
                if (urlMatch) {
                    let overlay = document.getElementById('admin-theme-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'admin-theme-overlay';
                        overlay.style.position = 'fixed';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.right = '0';
                        overlay.style.bottom = '0';
                        overlay.style.pointerEvents = 'none';
                        overlay.style.zIndex = '0';
                        overlay.style.backgroundRepeat = 'no-repeat';
                        overlay.style.backgroundSize = 'cover';
                        document.body.appendChild(overlay);
                    }
                    // Rendiamo l'overlay semi-trasparente con il bgColor
                    overlay.style.backgroundColor = `rgba(${hexToRgb(bgColor)},0.25)`;
                } else {
                    const existingOverlay = document.getElementById('admin-theme-overlay');
                    if (existingOverlay) existingOverlay.remove();
                }
            }
        } else {
            // rimuovi overlay se non serve
            const existingOverlay = document.getElementById('admin-theme-overlay');
            if (existingOverlay) existingOverlay.remove();
        }

        // --- Aggiorna bottoni, link, tabelle e font globale
        applicaTemaAdminExtra(bgColor, bgColorSecondario, font);

    } catch (err) {
        console.warn("Tema admin non caricato:", err);
        // Non interrompiamo l'esecuzione dell'app se il tema fallisce
    }
}

// --- Chiamare la funzione all'avvio
document.addEventListener('DOMContentLoaded', () => {
    applicaTemaAdmin();
});
