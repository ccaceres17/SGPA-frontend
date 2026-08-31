<script>
  import CoordinatorUsersReport from '$lib/components/CoordinatorUsersReport.svelte';

  export let data;
</script>

<CoordinatorUsersReport
  {data}
  backHref="/coordinator/teachers"
  backLabel="Back to professors"
/>