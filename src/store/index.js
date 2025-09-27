import { reactive } from 'vue'

// 用户管理状态
export const userStore = reactive({
  users: [
    { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: '启用', createTime: '2024-01-01' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: '普通用户', status: '启用', createTime: '2024-01-02' }
  ],
  
  addUser(user) {
    const newUser = {
      id: Date.now(),
      ...user,
      createTime: new Date().toISOString().split('T')[0]
    }
    this.users.push(newUser)
  },
  
  updateUser(id, userData) {
    const index = this.users.findIndex(user => user.id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData }
    }
  },
  
  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
    }
  },
  
  getUserById(id) {
    return this.users.find(user => user.id === id)
  }
})

// 权限管理状态
export const permissionStore = reactive({
  permissions: [
    { id: 1, name: '用户管理', code: 'user:manage', description: '用户增删改查权限', status: '启用', createTime: '2024-01-01' },
    { id: 2, name: '权限管理', code: 'permission:manage', description: '权限增删改查权限', status: '启用', createTime: '2024-01-01' },
    { id: 3, name: '数据源管理', code: 'datasource:manage', description: '数据源增删改查权限', status: '启用', createTime: '2024-01-01' }
  ],
  
  addPermission(permission) {
    const newPermission = {
      id: Date.now(),
      ...permission,
      createTime: new Date().toISOString().split('T')[0]
    }
    this.permissions.push(newPermission)
  },
  
  updatePermission(id, permissionData) {
    const index = this.permissions.findIndex(permission => permission.id === id)
    if (index !== -1) {
      this.permissions[index] = { ...this.permissions[index], ...permissionData }
    }
  },
  
  deletePermission(id) {
    const index = this.permissions.findIndex(permission => permission.id === id)
    if (index !== -1) {
      this.permissions.splice(index, 1)
    }
  },
  
  getPermissionById(id) {
    return this.permissions.find(permission => permission.id === id)
  }
})

// 数据源管理状态
export const dataSourceStore = reactive({
  dataSources: [
    { id: 1, name: 'MySQL主库', type: 'MySQL', host: '192.168.1.100', port: 3306, database: 'main_db', status: '连接正常', createTime: '2024-01-01' },
    { id: 2, name: 'Redis缓存', type: 'Redis', host: '192.168.1.101', port: 6379, database: '0', status: '连接正常', createTime: '2024-01-02' }
  ],
  
  addDataSource(dataSource) {
    const newDataSource = {
      id: Date.now(),
      ...dataSource,
      createTime: new Date().toISOString().split('T')[0]
    }
    this.dataSources.push(newDataSource)
  },
  
  updateDataSource(id, dataSourceData) {
    const index = this.dataSources.findIndex(ds => ds.id === id)
    if (index !== -1) {
      this.dataSources[index] = { ...this.dataSources[index], ...dataSourceData }
    }
  },
  
  deleteDataSource(id) {
    const index = this.dataSources.findIndex(ds => ds.id === id)
    if (index !== -1) {
      this.dataSources.splice(index, 1)
    }
  },
  
  getDataSourceById(id) {
    return this.dataSources.find(ds => ds.id === id)
  }
})
