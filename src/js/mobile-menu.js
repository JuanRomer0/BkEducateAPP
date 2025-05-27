class HeaderMobileMenu {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        // Primero limpiar cualquier hamburger existente que no sea del header
        this.cleanExistingHamburgers();
        this.createMobileMenu();
        this.setupEventListeners();
        this.handleResize();
    }

    cleanExistingHamburgers() {
        // Remover cualquier botón hamburguesa que no esté en el header
        const existingHamburgers = document.querySelectorAll('body > *:not(header) .hamburger, body > *:not(header) .hamburger-menu, body > *:not(header) [class*="hamburger"]');
        existingHamburgers.forEach(element => {
            element.style.display = 'none';
            element.remove();
        });

        // Remover iconos hamburguesa de títulos
        const titles = document.querySelectorAll('main h1, main h2, main h3, .admin-panel h1, .admin-panel h2, .admin-panel h3');
        titles.forEach(title => {
            // Remover cualquier icono hamburguesa del contenido del título
            const text = title.textContent;
            if (text.includes('☰') || text.includes('≡')) {
                title.textContent = text.replace(/☰|≡/g, '').trim();
            }
        });
    }

    createMobileMenu() {
        // Verificar si ya existe para evitar duplicados
        if (document.getElementById('headerHamburgerBtn')) {
            return;
        }

        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'header-hamburger-menu';
        hamburgerBtn.id = 'headerHamburgerBtn';
        hamburgerBtn.innerHTML = `
            <span class="header-hamburger-line"></span>
            <span class="header-hamburger-line"></span>
            <span class="header-hamburger-line"></span>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'header-mobile-menu-overlay';
        overlay.id = 'headerMobileOverlay';

        const mobileNav = document.createElement('div');
        mobileNav.className = 'header-mobile-nav';
        mobileNav.id = 'headerMobileNav';

        // Obtener datos del header actual
        const currentMenu = document.querySelector('header .menu');
        const currentLanguageSelector = document.querySelector('header .language-selector select');
        const currentUserInfo = document.querySelector('header .user-info');
        const currentUserDropdown = document.querySelector('header .user-menu .dropdown');

        mobileNav.innerHTML = `
            <div class="header-mobile-nav-header">
                <span class="header-mobile-nav-title">Menu</span>
                <button class="header-mobile-close-btn" id="headerMobileCloseBtn">×</button>
            </div>
            <div class="header-mobile-nav-content">
                <div class="header-mobile-nav-section">
                    <div class="header-mobile-nav-section-title">Navigation</div>
                    ${this.createMobileNavItems(currentMenu)}
                </div>
                
                <div class="header-mobile-divider"></div>
                
                <div class="header-mobile-nav-section">
                    <div class="header-mobile-nav-section-title">Settings</div>
                    <button class="header-mobile-theme-toggle" id="headerMobileThemeToggle">
                        <span>🌙 Dark Theme</span>
                        <span id="headerThemeToggleIcon">🌙</span>
                    </button>
                    <div class="header-mobile-language-selector">
                        ${this.createMobileLanguageSelector(currentLanguageSelector)}
                    </div>
                </div>
                
                <div class="header-mobile-user-section">
                    <div class="header-mobile-user-info">
                        ${currentUserInfo ? currentUserInfo.innerHTML : '<span>User</span>'}
                    </div>
                    <div class="header-mobile-nav-section-title">Account</div>
                    ${this.createMobileUserMenu(currentUserDropdown)}
                </div>
            </div>
        `;

        // Insertar elementos en el DOM
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(hamburgerBtn);
            document.body.appendChild(overlay);
            document.body.appendChild(mobileNav);
        }
    }

    createMobileNavItems(menuElement) {
        if (!menuElement) return '';
        
        const items = menuElement.querySelectorAll('li');
        let mobileItems = '';
        
        items.forEach(item => {
            const link = item.querySelector('a');
            if (link && !item.querySelector('button')) {
                const isActive = link.classList.contains('active') ? 'active' : '';
                mobileItems += `
                    <a href="${link.href}" class="header-mobile-nav-item ${isActive}">
                        ${link.textContent}
                    </a>
                `;
            }
        });
        
        return mobileItems;
    }

    createMobileLanguageSelector(selectElement) {
        if (!selectElement) return '<select><option>English</option></select>';
        
        return `<select id="headerMobileLanguageSelect">${selectElement.innerHTML}</select>`;
    }

    createMobileUserMenu(dropdownElement) {
        if (!dropdownElement) return '';
        
        const links = dropdownElement.querySelectorAll('a');
        let mobileUserItems = '';
        
        links.forEach(link => {
            mobileUserItems += `
                <a href="${link.href}" class="header-mobile-nav-item" style="color: ${link.style.color || 'white'}">
                    ${link.textContent.trim()}
                </a>
            `;
        });
        
        return mobileUserItems;
    }

    setupEventListeners() {
        const hamburgerBtn = document.getElementById('headerHamburgerBtn');
        const closeBtn = document.getElementById('headerMobileCloseBtn');
        const overlay = document.getElementById('headerMobileOverlay');
        const mobileThemeToggle = document.getElementById('headerMobileThemeToggle');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeMenu());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMenu());
        }

        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile language selector
        const mobileLanguageSelect = document.getElementById('headerMobileLanguageSelect');
        const originalLanguageSelect = document.querySelector('header .language-selector select');
        
        if (mobileLanguageSelect && originalLanguageSelect) {
            mobileLanguageSelect.addEventListener('change', (e) => {
                originalLanguageSelect.value = e.target.value;
                originalLanguageSelect.dispatchEvent(new Event('change'));
            });
        }

        // Close menu when clicking on nav items
        const mobileNavItems = document.querySelectorAll('.header-mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 100);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        const hamburgerBtn = document.getElementById('headerHamburgerBtn');
        const mobileNav = document.getElementById('headerMobileNav');
        const overlay = document.getElementById('headerMobileOverlay');

        if (hamburgerBtn) hamburgerBtn.classList.add('active');
        if (mobileNav) mobileNav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('header-mobile-menu-open');
    }

    closeMenu() {
        this.isMenuOpen = false;
        const hamburgerBtn = document.getElementById('headerHamburgerBtn');
        const mobileNav = document.getElementById('headerMobileNav');
        const overlay = document.getElementById('headerMobileOverlay');

        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('header-mobile-menu-open');
    }

    toggleTheme() {
        const originalThemeBtn = document.getElementById('botonColor');
        const themeIcon = document.getElementById('headerThemeToggleIcon');
        
        if (originalThemeBtn) {
            originalThemeBtn.click();
            
            const header = document.getElementById('headerColor');
            if (header && themeIcon) {
                if (header.classList.contains('dark')) {
                    themeIcon.textContent = '☀️';
                } else {
                    themeIcon.textContent = '🌙';
                }
            }
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que todo el DOM esté cargado
    setTimeout(() => {
        const headerMobileMenu = new HeaderMobileMenu();
        window.headerMobileMenu = headerMobileMenu;
    }, 100);
});

// También inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (!window.headerMobileMenu) {
                const headerMobileMenu = new HeaderMobileMenu();
                window.headerMobileMenu = headerMobileMenu;
            }
        }, 100);
    });
} else {
    setTimeout(() => {
        if (!window.headerMobileMenu) {
            const headerMobileMenu = new HeaderMobileMenu();
            window.headerMobileMenu = headerMobileMenu;
        }
    }, 100);
}