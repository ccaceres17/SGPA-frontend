<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/CoordinatorSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
</script>

<Header />
<SideBar />

<Dashboard
  roleName="Coordinator"
  eyebrow="Coordinator module"
  title="Academic control panel"
  description="Manage projects, teachers, students, and users from a clear, organized, and institutional interface."
/>

<Footer />