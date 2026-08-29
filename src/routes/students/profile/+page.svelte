<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/StudentSideBar.svelte';
  import Profile from '$lib/components/Profile.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  export let data;

  $: user = data.user || {};
  $: error = data.error;
</script>

<Header />
<SideBar />

<main>
  <div class="content-wrapper">
    <header class="main-header">
      <div>
        <span class="eyebrow">{t('sidebar.studentModuleLabel')}</span>
        <h1>{t('pages.studentProfile.heading')}</h1>
        <p>{t('pages.studentProfile.description')}</p>
      </div>

      <span class="header-badge">{t('sidebar.profile')}</span>
    </header>

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {:else}
      <Profile {user} />
    {/if}
  </div>
</main>

<Footer />

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
    padding: 0.55rem 1rem;
    border-radius: 999px;
    background: var(--sgpa-surface);
    color: var(--sgpa-blue);
    border: 1px solid var(--sgpa-border);
    font-weight: 950;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .error-msg {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 760px) {
    .main-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>