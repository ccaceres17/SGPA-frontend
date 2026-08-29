<script>
  import { onMount } from 'svelte';
  import { themeState, toggleTheme, syncThemeFromDocument } from '$lib/stores/theme.svelte.js';

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
  {#if isDark}
    <span aria-hidden="true">☀️</span>
  {:else}
    <span aria-hidden="true">🌙</span>
  {/if}
</button>
