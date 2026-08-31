import {
  getProjects,
  getUsers,
  getProjectUsers,
  getStatuses,
  ROLE_IDS,
  getStatusLabel,
  getUserFullName,
  PROJECT_CARD_ICON_SVG
} from '$lib/server/project-helpers.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildProjectCardHtml({
  project,
  statusLabel = 'Unknown',
  teacherName = 'Unassigned',
  actionHref = '#',
  actionLabel = 'View details',
  badgeLabel = 'Professor view'
}) {
  const projectName = escapeHtml(project?.project_name ?? 'Unnamed');
  const description = escapeHtml(project?.description ?? 'No description');
  const startDate = escapeHtml(project?.start_date || 'Not defined');
  const endDate = escapeHtml(project?.end_date || 'Not defined');
  const status = escapeHtml(statusLabel);
  const teacher = escapeHtml(teacherName);
  const href = escapeHtml(actionHref);
  const actionText = escapeHtml(actionLabel);
  const badge = escapeHtml(badgeLabel);

  return `
    <div class="project-card">
      <div class="project-card__left">
        <div class="project-card__icon">${PROJECT_CARD_ICON_SVG}</div>

        <div class="project-card__content">
          <h3>${projectName}</h3>
          <p>${description}</p>

          <div class="project-card__meta">
            <span><strong>Start date:</strong> ${startDate}</span>
            <span><strong>End date:</strong> ${endDate}</span>
            <span><strong>Status:</strong> ${status}</span>
            <span><strong>Teacher:</strong> ${teacher}</span>
          </div>
        </div>
      </div>

      <div class="project-card__right" style="gap:.75rem;flex-wrap:wrap;">
        <span class="neutral-badge">${badge}</span>
        <a href="${href}" class="action-btn" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;padding:.72rem 1rem;min-height:42px;">${actionText}</a>
      </div>
    </div>
  `;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const [projects, users, relations, statuses] = await Promise.all([
      getProjects(fetch, 'teacher'),
      getUsers(fetch, 'teacher'),
      getProjectUsers(fetch, 'teacher').catch(() => []),
      getStatuses(fetch, 'teacher')
    ]);

    const usersMap = new Map(users.map((user) => [Number(user.id_user), user]));
    const teacherByProject = new Map();

    for (const relation of relations) {
      if (Number(relation.id_role) === ROLE_IDS.teacher) {
        teacherByProject.set(Number(relation.id_project), Number(relation.id_user));
      }
    }

    const rows = projects.map((project) => {
      const teacherId = teacherByProject.get(Number(project.id_project));
      const teacher = teacherId ? usersMap.get(Number(teacherId)) : null;

      return {
        id_project: Number(project.id_project),
        proyecto_card: buildProjectCardHtml({
          project,
          statusLabel: getStatusLabel(project.id_status, statuses),
          teacherName: teacher ? getUserFullName(teacher) : 'Unassigned',
          actionHref: `/teacher/view_project/${project.id_project}`,
          actionLabel: 'View details',
          badgeLabel: 'Professor view'
        })
      };
    });

    return {
      rows,
      totalProjects: projects.length
    };
  } catch (error) {
    return {
      rows: [],
      totalProjects: 0,
      error: error.message || 'Could not load projects.'
    };
  }
}