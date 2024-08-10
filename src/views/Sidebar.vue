<template>
  <el-menu
    :default-active="activeIndex"
    class="sidebar-menu"
    @select="handleSelect"
    :background-color="transparent"
  >
    <el-menu-item index="1" class="custom-menu-item">
      <el-image :src="activeIndex === '1' ? homeIconChecked : homeIcon"></el-image>
      <span>首页</span>
    </el-menu-item>
    <el-menu-item index="2" class="custom-menu-item">
      <el-image :src="activeIndex === '2' ? taskIconChecked : taskIcon"></el-image>
      <span>任务管理</span>
    </el-menu-item>
    <!-- 可以根据需要添加更多菜单项 -->
  </el-menu>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Sidebar',
  setup(props, { emit }) {
    const activeIndex = ref('1')
    const homeIcon = ref(require('../assets/home/menu-icon-home.png'))
    const homeIconChecked = ref(require('../assets/home/menu-icon-home-checked.png'))
    const taskIcon = ref(require('../assets/home/menu-icon-task.png'))
    const taskIconChecked = ref(require('../assets/home/menu-icon-task-checked.png'))
    
    const handleSelect = (key, keyPath) => {
      console.log(keyPath);
      
      activeIndex.value = key
      emit('page-change', key)
    }

    return {
      activeIndex,
      homeIcon,
      homeIconChecked,
      taskIcon,
      taskIconChecked,
      handleSelect
    }
  }
}
</script>

<style scoped>
.sidebar-menu {
  height: 80%;
  border-right: none;
  width: 100px;
  background-image: url('../assets/home/left-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-menu-item * {
    vertical-align: top;
}
.custom-menu-item {
  width: 80px;
  height: 80px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/home/menu-hover.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 10px;
  padding: 0 !important;
}
.custom-menu-item .el-menu-item {

}
.custom-menu-item:hover,
.custom-menu-item.is-active {
  background-image: url('../assets/home/menu-checked.png');
  background-color: rgba(255, 0, 0, 0);
}

.custom-menu-item .el-image {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.custom-menu-item span {
  font-size: 12px;
  line-height: 1;
}

.custom-menu-item {
  color: #ffffff;
}

.custom-menu-item.is-active {
  color: #74E4F5; /* 绿色 */
}
</style>