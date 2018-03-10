<template>
  <div class="shopcart" :class="selectedCount !== 0 ? 'highlight' : ''">
    <div class="left-wrapper">
      <div class="icon-wrapper" :class="selectedCount !== 0 ? 'highlight' : ''" @click="toggleList">
        <span class="icon mt-shopping_cart"></span>
        <span class="count" v-if="selectedCount !== 0">{{ selectedCount }}</span>
      </div>
      <div class="desc-wrapper" :class="selectedCount !== 0 ? 'highlight' : ''">
        <p class="total" v-if="selectedCount"><span style="margin-right: 3px">¥</span>{{ selectedTotal }}</p>
        <p class="note">另需{{ poi.shipping_fee_tip }}</p>
      </div>
    </div>
    <div class="right-wrapper" :class="selectedCount !== 0 ? 'highlight' : ''">
      <p>{{ selectedCount !== 0 ? '去结算' : poi.min_price_tip}}</p>
    </div>

    <!-- pop-up content list -->
    <div class="shoprcart-list-wrapper">
      <transition name="fade">
      <div class="shopcart-list" v-show="showShopcartList">
        <div class="list-top" v-if="poi.discounts2">
          <img :src="poi.discounts2[0].icon_url" />
          <span>{{ poi.discounts2[0].info }}</span>
        </div>
        <div class="list-head">
          <div class="left">1号口袋</div>
          <div class="right" @click="clearList">
            <span class="icon mt-bin"></span>
            <span>清空购物车</span>
          </div>
        </div>
        <div class="list-body" ref="listWrapper">
          <ul>
            <li class="items" v-for="item in selectedFoods" v-if="item.count" :key="item.id">
              <div class="info">
                <p class="name">{{ item.name }}</p>
                <p class="unit">{{ item.unit }}</p>
              </div>
              <div class="price"><span style="margin-right: 3px">¥</span>{{ item.min_price }}</div>
              <CartControl class="controls" :food="item"></CartControl>
            </li>
          </ul>
        </div>
        <div class="list-foot"></div>
      </div>
      </transition>

      <transition name="fade">
      <div class="bg-mask" v-if="showShopcartList" @click="toggleList"></div>
      </transition>
    </div>
  </div>
</template>


<script>
// 导入better-scroll
import BScroll from "better-scroll";
// 导入 CarControl组件
import CartControl from "@/components/cartcontrol/cartcontrol";

export default {
  components: {
    CartControl,
    BScroll
  },

  props: {
    poi: {
      type: Object
    },
    foods: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      showShopcartList: false,
      BScrollWrapper: {}
    };
  },

  methods: {
    toggleList() {
      let that = this;

      that.showShopcartList = !that.showShopcartList;

      // init or refresh better scroll
      that.$nextTick(() => {
        if (Object.keys(that.BScrollWrapper).length) {
          that.refreshScroll();
        } else {
          that.initScroll();
        }
      });
    },
    clearList() {
      this.selectedFoods.forEach(item => {
        item.count = 0;
      });
    },
    initScroll() {
      let list = this.$refs.listWrapper;

      this.BScrollWrapper = new BScroll(list, {
        type: 3,
        click: true
      });
    },
    refreshScroll() {
      this.BScrollWrapper.refresh();
    }
  },
  
  computed: {
    selectedTotal() {
      let total = 0;
      if (this.selectedFoods.length) {
        this.selectedFoods.forEach(item => {
          total += item.min_price * item.count;
        });
      }
      return total;
    },
    selectedCount() {
      let count = 0;
      if (this.selectedFoods.length) {
        this.selectedFoods.forEach(item => {
          count += item.count;
        });
      }
      return count;
    },
    selectedFoods() {
      let foods = [];

      if (this.foods.length) {
        this.foods.forEach(category => {
          category.spus.forEach(item => {
            if (item.count) {
              foods.push(item);
            }
          });
        });
      }
      return foods;
    }
  }
};
</script>


<style lang="scss">
.shopcart {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 51px;
  background: #514f4f;
  z-index: 1;

  &.highlight {
    background: #2d2b2a;
  }

  .left-wrapper {
    flex: 1;
    position: relative;
    padding-left: 60px;

    .icon-wrapper {
      position: absolute;
      left: 10px;
      top: -14px;
      width: 50px;
      height: 50px;
      background: #666666;
      border-radius: 50%;

      &.highlight {
        background: #ffbb22;

        .icon {
          color: #2d2b2a;
        }
      }

      .icon {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 28px;
        color: #c4c4c4;
      }

      .count {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        line-height: 15px;
        font-size: 9px;
        color: #fff;
        text-align: center;
        background: red;
      }
    }

    .desc-wrapper {
      position: relative;
      margin-left: 13px;
      height: 100%;
      overflow: hidden;

      &.highlight {
        .total {
          padding: 7px 0 2px 0;
          height: 20px;
          line-height: 20px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          opacity: 1;
          box-sizing: content-box;
        }

        .note {
          transform: translateY(5px);
        }
      }

      .total {
        opacity: 0;
      }
      .note {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 16px;
        font-size: 12px;
        font-weight: normal;
        color: #bab9b9;
      }
    }
  }

  .right-wrapper {
    flex: 0 0 110px;
    position: relative;

    &.highlight {
      background: #ffbb22;

      p {
        color: #2d2b2a;
      }
    }

    p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 15px;
      font-weight: bold;
      color: #bab9b9;
    }
  }

  // pop-up list
  .shoprcart-list-wrapper {
    z-index: -1;
  }

  .bg-mask {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.6);
    z-index: -2;
  }

  .shopcart-list {
    position: absolute;
    bottom: 51px;
    left: 0;
    width: 100%;
    padding: 60px 0 11px 0;
    background: #fff;
    z-index: -1;

    .list-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #646158;
      font-size: 12px;
      background: #f3e6c6;

      img {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
      }
    }
    .list-head {
      position: absolute;
      top: 30px;
      left: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      background: #f4f4f4;
      overflow: hidden;
      color: #646158;
      font-size: 12px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #53c123;
      }

      .left {
        float: left;
        height: 100%;
      }
      .right {
        float: right;
        height: 100%;

        // span {
        //     vertical-align: baseline;
        // }

        // .icon {
        //     vertical-align: middle;
        // }
      }
    }
    .list-body {
      max-height: 360px;
      overflow: hidden;

      li.items {
        position: relative;
        width: 100%;
        height: 60px;
        padding: 0 12px;
        border-bottom: 1px solid #eeeeee;
        overflow: hidden;

        .placeholder {
          p {
            line-height: 60px;
            font-size: 24px;
            text-align: center;
            color: #333333;
          }
        }

        .info {
          float: left;
          width: 190px;
          height: 100%;
          margin-right: 22px;

          .name {
            width: 100%;
            height: 35px;
            padding-top: 11px;
            line-height: 25px;
            font-size: 16px;
            color: #333333;

            // 超出两行现实省略号的方法
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .unit {
            width: 100%;
            padding: 6px 0 8px 0;
            font-size: 12px;
            color: #b4b4b4;
          }
        }
        .price {
          float: left;
          height: 100%;
          line-height: 60px;
          font-size: 14px;
          color: #333333;
        }
        .controls {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
        }
      }
    }
    .list-foot {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 11px;
      background: #f4f4f4;
    }
  }

  // pop-up list transition effect
  .fade-enter-active,
  .fade-leave-active {
    // opacity: 1;
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
