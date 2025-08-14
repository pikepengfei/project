<template>
  <div class="reply-container">
    <div class="reply-title" v-if="!animationEnd">好的,我正在根据您的需求生成报告...</div>
    <div class="reply-title" v-if="animationEnd">已完成</div>
    <!-- 四个进度 -->
    <div class="progress-container" ref="progress">
      <div class="progress-step">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 0 }">
          <div class="circle-inner1" v-if="!progress1[0]"></div>
          <div class="circle-ed1" v-if="progress1[0]"></div>
        </div>
        <div class="progress-title">数据整理</div>

        <div class="sub-item">
          <div class="item">
            整理 基础数据
            <div class="loading-dot" v-if="!progress1[1] && progressIndex === 0 && currentIndex === 1"></div>
            <el-button v-if="progress1[1]" type="success" :icon="Select" circle />
          </div>
          <div class="item">
            整理 动态数据
            <div class="loading-dot" v-if="!progress1[2] && progressIndex === 0 && currentIndex === 2"></div>
            <el-button v-if="progress1[2]" type="success" :icon="Select" circle />
          </div>
          <div class="item">
            整理 相关报告
            <div class="loading-dot" v-if="!progress1[3] && progressIndex === 0 && currentIndex === 3"></div>
            <el-button v-if="progress1[3]" type="success" :icon="Select" circle />
          </div>
        </div>
      </div>

      <div class="progress-line progress-line1" :class="{ 'active-line': progressIndex > 0 }">
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>

      <div class="progress-step">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 1 }">
          <div class="circle-inner2" v-if="!progress2[0]"></div>
          <div class="circle-ed2" v-if="progress2[0]"></div>
        </div>
        <div class="progress-title">选址动力分析</div>

        <div class="sub-item">
          <div class="item">
            企业选址动力综合分析
            <div class="loading-dot" v-if="!progress2[1] && progressIndex === 1 && currentIndex === 1"></div>
            <el-button v-if="progress2[1]" type="success" :icon="Select" circle />
          </div>
        </div>
      </div>

      <div class="progress-line progress-line2" :class="{ 'active-line': progressIndex > 1 }">
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>

      <div class="progress-step">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 2 }">
          <div class="circle-inner3" v-if="!progress3[0]"></div>
          <div class="circle-ed3" v-if="progress3[0]"></div>
        </div>
        <div class="progress-title">核心数据分析</div>

        <div class="sub-item">
          <div class="item">
            企业基础数据分析
            <div class="loading-dot" v-if="!progress3[1] && progressIndex === 2 && currentIndex === 1"></div>
            <el-button v-if="progress3[1]" type="success" :icon="Select" circle />
          </div>
          <div class="item">
            企业所属行业分析
            <div class="loading-dot" v-if="!progress3[2] && progressIndex === 2 && currentIndex === 2"></div>
            <el-button v-if="progress3[2]" type="success" :icon="Select" circle />
          </div>
          <div class="item">
            企业动态数据分析
            <div class="loading-dot" v-if="!progress3[3] && progressIndex === 2 && currentIndex === 3"></div>
            <el-button v-if="progress3[3]" type="success" :icon="Select" circle />
          </div>
        </div>
      </div>

      <div class="progress-line progress-line3" :class="{ 'active-line': progressIndex > 2 }">
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>

      <div class="progress-step progress-step--last">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 3 }">
          <div class="circle-inner4" v-if="!progress4[0]"></div>
          <div class="circle-ed4" v-if="progress4[0]"></div>
        </div>
        <div class="progress-title">报告生成</div>

        <div class="sub-item">
          <div class="item">
            撰写报告
            <div class="loading-dot" v-if="!progress4[1] && progressIndex === 3 && currentIndex === 1"></div>
            <el-button v-if="progress4[1]" type="success" :icon="Select" circle />
          </div>
          <div class="paper-card" v-if="progress4[1]" @click="goPaperDetail">
            <div class="paper-icon"></div>
            <span class="text">分析报告</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Select } from '@element-plus/icons-vue';

const props = defineProps({
  finish: {
    type: Boolean,
    default: false,
  },
});

const progress1 = ref([false, false, false, false]);
const progress2 = ref([false, false]);
const progress3 = ref([false, false, false, false]);
const progress4 = ref([false, false, false, false]);
const animationEnd = ref(false);

const emit = defineEmits(['to-detail']);

const progressIndex = ref(0);
const currentIndex = ref(0);

const changeAnimationEnd = (b) => {
  animationEnd.value = b;
};

const clear = () => {
  // 清除定时器，避免内存泄漏
  clearTimeout(controlProgress);
  clearTimeout(controlPros);
};

const controlPro = () => {
  changeAnimationEnd(false);
  const timeout = setInterval(() => {
    switch (progressIndex.value) {
      case 0:
        if (currentIndex.value === 4) {
          progressIndex.value++;
          currentIndex.value = 0;
          break;
        }
        progress1.value[currentIndex.value++] = true;
        break;
      case 1:
        if (currentIndex.value === 2) {
          progressIndex.value++;
          currentIndex.value = 0;
          break;
        }
        progress2.value[currentIndex.value++] = true;
        break;
      case 2:
        if (currentIndex.value === 4) {
          progressIndex.value++;
          currentIndex.value = 0;
          break;
        }
        progress3.value[currentIndex.value++] = true;
        break;
      case 3:
        if (props.finish) {
          if (currentIndex.value === 4) {
            progressIndex.value++;
            currentIndex.value = 0;
            break;
          }
          progress4.value[currentIndex.value++] = true;
          changeAnimationEnd(true);
          break;
        }
        break;
      default:
        clear();
        // 如果progressIndex超出了预期范围，可以重置它或执行其他逻辑
        //   progressIndex.value = 0;
        //   currentIndex.value = 0;
        break;
    }
  }, 1000);
};

//控制ai报告模块出现在文字动画完成之后
const progress = ref(null);
const addClassAfterDelay = () => {
  // 使用原生JavaScript添加类名
  if (progress.value) {
    progress.value.classList.add('new-progress');
  }
};
const controlProgress = setTimeout(addClassAfterDelay, 2500);
const controlPros = setTimeout(controlPro, 2500);

const goPaperDetail = () => {
  emit('to-detail');
};

onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.reply-container {
  width: 970px;
  height: 420px;
  padding-top: 20px;
  font-weight: 500;
  font-size: 20px;
  color: #222222;
  background: #f9faff;
  border-radius: 18px;
  border: 6px solid #ffffff;

  .reply-title {
    margin-bottom: 36px;
    margin-left: 16px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    animation: typing 4s steps(47, end) forwards;
  }

  @keyframes typing {
    0% {
      width: 0;
    }

    100% {
      width: 100%;
    }
  }
}

.progress-container {
  width: 100%;
  position: relative;
  visibility: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 16px;

  &.new-progress {
    visibility: visible;
  }
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  // width: 200px;
  min-width: 230px;

  z-index: 2;



  .circle {
    width: 66px;
    height: 66px;
    border: 5px solid #2970ff;
    border-radius: 50%;
    background: #f9faff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;

    .circle-inner1,
    .circle-inner2,
    .circle-inner3,
    .circle-inner4 {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('@/assets/images/loading.png');
      background-size: cover;
      animation: rotate 1s linear infinite;
    }

    .circle-ed1 {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('@/assets/images/active_1.png');
      background-size: cover;
    }

    .circle-ed2 {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('@/assets/images/active_2.png');
      background-size: cover;
    }

    .circle-ed3 {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('@/assets/images/active_3.png');
      background-size: cover;
    }

    .circle-ed4 {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('@/assets/images/active_4.png');
      background-size: cover;
    }

    &.inactive-circle {
      background: #ffffff;
      border: 3px solid #dce2ea;

      .circle-inner2 {
        background: url('@/assets/images/inactive_2.png');
        animation: none;
      }

      .circle-inner3 {
        background: url('@/assets/images/inactive_3.png');
        animation: none;
      }

      .circle-inner4 {
        background: url('@/assets/images/inactive_4.png');
        animation: none;
      }
    }
  }

  .progress-title {
    font-weight: 500;
    font-size: 18px;
    color: #222222;
    margin-bottom: 36px;
    text-align: center;
  }

  .sub-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // width: 100%;

    .item {
      font-weight: 400;
      font-size: 18px;
      color: #5a5a5a;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .loading-dot {
        width: 8px;
        height: 8px;
        background: #5a5a5a;
        border-radius: 50%;
        margin-left: 6px;
        animation: scaleAnimation 1.5s ease-in-out infinite alternate;
      }

      .el-button {
        width: 14px;
        height: 14px;
        background: #d83e34;
        border: 3px solid #d83e34;
        margin-left: 6px;
      }
    }

    .paper-card {
      width: 200px;
      height: 76px;
      background: #ffffff;
      box-shadow: 0px 5px 9px 0px rgba(52, 54, 75, 0.05);
      border-radius: 12px;
      border: 1px solid #eeeeee;
      display: flex;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0px 8px 15px 0px rgba(52, 54, 75, 0.1);
        transform: translateY(-2px);
      }

      .paper-icon {
        width: 32px;
        height: 34px;
        margin-right: 12px;
        background: url('@/assets/images/paper.png');
        background-size: cover;
      }

      .text {
        font-weight: 400;
        font-size: 18px;
        color: #016aea;
        text-align: left;
      }
    }
  }
}

.progress-line {
  display: flex;
  align-items: center;
  position: absolute;
  top: 33px;
  transform: translateY(-50%);
  z-index: 1;

  &.progress-line1 {
    left: 159px;
  }

  &.progress-line2 {
    left: 391px;
  }

  &.progress-line3 {
    left: 622px;
  }

  .gray-line {
    width: 83px;
    height: 2px;
    background-color: #dce2ea;
  }

  .gray-sanjiao {
    border: transparent solid 10px;
    border-left: 10px #dce2ea solid;
    margin-right: -10px;
  }

  &.active-line {
    .gray-line {
      background: linear-gradient(231deg, #1966ff 100%, #00cbff 0%);
    }

    .gray-sanjiao {
      border-left: 10px #2970ff solid;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
}
</style>
