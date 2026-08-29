<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { normalizeLocale } from '$lib/i18n/locale.js';
  import { localeState } from '$lib/stores/locale.svelte.js';

  let { children, data } = $props();

  // Seeds the (module-level) locale store with this request's cookie so SSR
  // output — and the login page's own labels — render in the visitor's
  // chosen language instead of always defaulting to English. This must run
  // synchronously during SSR, so it can't use $effect: effects never run on
  // the server, and doing so silently reintroduces the English-only-SSR bug
  // this line fixes. The compiler's "only captures the initial value"
  // warning is a false positive for this specific one-shot seed — on the
  // client, later changes come from toggleLocale()/applyLocale(), not from a
  // change to `data`, so re-running on every `data` update is neither
  // needed nor (per the above) possible.
  // svelte-ignore state_referenced_locally
  localeState.current = normalizeLocale(data.locale);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}