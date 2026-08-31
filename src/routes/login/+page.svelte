<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import { enhance } from '$app/forms';
  import Header from '$lib/components/Header_L.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let { data, form } = $props();

  let selectedRole = $state('students');
  let email = $state('');
  let submitting = $state(false);

  function handleLoginSubmit() {
    submitting = true;

    return async ({ update }) => {
      await update();
      submitting = false;
    };
  }

  $effect(() => {
    if (form?.selectedRole) {
      selectedRole = form.selectedRole;
    }

    if (form?.email !== undefined) {
      email = form.email;
    }
  });
</script>

<svelte:head>
  <title>Login | SGPA</title>
  <meta
    name="description"
    content="Access to the Academic Project Management System - SGPA"
  />
</svelte:head>

<div class="page-wrapper">
  <Header />

  <main class="login-page">
    <section class="login-section">
      <div class="login-card">
        <div class="card-top-line"></div>

        <div class="login-card-header">
          <h2 class="login-card-title">{t('login.cardTitle')}</h2>

          <p class="login-card-subtitle">{t('login.cardSubtitle')}</p>
        </div>

        {#if data?.notice}
          <div class="notice-alert">
            {data.notice}
          </div>
        {/if}

        {#if form?.error}
          <div class="error-msg">
            <Icon name="alert-triangle" size={16} /> {form.error}
          </div>
        {/if}

        <form method="POST" class="login-form" use:enhance={handleLoginSubmit}>
          <div class="input-group-custom">
            <label for="email">{t('login.emailLabel')}</label>
            <input
              id="email"
              name="email"
              bind:value={email}
              class="login-formulary"
              type="email"
              placeholder={t('login.emailPlaceholder')}
              autocomplete="username"
              required
            />
          </div>

          <div class="input-group-custom">
            <div class="password-label-row">
              <label for="password">{t('login.passwordLabel')}</label>
              <a href="/forgot-password" class="forgot-password-link">{t('login.forgotPassword')}</a>
            </div>
            <input
              id="password"
              name="password"
              class="login-formulary"
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              autocomplete="current-password"
              required
            />
          </div>

          <div class="role-selector">
            <p class="role-title">{t('login.roleTitle')}</p>

            <div class="radio-group-horizontal">
              <label class:selected={selectedRole === 'students'} class="radio-option-vertical">
                <input type="radio" bind:group={selectedRole} name="role" value="students" />
                <span class="role-pill">{t('login.roleStudent')}</span>
              </label>

              <label class:selected={selectedRole === 'teacher'} class="radio-option-vertical">
                <input type="radio" bind:group={selectedRole} name="role" value="teacher" />
                <span class="role-pill">{t('login.roleTeacher')}</span>
              </label>

              <label class:selected={selectedRole === 'coordinator'} class="radio-option-vertical">
                <input type="radio" bind:group={selectedRole} name="role" value="coordinator" />
                <span class="role-pill">{t('login.roleCoordinator')}</span>
              </label>
            </div>
          </div>

          <button class="btn-primary" type="submit" disabled={submitting}>
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
      </div>
    </section>
  </main>

  <Footer />
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    background: var(--sgpa-bg);
  }

  .login-page {
    padding-bottom: 70px;
    display: flex;
    align-items: center;
    min-height: 80vh;
  }

  .login-section {
    width: 100%;
    padding: 30px 24px;
  }

  .login-card {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    background: var(--sgpa-surface);
    border-radius: 28px;
    padding: 2rem;
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-lg);
  }

  .card-top-line {
    position: absolute;
    inset: 0 0 auto;
    height: 5px;
    background: var(--sgpa-blue-dark);
  }

  .login-card-title {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.8rem;
    font-weight: 950;
  }

  .login-card-subtitle {
    margin: 0.45rem 0 1.2rem;
    color: var(--sgpa-text-soft);
    line-height: 1.6;
  }

  .notice-alert {
    margin-bottom: 1.2rem;
    padding: 0.95rem 1rem;
    border-radius: 16px;
    background: var(--sgpa-blue-soft);
    border: 1px solid rgba(11, 45, 105, 0.16);
    color: var(--sgpa-blue);
    font-weight: 800;
    line-height: 1.55;
  }

  .error-msg {
    margin-bottom: 1.2rem;
  }

  .login-form {
    display: grid;
    gap: 1.1rem;
  }

  .input-group-custom {
    display: grid;
    gap: 0.45rem;
  }

  label,
  .role-title {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 850;
  }

  .password-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .forgot-password-link {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--sgpa-link, var(--sgpa-blue));
    text-decoration: none;
  }

  .forgot-password-link:hover {
    text-decoration: underline;
  }

  .login-formulary {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    color: var(--sgpa-text);
  }

  .role-selector {
    margin-top: 0.25rem;
  }

  .radio-group-horizontal {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-top: 0.65rem;
  }

  .radio-option-vertical {
    cursor: pointer;
    border-radius: 18px;
    border: 1px solid var(--sgpa-border);
    background: var(--sgpa-surface-soft);
    padding: 1rem;
    text-align: center;
    transition:
      transform 0.22s ease,
      border-color 0.22s ease,
      background 0.22s ease,
      box-shadow 0.22s ease;
  }

  .radio-option-vertical input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .radio-option-vertical:hover {
    transform: translateY(-2px);
    border-color: rgba(11, 45, 105, 0.24);
    background: var(--sgpa-surface);
  }

  .radio-option-vertical.selected {
    border-color: rgba(11, 45, 105, 0.35);
    background: var(--sgpa-blue-soft);
    transform: translateY(-2px);
    box-shadow:
      inset 0 -4px 0 var(--sgpa-yellow),
      var(--sgpa-shadow-sm);
  }

  .role-pill {
    color: var(--sgpa-blue);
    font-weight: 950;
  }

  .btn-primary {
    width: 100%;
    min-height: 48px;
    border: none;
    padding: 0.95rem 1rem;
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  @media (max-width: 900px) {
    .radio-group-horizontal {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .login-section {
      padding-inline: 16px;
    }

    .login-card {
      padding: 1.35rem;
      border-radius: 22px;
    }
  }
</style>