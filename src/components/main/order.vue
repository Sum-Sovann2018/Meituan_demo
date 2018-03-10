<template>
  <div id="order-page">
    <!-- 左边导航边栏 -->
    <div class="side-nav" ref="orderSideNav">
      <ul class="nav">
        <li class="item nav-item-hook" :class="activeMenuIndex === 0? 'active' : ''" v-if="promo" @click="scrollToPosition(0)">
          <p>
            <img :src="promo.tag_icon" class="icon" v-if="promo.tag_icon"/>
            {{ promo.tag_name }}
          </p>
        </li>
        <li class="item nav-item-hook" v-for="(category, index) in food_spu" :key="category.id" :class="activeMenuIndex === index + 1? 'active' : ''" @click="scrollToPosition(index + 1)">
          <p>
            <img :src="category.icon" class="icon" v-if="category.icon"/>
            {{ category.name }}
          </p>
          <span class="indicator" v-show="categorySelectedFoodsCount(category) > 0">{{ categorySelectedFoodsCount(category) }}</span>
        </li>
      </ul>
    </div>

    <!-- 右边主体框 -->
    <div class="content-wrapper" ref="orderContentWrapper">
      <ul>
        <!-- 专场内容 -->
        <ul class="promo-wrapper list-item-hook">
          <li class="promo-item" v-for="image in promo.operation_source_list" :key="image.id">
            <img :src="image.pic_url" />
          </li>
        </ul>
        
        <!-- 分类内容 -->
        <li class="cate-item list-item-hook" v-for="category in food_spu" :key="category.id">
          <h3 class="cate-header">{{ category.name }}</h3>
          <ul>
            <li class="food-item" v-for="item in category.spus" :key="item.id" @click="clickThis(item)">
              <div class="food-image" :style="getFoodImgUrl(item)"></div>
              <div class="food-info">
                <h1 class="title">{{ item.name }}</h1>
                <div class="description" v-if="item.description">
                  <p>{{ item.description }}</p>
                </div>
                <div class="status">
                  <p>
                    <span>{{ item.month_saled_content }}</span>
                    <span>{{ item.praise_content }}</span>
                  </p>
                </div>
                <div class="hot-pick" v-if="item.product_label_picture">
                  <img :src="item.product_label_picture" />
                </div>
                <div class="price">
                  <p>
                    <span>¥{{ item.min_price }}</span>
                    <span>/{{ item.unit }}</span>
                  </p>
                </div>
              </div>
              <!-- carcontrol 组件 -->
              <CartControl class="controls" :food="item"></CartControl>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- shopcart组件 -->
    <Shopcart :poi="poi_info" :foods="food_spu"></Shopcart>

    <!-- food组件 -->
    <Food :food="clickedFood" ref="clickedFood" v-on:itemclosed="resetClickedFood"></Food>
  </div>
</template>

<script>
// 导入better-scroll
import BScroll from "better-scroll";
// 导入 Shopcart组件
import Shopcart from "@/components/shopcart/shopcart";
// 导入 CarControl组件
import CartControl from "@/components/cartcontrol/cartcontrol";
// 导入 Food组件
import Food from "@/components/food/food";

export default {
  // 声明本地子组件
  components: {
    Shopcart,
    CartControl,
    Food,
  },
  // 定义本地属性
  data() {
    return {
      // 用于存储后台数据的初始对象
      food_spu: [], //食品分类及对应分类包含的食品
      promo: {},    //专场信息
      poi_info: {}, //商家信息
      // DOM Cache
      foodCategoryList: {},
      navItemsList: {},
      clickedFood: {},
      // init objs to save better-scroll objs
      foodScroll: {},
      menuScroll: {},
      foodScrollY: 0,
      menuScrollY: 0,
      // height refs
      heightRnages: [0],
      // active menu class
      activeMenuIndex: 0
    };
  },

  methods: {
    // 获取food list item里面的食品图片
    getFoodImgUrl(item) {
      return `background-image: url("${item.picture}")`;
    },

    // 点击food item并打开food component页面
    clickThis(item) {
      this.clickedFood = item;

      // open item page
      // access the method on child component
      this.$refs.clickedFood.showItem();
    },

    // 重置被选中的food item
    resetClickedFood() {
      this.clickedFood = {};
    },

    // 初始化better-scroll
    // 必须初始化才能实现滚动
    initScroll() {
      // 通过$refs属性来获取DOM元素,这里获取的需要使用better-scroll元素的父级元素
      // 根据better-scroll的规则, scroll会作用于该父级元素的第一个子元素
      // div.parentWrapper
      // ..div.firstElelemt   --->只有第一个元素会实现better-scroll效果
      // ..div.otherElements
      let sideNav = this.$refs.orderSideNav;
      let contentWrapper = this.$refs.orderContentWrapper;

      // 把DOM list 元素保存到对应的本地属性
      // 用于给其他方法提供或者判定index, 来实现左右联动的效果
      this.foodCategoryList = contentWrapper.getElementsByClassName(
        "list-item-hook"
      );
      this.navItemsList = sideNav.getElementsByClassName("nav-item-hook");

      // 初始化BS实例
      // 把实例储存为本地属性
      this.menuScroll = new BScroll(sideNav, {
        probeType: 3, //滑动以及动态滚动(momentum)时, 都会被计算
        click: true   //可被点击
      });
      this.foodScroll = new BScroll(contentWrapper, {
        probeType: 3,
        click: true
      });

      // 绑定scroll事件
      // 搭档scroll触发时,对应的callback
      this.menuScroll.on("scroll", pos => {
        this.menuScrollY = Math.abs(Math.round(pos.y));
      });
      this.foodScroll.on("scroll", pos => {
        this.foodScrollY = Math.abs(Math.round(pos.y));
        // 根据滚动位置,动态设置active menu class
        this.activeMenuIndex = this.getScrollToIndex();
        // 根据active menu的位置,自动滚动,保持可视
        this.menuScroll.scrollToElement(
          this.navItemsList[this.activeMenuIndex - 3],
          500
        ); // 减3为了保持之前元素的可视
      });
    },

    // 计算出右边每个food category的DOM的clientHeight,并添加到heightRnages属性
    // 用于根据右边的滚动范围,判断左边对应的side nav item
    calcListItemHeightRanges() {
      let heightRange = 0;
      if (this.foodCategoryList.length) {
        // iterate the list and get the clientHeight of each item
        for (let i = 0; i < this.foodCategoryList.length; i++) {
          let elemHeight = this.foodCategoryList[i].clientHeight;
          heightRange += elemHeight;
          // save to heightRanges list
          this.heightRnages.push(heightRange);
        }
      }
    },

    // 滚动到指定的food category
    // 实现点击左边side nav, 右侧自动滚动到对应的food category
    scrollToPosition(index) {
      // 使用better-scroll的scrollToElement方法, 过度时长定义为0, 瞬时切换
      this.foodScroll.scrollToElement(this.foodCategoryList[index], 0);
      // used for active menu class
      this.activeMenuIndex = index;
    },

    // 根据右边商品区的滚动范围,计算左边side nav item list对应item的index
    // 实现左右部分的联动效果,滚动右边,自动选中左边对应的side nav item
    getScrollToIndex() {
      for (let i = 0; i < this.heightRnages.length - 1; i++) {
        if (
          this.foodScrollY >= this.heightRnages[i] &&
          this.foodScrollY < this.heightRnages[i + 1]
        ) {
          // return the index for class check
          return i;
        }
      }
    },

    // 计算指定category被选中item的个数
    // 用于显示side nav的选中商品的个数
    categorySelectedFoodsCount(category) {
      let count = 0;
      category.spus.forEach(item => {
        if (item.count) {
          count += item.count;
        }
      });
      return count;
    }
  },

  // 在create钩子处使用$axios后台加载数据
  // 并且初始化better-scroll
  created() {
    let that = this;

    that.$axios
      .get("/api/order")
      .then(response => {
        let sourceData = response.data;

        if (sourceData.code == 0) {
          that.food_spu = sourceData.data.food_spu_tags;
          that.promo = sourceData.data.container_operation_source;
          that.poi_info = sourceData.data.poi_info;

          // 为了确保DOM已经完全渲染, 在$nextTick的回调函数中加载BScroll初始项.
          that.$nextTick(() => {
            // better-scroll 初始化
            that.initScroll();

            // 获取list item 高度区间
            that.calcListItemHeightRanges();
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss">
.side-nav {
  flex: 0 0 85px;
  position: relative;
  width: 85px;
  height: 100%;
  overflow-y: hidden;

  .nav {
    display: block;
    padding: 0;
    margin: 0;
    width: inherit;
    height: auto;

    .item {
      display: block;
      position: relative;
      width: 100%;
      padding: 16px 23px 15px 10px;
      background: #fafafa;
      border-bottom: 1px solid #eeeeee;
      list-style-type: none;

      &.active {
        background: #fff;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          background: #ffbb22;
        }
      }

      &:last-child {
        border-bottom: 1px solid #eeeeee;
      }

      p {
        line-height: 17px;
        text-align: center;
        font-size: 13px;
        color: #333333;

        // 超出两行现实省略号的方法
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: text-top;
        }
      }

      .indicator {
        display: block;
        position: absolute;
        top: 50%;
        right: 5px;
        width: 17px;
        height: 17px;
        line-height: 17px;
        transform: translateY(-50%);
        background: #ffbb22;
        color: #333333;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
      }
    }
  }
}

.content-wrapper {
  flex: 0 1 auto;
  height: 100%;
  overflow-y: hidden;

  ul {
    // 专场内容
    .promo-wrapper {
      overflow: auto;

      li.promo-item {
        margin: 11px;

        img {
          width: 100%;
          // border-radius: 7px;
        }
      }
    }
    // 分类内容
    li.cate-item {
      border-top: 1px solid #eeeeee;
      overflow: auto;

      h3.cate-header {
        position: relative;
        padding-left: 10px;
        margin: 11px;
        font-size: 13px;
        font-weight: 400;
        color: #333333;

        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 2px;
          height: 10px;
          transform: translateY(-50%);
          background: #ffbb22;
        }
      }
    }
  }

  // 从cate-item中调出
  .food-item {
    display: flex;
    position: relative;
    padding: 11px;
    // border-bottom: 1px solid #eeeeee;
    align-items: center;

    .food-image {
      flex: 0 0 63px;
      margin-right: 11px;
      height: 63px;
      //
      background-size: cover;
      background-position: center;
    }

    .food-info {
      flex: 0 1 auto;

      .title {
        padding-right: 27px;
        margin-bottom: 4px;
        font-size: 16px;
        line-height: 21px;
        font-weight: 400;
        color: #333333;
      }
      .description {
        margin-bottom: 4px;

        p {
          font-size: 12px;
          line-height: 19px;
          color: #bfbfbf;

          // 超出一行现实省略号的方法
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .status {
        margin-bottom: 4px;

        p {
          font-size: 11px;
          line-height: 18px;
          color: #bfbfbf;
        }
      }
      .hot-pick {
        margin-bottom: 4px;

        img {
          height: 15px;
          width: auto;
        }
      }
      .price {
        p {
          span {
            font-size: 13px;
            color: #bfbfbf;
            vertical-align: top;
          }

          span:first-child {
            font-size: 16px;
            color: #fb4e44;
            vertical-align: text-top;
          }
        }
      }
    }

    // cartcontrol组件
    .controls {
      position: absolute;
      bottom: 10px;
      right: 12px;
    }
  }
}
</style>