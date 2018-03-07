<template>
  <div>
    <!-- 左边导航边栏 -->
    <div class="side-nav" ref="orderSideNav">
      <ul class="nav">
        <li class="item" :class="getScrollToIndex === 0? 'active' : ''" @click="scrollToPosition(0)">
          <p>
            <img :src="promo.tag_icon" class="icon" v-if="promo.tag_icon"/>
            {{ promo.tag_name }}
          </p>
        </li>
        <li class="item" v-for="(item, index) in food_spu" :key="item.id" :class="getScrollToIndex === index+1? 'active' : ''" @click="scrollToPosition(index+1)">
          <p>
            <img :src="item.icon" class="icon" v-if="item.icon"/>
            {{ item.name }}
          </p>
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
          <h3 class="cate-header">{{category.name}}</h3>
          <ul>
            <li class="food-item" v-for="item in category.spus" :key="item.id">
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
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 导入better-scroll
import BScroll from 'better-scroll';

export default {
  data() {
    return {
      // init objs to save data
      food_spu: {},
      promo: {},
      // init objs to save better-scroll objs
      foodScroll: {},
      menuScroll: {},
      foodScrollY: 0,
      menuScrollY: 0,
      // height refs
      heightRnages: [0],
    }
  },
  methods: {
    getFoodImgUrl(item) {
      return `background-image: url("${ item.picture }")`;
    },
    initScroll() {

      let sideNav = this.$refs.orderSideNav;
      let contentWrapper = this.$refs.orderContentWrapper;

      // 初始化BS实例
      this.menuScroll = new BScroll(sideNav, {
        probeType: 3,
        click: true,
      });
      this.foodScroll = new BScroll(contentWrapper, {
        probeType: 3,
        click: true,
      });

      // 绑定scroll事件
      this.menuScroll.on('scroll', (pos) => {
        this.menuScrollY = Math.abs(Math.round(pos.y));
      });
      this.foodScroll.on('scroll', (pos) => {
        this.foodScrollY = Math.abs(Math.round(pos.y));
      });
    },
    calcListItemHeightRanges() {
      // 获取DOM列表
      let foodItemsList = this.$refs.orderContentWrapper.getElementsByClassName('list-item-hook');
      let heightRange = 0;

      if(!foodItemsList.length) return;

      // iterate the list and get the clientHeight of each item
      for(let i=0; i<foodItemsList.length; i++) {
        let elemHeight = foodItemsList[i].clientHeight;

        heightRange += elemHeight;
        // save to heightRanges list
        this.heightRnages.push(heightRange);
      }
    },
    scrollToPosition(index) {
      let foodItemsList = this.$refs.orderContentWrapper.getElementsByClassName('list-item-hook');
      // 使用better-scroll的scrollToElement方法
      this.foodScroll.scrollToElement(foodItemsList[index], 250);
    },
  },
  computed: {
    getScrollToIndex() {
      for(let i=0; i<this.heightRnages.length; i++) {
        if(this.foodScrollY >= this.heightRnages[i] && this.foodScrollY < this.heightRnages[i+1]) {
          return i;
        }
      }
    }
  },
  created() {
    // 后台加载数据
    let that = this;

    that.$axios.get('/api/order')
      .then(response => {
        let sourceData = response.data;

        if(sourceData.code == 0) {
          that.food_spu = sourceData.data.food_spu_tags;
          that.promo = sourceData.data.container_operation_source;

          // console.log(that.food_spu);

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
}
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
      width: 100%;
      padding: 16px 23px 15px 10px;
      background: #eeeeee;
      border-bottom: 1px solid rgba(140, 140, 140, 0.3);
      list-style-type: none;

      &.active {
        background: #fff;
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
  }
  
}

</style>