<script>
  import Icon from '$lib/components/icons/Icon.svelte';

  export let stats = [];
</script>

<div class="stats-container">
  {#each stats as stat}
    <article class="stat-card">
      <div class="stat-icon" style="--stat-bg: {stat.bgColor}; --stat-color: {stat.color};">
        <Icon name={stat.iconName} size={24} />
      </div>

      <div class="stat-info">
        <span class="stat-number">{stat.value}</span>
        <span class="stat-label">{stat.label}</span>
      </div>
    </article>
  {/each}
</div>

<style>
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1rem;
    margin: 1.2rem 0 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 108px;
    padding: 1.25rem;
    border-radius: 22px;
    background: var(--sgpa-surface);
    border: 1px solid var(--sgpa-border);
    box-shadow: var(--sgpa-shadow-sm);
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--sgpa-shadow-md);
    border-color: rgba(11, 45, 105, 0.18);
  }

  .stat-icon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    flex: 0 0 auto;
    border-radius: 17px;
    color: var(--stat-color, var(--sgpa-blue));
    background: var(--stat-bg, var(--sgpa-blue-soft));
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .stat-number {
    color: var(--sgpa-blue-dark);
    font-size: 1.75rem;
    font-weight: 950;
    line-height: 1;
  }

  .stat-label {
    margin-top: 0.35rem;
    color: var(--sgpa-text-soft);
    font-size: 0.92rem;
    font-weight: 750;
  }
</style>