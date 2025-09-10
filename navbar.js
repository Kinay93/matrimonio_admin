function initNavbar() {
    const userBtn = document.getElementById('user-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const overlay = document.getElementById('mobile-overlay');

    // --- Dropdown user
    if(userBtn && dropdownMenu){
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', e => {
            if(!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)){
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // --- Hamburger toggle (mobile)
    if(menuToggle && mainNav && overlay){
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.style.display === 'flex';
            if(isOpen){
                mainNav.style.display = 'none';
                overlay.style.display = 'none';
            } else {
                mainNav.style.display = 'flex';
                mainNav.style.flexDirection = window.innerWidth <= 768 ? 'column' : 'row';
                overlay.style.display = 'block';
            }
        });

        overlay.addEventListener('click', () => {
            mainNav.style.display = 'none';
            overlay.style.display = 'none';
        });
    }

    // --- Recupera username admin da localStorage
    const username = localStorage.getItem('admin_username') || 'admin';
    const usernameLabel = document.getElementById('username-label');
    const linkProfilo = document.getElementById('link-profilo');
    const linkTemi = document.getElementById('link-temi');

    if(usernameLabel) usernameLabel.textContent = username;
    if(linkProfilo) linkProfilo.href = `profilo.html?username=${encodeURIComponent(username)}`;
    if(linkTemi) linkTemi.href = `temaadmin.html?username=${encodeURIComponent(username)}`;

    // --- Aggiorna link principali con ?admin=username
    mainNav.querySelectorAll('a[data-page]').forEach(a => {
    const page = a.dataset.page;
    if(page === 'coppie') {
        a.href = `index.html?admin=${encodeURIComponent(username)}`;
    } else if(page === 'home') {
        a.href = `home.html?admin=${encodeURIComponent(username)}`;
    } else if(page === 'marketplace') {
        a.href = `marketplace.html?admin=${encodeURIComponent(username)}`;
    }
});

    // --- Nascondi link della pagina corrente
    const currentPage = window.location.pathname.split('/').pop().replace('.html','');
    mainNav.querySelectorAll('a').forEach(a => {
        if(a.dataset.page === currentPage){
            a.style.display = 'none';
        }
    });

    // --- Aggiorna layout al ridimensionamento
    window.addEventListener('resize', () => {
        if(window.innerWidth > 768){
            mainNav.style.display = 'flex';
            mainNav.style.flexDirection = 'row';
            overlay.style.display = 'none';
        } else if(mainNav.style.display !== 'flex'){
            mainNav.style.display = 'none';
        }
    });
}

// --- Carica navbar dinamicamente
document.addEventListener('DOMContentLoaded', () => {
    const placeholder = document.getElementById('navbar-placeholder');
    if(placeholder){
        fetch('navbar.html')
            .then(res => res.text())
            .then(html => {
                placeholder.innerHTML = html;
                initNavbar();
            })
            .catch(err => console.error('Errore caricamento navbar:', err));
    }
});

// --- Funzione logout globale
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_username');
    window.location.href = 'login.html';
}
