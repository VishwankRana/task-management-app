export function pickAllowedFields(body, allowedKeys) {
  if (!body || typeof body !== 'object') return {};

  const result = {};
  for (const key of allowedKeys) {
    if (body[key] !== undefined) {
      result[key] = body[key];
    }
  }
  return result;
}

export const PROJECT_WRITABLE_FIELDS = [
  'projectName',
  'projectDescription',
  'projectStatus',
  'projectPriority',
  'projectStartDate',
  'projectEndDate',
];

export const TASK_WRITABLE_FIELDS = [
  'title',
  'description',
  'priority',
  'type',
  'status',
];

export function pickProjectData(body) {
  return pickAllowedFields(body, PROJECT_WRITABLE_FIELDS);
}

export function pickTaskData(body) {
  return pickAllowedFields(body, TASK_WRITABLE_FIELDS);
}
