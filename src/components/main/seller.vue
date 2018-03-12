<template>
  <div id="seller-page" ref="sellerWrapper">
    <div class="scrollWrapper">
      <Divider></Divider>

      <div class="seller-info">
        <div class="row address">
          <div class="icon address_icon"></div>
          <div class="text">{{ address }}</div>
          <div class="icon-clickable">
            <span class="phone_icon"></span>
          </div>
        </div>
        <div class="row store-images" ref="scrollWrapper">
          <div class="carousel" v-if="poi_env.thumbnails_url_list" :style="carouselWidth">
            <div class="image" :style="bgUrl(imgUrl)" v-for="imgUrl in poi_env.thumbnails_url_list" :key="imgUrl.id"></div>
          </div>
        </div>
        <div class="row safty">
          <div class="icon safty_icon"></div>
          <div class="text">查看食品安全档案</div>
          <div class="icon-clickable"><span class="mt-keyboard_arrow_right"></span></div>
        </div>
      </div>

      <Divider></Divider>

      <div class="shipping-info">
        <div class="row">
          <div class="icon delivery_icon"></div>
          <div class="text">配送服务: {{ app_delivery_tip }}</div>
        </div>
        <div class="row">
          <div class="icon time_icon"></div>
          <div class="text no-padding-right">配送时间: {{ shipping_time }}</div>
        </div>
      </div>

      <Divider></Divider>

      <div class="service-info">
        <div class="row" v-if="poi_service.length">
          <div class="icon server_icon"></div>
          <div class="text">商家服务: <img class="inline-icon" :src="poi_service[0].icon" />{{ poi_service[0].content }}</div>
        </div>
        <div class="row" v-for="item in discounts2" :key="item.id" v-if="discounts2.length">
          <img class="icon custom-icon" :src="item.icon_url" />
          <div class="text no-padding-right">{{ item.info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入Better-Scroll
import BScroll from 'better-scroll';
// 导入 Divider组件
import Divider from "@/components/divider/divider";

export default {
  components: {
    BScroll,
    Divider,
  },

  data() {
    return {
      address: '',          // 地址
      shipping_time: '',    // 配送时间
      poi_env: {},          // 环境图片
      app_delivery_tip: '', // 配送服务
      discounts2: [],       // 打折信息
      poi_service: [],      // 商家服务
      scrollWrapper: '',
    }
  },

  methods: {
    initScroll() {
      let elem = this.$refs.sellerWrapper;
      let scroll = new BScroll(elem, {
        probeType: 3,
        click: true,
      });
    },
    initCarouselScroll() {
      let elem = this.$refs.scrollWrapper;
      let scroll = new BScroll(elem, {
        probeType: 3,
        scrollX: true,
        scrollY: false,
      })
    },
    bgUrl(url) {
      return `background-image: url("${url}")`;
    }
  },

  computed: {
    carouselWidth() {
      const iamgeWidth = 92;
      const parentPadding = 15;
      const marginRight = 11;

      let width = 0;

      if(this.poi_env.thumbnails_url_list) {
        width = parentPadding * 2 + this.poi_env.thumbnails_url_list.length * (iamgeWidth + marginRight) - marginRight + 'px';
      } else {
        width += 'px';
      }
      
      return `width: ${width}`;
    }
  },

  created() {
    let that = this;

    that.$axios
      .get("/api/seller")
      .then(response => {
        let sourceData = response.data;

        if (sourceData.code == 0) {
          // 储存数据到本地属性
          that.address = sourceData.data.address;
          that.shipping_time = sourceData.data.shipping_time;
          that.poi_env = sourceData.data.poi_env;
          that.app_delivery_tip = sourceData.data.app_delivery_tip;
          that.discounts2 = sourceData.data.discounts2;
          that.poi_service = sourceData.data.poi_service;

          // 加载BScroll
          that.$nextTick(() => {
            that.initScroll();
            that.initCarouselScroll();
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
#seller-page {
  display: block;
  bottom: 0;
  background: #f4f4f4;
}

// Global Style
.row {
  position: relative;
  padding: 15px;
  width: 100%;
  border-bottom: 1px solid #f4f4f4;
  background: #fff;

  .icon {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 15px;
    padding: 1px;
    margin-right: 11px;
    width:16px;
    height: 16px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transform: translateY(-50%);

    // &:last-child {
    //   margin-right: 0;
    // }
  }

  .icon-clickable {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 100%;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 11px;
      transform: translateY(-50%);
      background: #f4f4f4;
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      background-size: cover;
      background-position: center;
    }
  }

  .text {
    position: relative;
    width: 100%;
    padding-left: 27px;
    padding-right: 92px;
    font-size: 14px;
    color: #333333;
    text-align: left;

    &.no-padding-right {
      padding-right: 0;
    }

    .inline-icon {
      display: inline-block;
      margin-left: 6px;
      margin-right: 17px;
      width: 15px;
      height: 15px;
      vertical-align: bottom;
    }
  }
}

.seller-info {
  .address {
    position: relative;

    .address_icon {
      background-image: url('/static/img/address.png');
    }
    .phone_icon {
      background-image: url('/static/img/phone.png');
    }
  }

  .store-images {
    .carousel {
      // min-width: 200vw;

      .image {
        display: inline-block;
        margin-right: 11px;
        width: 92px;
        height: 80px;
        background-size: cover;
        background-position: center;
      }
    }
  }

  .safty {
    .safty_icon {
      background-image: url('/static/img/safety.png');
    }
  }
}

.shipping-info {
  .delivery_icon {
    background-image: url('/static/img/delivery.png');
  }

  .time_icon {
    background-image: url('/static/img/time.png');
  }
}

.service-info {
  .server_icon {
    background-image: url('/static/img/server.png');
  }

  .custom-icon {
    width: 15px;
    height: 15px;
  }
}

</style>

