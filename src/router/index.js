import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '../views/UserManagement.vue'
import PermissionManagement from '../views/PermissionManagement.vue'
import DataSourceManagement from '../views/DataSourceManagement.vue'
import DataValidationManagement from '../views/DataValidationManagement.vue'
import DataMigrationManagement from '../views/DataMigrationManagement.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/permissions',
    name: 'PermissionManagement',
    component: PermissionManagement
  },
  {
    path: '/datasources',
    name: 'DataSourceManagement',
    component: DataSourceManagement
  },
  {
    path: '/data-validation',
    name: 'DataValidationManagement',
    component: DataValidationManagement
  },
  {
    path: '/data-migration',
    name: 'DataMigrationManagement',
    component: DataMigrationManagement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
