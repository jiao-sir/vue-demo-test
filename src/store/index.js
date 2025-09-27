import { reactive } from 'vue'

// 用户管理状态
export const userStore = reactive({
  users: [
    { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: '启用', createTime: '2024-01-01', isOnline: true },
    { id: 2, username: 'user1', email: 'user1@example.com', role: '普通用户', status: '启用', createTime: '2024-01-02', isOnline: true },
    { id: 3, username: 'user2', email: 'user2@example.com', role: '普通用户', status: '启用', createTime: '2024-01-03', isOnline: false },
    { id: 4, username: 'user3', email: 'user3@example.com', role: '普通用户', status: '启用', createTime: '2024-01-04', isOnline: true }
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
  },
  
  resetPassword(id) {
    const user = this.getUserById(id)
    if (user) {
      // 这里可以添加重置密码的逻辑，比如发送邮件等
      console.log(`重置用户 ${user.username} 的密码`)
      return true
    }
    return false
  },
  
  assignPermissions(id, permissions) {
    const user = this.getUserById(id)
    if (user) {
      user.permissions = permissions || []
      return true
    }
    return false
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

// 数据校验管理状态
export const dataValidationStore = reactive({
  validations: [
    { 
      id: 1, 
      dataSourceA: 'MySQL主库', 
      dataSourceB: 'PostgreSQL备库', 
      type: '数据完整性', 
      result: '成功', 
      createTime: '2024-01-01 10:30:15', 
      completeTime: '2024-01-01 10:32:38',
      duration: '143.0s',
      description: '用户表数据完整性校验',
      errorMessage: null
    },
    { 
      id: 2, 
      dataSourceA: 'Redis缓存', 
      dataSourceB: 'MySQL主库', 
      type: '数据一致性', 
      result: '成功', 
      createTime: '2024-01-02 14:20:10', 
      completeTime: '2024-01-02 14:21:58',
      duration: '108.0s',
      description: '订单缓存数据一致性校验',
      errorMessage: null
    },
    { 
      id: 3, 
      dataSourceA: 'MySQL主库', 
      dataSourceB: 'MongoDB日志库', 
      type: '数据准确性', 
      result: '失败', 
      createTime: '2024-01-03 09:15:25', 
      completeTime: '2024-01-03 09:18:45',
      duration: '200.0s',
      description: '库存数据准确性校验',
      errorMessage: '数据不一致：发现3条记录存在差异'
    },
    { 
      id: 4, 
      dataSourceA: 'PostgreSQL备库', 
      dataSourceB: 'MySQL主库', 
      type: '业务规则', 
      result: '成功', 
      createTime: '2024-01-04 16:45:30', 
      completeTime: '2024-01-04 16:49:41',
      duration: '251.0s',
      description: '财务数据业务规则校验',
      errorMessage: null
    },
    { 
      id: 5, 
      dataSourceA: 'MongoDB日志库', 
      dataSourceB: 'Redis缓存', 
      type: '数据格式', 
      result: '失败', 
      createTime: '2024-01-05 11:30:20', 
      completeTime: '2024-01-05 11:31:50',
      duration: '90.0s',
      description: '日志数据格式校验',
      errorMessage: '数据格式不匹配：发现2条记录格式错误'
    }
  ],
  
  addValidation(validation) {
    const newValidation = {
      id: validation.id || Date.now(),
      ...validation,
      createTime: validation.createTime || new Date().toISOString().split('T')[0]
    }
    this.validations.push(newValidation)
  },
  
  updateValidation(id, validationData) {
    const index = this.validations.findIndex(validation => validation.id === id)
    if (index !== -1) {
      this.validations[index] = { ...this.validations[index], ...validationData }
    }
  },
  
  deleteValidation(id) {
    const index = this.validations.findIndex(validation => validation.id === id)
    if (index !== -1) {
      this.validations.splice(index, 1)
    }
  },
  
  getValidationById(id) {
    return this.validations.find(validation => validation.id === id)
  }
})

// 数据迁移管理状态
export const dataMigrationStore = reactive({
  migrations: [
    { id: 1, name: '用户表迁移', source: 'MySQL', target: 'PostgreSQL', status: '成功', createTime: '2024-01-01', duration: '15.2s' },
    { id: 2, name: '订单表迁移', source: 'MySQL', target: 'PostgreSQL', status: '成功', createTime: '2024-01-02', duration: '23.8s' },
    { id: 3, name: '商品表迁移', source: 'MySQL', target: 'PostgreSQL', status: '失败', createTime: '2024-01-03', duration: '8.5s' },
    { id: 4, name: '日志表迁移', source: 'MySQL', target: 'MongoDB', status: '成功', createTime: '2024-01-04', duration: '45.3s' },
    { id: 5, name: '配置表迁移', source: 'MySQL', target: 'PostgreSQL', status: '失败', createTime: '2024-01-05', duration: '12.1s' }
  ],
  
  addMigration(migration) {
    const newMigration = {
      id: Date.now(),
      ...migration,
      createTime: new Date().toISOString().split('T')[0]
    }
    this.migrations.push(newMigration)
  },
  
  updateMigration(id, migrationData) {
    const index = this.migrations.findIndex(migration => migration.id === id)
    if (index !== -1) {
      this.migrations[index] = { ...this.migrations[index], ...migrationData }
    }
  },
  
  deleteMigration(id) {
    const index = this.migrations.findIndex(migration => migration.id === id)
    if (index !== -1) {
      this.migrations.splice(index, 1)
    }
  },
  
  getMigrationById(id) {
    return this.migrations.find(migration => migration.id === id)
  }
})
