<template>
  <el-config-provider
    :button="{autoInsertSpace: false}"
    :locale="$i18n.messages[$i18n.locale].el">
    <router-view></router-view>
  </el-config-provider>
</template>

<script>

export default {
  name: "App",
  created() {},
  mounted(){
    
  },
  methods:{
   
  }
};
</script>

<style lang="scss">
@import "@/style/style.scss";
@import "@/style/theme/dark.scss";
</style>
