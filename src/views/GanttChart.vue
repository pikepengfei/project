<template>
  <div class="gantt-chart">
    <div class="test-all">
      <div class="task-info">
        <div class="task-title">
          <el-image
            :src="task_icon"
            style="width: 20px; height: 20px"
          ></el-image>
          <p style="margin-left: 10px">W07-10任务 （2024年7月-2025年8月）</p>
        </div>
        <div class="task-progress">
          <p>任务进行中</p>
          <div class="progress-bar-container">
            <div
              class="progress-bar"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
          <p>完成度{{ completionPercentage }}%</p>
        </div>
      </div>
      <div class="task-schedule">
        <div class="task-imformation">
          <div class="task-title-lim">
            <el-image
              :src="task_2"
              style="width: 20px; height: 20px"
            ></el-image>
            <p style="margin-left: 10px">任务介绍：</p>
          </div>
          <div style="width: 80%; margin-top: 10px">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              euismod bibendum laoreet. Proin gravida dolor sit amet lacus
              accuman et viverra justo commodo. Pron sodales pulvinar tempor.
              Cum socils natoque penatibus et magnis dis partunent montes,
              nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra
              vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget
            </p>
          </div>
        </div>
        <div class="devise-type">
          <div class="task-title-lim">
            <el-image
              :src="task_3"
              style="width: 20px; height: 20px"
            ></el-image>
            <p style="margin-left: 10px">型号发次：Y1</p>
          </div>
          <div class="task-title-lim">
            <el-image
              :src="task_4"
              style="width: 20px; height: 20px"
            ></el-image>
            <p style="margin-left: 10px">星星型号：Zch-12</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-area">
      <!-- 这里将来可以添加实际的甘特图 -->
      <div class="gantt-chart-title">
        <el-image :src="task_5" style="width: 20px; height: 20px"></el-image>
        <p>测试节点</p>
        <el-image :src="task_6" style="width: 20px; height: 20px"></el-image>
      </div>
      <div class="gantt-chart-content">
        <g-gantt-chart
          chart-start="2021-07-12 12:00"
          chart-end="2021-07-14 12:00"
          precision="hour"
          bar-start="myBeginDate"
          bar-end="myEndDate"
        >
          <g-gantt-row label="My row 1" :bars="row1BarList" />
          <g-gantt-row label="My row 2" :bars="row2BarList" />
        </g-gantt-chart>
        <!-- <g-gantt
          :tasks="testNodes"
          :date-format="'YYYY-MM-DD'"
          :row-height="40"
          :bar-height="30"
          :precision="'day'"
          :hide-dates="false"
          :start-date="startDate"
          :end-date="endDate"
        >
          <template #bar="{ task }">
            <g-gantt-row
              :label="task.name"
              :start="task.startDate"
              :end="task.endDate"
              :progress="task.progress"
              :style="getTaskStyle(task)"
            /> 
          </template>
        </g-gantt> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import tasksData from "./data.json";
export default {
  name: "GanttChart",
  setup() {
    const completionPercentage = ref(30); // 这里可以根据实际情况动态计算
    const task_icon = ref(require("../assets/public/icon/flow-name-icon.png"));
    const task_2 = ref(require("../assets/public/icon/flow-des-icon.png"));
    const task_3 = ref(require("../assets/public/icon/flow-rocket-icon.png"));
    const task_4 = ref(require("../assets/public/icon/flow-moon-icon.png"));
    const task_5 = ref(require("../assets/public/title-left.png"));
    const task_6 = ref(require("../assets/public/title-right.png"));

    const row1BarList = ref([
      {
        myBeginDate: "2021-07-13 13:00",
        myEndDate: "2021-07-13 19:00",
        ganttBarConfig: {
          // each bar must have a nested ganttBarConfig object ...
          id: "unique-id-1", // ... and a unique "id" property
          label: "Lorem ipsum dolor",
        },
      },
    ]);
    const row2BarList = ref([
      {
        myBeginDate: "2021-07-13 00:00",
        myEndDate: "2021-07-14 02:00",
        ganttBarConfig: {
          id: "another-unique-id-2",
          hasHandles: true,
          label: "Hey, look at me",
          style: {
            // arbitrary CSS styling for your bar
            background: "#e09b69",
            borderRadius: "20px",
            color: "black",
          },
        },
      },
    ]);

    const taskData = ref(tasksData);

    const startDate = computed(() => taskData.value.data.task.startDate);
    const endDate = computed(() => taskData.value.data.task.endDate);
    const testNodes = taskData.value.data.testNodes.map((node) => ({
      ...node,
      progress: 0,
      type: "testNode",
    }));

    const getTaskStyle = (task) => {
      let backgroundColor;
      switch (task.state) {
        case 2:
          backgroundColor = "#4CAF50"; // 进行中
          break;
        case 3:
          backgroundColor = "#2196F3"; // 已完成
          break;
        default:
          backgroundColor = "#FFA500"; // 未开始或其他状态
      }
      return { backgroundColor };
    };
    onMounted(() => {
      console.log("testNodes", testNodes);
    });
    return {
      completionPercentage,
      task_icon,
      task_2,
      task_3,
      task_4,
      task_5,
      task_6,

      row1BarList,
      row2BarList,
      testNodes,
      taskData,
      startDate,
      endDate,
      getTaskStyle,
    };
  },
};
</script>

<style scoped>
.gantt-chart-content {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}

.g-gantt {
  font-family: Arial, sans-serif;
}

.g-gantt-row {
  border-bottom: 1px solid #2c3e50;
}

.g-gantt-row-label {
  color: #ecf0f1;
}

.g-gantt-grid {
  stroke: #34495e;
}

.g-gantt-time-axis {
  fill: #2c3e50;
  color: #ecf0f1;
}

.gantt-chart-title {
  display: flex;
}

.gantt-chart {
  height: 100%;
  width: 100%;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
}

.progress-bar-container {
  width: 200px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  transition: width 0.5s ease-in-out;
}

.chart-area {
  flex-grow: 1;
  /* padding: 20px; */
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #001529;
  background-image: url("../assets/public/info-left.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 60%;
  flex-direction: column;
}

.placeholder {
  font-size: 24px;
  color: #888;
}
.task-schedule {
  display: flex;
  height: 100px;
}
.task-imformation {
  background-image: url("../assets/public/view-des-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  margin: 10px;
  width: 70%;
}
.devise-type {
  background-image: url("../assets/public/view-des-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 30%; /* 设置为30% */
  margin: 10px;
}
.task-title {
  display: flex;
  margin-left: 10px;
}
.task-title-lim {
  margin: 10px;
  display: flex;
}
.task-info {
  height: 50px;
  background-image: url("../assets/public/view-name-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  /* width: 40%; */
  margin: 10px;
  /* background-color: #002140; */
}
.test-all {
  background-image: url("../assets/public/view-top-bg.png");
  padding-top: 1px;
  background-repeat: repeat;
  background-size: 100% 100%;
  padding-bottom: 1px;
}
.placeholder {
  font-size: 24px;
  color: #888;
}

h2 {
  color: #00ffff;
  margin-bottom: 20px;
}

.el-table {
  background-color: transparent;
  color: #fff;
}

.el-table th {
  background-color: #003366;
  color: #00ffff;
}

.el-table td {
  background-color: #002140;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #004080;
}
</style>