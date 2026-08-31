<script>
  import Icon from '$lib/components/icons/Icon.svelte';
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let form;

  $: savedValues = form?.values || {};
  $: successMessage = form?.success
    ? form.emailDelivered
      ? t('pages.createUsers.emailSentNote')
      : t('pages.createUsers.emailNotSentNote')
    : '';

  function getValue(name) {
    return savedValues[name] ?? '';
  }
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div class="header-copy">
        <span class="eyebrow">{t('sidebar.coordinatorModuleLabel')}</span>
        <h1>{t('pages.createUsers.heading')}</h1>
        <p>{t('pages.createUsers.description')}</p>
      </div>

      <div class="header-badge">
        {t('pages.createUsers.userManagement')}
      </div>
    </header>

    {#if form?.success}
      <div class="success-msg" role="status"><Icon name="check-circle" size={16} /> {successMessage}</div>
    {/if}

    {#if form?.error}
      <div class="error-msg"><Icon name="alert-triangle" size={16} /> {form.error}</div>
    {/if}

    <section class="form-section">
      <div class="section-title">
        <div>
          <h2>{t('pages.createUsers.formHeading')}</h2>
          <p>{t('pages.createUsers.formDescription')}</p>
        </div>

        <span class="badge">{t('footer.coordinator')}</span>
      </div>

      <div class="form-card">
        <form method="POST" class="user-form">
          <div class="form-grid">
            <div class="field">
              <label for="first_name">{t('pages.createUsers.firstNames')}</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder={t('pages.createUsers.firstNamePlaceholder')}
                value={getValue('first_name')}
                required
              />
            </div>

            <div class="field">
              <label for="last_name">{t('pages.createUsers.lastNames')}</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder={t('pages.createUsers.lastNamePlaceholder')}
                value={getValue('last_name')}
                required
              />
            </div>

            <div class="field">
              <label for="email">{t('pages.createUsers.emailAddress')}</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t('pages.createUsers.emailPlaceholder')}
                value={getValue('email')}
                required
              />
            </div>

            <div class="field">
              <label for="phone">{t('ui.phone')}</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder={t('pages.createUsers.phonePlaceholder')}
                value={getValue('phone')}
                required
              />
            </div>

            <div class="field">
              <label for="id_role">{t('pages.createUsers.userType')}</label>
              <select id="id_role" name="id_role" required>
                <option value="">{t('pages.createUsers.selectRole')}</option>
                <option value="3" selected={String(getValue('id_role')) === '3'}>
                  {t('footer.teacher')}
                </option>
                <option value="1" selected={String(getValue('id_role')) === '1'}>
                  {t('footer.student')}
                </option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="reset" class="clear-btn">{t('pages.createUsers.clearForm')}</button>
            <button type="submit" class="save-btn">{t('pages.createUsers.createUser')}</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</main>

<style>
  main {
    min-height: 80vh;
    padding: 2rem 1rem 3rem;
  }

  .content-wrapper {
    max-width: 1100px;
    margin: 0 auto;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 1.6rem;
    padding: 1.6rem;
    border-radius: 28px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-md);
  }

  .eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.75rem;
    padding: 0.42rem 0.8rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(242, 183, 5, 0.28);
  }

  .main-header h1 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  .main-header p {
    max-width: 720px;
    margin: 0.7rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.7;
  }

  .header-badge {
    flex: 0 0 auto;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .success-msg,
  .error-msg {
    margin-bottom: 1rem;
  }

  .form-section {
    display: grid;
    gap: 1rem;
  }

  .section-title {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .section-title h2 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.45rem;
    font-weight: 950;
  }

  .section-title p {
    margin: 0.35rem 0 0;
    color: var(--sgpa-text-soft);
  }

  .badge {
    padding: 0.45rem 0.85rem;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(11, 45, 105, 0.12);
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 950;
  }

  .form-card {
    background: var(--sgpa-surface);
    border-radius: 28px;
    padding: clamp(1.2rem, 3vw, 2rem);
    box-shadow: var(--sgpa-shadow-md);
    border: 1px solid var(--sgpa-border);
    border-top: 6px solid var(--sgpa-blue);
  }

  .user-form {
    display: grid;
    gap: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.1rem;
  }

  .field {
    display: grid;
    gap: 0.45rem;
  }

  .field label {
    color: var(--sgpa-blue-dark);
    font-weight: 850;
    font-size: 0.95rem;
  }

  .field input,
  .field select {
    width: 100%;
    min-height: 46px;
    padding: 0.85rem 1rem;
    border: 1px solid var(--sgpa-border);
    border-radius: 14px;
    background: var(--sgpa-surface);
    color: var(--sgpa-text);
    outline: none;
  }

  .field input:focus,
  .field select:focus {
    border-color: var(--sgpa-yellow);
    box-shadow: var(--sgpa-focus);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    border-top: 1px solid var(--sgpa-border);
    padding-top: 1.3rem;
    flex-wrap: wrap;
  }

  .save-btn,
  .clear-btn {
    min-height: 46px;
    padding: 0.8rem 1.2rem;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 950;
  }

  .clear-btn {
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border-strong);
  }

  .clear-btn:hover {
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue-dark);
  }

  @media (max-width: 780px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      justify-content: stretch;
    }

    .save-btn,
    .clear-btn {
      width: 100%;
    }
  }
</style>