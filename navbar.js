// --- Inizializzazione navbar
function initNavbar() {
    const userBtn = document.getElementById('user-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // Dropdown user
    if(userBtn && dropdownMenu){
        userBtn.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', e => {
            if(!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)){
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Hamburger toggle
    if(menuToggle && mainNav){
        menuToggle.addEventListener('click', () => {
            mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
            mainNav.style.flexDirection = 'column';
        });
    }

    // Aggiorna link Profilo e Temi con username
    const username = localStorage.getItem('admin_username') || 'admin';
    const usernameLabel = document.getElementById('username-label');
    const linkProfilo = document.getElementById('link-profilo');
    const linkTemi = document.getElementById('link-temi');

    if(usernameLabel) usernameLabel.textContent = username;
    if(linkProfilo) linkProfilo.href = `profilo.html?username=${encodeURIComponent(username)}`;
    if(linkTemi) linkTemi.href = `temaadmin.html?username=${encodeURIComponent(username)}`;

    // Nascondi link della pagina corrente
    const currentPage = window.location.pathname.split('/').pop().replace('.html','');
    mainNav.querySelectorAll('a').forEach(a => {
        if(a.dataset.page === currentPage){
            a.style.display = 'none';
        }
    });
}

// --- Dopo aver caricato navbar
document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('navbar-placeholder');
    if(placeholder){
        fetch('navbar.html')
            .then(res => res.text())
            .then(html => {
                placeholder.innerHTML = html;
                initNavbar(); // <--- inizializza eventi solo dopo che il markup è inserito
            })
            .catch(err => console.error('Errore caricamento navbar:', err));
    }
});
