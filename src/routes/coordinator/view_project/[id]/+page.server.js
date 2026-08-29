import { fail } from '@sveltejs/kit';
import {
  getProjectDetails,
  assignTeacherToProject,
  updateProjectStatus,
  getStatuses
} from '$lib/server/project-helpers.js';
import { applyStatusUpdate } from '$lib/server/status-update.js';
import { getLocaleFromCookies } from '$lib/server/locale.js';

function isCancelledStatus(statusId, statuses = []) {
  const selectedStatus = statuses.find(
    (status) => Number(status.id_status) === Number(statusId)
  );

  const name = String(selectedStatus?.status_name || '').trim().toLowerCase();

  return (
    Number(statusId) === 4 ||
    name === 'cancelled' ||
    name === 'canceled' ||
    name === 'cancelado'
  );
}

function getCancelledStatusId(statuses = []) {
  const status = statuses.find((item) => {
    const name = String(item.status_name || '').trim().toLowerCase();

    return (
      Number(item.id_status) === 4 ||
      name === 'cancelled' ||
      name === 'canceled' ||
      name === 'cancelado'
    );
  });

  return Number(status?.id_status || 4);
}

function getActiveStatusId(statuses = []) {
  const status = statuses.find((item) => {
    const name = String(item.status_name || '').trim().toLowerCase();

    return Number(item.id_status) === 1 || name === 'active' || name === 'activo';
  });

  return Number(status?.id_status || 1);
}

function filterStatusesForCoordinatorSelector(statuses = []) {
  return statuses.filter((status) => !isCancelledStatus(status.id_status, statuses));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params, cookies }) {
  const projectId = Number(params.id);
  const locale = getLocaleFromCookies(cookies);

  if (!projectId) {
    return {
      projectId: params.id,
      actionStatuses: [],
      isProjectCancelled: false,
      error: 'Invalid project ID.'
    };
  }

  try {
    const details = await getProjectDetails(fetch, 'coordinator', projectId, locale);
    const isProjectCancelled = isCancelledStatus(details.project?.id_status, details.statuses);

    return {
      ...details,
      projectId,
      actionStatuses: filterStatusesForCoordinatorSelector(details.statuses),
      isProjectCancelled
    };
  } catch (error) {
    return {
      projectId,
      actionStatuses: [],
      isProjectCancelled: false,
      error: error.message || 'Could not load project details.'
    };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  updateStatus: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();
    const statusId = Number(formData.get('statusId'));

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    if (!statusId) {
      return fail(400, {
        error: 'Select a valid status.'
      });
    }

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    if (isCancelledStatus(statusId, statuses)) {
      return fail(403, {
        error: 'Use the Cancel project button to cancel a project.'
      });
    }

    const result = await applyStatusUpdate(() => updateProjectStatus(fetch, projectId, statusId));

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      message: 'Project status updated successfully.'
    };
  },

  cancelProject: async ({ fetch, params }) => {
    const projectId = Number(params.id);

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    const cancelledStatusId = getCancelledStatusId(statuses);

    const result = await applyStatusUpdate(() =>
      updateProjectStatus(fetch, projectId, cancelledStatusId)
    );

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      message: 'Project cancelled successfully.'
    };
  },

  reactivateProject: async ({ fetch, params }) => {
    const projectId = Number(params.id);

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    let statuses = [];

    const statusesResult = await applyStatusUpdate(async () => {
      statuses = await getStatuses(fetch, 'coordinator');
    });

    if (!statusesResult.success) {
      return fail(statusesResult.status >= 400 ? statusesResult.status : 500, {
        error: statusesResult.message
      });
    }

    const activeStatusId = getActiveStatusId(statuses);

    const result = await applyStatusUpdate(() =>
      updateProjectStatus(fetch, projectId, activeStatusId)
    );

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      message: 'Project reactivated successfully.'
    };
  },

  assignTeacher: async ({ request, fetch, params }) => {
    const projectId = Number(params.id);
    const formData = await request.formData();
    const teacherId = Number(formData.get('teacherId'));

    if (!projectId) {
      return fail(400, {
        error: 'Invalid project.'
      });
    }

    if (!teacherId) {
      return fail(400, {
        error: 'Select a valid teacher.'
      });
    }

    let assignResult;

    const result = await applyStatusUpdate(async () => {
      assignResult = await assignTeacherToProject(fetch, projectId, teacherId);
    });

    if (!result.success) {
      return fail(result.status >= 400 ? result.status : 500, {
        error: result.message
      });
    }

    return {
      success: true,
      message: assignResult?.alreadyAssigned
        ? 'This teacher is already assigned to the project.'
        : 'Teacher assigned successfully.'
    };
  }
};