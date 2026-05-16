<script>
  const tasks = [
    {
      title: 'Map onboarding flow',
      owner: 'Asha',
      status: 'Todo',
      priority: 'High',
      estimate: 3,
      description: 'Turn the first-run experience into a checked sequence of setup steps.'
    },
    {
      title: 'Ship usage dashboard',
      owner: 'Mira',
      status: 'In Progress',
      priority: 'High',
      estimate: 5,
      description: 'Add the core chart and recent activity feed for weekly reviews.'
    },
    {
      title: 'Polish billing copy',
      owner: 'Noah',
      status: 'Review',
      priority: 'Medium',
      estimate: 2,
      description: 'Rewrite plan descriptions so upgrade paths are clearer.'
    },
    {
      title: 'Clean empty states',
      owner: 'Asha',
      status: 'Done',
      priority: 'Low',
      estimate: 1,
      description: 'Replace placeholder text with concise, useful empty-state guidance.'
    },
    {
      title: 'Prototype invite links',
      owner: 'Mira',
      status: 'Todo',
      priority: 'Medium',
      estimate: 3,
      description: 'Create the first version of shareable workspace invites.'
    },
    {
      title: 'Review audit events',
      owner: 'Noah',
      status: 'In Progress',
      priority: 'Medium',
      estimate: 4,
      description: 'Confirm each critical account action creates a readable audit trail.'
    }
  ];

  const statuses = ['Todo', 'In Progress', 'Review', 'Done'];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  let query = '';
  let selectedPriority = 'All';

  $: normalizedQuery = query.trim().toLowerCase();
  $: filteredTasks = tasks.filter((task) => {
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    const matchesQuery =
      !normalizedQuery ||
      [task.title, task.owner, task.status, task.priority, task.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesPriority && matchesQuery;
  });

  $: totalEstimate = filteredTasks.reduce((total, task) => total + task.estimate, 0);
  $: completedEstimate = filteredTasks
    .filter((task) => task.status === 'Done')
    .reduce((total, task) => total + task.estimate, 0);
  $: ownerTotals = tasks.reduce((totals, task) => {
    totals[task.owner] = (totals[task.owner] || 0) + task.estimate;
    return totals;
  }, {});

  function tasksForStatus(status) {
    return filteredTasks.filter((task) => task.status === status);
  }
</script>

<main class="shell">
  <section class="toolbar">
    <div>
      <p class="eyebrow">Svelte Template</p>
      <h1>Sprint Board</h1>
    </div>

    <label class="search">
      <span>Search</span>
      <input bind:value={query} placeholder="Owner, task, status..." />
    </label>
  </section>

  <section class="metrics" aria-label="Sprint metrics">
    <article>
      <span>Visible Tasks</span>
      <strong>{filteredTasks.length}</strong>
    </article>
    <article>
      <span>Total Points</span>
      <strong>{totalEstimate}</strong>
    </article>
    <article>
      <span>Done Points</span>
      <strong>{completedEstimate}</strong>
    </article>
  </section>

  <section class="filters" aria-label="Priority filters">
    {#each priorities as priority}
      <button
        class:active={selectedPriority === priority}
        on:click={() => (selectedPriority = priority)}
        type="button"
      >
        {priority}
      </button>
    {/each}
  </section>

  <section class="board" aria-label="Task board">
    {#each statuses as status}
      <article class="column">
        <header>
          <h2>{status}</h2>
          <span>{tasksForStatus(status).length}</span>
        </header>

        <div class="cards">
          {#each tasksForStatus(status) as task}
            <article class="task">
              <div class="task-header">
                <strong>{task.title}</strong>
                <span class:high={task.priority === 'High'}>{task.priority}</span>
              </div>
              <p>{task.description}</p>
              <footer>
                <span>{task.owner}</span>
                <span>{task.estimate} pts</span>
              </footer>
            </article>
          {:else}
            <p class="empty">No matching work</p>
          {/each}
        </div>
      </article>
    {/each}
  </section>

  <section class="owners" aria-label="Owner summary">
    {#each Object.entries(ownerTotals) as [owner, points]}
      <article>
        <span>{owner}</span>
        <strong>{points} pts</strong>
      </article>
    {/each}
  </section>
</main>
