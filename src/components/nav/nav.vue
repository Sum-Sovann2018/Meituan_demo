<template>
  <div class="nav-bar">
		<router-link to="/order" class="nav-item">点菜</router-link>
		<router-link to="/rating" class="nav-item">评价<span v-show="commentCount > 0">({{ commentCount }})</span></router-link>
		<router-link to="/seller" class="nav-item">卖家</router-link>
  </div>
</template>

<script>
export default {
  props: {
    commentCount: {
      type: Number,
      default: 0,
    }
  }
  
};
</script>


<style lang="scss">
.nav-bar {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eeeeee;

  .nav-item {
    flex: 1 0 auto;
    position: relative;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 13px;
    color: #666666;
    text-decoration: none;

    &.active {
      color: #ffbb22;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 15px;
        height: 2px;
        background: #ffbb22;
        transform: translateX(-50%);
      }
    }
  }
}
</style>

