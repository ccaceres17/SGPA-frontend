<script>
  export let name = 'Academic project';
  export let schedule = 'No schedule defined';

  function viewStudents() {
    alert('Here you would see the students for the project: ' + name);
  }
</script>

<div class="card">
  <div class="left">
    <div class="icon">📁</div>

    <div class="info">
      <h3>{name}</h3>
      <p>{schedule}</p>
    </div>
  </div>

  <button class="students-btn" type="button" onclick={viewStudents}>
    View students
  </button>
</div>

<style>
  .card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    background: var(--sgpa-surface);
    padding: 1.25rem;
    border-radius: 22px;
    border: 1px solid var(--sgpa-border);
    border-left: 6px solid var(--sgpa-blue);
    box-shadow: var(--sgpa-shadow-sm);
    flex-wrap: wrap;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 260px;
    flex: 1;
  }

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    background: var(--sgpa-blue-soft);
    color: var(--sgpa-blue);
    font-size: 1.45rem;
  }

  h3 {
    margin: 0;
    color: var(--sgpa-blue-dark);
    font-size: 1.15rem;
    font-weight: 950;
  }

  p {
    margin: 0.3rem 0 0;
    color: var(--sgpa-text-soft);
    line-height: 1.5;
  }

  .students-btn {
    min-height: 42px;
    padding: 0.72rem 1rem;
    border: none;
    border-radius: 999px;
    background: var(--sgpa-accent-start);
    color: var(--sgpa-on-accent);
    font-weight: 900;
    cursor: pointer;
  }

  .students-btn:hover {
    background: var(--sgpa-accent-hover);
  }

  @media (max-width: 640px) {
    .left {
      min-width: 100%;
    }

    .students-btn {
      width: 100%;
    }
  }
</style>