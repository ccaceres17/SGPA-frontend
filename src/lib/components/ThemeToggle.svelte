<script>
  import { onMount } from 'svelte';
  import { themeState, toggleTheme, syncThemeFromDocument } from '$lib/stores/theme.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

  onMount(() => {
    syncThemeFromDocument();
  });

  let isDark = $derived(themeState.current === 'dark');
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={toggleTheme}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  aria-pressed={isDark}
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  <Icon name={isDark ? 'sun' : 'moon'} size={18} />
</button>
