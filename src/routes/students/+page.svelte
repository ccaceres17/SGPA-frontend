<script>
  import Header from '$lib/components/Header_St.svelte';
  import SideBar from '$lib/components/StudentSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import { t } from '$lib/stores/locale.svelte.js';

  let { data } = $props();
</script>

<Header />
<SideBar />

<Dashboard
  eyebrow={t('dashboard.student.eyebrow')}
  title={t('dashboard.student.title')}
  description={t('dashboard.student.description')}
  stats={data.stats}
  extraStat={{ labelKey: 'dashboard.stats.enrolledProjects', value: data.totalEnrolled, iconName: 'graduation-cap' }}
  recentProjects={data.recentProjects}
  error={data.error}
/>