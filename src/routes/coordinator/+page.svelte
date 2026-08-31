<script>
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let { data } = $props();
</script>

<Header />
<SideBar />

<Dashboard
  eyebrow={t('dashboard.coordinator.eyebrow')}
  title={t('dashboard.coordinator.title')}
  description={t('dashboard.coordinator.description')}
  stats={data.stats}
  extraStat={{ labelKey: 'dashboard.stats.researchGroups', value: data.totalResearchGroups, iconName: 'users' }}
  recentProjects={data.recentProjects}
  error={data.error}
/>