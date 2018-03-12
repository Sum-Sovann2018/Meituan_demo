<template>
  <div>
    <ul class="comments-content">
      <li class="comment" v-for="comment in comments" :key="comment.id">
        <div class="avatar" :style="getUserAvatarUrl(comment)" v-if="comment.user_pic_url"></div>
        <div class="avatar-default" v-if="!comment.user_pic_url"></div>
        <div class="info">
          <div class="details">
            <div class="username">{{ comment.user_name }}</div>
            <div class="comment-date" v-if="typeof comment.comment_time === 'number'">{{ commentTime(comment.comment_time) }}</div>
            <div class="comment-date" v-if="typeof comment.comment_time === 'string'">{{ comment.comment_time }}</div>
          </div>

          <div class="star-component">
            <span class="title">评分</span>
            <Stars :score="comment.order_comment_score" v-if="showStar"></Stars>
          </div>
          
          <div class="content" v-if="comment.comment_content" v-html="formatContent(comment.comment_content)"></div>
          <div class="content" v-if="comment.comment" v-html="formatContent(comment.comment)"></div>

          <div class="content-image" v-if="comment.comment_pics">
            <img :src="pic.thumbnail_url" v-for="pic in comment.comment_pics" :key="pic.id">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// 导入 Stars组件
import Stars from "@/components/stars/stars";

export default {
  components: {
    Stars
  },

  props: {
    comments: [Object, Array],
    showStar: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    getUserAvatarUrl(item) {
      let url = '';
      if(item.user_pic_url) {
        url = item.user_pic_url;
      } else if (item.user_icon) {
        url = item.user_icon;
      }
      return `background-image: url("${url}")`;
    },
    commentTime(time) {
      let date = new Date(time * 1000);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = (date.getDate() + 1 < 10) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
      return `${year}.${month}.${day}`;
    },
    formatContent(content) {
      let hashtagRegExp = /(#[^#]+#)/g;
      return content.replace(hashtagRegExp, '<span class="hashtag">$1</span>');
    },
  }
}
</script>

<style lang="scss">
.comments-content {

  li.comment {
    padding: 16px 0;
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
        margin-bottom: 10px;

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

      .star-component {
        text-align: left;
        margin-bottom: 12px;

        .title {
          font-size: 12px;
          color: #999999;
        }

        .stars-wrapper {
          display: inline-block;
        }
      }

      .content {
        font-size: 14px;
        color: #333333;

        .hashtag {
          color: #576b95;
        }
      }

      .content-image {
        margin-top: 12px;
        img {
          display: inline-block;
          width: 100px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
