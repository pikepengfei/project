/*<template>
  <div class="con">
    <!-- <el-alert title="说明：" type="info" :closable="false" 
      description="根据以下图片还原页面，涉及的图片在【assets】文件夹中，需要使用的mock数据在【data.json】中。
      1、右侧状态灯，根据state状态，切换不同样式，测试节点及动态节点下方箭头，可点击展开。2、鼠标hover在时间轴时蓝色辅助线显示。3、时间轴根据所有节点时间区间进行分割.4、进入页面时甘特图自动滚动到离当前时间最近的节点。"> 
    </el-alert>
    <img src="../assets/原型.png" class="pic"> -->
  </div>
</template>
<script>

export default {
  name: "home",
  components: {
    
  },
  data() {
    return {
      
      result:[],
      len:3
    };
  },
  created() {},
  mounted() {
  
  },
  methods: {
    
  },
};
</script>
<style scoped>
.con {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px;
}
.pic{
  width: 1200px;
  display: block;
  margin: auto;
  margin-top: 30px;
}
.con >>> .el-alert--info.is-light .el-alert__description,.con>>>.el-alert__title{
  color: #333;
  font-size: 16px;
}
</style>