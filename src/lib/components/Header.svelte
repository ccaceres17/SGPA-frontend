<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<header class="site-header">
  <div class="top-bar"></div>

  <div class="header-container">
    <div class="brand">
      <div class="logo-slot" aria-label="Logo universitario">
        <img src="/images/logo-cul.webp" alt="CUL university logo" width="400" height="169" />
      </div>

      <div class="brand-text">
        <h1 class="brand-title" aria-label="SGPA">
          <span>S</span>
          <span class="dot"></span>
          <span>G</span>
          <span class="dot"></span>
          <span>P</span>
          <span class="dot"></span>
          <span>A</span>
        </h1>
        <p>Academic Project Management System</p>
      </div>
    </div>

    <nav class="main-nav" aria-label="Main navigation">
      <a href="#inicio" class="active">Home</a>
      <a href="#funcionamiento">How it works</a>
      <a href="#equipo">Team</a>
      <a href="/login" class="login-btn">Log in</a>
    </nav>
  </div>
</header>

<style>
  .top-bar {
    height: 7px;
    background: linear-gradient(90deg, var(--sgpa-blue), var(--sgpa-yellow), var(--sgpa-orange));
  }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--sgpa-border);
  }

  .header-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo-slot {
    width: 70px;
    height: 70px;
    border-radius: 18px;
    overflow: hidden;
    background: #ffffff;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  .logo-slot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--sgpa-blue);
    font-size: 1.8rem;
    line-height: 1;
    font-weight: 950;
    letter-spacing: 0.02em;
  }

  .brand-title .dot {
    width: 7px;
    height: 7px;
    background: var(--sgpa-yellow);
    border-radius: 50%;
  }

  .brand-text p {
    margin: 8px 0 0;
    color: var(--sgpa-text-soft);
    font-size: 0.92rem;
    font-weight: 650;
  }

  .main-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .main-nav a {
    text-decoration: none;
    color: var(--sgpa-text-soft);
    font-size: 0.95rem;
    font-weight: 800;
    position: relative;
    transition: color 0.22s ease, transform 0.22s ease;
    padding: 8px 0;
  }

  .main-nav a:hover,
  .main-nav a.active {
    color: var(--sgpa-blue);
  }

  .main-nav a.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 3px;
    background: var(--sgpa-yellow);
    border-radius: 999px;
  }

  .login-btn,
  .home-btn,
  .nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 10px 18px !important;
    background: linear-gradient(135deg, var(--sgpa-blue), var(--sgpa-blue-mid));
    color: #ffffff !important;
    border-radius: 999px;
    font-weight: 900 !important;
    box-shadow: 0 10px 22px rgba(11, 45, 105, 0.16);
  }

  .login-btn:hover,
  .home-btn:hover,
  .nav-btn:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 720px) {
    .header-container {
      flex-direction: column;
      align-items: flex-start;
    }

    .brand-title {
      font-size: 1.5rem;
    }
  }
</style>