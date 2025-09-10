// --- Logout
function logout() {
    localStorage.removeItem('admin_username');
    window.location.href = 'login.html';
}

// --- Inizializza navbar
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

    // --- Aggiorna link dropdown con username
    const username = localStorage.getItem('admin_username') || 'admin';
    const usernameLabel = document.getElementById('username-label');
    const linkProfilo = document.getElementById('link-profilo');
    const linkTemi = document.getElementById('link-temi');
    const linkLogout = document.getElementById('link-logout');

    if(usernameLabel) usernameLabel.textContent = username;

    if(linkProfilo){
        linkProfilo.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `profilo.html?admin=${encodeURIComponent(username)}`;
        });
    }

    if(linkTemi){
        linkTemi.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `temaadmin.html?admin=${encodeURIComponent(username)}`;
        });
    }

    if(linkLogout){
        linkLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

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
