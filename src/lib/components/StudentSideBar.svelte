<script>
  import { page } from '$app/stores';
  import { t } from '$lib/stores/locale.svelte.js';

  let isOpen = $state(false);

  const workspaceItems = [
    { nameKey: 'sidebar.mainPanel', href: '/students' },
    { nameKey: 'sidebar.availableProjects', href: '/students/projects' },
    { nameKey: 'sidebar.myProjects', href: '/students/myprojects' }
  ];

  const accountItems = [{ nameKey: 'sidebar.profile', href: '/students/profile' }];

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

  function isActive(href) {
    const currentPath = $page.url.pathname.replace(/\/$/, '');
    const itemPath = href.replace(/\/$/, '');

    return currentPath === itemPath;
  }
</script>

<button
  class="menu-toggle"
  class:open={isOpen}
  type="button"
  aria-label={isOpen ? 'Close side menu' : 'Open side menu'}
  aria-expanded={isOpen}
  onclick={toggleMenu}
>
  <span class="hamburger" aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
  </span>
</button>

{#if isOpen}
  <button class="overlay" type="button" aria-label="Close side menu" onclick={closeMenu}></button>
{/if}

<aside class="sidebar" class:open={isOpen}>
  <div class="sidebar-header">
    <div class="brand-mark">E</div>

    <div>
      <h2>SGPA</h2>
      <p>{t('sidebar.studentModuleLabel')}</p>
    </div>
  </div>

  <nav class="menu" aria-label="Student menu">
    <span class="menu-section-label">{t('sidebar.workspaceSection')}</span>

    {#each workspaceItems as item}
      <a
        href={item.href}
        class:active={isActive(item.href)}
        aria-current={isActive(item.href) ? 'page' : undefined}
        onclick={closeMenu}
      >
        <span class="dot"></span>
        <span>{t(item.nameKey)}</span>
      </a>
    {/each}

    <span class="menu-section-label">{t('sidebar.accountSection')}</span>

    {#each accountItems as item}
      <a
        href={item.href}
        class:active={isActive(item.href)}
        aria-current={isActive(item.href) ? 'page' : undefined}
        onclick={closeMenu}
      >
        <span class="dot"></span>
        <span>{t(item.nameKey)}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .menu-toggle {
    position: fixed;
    left: 18px;
    top: 50%;
    z-index: 1200;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: var(--sgpa-shadow-md);
    transition: left 0.32s ease, background 0.22s ease, transform 0.22s ease;
  }

  .menu-toggle:hover {
    background: var(--sgpa-blue-soft);
    transform: translateY(-50%) scale(1.04);
  }

  .menu-toggle.open {
    left: 316px;
    background: var(--sgpa-blue);
    color: var(--sgpa-on-accent);
  }

  .hamburger {
    display: grid;
    gap: 5px;
  }

  .hamburger span {
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  .menu-toggle.open .hamburger span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .menu-toggle.open .hamburger span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.open .hamburger span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1150;
    width: 300px;
    height: 100vh;
    padding: 1.2rem;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
    transform: translateX(-100%);
    transition: transform 0.32s ease;
    box-shadow: 18px 0 44px rgba(15, 35, 70, 0.14);
    border-right: 1px solid var(--sgpa-border);
    overflow-y: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.4rem;
    padding: 1rem;
    border-radius: 20px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    font-weight: 950;
    font-size: 1.2rem;
  }

  .sidebar-header h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.2rem;
    font-weight: 950;
  }

  .sidebar-header p {
    margin: 0.15rem 0 0;
    color: var(--sgpa-text-soft);
    font-size: 0.86rem;
    font-weight: 650;
  }

  .menu {
    display: grid;
    gap: 0.4rem;
  }

  .menu-section-label {
    margin: 0.9rem 0.3rem 0.2rem;
    color: var(--sgpa-muted);
    font-size: 0.72rem;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .menu-section-label:first-child {
    margin-top: 0.2rem;
  }

  .menu a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 0.95rem;
    border-radius: 16px;
    color: var(--sgpa-text-soft);
    text-decoration: none;
    font-weight: 800;
    border: 1px solid transparent;
    transition:
      transform 0.22s ease,
      background 0.22s ease,
      color 0.22s ease,
      border-color 0.22s ease;
  }

  .menu a:hover {
    transform: translateX(4px);
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border-color: var(--sgpa-border);
  }

  .menu a.active {
    background: var(--sgpa-blue);
    color: var(--sgpa-on-accent);
    box-shadow: inset 5px 0 0 var(--sgpa-yellow);
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: var(--sgpa-border-strong);
    flex: 0 0 auto;
  }

  .menu a.active .dot,
  .menu a:hover .dot {
    background: var(--sgpa-yellow);
    box-shadow: 0 0 0 5px rgba(242, 183, 5, 0.18);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1100;
    border: none;
    background: rgba(15, 35, 70, 0.28);
    backdrop-filter: blur(4px);
    cursor: pointer;
  }

  @media (max-width: 720px) {
    .sidebar {
      width: min(300px, 84vw);
    }

    .menu-toggle.open {
      left: min(316px, calc(84vw + 14px));
    }
  }

  /* Above mobile: the sidebar is a persistent workspace column, not an
     off-canvas overlay — the toggle/overlay are mobile-only affordances. */
  @media (min-width: 721px) {
    .menu-toggle,
    .overlay {
      display: none;
    }

    .sidebar {
      transform: none;
      box-shadow: none;
      top: 88px;
      height: calc(100vh - 88px);
      z-index: 20;
    }
  }
</style>