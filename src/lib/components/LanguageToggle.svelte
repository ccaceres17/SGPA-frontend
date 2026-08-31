<script>
  import { onMount } from 'svelte';
  import { localeState, toggleLocale, syncLocaleFromDocument, t } from '$lib/stores/locale.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

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
  <Icon name="globe" size={14} />
  <span aria-hidden="true">{isSpanish ? 'EN' : 'ES'}</span>
</button>

<style>
  .language-toggle {
    width: auto;
    gap: 0.35rem;
    padding: 0 0.85rem;
  }
</style>
