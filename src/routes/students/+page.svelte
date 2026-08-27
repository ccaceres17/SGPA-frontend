<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/StudentSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
</script>

<Header />
<SideBar />

<Dashboard
  roleName="Student"
  eyebrow="Student module"
  title="Academic projects overview"
  description="Explore available projects, review your enrollments, and check your personal information within SGPA."
/>

<Footer />