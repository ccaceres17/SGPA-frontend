<script>
  import Header from '$lib/components/Header_St.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SideBar from '$lib/components/TeacherSideBar.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
</script>

<Header />
<SideBar />

<Dashboard
  roleName="Teacher"
  eyebrow="Teacher module"
  title="Assigned project tracking"
  description="Check academic information, review available projects, and track activity for your assigned projects."
/>

<Footer />