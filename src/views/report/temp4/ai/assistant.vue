<template>
  <div class="home">
    <!-- <div class="back" @click="back"></div> -->
    <div
      class="headerTitle flex items-center justify-center ml-[30px] pt-[15px]"
    >
      <img
        class="w-[254px] h-[26.97px]"
        src="@/assets/images/dingbu.png"
        alt=""
      />
    </div>
    <div class="questionContainer flex items-start">
      <div class="myQuestion">
        <div
          class="input flex items-center company-display"
          :style="{
            whiteSpace: 'normal', // 允许换行
            textAlign: 'left', // 内容居左显示
          }"
        >
          {{ props.company }}
        </div>
      </div>
      <div class="me">我</div>
    </div>

    <div class="replyContainer flex items-start">
      <div class="ai"></div>
      <reply :finish="finish"></reply>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import reply from './reply.vue'

const emits = defineEmits(['back'])
const props = defineProps({
  keyword: {
    type: String,
    default: '', // 设置默认值为空字符串
  },
  finish: {
    type: Boolean,
    default: false,
  },
  company: {
    type: String,
    required: true,
  },
})

const route = useRoute()
console.log('子组件接收到的值:', props.company) //
const back = () => {
  emits('back')
}
</script>

<style scoped lang="scss">
.company-display {
  max-width: 700px;
  max-height: 45px; /* 最大宽度为500px */
  overflow-y: auto; /* 超出时显示垂直滚动条 */
  white-space: normal; /* 允许换行 */
  text-align: left;
}
.home {
  width: 100%;
  height: 100vh;
  position: relative;

  .back {
    width: 40px;
    height: 40px;
    position: relative;
    background-color: blue;
    // left: -300px;
  }

  .headerTitle {
  }

  .questionContainer {
    animation: move 0.5s forwards;
    position: absolute;
    right: 60px;
    bottom: 145px;
  }
  .replyContainer {
    position: absolute;
    bottom: 145px;
    left: 163px;
    // height: 127px;
    // overflow: hidden;
    animation: moveReply 0.5s forwards;
    // transition: all 1.5s ;
    .ai {
      width: 89px;
      height: 89px;
      background: url(@/assets/images/IP.png);
      background-size: cover;
      border-radius: 50%;
      margin-right: 18px;
    }
  }
  .myQuestion {
    position: relative;
    width: 772px;
    height: 148px;
    padding: 0 3px;
    background: url('@/assets/images/shuruk.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18px;

    .input {
      padding-left: 24px;
      border-radius: 18px;
      // background: #f9faff;
      font-weight: 400;
      font-size: 18px;
      color: #222222;
      line-height: 29px;
      text-align: left;
    }
  }

  .me {
    width: 70px;
    height: 70px;
    font-weight: 500;
    font-size: 22px;
    color: #ffffff;
    background: #4185f1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes move {
    0% {
      transform: translate(0, 0) scale(1); /* 初始位置：不移动，不缩小 */
    }
    100% {
      transform: translate(80px, -420px) scale(0.8);
    }
  }

  @keyframes moveReply {
    0% {
      transform: translate(0, 0); /* 初始位置：不移动，不缩小 */
      height: 37px;
    }
    33% {
      transform: translate(-130px, 40px);
      height: 37px;
    }
    66% {
      transform: translate(-130px, 40px);
      height: 137px;
    }
    100% {
      transform: translate(-130px, 40px);
      height: 426px;
    }
  }
}
</style>
