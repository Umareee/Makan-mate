/**
 * Component Loader Utility
 * Loads reusable HTML components into pages
 */

/**
 * Load a component from a file and inject it into a container
 * @param {string} componentPath - Path to the component HTML file
 * @param {string} containerId - ID of the container element
 * @returns {Promise<boolean>} - Success status
 */
async function loadComponent(componentPath, containerId) {
  try {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return false;
    }

    const response = await fetch(componentPath);

    if (!response.ok) {
      console.error(`Failed to load component: ${componentPath} (${response.status})`);
      return false;
    }

    const html = await response.text();
    container.innerHTML = html;

    return true;
  } catch (error) {
    console.error(`Error loading component from ${componentPath}:`, error);
    return false;
  }
}

/**
 * Load multiple components in parallel
 * @param {Array<{path: string, containerId: string}>} components
 * @returns {Promise<boolean>} - True if all components loaded successfully
 */
async function loadComponents(components) {
  try {
    const promises = components.map(({ path, containerId }) =>
      loadComponent(path, containerId)
    );

    const results = await Promise.all(promises);
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error loading components:', error);
    return false;
  }
}

/**
 * Get the current page name from the URL
 * @returns {string} - Current page name (e.g., 'index', 'about', 'menu')
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  return page;
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');

    // Remove active classes
    link.classList.remove('bg-makan-orange', 'text-white', 'px-4', 'py-2', 'rounded-full');
    link.classList.add('text-custom-text', 'font-medium');

    // Add active classes to current page
    if (linkPage === currentPage) {
      link.classList.remove('text-custom-text', 'font-medium');
      link.classList.add('bg-makan-orange', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-makan-orange-hover');
    }
  });
}

/**
 * Initialize navbar dropdown menu with hover delay
 */
function initNavbarDropdown() {
  const menuTrigger = document.getElementById('menu-trigger');
  const menuPanel = document.querySelector('.group .absolute');

  if (menuTrigger && menuPanel) {
    let menuTimeout;

    menuTrigger.addEventListener('mouseenter', () => {
      clearTimeout(menuTimeout);
      menuPanel.classList.remove('hidden');
    });

    menuTrigger.addEventListener('mouseleave', () => {
      menuTimeout = setTimeout(() => {
        menuPanel.classList.add('hidden');
      }, 1000); // 1 second delay
    });

    menuPanel.addEventListener('mouseenter', () => {
      clearTimeout(menuTimeout);
      menuPanel.classList.remove('hidden');
    });

    menuPanel.addEventListener('mouseleave', () => {
      menuTimeout = setTimeout(() => {
        menuPanel.classList.add('hidden');
      }, 200);
    });
  }
}

/**
 * Function to navigate to menu page with selected category
 */
function goToMenuCategory(categoryId) {
  console.log('Storing category for navigation:', categoryId);
  localStorage.setItem('selectedMenuCategory', categoryId);
  window.location.href = 'menu.html';
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-menu');

  if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });

    // Close mobile menu
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

/**
 * Initialize and load the navbar component
 */
async function initNavbar() {
  const success = await loadComponent('/components/navbar.html', 'navbar-container');
  if (success) {
    // Set active link after navbar is loaded
    setActiveNavLink();
    // Initialize dropdown menu with delay
    initNavbarDropdown();
    // Make goToMenuCategory available globally
    window.goToMenuCategory = goToMenuCategory;
  }
}

/**
 * Initialize and load the mobile menu component
 */
async function initMobileMenuComponent() {
  const success = await loadComponent('/components/mobile-menu.html', 'mobile-menu-container');
  if (success) {
    // Initialize mobile menu functionality after it's loaded
    initMobileMenu();
  }
}

/**
 * Initialize and load the footer component
 */
function initFooter() {
  loadComponent('/components/footer.html', 'footer-container');
}

/**
 * Initialize and load the WhatsApp float component
 */
function initWhatsAppFloat() {
  loadComponent('/components/whatsapp-float.html', 'whatsapp-container');
}

/**
 * Initialize all components
 */
function initComponents() {
  initNavbar();
  initMobileMenuComponent();
  initWhatsAppFloat();
  initFooter();
}

// Auto-load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}
