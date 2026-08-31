<script>
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/TeacherSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let { data } = $props();
</script>

<Header />
<SideBar />

<Dashboard
  eyebrow={t('dashboard.teacher.eyebrow')}
  title={t('dashboard.teacher.title')}
  description={t('dashboard.teacher.description')}
  stats={data.stats}
  extraStat={{ labelKey: 'dashboard.stats.assignedProjects', value: data.totalProjects, iconName: 'folder' }}
  recentProjects={data.recentProjects}
  error={data.error}
/>