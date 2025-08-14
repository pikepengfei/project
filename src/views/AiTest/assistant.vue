<template>
  <div class="home">
    <!-- <div class="back" @click="back"></div> -->
    <div class="headerTitle flex items-center justify-center">
      <!-- <img class="ml-[30px] w-auto h-[22px]" src="@/assets/images/aiTitle.png" alt="" /> -->
    </div>
    <div class="questionContainer flex items-start">
      <div class="myQuestion">
        <div class="input flex items-center">
          {{ props.keyword }}
        </div>
      </div>
      <div class="me">我</div>
    </div>

    <div class="replyContainer flex items-start">
      <div class="ai"></div>
      <reply :finish="finish" @to-detail="toDetail"></reply>
    </div>
  </div>
</template>
<script setup>
import reply from './reply.vue';

const emit = defineEmits(['back', 'to-detail', 'progress-end']);
const props = defineProps({
  keyword: String,
  finish: {
    type: Boolean,
    default: false,
  },
});

const toDetail = () => {
  emit('to-detail');
};
</script>

<style scoped lang="scss">
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
    margin: 0 auto 64px;
    display: flex;
    align-items: center;
    justify-content: center;
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
      width: 60px;
      height: 60px;
      background: url(@/assets/images/ai-icon-reply.png);
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
    background: url('@/assets/images/radius.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18px;

    .input {
      width: 919px;
      height: 121px;
      padding-left: 24px;
      border-radius: 18px;
      background: #f9faff;

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
