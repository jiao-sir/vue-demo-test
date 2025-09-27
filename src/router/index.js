import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '../views/UserManagement.vue'
import PermissionManagement from '../views/PermissionManagement.vue'
import DataSourceManagement from '../views/DataSourceManagement.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
