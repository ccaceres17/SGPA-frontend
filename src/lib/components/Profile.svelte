<script>
  import { t } from '$lib/stores/locale.svelte.js';
  import Icon from '$lib/components/icons/Icon.svelte';

  export let user = {};

  function getRoleConfig(roleId) {
    const configs = {
      1: { name: t('pages.profile.roleStudent'), color: '#e8680d', label: t('pages.profile.labelUndergraduate') },
      3: { name: t('pages.profile.roleTeacher'), color: '#0099cc', label: t('pages.profile.labelTeacher') },
      4: { name: t('pages.profile.roleCoordinator'), color: '#202f56', label: t('pages.profile.labelCoordinator') }
    };

    return configs[roleId] || { name: t('pages.profile.roleUser'), color: '#5f6f89', label: t('pages.profile.labelSystem') };
  }

  $: role = getRoleConfig(user.id_role);
</script>

<div class="profile-card">
  <div class="profile-header" style="border-left-color: {role.color}">
    <div class="avatar" style="background-color: {role.color}">
      {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
    </div>

    <div class="user-meta">
      <span class="profile-eyebrow">{t('pages.profile.institutionalProfile')}</span>
      <h1>{user.first_name || t('pages.profile.roleUser')} {user.last_name || ''}</h1>

      <span class="role-tag" style="background-color: {role.color}15; color: {role.color}">
        {role.name} · {role.label}
      </span>
    </div>
  </div>

  <div class="info-sections">
    <section class="data-group">
      <h3><span class="icon"><Icon name="mail" size={17} /></span> {t('pages.profile.contactAndAccess')}</h3>

      <div class="field">
        <span class="label">{t('pages.profile.institutionalEmail')}</span>
        <span class="value">{user.email || t('pages.profile.notRegistered')}</span>
      </div>

      <div class="field">
        <span class="label">{t('pages.profile.contactPhone')}</span>
        <span class="value">{user.phone || t('pages.profile.notRegistered')}</span>
      </div>
    </section>

    <section class="data-group">
      <h3><span class="icon"><Icon name="key" size={17} /></span> {t('pages.profile.identification')}</h3>

      <div class="field">
        <span class="label">{t('pages.profile.accountStatus')}</span>
        <span class="status-indicator {user.is_active ? 'active' : 'inactive'}">
          {user.is_active ? `● ${t('ui.activeStatus')}` : `○ ${t('ui.inactive')}`}
        </span>
      </div>

      <div class="field">
        <span class="label">{t('pages.profile.assignedRole')}</span>
        <span class="value">{role.name}</span>
      </div>
    </section>
  </div>
</div>

<style>
  .profile-card {
    background: var(--sgpa-surface);
    border-radius: 28px;
    box-shadow: var(--sgpa-shadow-md);
    overflow: hidden;
    max-width: 900px;
    margin: 0 auto;
    border: 1px solid var(--sgpa-border);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: var(--sgpa-surface);
    border-left: 10px solid;
    border-bottom: 1px solid var(--sgpa-border);
  }

  .avatar {
    width: 82px;
    height: 82px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.8rem;
    font-weight: 950;
    text-transform: uppercase;
    box-shadow: 0 14px 28px rgba(11, 45, 105, 0.18);
    flex-shrink: 0;
  }

  .profile-eyebrow {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 0.45rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: var(--sgpa-yellow-soft);
    color: var(--sgpa-blue);
    border: 1px solid rgba(242, 183, 5, 0.28);
    font-size: 0.75rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .user-meta h1 {
    margin: 0;
    font-size: clamp(1.45rem, 3vw, 2rem);
    color: var(--sgpa-blue-dark);
    font-weight: 950;
    letter-spacing: -0.04em;
  }

  .role-tag {
    font-size: 0.78rem;
    font-weight: 900;
    padding: 6px 12px;
    border-radius: 999px;
    margin-top: 0.7rem;
    display: inline-flex;
    text-transform: uppercase;
    border: 1px solid rgba(11, 45, 105, 0.12);
  }

  .info-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 2rem;
  }

  .data-group {
    background: var(--sgpa-surface-soft);
    border: 1px solid var(--sgpa-border);
    border-radius: 22px;
    padding: 1.2rem;
  }

  .data-group h3 {
    font-size: 0.9rem;
    color: var(--sgpa-blue);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 950;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .field {
    margin-bottom: 1rem;
  }

  .field:last-child {
    margin-bottom: 0;
  }

  .label {
    display: block;
    font-size: 0.75rem;
    color: var(--sgpa-muted);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1rem;
    color: var(--sgpa-text);
    font-weight: 750;
    overflow-wrap: anywhere;
  }

  .status-indicator {
    display: inline-flex;
    border-radius: 999px;
    padding: 0.38rem 0.75rem;
    font-weight: 900;
    font-size: 0.9rem;
  }

  .status-indicator.active {
    background: var(--sgpa-success-bg);
    color: var(--sgpa-success);
  }

  .status-indicator.inactive {
    background: var(--sgpa-danger-bg);
    color: var(--sgpa-danger);
  }

  @media (max-width: 700px) {
    .info-sections {
      grid-template-columns: 1fr;
      padding: 1.2rem;
    }

    .profile-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.4rem;
    }
  }
</style>