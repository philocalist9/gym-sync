// shared/permissions.ts
import { ROLES } from './roles';

export const PERMISSIONS = {
  [ROLES.MEMBER]: [
    'view_own_profile',
    'edit_own_profile',
    'view_own_workouts',
    'view_own_membership',
    'schedule_appointments',
    'view_own_progress'
  ],
  [ROLES.TRAINER]: [
    'view_own_profile',
    'edit_own_profile',
    'view_clients',
    'create_workouts',
    'edit_workouts',
    'view_appointments',
    'manage_appointments'
  ],
  [ROLES.GYM_OWNER]: [
    'view_own_profile',
    'edit_own_profile',
    'manage_trainers',
    'manage_members',
    'view_analytics',
    'manage_memberships',
    'manage_gym_settings'
  ],
  [ROLES.SUPER_ADMIN]: [
    'all'
  ]
}; 