// Funzione per applicare il tema admin
async function applicaTemaAdmin() {
    try {
        const res = await fetch('https://matrimonioapp.ew.r.appspot.com/admin/get_latest_admin_theme');
        const data = await res.json();

        // Colori e font
        document.body.style.backgroundColor = data.bg_color || '#fff';
        document.body.style.color = data.text_color || '#000';
        const header = document.querySelector('header');
        if (header) header.style.backgroundColor = data.header_color || '#eee';
        const h1 = header ? header.querySelector('h1') : null;
        if (h1) h1.textContent = data.header_text || 'Amministrazione Matrimonio';
        document.body.style.fontFamily = data.font_family || 'Arial, Helvetica, sans-serif';

        // Logo
        if (data.logo) {
            let existingLogo = document.getElementById('admin-logo');
            if (!existingLogo) {
                existingLogo = document.createElement('img');
                existingLogo.id = 'admin-logo';
                existingLogo.style.height = '40px';
                existingLogo.style.position = 'absolute';
                existingLogo.style.top = '10px';
                existingLogo.style.left = '10px';
                document.body.appendChild(existingLogo);
            }
            existingLogo.src = data.logo;
        }
    } catch (err) {
        console.warn("Tema admin non caricato:", err);
    }
}

// Gestione salvataggio tema admin
const saveTemaBtn = document.getElementById('saveTema');
if (saveTemaBtn) {
    saveTemaBtn.addEventListener('click', async () => {
        const timestamp = Date.now();
        const formData = new FormData();
        formData.append("filename", `admin_${timestamp}.json`);
        formData.append("bg_color", document.getElementById('bgColor').value);
        formData.append("text_color", document.getElementById('textColor').value);
        formData.append("header_color", document.getElementById('headerColor').value);
        formData.append("header_text", document.getElementById('headerText').value);
        formData.append("font_family", document.getElementById('fontSelect').value);
        const logoFile = document.getElementById('logoFile').files[0];
        if (logoFile) formData.append("logo", logoFile);

        const res = await fetch(`https://matrimonioapp.ew.r.appspot.com/admin/save_theme`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            alert("Tema salvato!");
        } else {
            alert("Errore nel salvataggio del tema");
        }
    });
}
