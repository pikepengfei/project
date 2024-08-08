<template>
  <div class="task-control-platform">
     <div class="task-management-platform">
    <header>
      <div class="time-display">
        <span class="time">{{ currentTime }}</span>
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="status-lights">
        <div class="status-light" :class="{ 'active': statusLight === 'green' }"></div>
        <div class="status-light" :class="{ 'active': statusLight === 'yellow' }"></div>
        <div class="status-light" :class="{ 'active': statusLight === 'red' }"></div>
      </div>
    </header>

    <main>
      <div class="task-info">
        <div class="task-name">{{ taskInfo.name }}</div>
        <div class="task-duration">{{ taskInfo.duration }}</div>
      </div>

      <div class="gantt-chart">
        <div class="timeline">
          <div class="timeline-marker" v-for="marker in timelineMarkers" :key="marker.id" :style="{ left: marker.position + '%' }">
            <div class="marker-label">{{ marker.label }}</div>
          </div>
        </div>
        <div class="gantt-bars">
          <div class="gantt-bar" v-for="bar in ganttBars" :key="bar.id" :style="{ left: bar.startDate + '%', width: bar.duration + '%' }">
            <div class="bar-label">{{ bar.label }}</div>
            <div class="bar-arrow" @click="toggleBarDetails(bar)"></div>
          </div>
        </div>
        <div class="gantt-details" v-if="selectedBar">
          <div class="detail-item">
            <label>Start Date:</label>
            <span>{{ selectedBar.startDate }}</span>
          </div>
          <div class="detail-item">
            <label>End Date:</label>
            <span>{{ selectedBar.endDate }}</span>
          </div>
          <div class="detail-item">
            <label>Duration:</label>
            <span>{{ selectedBar.duration }}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span>{{ selectedBar.status }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
    <!-- <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          dasdfasdfa
        </div>
      </el-col>
      <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    </el-row> -->

    <!-- <div class="sidebar">
      <div
        v-for="(item, index) in navItems"
        :key="index"
        :class="['nav-item', { active: currentNavIndex === index }]"
        @click="handleNavClick(index)"
      >
        <img :src="item.icon" class="nav-icon" />
        <span>{{ item.title }}</span>
      </div>
    </div>

       <el-aside width="200px" class="left-nav">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#1a202e"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><document /></el-icon>
            <span>任务管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

    <div class="left-nav">
      <div class="nav-item">
        <img src="@/assets/home/menu-icon-home-checked.png" alt="首页" />
        <span>首页</span>
      </div>
      <div class="nav-item active">
        <img src="@/assets/home/menu-icon-task-checked.png" alt="任务管理" />
        <span>任务管理</span>
      </div>
    </div>




    <div class="right-status" :style="{ backgroundImage: `url(${statusBg})` }">
      <div class="status-header">
        <span>张三</span>
        <span class="percentage">{{ task.percentageStr }}</span>
      </div>
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: task.percentageStr, backgroundColor: '#39D5B8' }"
        ></div>
      </div>
    </div>-->
  </div> 
</template>

<script>
// import headerBg from '@/assets/public/flow/flow-state-ywc.png';
// import statusBg from '@/assets/public/flow/flow-state-ywc.png';
// import data from './data.json';
// import { ref, onMounted } from 'vue';
// import { useElementSize } from '@vueuse/core';

export default {
  // setup() {
  //   const currentTime = ref('');
  //   const currentDate = ref('');
  //   const statusLight = ref('green');
  //   const taskInfo = ref(data.taskInfo);
  //   const timelineMarkers = ref([]);
  //   const ganttBars = ref([]);
  //   const selectedBar = ref(null);
  //   const { width: chartWidth } = useElementSize(ref());

  //   const updateTime = () => {
  //     const now = new Date();
  //     currentTime.value = now.toLocaleTimeString();
  //     currentDate.value = now.toLocaleDateString();
  //   };

  //   const toggleBarDetails = (bar) => {
  //     selectedBar.value = selectedBar.value === bar ? null : bar;
  //   };

  //   onMounted(() => {
  //     updateTime();
  //     setInterval(updateTime, 1000);

  //     // 计算时间轴标记的位置
  //     const startDate = new Date(data.taskInfo.startDate);
  //     const endDate = new Date(data.taskInfo.endDate);
  //     const totalDuration = endDate.getTime() - startDate.getTime();
  //     data.timeline.forEach((marker, index) => {
  //       const markerDate = new Date(marker.date);
  //       const markerPosition = ((markerDate.getTime() - startDate.getTime()) / totalDuration) * 100;
  //       timelineMarkers.value.push({ id: index, label: marker.label, position: markerPosition });
  //     });

  //     // 计算甘特图条的位置和宽度
  //     data.tasks.forEach((task, index) => {
  //       const taskStart = new Date(task.startDate);
  //       const taskEnd = new Date(task.endDate);
  //       const taskDuration = taskEnd.getTime() - taskStart.getTime();
  //       const taskPosition = ((taskStart.getTime() - startDate.getTime()) / totalDuration) * 100;
  //       const taskWidth = (taskDuration / totalDuration) * 100;
  //       ganttBars.value.push({ id: index, label: task.name, start: taskPosition, duration: taskWidth, start: task.startDate, end: task.endDate, status: task.status });
  //     });

  //     // 滚动到当前时间最近的节点
  //     const currentDateTime = new Date().getTime();
  //     const nearestBar = ganttBars.value.reduce((nearest, bar) => {
  //       const barDateTime = new Date(bar.startDate).getTime();
  //       const distance = Math.abs(currentDateTime - barDateTime);
  //       return distance < Math.abs(currentDateTime - new Date(nearest.start).getTime()) ? bar : nearest;
  //     }, ganttBars.value[0]);
  //     const nearestBarPosition = ((new Date(nearestBar.start).getTime() - startDate.getTime()) / totalDuration) * chartWidth.value;
  //     window.scrollTo({ left: nearestBarPosition - chartWidth.value / 2, behavior: 'smooth' });
  //   });

  //   return {
  //     currentTime,
  //     currentDate,
  //     statusLight,
  //     taskInfo,
  //     timelineMarkers,
  //     ganttBars,
  //     selectedBar,
  //     toggleBarDetails
  //   };
  // }
  // data() {
  //   return {
  //     headerBg,
  //     statusBg,
  //     task: data.data.task,
  //     testNodes: data.data.testNodes,
  //     dynamicNodes: data.data.dynamicNodes,
  //     navItems : [
  //     { title: '首页', icon: 'assets/home.png' },
  //     { title: '任务管理', icon: 'assets/task.png' }
  //     ]
  //   };
  // },
  // computed: {
  //   timeLineDates() {
  //     const startDate = new Date(this.task.startDate);
  //     const endDate = new Date(this.task.endDate);
  //     const dates = [];
  //     for (
  //       let date = new Date(startDate);
  //       date <= endDate;
  //       date.setDate(date.getDate() + 1)
  //     ) {
  //       dates.push(this.formatDate(date));
  //     }
  //     return dates;
  //   },
  // },
  // methods: {
  //   formatDate(date) {
  //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //     const day = date.getDate().toString().padStart(2, '0');
  //     return `${month}月${day}日`;
  //   },
  //   calculateNodeProgress(node) {
  //     const startDate = new Date(node.startDate);
  //     const endDate = new Date(node.endDate);
  //     const today = new Date();
  //     const totalDays =
  //       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  //     const passedDays =
  //       (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  //     return Math.min(Math.max((passedDays / totalDays) * 100, 0), 100);
  //   },
  //   getNodeColor(state) {
  //     switch (state) {
  //       case 2:
  //         return '#39D5B8';
  //       case 3:
  //         return '#F6E37B';
  //       default:
  //         return '#1A202E';
  //     }
  //   },
  // },
};
</script>

<style scoped>
.task-control-platform{
  background-image: url('../assets/public/dialog-bg.png'); 
  background-repeat: repeat;
  background-attachment: fixed;  
  background-size: cover; 
  height: 100vh; 
  margin: 0; 
  padding: 0; 
}
</style>