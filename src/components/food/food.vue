<template>
  <div class="food-conatiner" v-if="viewItem" ref="BSWrapper"> 
    <div class="scroll-wrapper">
      <!-- food infomation -->
      <div class="food-wrapper">
        <div class="food-content">
          <div class="food-img">
            <img :src="currentFood.picture" alt="">
          </div>
          <div class="food-info">
            <div class="name">{{ currentFood.name }}</div>
            <div class="desc" v-if="currentFood.description">{{ currentFood.description }}</div>
            <div class="sales">{{ currentFood.month_saled_content }}</div>
            <div class="hot-pick" v-if="currentFood.product_label_picture">
              <img :src="currentFood.product_label_picture" />
            </div>
            <div class="price">
              <div class="left">
                <span>¥{{ currentFood.min_price }}</span>
                <span>/{{ currentFood.unit }}</span>
              </div>
              <div class="right" v-if="!selected" @click="selectThis(currentFood)">选择</div>
              <!-- carcontrol 组件 -->
              <CartControl class="cartcontrols" :food="currentFood" v-if="selected"></CartControl>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <Divider></Divider>

      <!-- comment section -->
      <div class="comments-wrapper">
        <div class="comments-header" v-if="food.rating">
          <div class="title">{{ food.rating.title }}</div>
          <div class="ratings"><span>({{ food.rating.like_ratio_desc }}</span><span class="red">{{ food.rating.like_ratio }})</span></div>
          <div class="comments-toggle"><span>{{ food.rating.snd_title }}</span><span class="mt-keyboard_arrow_right"></span></div>
        </div>

        <ul class="comments-content" v-if="food.rating">
          <li class="comment" v-for="comment in food.rating.comment_list" :key="comment.id">
            <div class="avatar" :style="getUserAvatarUrl(comment)" v-if="comment.user_icon"></div>
            <div class="avatar-default" v-if="!comment.user_icon"></div>
            <div class="info">
              <div class="details">
                <div class="username">{{ comment.user_name }}</div>
                <div class="comment-date">{{ comment.comment_time }}</div>
              </div>
              <div class="content">{{ comment.comment_content }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="controls">
      <div class="close" @click="closeItem">
        <span class="mt-close"></span>
      </div>
      <div class="share">
        <span class="mt-share"></span>
      </div>
      <div class="more">
        <span class="mt-share2"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// 导入better-scroll
import BScroll from "better-scroll";
// 导入 Divider组件
import Divider from "@/components/divider/divider";
// 导入 CarControl组件
import CartControl from "@/components/cartcontrol/cartcontrol";

export default {
  components: {
    Divider,
    CartControl,
    BScroll
  },

  props: {
      food: {
          type: Object
      }
  },

  data() {
      return {
          viewItem: false,
          BScrollWrapper: {},
      }
  },

  methods: {
    showItem() {
      this.viewItem = true;

      // init BScroll
      this.$nextTick(() => {
        this.initScroll();
      })
    },
    closeItem() {
      this.viewItem = false;
      this.$emit('itemclosed');
    },
    selectThis(item) {
      if(!item.count) {
        Vue.set(item, "count", 1); 
      }
    },
    getUserAvatarUrl(item) {
      let url = item.user_icon ? item.user_icon : '';
      return `background-image: url("${url}")`;
    },
    initScroll() {
      let list = this.$refs.BSWrapper;

      this.BScrollWrapper = new BScroll(list, {
        type: 3,
        click: true
      });
    },
  },

  computed: {
    currentFood() {
      return this.food;
    },
    selected() {
      if(!this.currentFood.count) {
        return false; 
      } else {
        return true;
      }
    },
  }
}
</script>

<style lang="scss">
.food-conatiner {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 51px;
  width: 100%;
  background:white;

  .controls {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    overflow: hidden;
    z-index: 2;

    .close, .share, .more {
      position: relative;
      width: 30px;
      height: 30px;
      line-height: 30px;
      background: #9d9d9d;
      border-radius: 50%;

      span {
        position: absolute;
        top: 50%;
        left: 50%;
        color: #fff;
      }
    }

    .close {
      float: left;
      margin-left: 10px;
      font-size: 23px;

      span{
        transform: translate(-50%, -51%);
      }
    }

    .share, .more {
      float: right;
      margin-right: 10px;
      font-size: 14px;
    }

    .more {
      span{
        transform: translate(-55%, -50%);
      }
    }

    .share {
      font-size: 18px;
      span{
        transform: translate(-42%, -55%);
      }
    }
  }
}

.food-wrapper {
  position: relative;
  width: 100%;
  padding: 10px;

  .food-content {
    .food-img {
      position: relative;
      width: 100%;

      // 注意,常见的图片设置方法
      // 当子元素图片未加载时,父元素是没有高度的,所以,为了达到把父元素设置成正方形的效果,可以使用padding把父元素撑开,同时把height设置为0, 这样父元素就变成一个正方形
      // 这样当子元素的图片读取父元素的宽度和高度时,就能被正确显示了
      height: 0;
      padding-top: 100%;

      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .food-info {
      padding: 6px;
      .name {
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        font-weight: bold;
        color: #333333;
      }
      .desc,
      .sales {
        font-size: 12px;
        color: #9d9d9d;
        margin-bottom: 6px;
      }
      .hot-pick {
        margin-bottom: 6px;
        img {
          height: 18px;
        }
      }
      .price {
        position: relative;
        overflow: hidden;
        height: 32px;
        line-height: 32px;
        .left {
          float: left;

          span:first-child {
            color: #fb4e44;
            font-size: 17px;
            font-weight: bold;
          }

          span:last-child {
            color: #9d9d9d;
            font-size: 12px;
            font-weight: normal;
          }

        }
        .right {
          position: relative;
          float: right;
          width: 64px;
          height: 32px;
          line-height: 32px;
          font-size: 12px;
          text-align: center;
          color: #333333;
          background: #ffd161;
          border-radius: 15px;
        }

        // cartcontrol组件
        .cartcontrols {
          position: absolute;
          top: 50%;
          right: 0px;
          transform: translateY(-50%)
        }
      }
    }
  }
}


.comments-wrapper {

  .comments-header {
    padding: 16px 10px;
    border-bottom: 1px solid #f4f4f4;
    overflow: hidden;

    .title,
    .ratings {
      float: left;
      height: 14px;
      line-height: 14px;
      color: #333333;
      font-size: 14px;
    }
    .ratings {
      margin-left: 5px;

      .red { 
        color: #fb4e44; 
      }
    }
    .comments-toggle {
      float: right;
      height: 14px;
      line-height: 14px;
      color: #333333;
      font-size: 14px;
    }
  }

  .comments-content {
    padding: 10px;

    li.comment {
      padding: 10px 0;
      border-bottom: 1px solid #f4f4f4;

      .avatar,
      .avatar-default {
        float: left;
        width: 41px;
        height: 41px;
        margin-right: 10px;
        background-size: cover;
        background-position: center;
        border-radius: 50%;
      }

      .avatar-default {
        background-image: url("./anonymity.png");
      }

      .info {
        width: 100%;
        padding-left: 51px;

        .details {
          overflow: hidden;
          height: 18px;
          line-height: 18px;
          margin-bottom: 17px;

          .username {
            float: left;
            font-size: 14px;
            color: #333333
          }
          .comment-date {
            float: right;
            font-size: 12px;
            color: #666666
          }
        }

        .content {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
}
</style>



