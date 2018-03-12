<template>
  <div id="rating-page" ref="ratingWrapper">
    <div class="scrollWrapper">
      <!-- 评分部分 -->
      <div class="rating-wrapper">
        <div class="seller-rating">
          <div class="number">{{ scores.comment_score }}</div>
          <div class="text">商家评分</div>
        </div>
        <div class="food-rating">
          <div class="quality">
            <div class="title">口味</div>
            <Stars class="wrapper" :score="scores.quality_score"></Stars>
          </div>
          <div class="packing">
            <div class="title">包装</div>
            <Stars class="wrapper" :score="scores.pack_score"></Stars>
          </div>
        </div>
        <div class="shipping-rating">
          <div class="number">{{ scores.delivery_score }}</div>
          <div class="text">配送评分</div>
        </div>
      </div>

      <!-- 隔离带 -->
      <Divider class="divider"></Divider>

      <!-- 评论部分 --> 
      <div class="content-wrapper">
        <div class="tab-wrapper">
          <ul v-if="tabs.length">
            <li class="tab-item" :class="activeTab === 'ALL'? 'active' : ''" @click="clickedTab(0)">{{ tabs[0].comment_score_title }}</li>
            <li class="tab-item" :class="activeTab === 'PIC'? 'active' : ''" @click="clickedTab(1)">{{ tabs[1].comment_score_title }}</li>
            <li class="tab-item" :class="activeTab === 'DP'? 'active' : ''" @click="clickedTab(2)">{{ tabs[2].comment_score_title }}</li>
          </ul>
        </div>

        <div class="label-wrapper">
          <div class="label-item" v-for="comment_score_type in comment_score_types" :key="comment_score_type.id" :class="comment_score_type.comment_score_type === 1? 'good' : 'bad'">
            <span class="content">{{ comment_score_type.comment_score_title }}</span>
            <span class="count">{{ comment_score_type.total_count }}</span>
          </div>
          <div class="label-item" v-for="label in labels" :key="label.id" :class="label.label_star === 5? 'good' : 'bad'">
            <span class="content">{{ label.content }}</span>
            <span class="count">{{ label.label_count }}</span>
          </div>
        </div>

        <div class="comment-wrapper">
          <Comment :comments="filteredComments" :showStar="true"></Comment>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// 导入Better-Scroll
import BScroll from 'better-scroll';
// 导入 Stars组件
import Stars from "@/components/stars/stars";
// 导入 Divider组件
import Divider from "@/components/divider/divider";
// 导入 Comment组件
import Comment from "@/components/comment/comment";

export default {
  components: {
    Stars,
    Divider,
    Comment,
  },

  data() {
    return {
      scores: {},
      tabs: {},
      labels: {},
      comment_score_types: {},
      comments: {},
      // tabs active class
      activeTab: 'ALL',
      
    }
  },

  methods: {
    initScroll() {
      let elem = this.$refs.ratingWrapper;

      let scroll = new BScroll(elem, {
        probeType: 3,
        click: true,
      });
    },
    clickedTab(index) {
      let tab = '';
      switch(index) {
        case 0:
          tab = "ALL";
          break;
        case 1:
          tab = "PIC";
          break;
        case 2:
          tab = "DP";
          break;
      }

      this.activeTab = tab;
    }
  },

  computed: {
    // 根据tab显示评论内容
    filteredComments() {
      let commentList = [];

      if(this.activeTab === 'ALL') {
        commentList = this.comments;
      } else if(this.activeTab === 'PIC') {
        this.comments.forEach(comment => {
          if(comment.comment_pics.length) {
            commentList.push(comment);
          }
        });
      }
      return commentList;
    }
  },

  // 在create钩子处使用$axios后台加载数据
  // 并且初始化better-scroll
  created() {
    let that = this;

    that.$axios
      .get("/api/rating")
      .then(response => {
        let sourceData = response.data;

        if (sourceData.code == 0) {
          // 储存数据到本地属性
          // score属性
          that.scores = sourceData.data.scores
          // tab属性
          that.tabs = sourceData.data.tab;
          // comment_tags属性
          that.labels = sourceData.data.labels;
          that.comment_score_types = sourceData.data.comment_score_type_infos;
          // comments属性
          that.comments = sourceData.data.comments;


          // 为了确保DOM已经完全渲染, 在$nextTick的回调函数中加载BScroll初始项.
          that.$nextTick(() => {
            // better-scroll 初始化
            that.initScroll();

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
#rating-page {
  bottom: 0;
}

.scrollWrapper {
  display: block;
  position: relative;
  width: 100%;
  height: auto;
}

.rating-wrapper {
  display: flex;
  width: 100%;
  height: 85px;
  // background: #eeeeee;

  .seller-rating,
  .shipping-rating {
    flex: 0 0 110px;
    padding: 20px 26px;

    .number {
      margin-bottom: 9px;
      font-size: 23px;
      font-weight: bold;
      text-align: center;
    }
    .text {
      font-size: 13px;
      text-align: center;
    }
  }

  .seller-rating {
    .number {
      color: #ffb000;
    }
    .text {
      color: #666666;
    }
  }

  .shipping-rating {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 80%;
      transform: translateY(-50%);
      background: #eeeeee;
    }

    .number {
      color: #999999;
    }
    .text {
      color: #999999;
    }
  }

  .food-rating {
    flex: 1 0 auto;
    padding: 20px 0;

    .quality {
      margin-bottom: 5px;
    }

    .quality,
    .packing {
      height: 20px;

      .title {
        display: inline-block;
        font-size: 12px;
        color: #666666;
        vertical-align: middle;
      }
      .wrapper {
        display: inline-block;
        vertical-align: middle;
        .score {
          color: #ffb000;
        }
      }
    }
  }

  // .shipping-rating {
  //   flex: 0 0 110px;
  // }
}

.content-wrapper {
  width: 100%;
  padding: 16px;

  .tab-wrapper {
    width: 100%;
    margin-bottom: 11px;

    ul {
      display: flex;
      
      .tab-item {
        flex: 1;
        padding: 11px;
        font-size: 14px;
        color: #ffb000;
        text-align: center;
        background: #fff;
        border: 1px solid #ffb000;
        border-left: none;

        &:first-child {
          border-left: 1px solid #ffb000;
          border-radius: 3px 0 0 3px;
        }

        &:last-child {
          border-radius: 0 3px 3px 0;
        }

        &.active {
          color: #333333;
          background: #ffb000;
        }
      }
    }
  }

  .label-wrapper {
    overflow: hidden;

    .label-item {
      float: left;
      padding: 8px 10px;
      margin-right: 6px;
      margin-bottom: 6px;
      background: #f4f4f4;
      border-radius: 3px;
      line-height: 12px;
      

      &.good {
        color: #666666;
      }

      &.bad {
        color: #999999;
      }

      span {
        display: inline-block; 
        font-size: 12px;
        
      }
    }
  }

  .comment-wrapper {
    margin-top: 10px;
  }

}
</style>