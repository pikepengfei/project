<template>
  <div>
    <div class="home flex-col items-center" v-if="!taggle">
      <div class="headerTitle"></div>
      <div class="logo">
        <img src="/src/assets/images/home.gif" />
        <div class="gifTitle"></div>
      </div>
      <div class="myQuestion">
        <div class="input flex flex-row justify-between items-center" @keyup.enter="goAssitant">
          <el-image src="/src/assets/images/ai.png"></el-image>
          <!-- <el-input v-model="input" placeholder="请告诉我您的需求，如：“帮我找一个能做生物医药生产，性价比高的厂房”"/> -->
          <el-select
            v-model="input"
            filterable
            remote
            reserve-keyword
            placeholder="请告诉我您的需求，如：“帮我找一个能做生物医药生产，性价比高的厂房”"
            :remote-method="getList"
            :loading="loadings"
          >
            <el-option v-for="item in options" :key="item.value" :value="item.value" />
          </el-select>
          <el-image src="/src/assets/images/plane.png" @click="goAssitant"></el-image>
        </div>
      </div>
    </div>
    <div v-if="taggle">
      <assistant :input="input" @back="back"></assistant>
    </div>
  </div>
</template>
<script setup>
import { onBeforeUnmount, watch } from 'vue';
import assistant from './assistant.vue';
import { searchEnterprise } from '@/api/business/report';

const router = useRouter();

const input = ref('');
const taggle = ref(false);
const options = ref([
  { label: '', value: '今晚打老虎' },
  { label: '', value: '今晚打老狗' },
  { label: '', value: '今晚打虎b' },
  { label: '', value: '今晚打完达山一号' },
]);
const loadings = ref(false);
const goAssitant = () => {
  // if(input.value){
  //     router.push({path:'/AI/assistant',query:{input:input.value}});
  // }
  console.log(input.value, taggle.value, 'inputinputinput');
  if (input.value) {
    taggle.value = true;
  }
};

const back = () => {
  taggle.value = false;
  input.value = '';
};

const getList = () => {
  // console.log('fklsdjflajldfjlajsdlf');
  // loadings.value = true;
  // options.value.push({label:'',value:'今晚打老虎'});
  // let res = await searchEnterprise();
  // console.log(res,'resresresresres')
  // loadings.value = false;
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100vh;
  padding-top: 22px;
  background: linear-gradient(25deg, rgba(255, 255, 255, 0) 0%, #eaf4ff 100%),
    linear-gradient(332deg, rgba(255, 255, 255, 0) 0%, #eceaff 100%);
  position: relative;
  display: flex;
  // top: -30px;
  // background: #fff;

  .headerTitle {
    width: 200px;
    height: 22px;
    background: url('@/assets/images/aiTitle.png');
    background-size: cover;
    margin: 0 auto 64px;
  }

  .logo {
    img {
      width: 536px;
      height: 280px;
      background: #f9faff;
      position: relative;
      left: -50px;
    }
    .gifTitle {
      width: 488px;
      height: 64.5px;
      background: url('@/assets/images/gifTitle.png');
      background-size: cover;
      margin: 0 auto;
      position: relative;
      top: -18px;
    }
  }

  .myQuestion {
    position: absolute;
    bottom: 142px;
    width: 925px;
    height: 127px;
    // border: 3px solid;
    border-radius: 18px;
    background: linear-gradient(
      90deg,
      rgba(4, 120, 255, 1),
      rgba(122, 239, 237, 1),
      rgba(229, 68, 57, 1)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18px;

    .input {
      width: 919px;
      height: 121px;
      border-radius: 18px;
      background: #f9faff;
      padding-left: 24px;
      padding-right: 24px;

      .el-image {
        width: 52px;
        height: 55px;
      }

      :deep(.el-select__wrapper) {
        background: #f9faff;
        border: none;
        border-radius: none;
        box-shadow: none;
        position: relative;
        top: -26px;
        // .el-input__inner{
        //     height: 79px;
        // }
      }
    }
  }
}
</style>
