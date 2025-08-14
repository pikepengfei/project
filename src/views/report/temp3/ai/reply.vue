<template>
  <div class="reply-container">
    <div class="reply-title text-[20px] font-bold">
      好的,我正在根据您的需求生成选址报告(预计1～2分钟)...
    </div>
    <!-- 四个进度 -->
    <div ref="progress" class="progress-container flex flex-row space-between">
      <div class="progress1 flex flex-col items-center justify-center">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 0 }">
          <div v-if="!progress1[0]" class="circle-inner1"></div>
          <div v-if="progress1[0]" class="circle-ed1"></div>
        </div>
        <div class="progress-title">需求解析</div>

        <div class="subItem flex flex-col items-center">
          <div class="item flex flex-row items-center">
            语义解析
            <div
              v-if="!progress1[1] && progressIndex === 0 && currentIndex === 1"
              class="black"
            ></div>
            <el-button
              v-if="progress1[1]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            需求拆解
            <div
              v-if="!progress1[2] && progressIndex === 0 && currentIndex === 2"
              class="black"
            ></div>
            <el-button
              v-if="progress1[2]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            需求分析
            <div
              v-if="!progress1[3] && progressIndex === 0 && currentIndex === 3"
              class="black"
            ></div>
            <el-button
              v-if="progress1[3]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
        </div>
      </div>
      <div
        class="progress-line1 flex flex-row items-center"
        :class="{ 'active-line': progressIndex > 0 }"
      >
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>
      <div class="progress1 flex flex-col items-center justify-center">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 1 }">
          <div v-if="!progress2[0]" class="circle-inner2"></div>
          <!-- <el-button type="success" :icon="Check" circle v-if="progress2[0]" /> -->
          <div v-if="progress2[0]" class="circle-ed2"></div>
        </div>
        <div class="progress-title">数据整理</div>

        <div class="subItem flex flex-col items-center">
          <div class="item flex flex-row items-center">
            整理基础数据
            <div
              v-if="!progress2[1] && progressIndex === 1 && currentIndex === 1"
              class="black"
            ></div>
            <el-button
              v-if="progress2[1]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            整理园区数据
            <div
              v-if="!progress2[2] && progressIndex === 1 && currentIndex === 2"
              class="black"
            ></div>
            <el-button
              v-if="progress2[2]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            整理载体数据
            <div
              v-if="!progress2[3] && progressIndex === 1 && currentIndex === 3"
              class="black"
            ></div>
            <el-button
              v-if="progress2[3]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
        </div>
      </div>
      <div
        class="progress-line2 flex flex-row items-center"
        :class="{ 'active-line': progressIndex > 1 }"
      >
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>
      <div class="progress1 flex flex-col items-center justify-center">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 2 }">
          <div v-if="!progress3[0]" class="circle-inner3"></div>
          <!-- <el-button type="success" :icon="Check" circle v-if="progress3[0]" />-->
          <div v-if="progress3[0]" class="circle-ed3"></div>
        </div>
        <div class="progress-title">需求匹配</div>

        <div class="subItem flex flex-col items-center">
          <div class="item flex flex-row items-center">
            产业数据匹配
            <div
              v-if="!progress3[1] && progressIndex === 2 && currentIndex === 1"
              class="black"
            ></div>
            <el-button
              v-if="progress3[1]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            园区数据匹配
            <div
              v-if="!progress3[2] && progressIndex === 2 && currentIndex === 2"
              class="black"
            ></div>
            <el-button
              v-if="progress3[2]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div class="item flex flex-row items-center">
            载体数据匹配
            <div
              v-if="!progress3[3] && progressIndex === 2 && currentIndex === 3"
              class="black"
            ></div>
            <el-button
              v-if="progress3[3]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
        </div>
      </div>
      <div
        class="progress-line3 flex flex-row items-center"
        :class="{ 'active-line': progressIndex > 2 }"
      >
        <div class="gray-line"></div>
        <div class="gray-sanjiao"></div>
        <div class="gray-line"></div>
      </div>
      <div class="progress1 flex flex-col items-center justify-start">
        <div class="circle" :class="{ 'inactive-circle': progressIndex < 3 }">
          <div v-if="!progress4[0]" class="circle-inner4"></div>
          <!-- <el-button type="success" :icon="Check" circle v-if="progress4[0]" /> -->
          <div v-if="progress4[0]" class="circle-ed4"></div>
        </div>
        <div class="progress-title">报告生成</div>

        <div class="subItem flex flex-col items-center">
          <div class="item flex flex-row items-center flex-start">
            撰写报告
            <div
              v-if="!progress4[1] && progressIndex === 3 && currentIndex === 1"
              class="black"
            ></div>
            <el-button
              v-if="progress4[1]"
              type="success"
              :icon="Check"
              circle
            />
          </div>
          <div
            v-if="progress4[1]"
            v-stat="{
              type: 'click',
              category: 'ai_report',
              label: `ai-报告`,
              action: 'click',
            }"
            style="margin-right: 36px; cursor: pointer"
            class="paperIn flex items-center justify-center"
            @click="goPaperDetail"
          >
            <div class="paper-icon"></div>
            <span class="text">分析报告</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Check } from '@element-plus/icons-vue'
import { ref } from 'vue'
const props = defineProps({
  finish: {
    type: Boolean,
    default: false,
  },
})
const progress1 = ref([false, false, false, false])
const progress2 = ref([false, false, false, false])
const progress3 = ref([false, false, false, false])
const progress4 = ref([false, false, false, false])
const currentCompany = ref('')
const progressIndex = ref(0)
const currentIndex = ref(0)

const controlPro = () => {
  const timeout = setInterval(() => {
    switch (progressIndex.value) {
      case 0:
        if (currentIndex.value === 4) {
          progressIndex.value++
          currentIndex.value = 0
          break
        }
        progress1.value[currentIndex.value++] = true
        break
      case 1:
        if (currentIndex.value === 4) {
          progressIndex.value++
          currentIndex.value = 0
          break
        }
        progress2.value[currentIndex.value++] = true
        break
      case 2:
        if (currentIndex.value === 4) {
          progressIndex.value++
          currentIndex.value = 0
          break
        }
        progress3.value[currentIndex.value++] = true
        break
      case 3:
        if (props.finish) {
          const storedCompanyData = localStorage.getItem('companyData')
          if (storedCompanyData) {
            currentCompany.value = JSON.parse(storedCompanyData)
          }
          if (currentCompany.value) {
            if (currentIndex.value === 4) {
              progressIndex.value++
              currentIndex.value = 0
              break
            }
            progress4.value[currentIndex.value++] = true
            break
          }
        }
        break
      default:
        clear()
        // 如果progressIndex超出了预期范围，可以重置它或执行其他逻辑
        //   progressIndex.value = 0;
        //   currentIndex.value = 0;
        break
    }
  }, 1000)
}
const clear = () => {
  // 清除定时器，避免内存泄漏
  clearTimeout(controlProgress)
  clearTimeout(controlPros)
}

// 控制ai报告模块出现在文字动画完成之后
const progress = ref(null)
const addClassAfterDelay = () => {
  // 使用原生JavaScript添加类名
  if (progress.value) {
    progress.value.classList.add('new-progress')
  }
}
const controlProgress = setTimeout(addClassAfterDelay, 2500)
const controlPros = setTimeout(controlPro, 2500)

const goPaperDetail = () => {
  const storedCompanyData = localStorage.getItem('companyData') // {{ edit_1 }}
  if (storedCompanyData) {
    currentCompany.value = JSON.parse(storedCompanyData) // {{ edit_2 }}
    window.open(
      `/ai/ai-report?id=${currentCompany.value}&preview=true`,
      '_blank',
    )
  }
}

onMounted(() => {})

onBeforeUnmount(() => {
  // 清除定时器，避免内存泄漏
  clearTimeout(controlProgress)
  clearTimeout(controlPros)
})
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
  // padding-left: 16px;
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
    white-space: nowrap; /* 防止文字换行 */
    overflow: hidden; /* 隐藏超出容器的内容 */
    animation: typing 4s steps(47, end) forwards; /* 动画设置 */
    // border-right: 2px solid orange; /* 可选，用于显示动画进度 */
  }
  @keyframes typing {
    0% {
      width: 0; /* 初始宽度为0 */
    }
    100% {
      width: 100%; /* 最终宽度为100%，即显示全部文字 */
    }
  }

  .progress-line1 {
    position: absolute;
    top: 22px;
    left: 156px;
    .gray-line {
      width: 83px; /* 或者设置具体的宽度，如200px */
      height: 2px; /* 设置线条的高度，即粗细 */
      // border:#DCE2EA 1px solid;
      background-color: #dce2ea;
    }
    .gray-sanjiao {
      border: transparent solid 10px;
      border-left: 10px #dce2ea solid;
      margin-right: -10px;
    }
  }
  .progress-line2 {
    position: absolute;
    top: 22px;
    left: 397px;
    .gray-line {
      width: 83px; /* 或者设置具体的宽度，如200px */
      height: 2px; /* 设置线条的高度，即粗细 */
      // border:#DCE2EA 1px solid;
      background-color: #dce2ea;
    }
    .gray-sanjiao {
      border: transparent solid 10px;
      border-left: 10px #dce2ea solid;
      margin-right: -10px;
    }
  }
  .progress-line3 {
    position: absolute;
    top: 22px;
    left: 640px;
    .gray-line {
      width: 82px; /* 或者设置具体的宽度，如200px */
      height: 2px; /* 设置线条的高度，即粗细 */
      // border:#DCE2EA 1px solid;
      background-color: #dce2ea;
    }
    .gray-sanjiao {
      border: transparent solid 10px;
      border-left: 10px #dce2ea solid;
      margin-right: -10px;
    }
  }
  .active-line {
    .gray-line {
      width: 82px; /* 或者设置具体的宽度，如200px */
      height: 2px; /* 设置线条的高度，即粗细 */
      // border:1px linear-gradient( 231deg, #1966FF 0%, #00CBFF 100%) solid;
      background: linear-gradient(231deg, #1966ff 100%, #00cbff 0%);
    }
    .gray-sanjiao {
      border: transparent solid 10px;
      border-left: 10px #2970ff solid;
      margin-right: -10px;
    }
  }
}

.progress-container {
  width: 970px;
  position: relative;
  visibility: hidden;
  .progress1 {
    // margin-left: 70px;
    display: flex;
    justify-content: start;
    width: 320px;
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

      .el-button {
        width: 24px;
        height: 24px;
        // border: 5px solid #1966FF ;
        // border-left: #D83E34;
      }

      .circle-inner1 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #1966ff;
        // border-left: #d83e34;
        background: url('@/assets/images/loading.png');
        background-size: cover;
        animation: rotate 8s linear infinite;
      }
      .circle-ed1 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url('@/assets/images/active_1.png');
        background-size: cover;
      }

      .circle-inner2 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #1966ff;
        // border-left: #d83e34;
        background: url('@/assets/images/loading.png');
        background-size: cover;
        animation: rotate 1s linear infinite;
      }
      .circle-ed2 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url('@/assets/images/active_2.png');
        background-size: cover;
      }

      .circle-inner3 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #1966ff;
        // border-left: #d83e34;
        background: url('@/assets/images/loading.png');
        background-size: cover;
        animation: rotate 1s linear infinite;
      }
      .circle-ed3 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url('@/assets/images/active_3.png');
        background-size: cover;
      }

      .circle-inner4 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #1966ff;
        // border-left: #d83e34;
        background: url('@/assets/images/loading.png');
        background-size: cover;
        animation: rotate 1s linear infinite;
      }
      .circle-ed4 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url('@/assets/images/active_4.png');
        background-size: cover;
      }
    }
    .inactive-circle {
      width: 66px;
      height: 66px;
      background: #ffffff;
      border: 3px solid #dce2ea;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;

      .el-button {
        width: 24px;
        height: 24px;
        // display: none;
        // border: 5px solid #1966FF ;
        // border-left: #D83E34;
      }

      .circle-inner2 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #DCE2EA;
        background: url('@/assets/images/inactive_2.png');
        background-size: cover;
        // border-left: #d83e34;
        animation: none;
      }

      .circle-inner3 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #DCE2EA;
        background: url('@/assets/images/inactive_3.png');
        background-size: cover;
        // border-left: #d83e34;
        animation: none;
      }

      .circle-inner4 {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        // border: 5px solid #DCE2EA;
        background: url('@/assets/images/inactive_4.png');
        background-size: cover;
        // border-left: #d83e34;
        animation: none;
      }
    }

    .progress-title {
      font-weight: 500;
      font-size: 18px;
      color: #222222;
      margin-bottom: 36px;
    }

    .subItem {
      .item {
        font-weight: 400;
        font-size: 18px;
        color: #5a5a5a;
        margin-bottom: 18px;

        .black {
          width: 8px;
          height: 8px;
          background: #5a5a5a;
          border-radius: 50%;
          margin-left: 6px;
          animation: scaleAnimation 1.5s ease-in-out infinite alternate;
        }
        @keyframes scaleAnimation {
          0% {
            transform: scale(1); /* 原始大小 */
          }
          100% {
            transform: scale(0.5); /* 缩小到原始大小的一半 */
          }
        }

        .el-button {
          width: 14px;
          height: 14px;
          background: #d83e34;
          border: 3px solid #d83e34;
          margin-left: 6px;
        }
      }
      .paperIn {
        width: 200px;
        height: 76px;
        background: #ffffff;
        box-shadow: 0px 5px 9px 0px rgba(52, 54, 75, 0.05);
        border-radius: 12px;
        border: 1px solid #eeeeee;

        .paper-icon {
          width: 32px;
          height: 34px;
          margin-right: 12px;
          background: url('@/assets/images/part.png');
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
}
@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}
.new-progress {
  visibility: visible;
}
</style>
