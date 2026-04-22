// ----- THEME & RTL MANAGER -----
const ThemeManager = {
  getDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === '1';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  setDarkMode(on) {
    document.body.classList.toggle('dark', on);
    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) darkToggle.innerHTML = on ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('darkMode', on ? '1' : '0');
    // Dispatch event for other components (like Drawer)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { dark: on } }));
  },

  getRtlMode() {
    return localStorage.getItem('rtlMode') === '1';
  },

  setRtlMode(on) {
    document.documentElement.dir = on ? 'rtl' : 'ltr';
    localStorage.setItem('rtlMode', on ? '1' : '0');
    window.dispatchEvent(new CustomEvent('rtlChanged', { detail: { rtl: on } }));
  },

  init() {
    this.setDarkMode(this.getDarkMode());
    this.setRtlMode(this.getRtlMode());
  }
};

// Auto-init on script load if body exists, otherwise wait
if (document.body) ThemeManager.init();
else window.addEventListener('DOMContentLoaded', () => ThemeManager.init());

const darkToggleBtn = document.getElementById('darkToggle');
if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => ThemeManager.setDarkMode(!document.body.classList.contains('dark')));
}

const rtlToggleBtn = document.getElementById('rtlToggle');
if (rtlToggleBtn) {
  rtlToggleBtn.addEventListener('click', () => ThemeManager.setRtlMode(document.documentElement.dir !== 'rtl'));
}

      // ----- USER DROPDOWN TOGGLE -----
      const userToggleBtn = document.getElementById('userToggle');
      const userDropMenu = document.getElementById('userDropMenu');
      if (userToggleBtn && userDropMenu) {
        userToggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = userDropMenu.classList.contains('open');
          userDropMenu.classList.toggle('open', !isOpen);
          userToggleBtn.setAttribute('aria-expanded', String(!isOpen));
        });
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!userToggleBtn.contains(e.target) && !userDropMenu.contains(e.target)) {
            userDropMenu.classList.remove('open');
            userToggleBtn.setAttribute('aria-expanded', 'false');
          }
        });
        // Close on Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            userDropMenu.classList.remove('open');
            userToggleBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // ----- SCROLL EFFECTS -----
      const navWrapper = document.querySelector('.nav-wrapper');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navWrapper?.classList.add('scrolled');
        } else {
          navWrapper?.classList.remove('scrolled');
        }
      }, { passive: true });

      // ----- DRAWER LOGIC (open/close) -----
      const drawer = document.getElementById('drawer');
      const overlay = document.getElementById('drawerOverlay');
      function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
      const openBtn = document.getElementById('openDrawer');
      if (openBtn) openBtn.addEventListener('click', openDrawer);
      const closeBtn = document.getElementById('closeDrawer');
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (overlay) overlay.addEventListener('click', closeDrawer);
      document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeDrawer));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

      // ----- ACTIVE LINK HANDLER (Desktop + Drawer) -----
      function setActiveLink(clickedEl, containerSelector) {
        const parentGroup = clickedEl.closest(containerSelector);
        if (parentGroup) {
          const allLinks = parentGroup.querySelectorAll('a, .ddrop-btn');
          allLinks.forEach(link => link.classList.remove('active'));
        }
        clickedEl.classList.add('active');
      }

      // Desktop nav logic for buttons
      const desktopNav = document.querySelector('.nav-links');
      if (desktopNav) {
        // Only prevent default on dropdown buttons, don't block actual 'a' links
        const ddropBtns = desktopNav.querySelectorAll('.ddrop-btn');
        ddropBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
          });
        });
      }

      // Drawer navigation click handling (close drawer on real links)
      const drawerNavContainer = document.querySelector('.drawer-nav');
      if (drawerNavContainer) {
        const drawerLinks = drawerNavContainer.querySelectorAll('a');
        drawerLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            // Only prevent default if it's a structural link (like href="#")
            if (link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:void(0)') {
                e.preventDefault();
            }
            // Let the browser handle standard redirect links naturally
          });
        });
      }

      // Automatically set active link based on current page URL
      window.addEventListener('DOMContentLoaded', () => {
          const path = decodeURIComponent(window.location.pathname);
          let currentPath = path.split('/').pop() || 'index.html';
          
          // Normalize paths
          if (currentPath === '') currentPath = 'index.html';

          // Desktop active state
          if (desktopNav) {
              const allDesktopLinks = desktopNav.querySelectorAll('a');
              allDesktopLinks.forEach(link => {
                  const href = decodeURIComponent(link.getAttribute('href') || '');
                  if (href.includes(currentPath)) {
                      link.classList.add('active');
                      // If it's inside a dropdown, also highlight parent ddrop-btn
                      const parentDdrop = link.closest('.ddrop');
                      if (parentDdrop) {
                          const btn = parentDdrop.querySelector('.ddrop-btn');
                          if (btn) btn.classList.add('active');
                      }
                  }
              });
          }

          // Drawer active state
          if (drawerNavContainer) {
              const allDrawerLinks = drawerNavContainer.querySelectorAll('a');
              allDrawerLinks.forEach(link => {
                  const href = decodeURIComponent(link.getAttribute('href') || '');
                  if (href.includes(currentPath)) {
                      link.classList.add('active');
                      link.classList.add('active-drawer');
                  }
              });
          }
      });

      // ----- DRAWER ENHANCEMENT: add dark mode toggle, RTL toggle, user profile submenu (unchanged)-----
      (function enhanceDrawerControls() {
        if (document.getElementById('drawerEnhancedMarker')) return;
        const drawerNav = document.querySelector('.drawer-nav');
        if (!drawerNav) return;
        const enhancedDiv = document.createElement('div');
        enhancedDiv.className = 'drawer-enhanced-controls';
        enhancedDiv.id = 'drawerEnhancedMarker';

        // Dark mode row
        const darkRow = document.createElement('div');
        darkRow.className = 'drawer-control-item';
        const isDarkNow = document.body.classList.contains('dark');
        darkRow.innerHTML = `<span><i class="${isDarkNow ? 'fas fa-sun' : 'fas fa-moon'}"></i> Dark Mode</span><span class="toggle-badge" id="drawerDarkBadge">${isDarkNow ? 'On' : 'Off'}</span>`;

        // RTL row
        const rtlRow = document.createElement('div');
        rtlRow.className = 'drawer-control-item';
        const isRtlNow = document.documentElement.dir === 'rtl';
        rtlRow.innerHTML = `<span><i class="fas fa-right-left"></i> RTL Mode</span><span class="toggle-badge" id="drawerRtlBadge">${isRtlNow ? 'RTL' : 'LTR'}</span>`;

        // User profile collapsible
        const userProfileWrapper = document.createElement('div');
        userProfileWrapper.className = 'drawer-user-profile';
        const profileTrigger = document.createElement('div');
        profileTrigger.className = 'drawer-control-item profile-trigger';
        profileTrigger.style.cursor = 'pointer';
        profileTrigger.innerHTML = `<span><i class="fas fa-user-circle"></i> My Profile</span><i class="fas fa-chevron-down" style="font-size:0.7rem; color:var(--gold);"></i>`;
        const subMenu = document.createElement('div');
        subMenu.className = 'profile-submenu';
        subMenu.innerHTML = `
          <a href="./login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
          <a href="./register.html"><i class="fas fa-user-plus"></i> Register</a>
        `;
        userProfileWrapper.appendChild(profileTrigger);
        userProfileWrapper.appendChild(subMenu);

        enhancedDiv.appendChild(darkRow);
        enhancedDiv.appendChild(rtlRow);
        enhancedDiv.appendChild(userProfileWrapper);

        const existingDivider = drawerNav.querySelector('.drawer-divider');
        if (existingDivider) {
          drawerNav.insertBefore(enhancedDiv, existingDivider);
        } else {
          drawerNav.appendChild(enhancedDiv);
        }

        // badge update helpers
        const drawerDarkBadge = document.getElementById('drawerDarkBadge');
        const drawerRtlBadge = document.getElementById('drawerRtlBadge');
        const updateDarkBadge = () => {
          const darkActive = document.body.classList.contains('dark');
          if (drawerDarkBadge) drawerDarkBadge.textContent = darkActive ? 'On' : 'Off';
          const iconSpan = darkRow.querySelector('span i');
          if (iconSpan) iconSpan.className = darkActive ? 'fas fa-sun' : 'fas fa-moon';
        };
        const updateRtlBadge = () => {
          const rtlActiveFlag = document.documentElement.dir === 'rtl';
          if (drawerRtlBadge) drawerRtlBadge.textContent = rtlActiveFlag ? 'RTL' : 'LTR';
        };
        updateDarkBadge();
        updateRtlBadge();

        // theme changed listeners
        window.addEventListener('themeChanged', updateDarkBadge);
        window.addEventListener('rtlChanged', updateRtlBadge);

        // attach toggle events
        darkRow.addEventListener('click', (e) => {
          e.stopPropagation();
          ThemeManager.setDarkMode(!document.body.classList.contains('dark'));
        });
        rtlRow.addEventListener('click', (e) => {
          e.stopPropagation();
          ThemeManager.setRtlMode(document.documentElement.dir !== 'rtl');
        });

        // profile dropdown toggle
        const chevronIcon = profileTrigger.querySelector('.fa-chevron-down');
        profileTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          subMenu.classList.toggle('open');
          if (chevronIcon) chevronIcon.style.transform = subMenu.classList.contains('open') ? 'rotate(180deg)' : '';
        });

        if (chevronIcon) chevronIcon.style.transition = 'transform 0.2s';
      })();

      // Additional: drawer footer buttons (Login/Register) demo alerts
      const drawerLoginBtn = document.getElementById('drawerLoginBtn');
      const drawerRegisterBtn = document.getElementById('drawerRegisterBtn');
      if (drawerLoginBtn) drawerLoginBtn.addEventListener('click', () => alert('🔐 Login (demo)'));
      if (drawerRegisterBtn) drawerRegisterBtn.addEventListener('click', () => alert('📝 Register (demo)'));

 // Preloader Logic
 window.addEventListener('load', () => {
     const preloader = document.getElementById('preloader');
     if (preloader) {
         preloader.classList.add('fade-out');
     }
 });