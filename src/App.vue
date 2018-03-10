<template>
  <div id="app">
    <AppHeader :poi="poi_info"></AppHeader>
    <AppNav></AppNav>
    <router-view class="main"></router-view>
  </div>
</template>

<script>
import AppHeader from "@/components/header/header";
import AppNav from "@/components/nav/nav";

export default {
  name: "App",

  components: {
    AppHeader,

    AppNav
  },

  data() {
    return {
      poi_info: {}
    };
  },

  // using $axios at create hook

  created() {
    // save this
    let that = this;

    // 后台加载数据
    that.$axios
      .get("/api/order")

      .then(response => {
        let sourceData = response.data;

        if (sourceData.code == 0) {
          that.poi_info = sourceData.data.poi_info;
        }
      })

      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss">
// 导入字体图标
@import url("./common/css/icon.css");

.main {
  display: flex;
  position: absolute;
  width: 100%;
  top: 201px;
  left: 0;
  bottom: 51px;
  overflow: hidden;
}
</style>