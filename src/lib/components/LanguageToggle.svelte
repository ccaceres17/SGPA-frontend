<script>
  import { onMount } from 'svelte';
  import { localeState, toggleLocale, syncLocaleFromDocument, t } from '$lib/stores/locale.svelte.js';

  onMount(() => {
    syncLocaleFromDocument();
  });

  let isSpanish = $derived(localeState.current === 'es');
</script>

<button
  type="button"
  class="theme-toggle language-toggle"
  onclick={toggleLocale}
  aria-label={isSpanish ? t('common.switchToEnglish') : t('common.switchToSpanish')}
  title={isSpanish ? t('common.switchToEnglish') : t('common.switchToSpanish')}
>
  <span aria-hidden="true">{isSpanish ? 'EN' : 'ES'}</span>
</button>
