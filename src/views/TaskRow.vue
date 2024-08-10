<template>
  <div class="task-row">
    <h2>任务管理</h2>
    <el-table
      :data="tasks"
      style="width: 100%"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column prop="id" label="任务ID" width="80" />
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="startDate" label="开始时间" width="120" />
      <el-table-column prop="endDate" label="结束时间" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" width="180">
        <template #default="scope">
          <el-progress :percentage="scope.row.progress" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TaskRow',
  setup() {
    const tasks = ref([
      { id: 1, name: '任务1', startDate: '2023-05-01', endDate: '2023-05-10', status: '进行中', progress: 50 },
      { id: 2, name: '任务2', startDate: '2023-05-05', endDate: '2023-05-15', status: '已完成', progress: 100 },
      { id: 3, name: '任务3', startDate: '2023-05-12', endDate: '2023-05-20', status: '未开始', progress: 0 },
    ])

    const getStatusType = (status) => {
      switch (status) {
        case '进行中': return 'warning'
        case '已完成': return 'success'
        case '未开始': return 'info'
        default: return ''
      }
    }

    const headerCellStyle = {
      backgroundColor: '#003366',
      color: '#00ffff',
      fontWeight: 'bold'
    }

    const cellStyle = {
      backgroundColor: '#001529',
      color: '#ffffff'
    }

    const handleEdit = (index, row) => {
      console.log('编辑任务:', index, row)
      // 这里添加编辑任务的逻辑
    }

    const handleDelete = (index, row) => {
      console.log('删除任务:', index, row)
      // 这里添加删除任务的逻辑
    }

    return {
      tasks,
      getStatusType,
      headerCellStyle,
      cellStyle,
      handleEdit,
      handleDelete
    }
  }
}
</script>

<style scoped>
.task-row {
  padding: 20px;
  background-color: #001529;
  color: #ffffff;
}

h2 {
  color: #00ffff;
  margin-bottom: 20px;
}

.el-table {
  background-color: transparent !important;
}

.el-table::before {
  height: 0;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #002140 !important;
}

.el-button {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}

.el-button:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.el-button.el-button--danger {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.el-button.el-button--danger:hover {
  background-color: #ff7875;
  border-color: #ff7875;
}
</style>