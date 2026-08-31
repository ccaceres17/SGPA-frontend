<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import { enhance } from '$app/forms';
  import Header from '$lib/components/Header_L.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let { form } = $props();
  let submitting = $state(false);

  function handleSubmit() {
    submitting = true;

    return async ({ update }) => {
      await update();
      submitting = false;
    };
  }
</script>

<svelte:head>
  <title>{t('forgotPassword.heading')} | SGPA</title>
</svelte:head>

<div class="page-wrapper">
  <Header />

  <main class="notice-page">
    <section class="notice-card">
      <div class="card-top-line"></div>

      {#if form?.success}
        <div role="status" aria-live="polite">
          <h1>{t('forgotPassword.heading')}</h1>
          <p>{t('forgotPassword.successMessage')}</p>
          <a class="back-link" href="/login">{t('forgotPassword.backToLogin')}</a>
        </div>
      {:else}
        <h1>{t('forgotPassword.heading')}</h1>
        <p>{t('forgotPassword.description')}</p>

        {#if form?.errorType}
          <div class="error-msg" role="alert"><Icon name="alert-triangle" size={16} /> {t('forgotPassword.genericErrorMessage')}</div>
        {/if}

        <form method="POST" class="forgot-form" use:enhance={handleSubmit}>
          <div class="input-group">
            <label for="email">{t('forgotPassword.emailLabel')}</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t('forgotPassword.emailPlaceholder')}
              autocomplete="username"
              required
            />
          </div>

          <button type="submit" class="btn-primary" disabled={submitting}>
            {submitting ? t('login.submitting') : t('forgotPassword.submit')}
          </button>
        </form>

        <a class="back-link secondary" href="/login">{t('forgotPassword.backToLogin')}</a>
      {/if}
    </section>
  </main>

  <Footer />
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    background: var(--sgpa-bg);
  }

  .notice-page {
    padding: 30px 24px 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
  }

  .notice-card {
    position: relative;
    overflow: hidden;
    width: min(560px, 100%);
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

  h1 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(1.5rem, 4vw, 1.9rem);
    font-weight: 950;
  }

  p {
    margin: 0.85rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.65;
  }

  .error-msg {
    margin: 1rem 0 0;
    padding: 0.85rem 1rem;
    border-radius: 14px;
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    font-weight: 700;
    line-height: 1.5;
  }

  .forgot-form {
    display: grid;
    gap: 1.1rem;
    margin-top: 1.4rem;
  }

  .input-group {
    display: grid;
    gap: 0.45rem;
  }

  label {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-weight: 850;
  }

  input {
    width: 100%;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    color: var(--sgpa-text);
  }

  .btn-primary {
    width: 100%;
    min-height: 48px;
    border: none;
    padding: 0.95rem 1rem;
    border-radius: 999px;
    font-weight: 950;
    cursor: pointer;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-accent-start);
  }

  .btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .back-link {
    display: inline-flex;
    margin-top: 1.5rem;
    min-height: 46px;
    padding: 0.8rem 1.3rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-weight: 950;
    text-decoration: none;
    color: var(--sgpa-on-accent);
    background: var(--sgpa-accent-start);
  }

  .back-link.secondary {
    color: var(--sgpa-blue);
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
  }

  @media (max-width: 640px) {
    .notice-card {
      padding: 1.35rem;
      border-radius: 22px;
    }
  }
</style>
