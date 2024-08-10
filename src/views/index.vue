<template>

<div class="app-container">
     <!-- 顶部布局 -->
     <el-header>
      <el-row>
        <el-col :span="4" class="timeType">
          <p class="time">{{ currentTime }}</p>
          <p class="time">{{ currentDate }}</p>
        </el-col>
        <el-col :span="16">
           <el-image :src="headsrc"></el-image>
        </el-col>
        <el-col :span="4" class="login">
          <el-space alignment="center" :size="20">
          <p v-if="isLoggedIn">欢迎, {{ username }}</p>
          <el-button v-if="isLoggedIn" @click="logout" class="transparent-button" size="small"><el-image :src="exitsrc"></el-image></el-button>
          <el-button v-else @click="login" class="transparent-button" size="small">登录</el-button>
      </el-space>
    </el-col>
      </el-row>
    </el-header>

    <div class="app-main">
      <Sidebar class="app-sidebar" @page-change="handlePageChange"/>
      <main class="app-content">
        <!-- 根据当前页面显示不同内容 -->
        <component :is="currentPage" />
      </main>
    </div>
    <footer class="app-footer">
      <span>软件版本: v{{ version }}</span>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from './Sidebar.vue';
import tasksData from './data.json';
import { ElMessage } from 'element-plus'
import GanttChart from './GanttChart.vue'
import TaskRow from './TaskRow.vue'
export default {
  components: {
    Sidebar,
    GanttChart,
    TaskRow
  },
  setup() {
    const currentTime = ref('');
    const currentDate = ref('');
    const tasks = ref(tasksData);
    const headsrc = ref(require('../assets/home/head-line1.png'));
    const exitsrc = ref(require('../assets/home/outBtn.png'));
    
    const isLoggedIn = ref(false)
    const username = ref('')

    const login = () => {
      // 这里应该是实际的登录逻辑
      isLoggedIn.value = true
      username.value = '张三'
      ElMessage.success('登录成功')
    }

    const logout = () => {
      // 这里应该是实际的退出逻辑
      isLoggedIn.value = false
      username.value = ''
      ElMessage.info('已退出登录')
    }

    const updateDateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString();
      currentDate.value = now.toLocaleDateString();
    };
    
    const currentPage = ref('GanttChart') 

    const handlePageChange = (pageKey) => {
      switch(pageKey) {
        case '1':
        currentPage.value = 'GanttChart'  
      break
      case '2':
        currentPage.value = 'TaskRow'
      break

      }
    }

    let timer;

    onMounted(() => {
      updateDateTime();
      timer = setInterval(updateDateTime, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      currentTime,
      currentDate,
      tasks,
      headsrc,exitsrc,
      isLoggedIn,
      username,
      currentPage,
      handlePageChange,
      login,
      logout,
    };
  }
}
</script>

<style scoped>
@import './main.css';
.app-content{
  width: 90%;
  margin-left: 20px;
}
.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.app-sidebar {
  width: 125px;
  margin: 10px 0 0 20px;
  background-color: #002b4d;
  padding-top: 30px;
}

.transparent-button {
  background-color: transparent !important;
  border-color: transparent !important;
}
.login {
    display: flex;
    justify-content: flex-end;
}
.timeType{
    padding-left: 20px;
}
.rigth{
  background-color: red;
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #1E1E1E;
  color: #FFFFFF;
}
.app-container {
  background-image: url('../assets/public/dialog-bg.png'); 
  background-repeat: repeat;
  background-attachment: fixed;  
  background-size: cover; 
  height: 100vh; 
  margin: 0; 
  padding: 0; 
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #001529;
  color: #fff;
}
.sidebar {
  width: 200px;
  background-color: #f5f5f5;
}
.status-light {
  width: 20px;
  height: 20px;
  margin: 10px;
  border-radius: 50%;
}
.status-light.active {
  background-color: green;
}
.status-light.inactive {
  background-color: red;
}
.main-content {
  flex: 1;
  padding: 20px;
}
.timeline {
  position: relative;
  height: 100px;
  background-color: #e5e5e5;
}
.timeline-segment {
  display: inline-block;
  width: 100px;
  height: 100%;
  border-right: 1px solid #ccc;
}
.aux-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: blue;
}
/* Optional: Adjust styles as needed */
.el-header {
  width: 100%;
}

.time {
  margin: 0;
  font-size: 20PX;
}

.title {
  margin: 0;
  text-align: center;
}

.right-align {
  text-align: right;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>