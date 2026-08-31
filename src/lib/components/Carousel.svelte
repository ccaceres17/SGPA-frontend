<script>
  import { onMount, onDestroy } from 'svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  /** @type {{src: string, alt: string}[]} */
  export let slides = [];
  export let autoAdvanceMs = 6000;

  let activeIndex = 0;
  let timer = null;
  let prefersReducedMotion = false;
  let rootEl;

  function goTo(index) {
    activeIndex = (index + slides.length) % slides.length;
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  function startAutoAdvance() {
    stopAutoAdvance();
    if (!autoAdvanceMs || prefersReducedMotion || slides.length <= 1) return;
    timer = setInterval(next, autoAdvanceMs);
  }

  function stopAutoAdvance() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  }

  onMount(() => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startAutoAdvance();
  });

  onDestroy(() => {
    stopAutoAdvance();
  });
</script>

{#if slides.length > 0}
  <div
    class="carousel"
    role="tabpanel"
    aria-roledescription="carousel"
    aria-label={t('home.hero.carouselLabel')}
    tabindex="0"
    bind:this={rootEl}
    onkeydown={handleKeydown}
    onpointerenter={stopAutoAdvance}
    onpointerleave={startAutoAdvance}
    onfocusin={stopAutoAdvance}
    onfocusout={startAutoAdvance}
  >
    <div class="carousel-viewport">
      {#each slides as slide, index}
        <img
          src={slide.src}
          alt={slide.alt}
          class="carousel-slide"
          class:active={index === activeIndex}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      {/each}
    </div>

    {#if slides.length > 1}
      <button type="button" class="carousel-nav prev" onclick={previous} aria-label={t('home.hero.carouselPrev')}>
        <Icon name="chevron-left" size={20} />
      </button>

      <button type="button" class="carousel-nav next" onclick={next} aria-label={t('home.hero.carouselNext')}>
        <Icon name="chevron-right" size={20} />
      </button>

      <div class="carousel-dots" role="tablist" aria-label={t('home.hero.carouselDots')}>
        {#each slides as _, index}
          <button
            type="button"
            role="tab"
            class="carousel-dot"
            class:active={index === activeIndex}
            aria-current={index === activeIndex}
            aria-label={t('home.hero.carouselGoTo', { number: index + 1 })}
            onclick={() => goTo(index)}
          ></button>
        {/each}
      </div>
    {/if}

    <span class="sr-only" aria-live="polite">
      {t('home.hero.carouselStatus', { current: activeIndex + 1, total: slides.length })}
    </span>
  </div>
{/if}

<style>
  .carousel {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: var(--sgpa-radius-lg, 24px);
    overflow: hidden;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-lg);
    outline: none;
  }

  .carousel:focus-visible {
    box-shadow: var(--sgpa-focus), var(--sgpa-shadow-lg);
  }

  .carousel-viewport {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .carousel-slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #ffffff;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .carousel-slide {
      transition: none;
    }
  }

  .carousel-slide.active {
    opacity: 1;
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid var(--sgpa-border);
    background: rgba(255, 255, 255, 0.9);
    color: var(--sgpa-blue-dark);
    cursor: pointer;
    box-shadow: var(--sgpa-shadow-sm);
  }

  .carousel-nav:hover {
    background: #ffffff;
  }

  .carousel-nav.prev {
    left: 12px;
  }

  .carousel-nav.next {
    right: 12px;
  }

  .carousel-dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    display: flex;
    justify-content: center;
    gap: 0.4rem;
  }

  .carousel-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    border: none;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 0;
  }

  .carousel-dot.active {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(11, 45, 105, 0.35);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
