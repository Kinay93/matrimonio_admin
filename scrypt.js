// ----------------------------
// CONFIG ADMIN / TEMA DINAMICO
// ----------------------------
let temaCorrente = null; // memorizza il tema admin
let adminCorrente = "default"; // modifica secondo login/admin corrente

async function caricaTema() {
    try {
        const res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/get_tema?admin=${adminCorrente}&t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.tema) {
            temaCorrente = data.tema;

            // Applica dinamicamente al frontend
            if(temaCorrente.bg_color) document.body.style.backgroundColor = temaCorrente.bg_color;
            if(temaCorrente.text_color) document.body.style.color = temaCorrente.text_color;
            if(temaCorrente.header_color) document.querySelector('header').style.backgroundColor = temaCorrente.header_color;
            if(temaCorrente.header_text) document.querySelector('header h1').textContent = temaCorrente.header_text;
            if(temaCorrente.font_family) document.body.style.fontFamily = temaCorrente.font_family;
            if(temaCorrente.logo_url) {
                let imgLogo = document.querySelector('#logo-img');
                if(!imgLogo){
                    imgLogo = document.createElement('img');
                    imgLogo.id = 'logo-img';
                    imgLogo.style.height = '50px';
                    imgLogo.style.marginRight = '10px';
                    document.querySelector('header').prepend(imgLogo);
                }
                imgLogo.src = temaCorrente.logo_url;
            }
        }
    } catch(e) {
        console.error("Errore caricamento tema admin:", e);
    }
}

// ----------------------------
// GESTIONE COPPIE
// ----------------------------
document.getElementById('nuovo-matrimonio').addEventListener('click', () => {
    window.location.href = 'nuovacoppia.html';
});

document.getElementById('settings').addEventListener('click', () => {
    window.location.href = 'temaadmin.html';
});

async function caricaCoppie() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_coppie_admin');
        const data = await res.json();
        const tbody = document.querySelector('#coppie-table tbody');
        tbody.innerHTML = '';

        data.coppie.forEach(coppia => {
            const tr = document.createElement('tr');

            const tdNome = document.createElement('td');
            const link = document.createElement('a');
            link.href = `modificacoppia.html?coppia=${coppia.nome}`;
            link.textContent = coppia.nome;
            tdNome.appendChild(link);

            const tdQR = document.createElement('td');
            const btnGenera = document.createElement('button');
            btnGenera.textContent = 'Genera QR';
            btnGenera.disabled = coppia.qr_generato;
            btnGenera.addEventListener('click', () => generaQRCode(coppia.nome, btnGenera));

            const btnVedi = document.createElement('button');
            btnVedi.textContent = 'Vedi QR';
            btnVedi.disabled = !coppia.qr_generato;
            btnVedi.addEventListener('click', () => vediQRCode(coppia.nome));

            tdQR.appendChild(btnGenera);
            tdQR.appendChild(btnVedi);

            tr.appendChild(tdNome);
            tr.appendChild(tdQR);
            tbody.appendChild(tr);
        });
    } catch(e) {
        console.error("Errore caricamento coppie:", e);
    }
}

// ----------------------------
// GENERAZIONE / VISUALIZZAZIONE QR
// ----------------------------
async function generaQRCode(coppiaNome, btnGenera) {
    try {
        const res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/genera_qrcode?coppia=${encodeURIComponent(coppiaNome)}`);
        const data = await res.json();
        if (data.success) {
            btnGenera.disabled = true;
            vediQRCode(coppiaNome);
            caricaCoppie();
        } else alert('Errore generazione QR');
    } catch(e) {
        alert(e.message);
    }
}

async function vediQRCode(coppiaNome) {
    try {
        const res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/get_qrcode?coppia=${encodeURIComponent(coppiaNome)}`);
        if(!res.ok) throw new Error("QR non trovato");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const modal = document.getElementById('qrcode-modal');
        const img = document.getElementById('qrcode-fullscreen');
        const downloadBtn = document.getElementById('download-qrcode');

        img.src = url;
        modal.style.display = 'flex';

        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${coppiaNome}_qrcode.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            modal.style.display = 'none';
        };
    } catch(e) {
        alert(e.message);
    }
}

document.querySelector('#qrcode-modal .close').addEventListener('click', () => {
    document.getElementById('qrcode-modal').style.display = 'none';
});

// ----------------------------
// TEMA ADMIN SAVE (per temaadmin.html)
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveTema');
    if(saveBtn){
        saveBtn.addEventListener('click', async () => {
            try{
                const formData = new FormData();
                formData.append("bg_color", document.getElementById('bgColor').value);
                formData.append("text_color", document.getElementById('textColor').value);
                formData.append("header_color", document.getElementById('headerColor').value);
                formData.append("header_text", document.getElementById('headerText').value);
                formData.append("font_family", document.getElementById('fontSelect').value);
                const logoFile = document.getElementById('logoFile').files[0];
                if(logoFile) formData.append("logo", logoFile);

                const res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/save_theme?admin=${adminCorrente}`, {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                if(data.success) {
                    alert("Tema salvato!");
                    caricaTema(); // aggiorna subito frontend
                } else alert("Errore salvataggio tema");
            } catch(e) {
                console.error("Errore save tema:", e);
            }
        });
    }
});

// ----------------------------
// ONLOAD
// ----------------------------
window.onload = async () => {
    await caricaTema();
    caricaCoppie();
};
