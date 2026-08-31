<script>
  import { ICONS } from './paths.js';

  export let name;
  export let size = 20;
  export let strokeWidth = 2;
  export let title = '';

  let className = '';
  export { className as class };

  $: shapes = ICONS[name] || [];
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden={title ? undefined : 'true'}
  role={title ? 'img' : undefined}
>
  {#if title}<title>{title}</title>{/if}
  {#each shapes as shape}
    {#if shape.tag === 'path'}
      <path d={shape.d} fill={shape.fill} stroke={shape.stroke} />
    {:else if shape.tag === 'circle'}
      <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} stroke={shape.stroke} />
    {:else if shape.tag === 'line'}
      <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />
    {/if}
  {/each}
</svg>
