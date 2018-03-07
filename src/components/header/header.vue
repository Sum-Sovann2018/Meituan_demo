<template>
  <div class="header">
      <!-- {{ poi.name }} -->
      <div class="bg" :style="getBgUrl"></div>
      <!-- 顶部通栏 -->
      <div class="top-wrapper">
        <div class="left-wrapper">
            <span class="mt-arrow_left"></span>
        </div>
        <div class="middle-wrapper">
            <span class="mt-search"></span>
            <input type="text" placeholder="搜索店内商品">
        </div>
        <div class="right-wrapper">
            <a href="#" class="pd-bt">拼单</a>
            <div class="more-bt">
                <i class="circle"></i>
                <i class="circle"></i>
                <i class="circle"></i>
            </div>
        </div>
      </div>
      
      <!-- 主体部分 -->
      <div class="body-wrapper">
          <div class="logo" :style="getLogoUrl"></div>
          <div class="name">{{ poi.name }}</div>
          <div class="mark" @click="isMarked = !isMarked">
              <span :class="isMarked? 'mt-star-full' : 'mt-star-empty'"></span>
          </div>
      </div>

      <!-- 底部活动通知部分 -->
      <div class="bottom-wrapper">
          <img class="icon" v-if="this.poi.discounts2" :src="this.poi.discounts2[0].icon_url" />
          <div class="info" v-if="this.poi.discounts2">
              {{ this.poi.discounts2[0].info }}
          </div>
          <div class="note" v-if="this.poi.discounts2" @click="toggleModal">
              {{ this.poi.discounts2.length }}个通知
              <span class="mt-keyboard_arrow_right"></span>
          </div>
      </div>

      <!-- 公告通知 -->
      <transition name="fade">
      <div class="modal-wrapper" v-show="this.modalToggled">
          <div class="modal" :style="getModalBgUrl">
              <div class="body">
                  <div class="logo-wrapper">
                      <div class="logo" :style="getLogoUrl"></div>
                  </div>
                  <div class="name-wrapper">{{ poi.name }}</div>
                  <div class="ratings-wrapper">
                      <div class="ratings" v-html="getRatingHtml"></div>
                      <span class="score">{{ poi.wm_poi_score }}</span>
                  </div>
                  <div class="shipping-wrapper">
                      <div class="shipping-info">
                          <span>{{ poi.min_price_tip }}</span>
                          <span class="divider"></span>
                          <span>{{ poi.shipping_fee_tip }}</span>
                          <span class="divider"></span>
                          <span>{{ poi.delivery_time_tip }}</span>
                      </div>
                      <div class="shipping-schedule">
                          <span>配送时间: {{ poi.shipping_time }}</span>
                      </div>
                  </div>
                  <div class="info-box-wrapper">
                    <div class="info" v-if="this.poi.discounts2">
                        <img class="icon" v-if="this.poi.discounts2" :src="this.poi.discounts2[0].icon_url" />
                        {{ this.poi.discounts2[0].info }}
                    </div>
                  </div>
              </div>
              <div class="toggle" @click="toggleModal">
                  <span class="mt-close"></span>
              </div>
          </div>
      </div>
      </transition>
      
  </div>
</template>


<script>
export default {
  props: {
      poi: {
          type: Object,
          default: {}
      }
  },
  data() {
      return {
          modalToggled: false,
          isMarked: false
      }
  },
  methods: {
      toggleModal() {
          return this.modalToggled = !this.modalToggled;
      }
  },
  computed: {
      getBgUrl() {
          return `background-image: url("${ this.poi.head_pic_url }")`;
      },
      getLogoUrl() {
          return `background-image: url("${ this.poi.pic_url }")`;
      },
      getModalBgUrl() {
          return `background-image: url("${ this.poi.poi_back_pic_url }")`;
      },
      getRatingHtml() {
          const ratingStarCount = 5;

        //   let ratings = this.poi_.wm_poi_score;
          let ratings = Math.floor(this.poi.wm_poi_score / 0.5) * 0.5;
          let fullStarCount = Math.floor(ratings);
          let hasHalfStar = (ratings % 1) !== 0;
          let html = '';
          let starCount = 0;

          for(let i=0; i<fullStarCount; i++) {
              html += `<span class="mt-star-full"></span>`;
              starCount++;
          }

          if(hasHalfStar) {
              html += `<span class="mt-star-half"></span>`;
              starCount++;
          }

          while(starCount < ratingStarCount) {
              html += `<span class="mt-star-empty"></span>`;
              starCount++;
          }

          return html;
      }
  }
}
</script>


<style lang="scss">
    .header {
        width: 100%;
        height: 160px;
        padding-top: 20px;

        .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 160px;
            background-position: center center;
            background-size: 100% auto;
            z-index: -1;

            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 160px;
                background: rgba(0, 0, 0, 0.3);
            }
        }
    }

    .top-wrapper {
        position: relative;
        margin-top: 6px;
        margin-bottom: 17px;

        .left-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 50px;
            height: 31px;
            line-height: 31px;

            span {
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 15px;
                transform: translateY(-50%);
                color: #fff;
            }
        }
        .middle-wrapper {
            position: relative;
            width: 100%;
            height: 31px;
            padding: 0 104px 0 50px;

            input {
                width: 100%;
                height: 31px;
                padding-left: 28px;
                border: none;
                border-radius: 25px;
                outline: none;
                color: #868686;
                // background: #eeeeee;

                &:placeholder {
                    color: #868686;
                }
            }

            span {
                position: absolute;
                display: block;
                width: 28px;
                height: 31px;
                line-height: 31px;
                font-size: 13px;
                text-align: center;
                color: #868686;
            }
        }
        .right-wrapper {
            position: absolute;
            right: 0;
            top: 0;
            width: 104px;
            height: 31px;

            .pd-bt {
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 15px;
                width: 30px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                font-size: 10px;
                border: 1px solid #fff;
                text-decoration: none;
                color: #fff;
                transform: translateY(-50%);
            }
            .more-bt {
                display: block;
                position: absolute;
                top: 0;
                right: 15px;
                width: 30px;
                height: 31px;
                line-height: 31px;
                text-align: center;

                .circle {
                    display: inline-block;
                    position: relative;
                    transform: translateY(-50%);
                    width: 5px;
                    height: 5px;
                    border: 1px solid #fff;
                    border-radius: 50%;
                }
            }
        }
    }

    .body-wrapper {
        position: relative;
        width: 100%;
        height: 50px;
        padding: 0 10px;
        margin-bottom: 11px;
        overflow: hidden;

        .logo {
            float: left;
            width: 50px;
            height: 50px;
            margin-right: 10px;
            background-position: center;
            background-size: cover;
        }
        .name {
            float: left;
            height: 50px;
            line-height: 50px;
            font-size: 1rem;
            font-weight: 400;
            color: #fff;
        }
        .mark {
            float: right;
            position: relative;
            width: 50px;
            height: 50px;

            span {
                display: inline-block;
                position: absolute;
                width: 100%;
                top: 7px;
                font-size: 1.2rem;
                text-align: center;
                color: #fff;

                &::after {
                    content: "收藏";
                    position: absolute;
                    left: 50%;
                    top: calc(100% + 3px);
                    width: 100%;
                    transform: translateX(-50%);
                    color: #fff;
                    font-size: 0.8rem;
                    text-align: center;
                }
            }
        }
    }

    .bottom-wrapper {
        position: relative;
        width: 100%;
        height: 16px;
        padding: 0 10px;

        .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }
        .info {
            display: inline-block;
            height: 16px;
            vertical-align: top;
            line-height: 16px;
            font-size: 12px;
            font-weight: 300;
            color: #fff;
        }
        .note {
            position: absolute;
            display: block;
            top: -1px;
            right: 10px;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;

            span {
                text-align: center;
                line-height: 16px;
                font-size: 12px;
                color: #fff;
            }
        }
    }

    .modal-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(98, 98, 98, 0.8);
        z-index: 2;

        .modal {
            position: absolute;
            top: 43px;
            left: 50%;
            width: 335px;
            border-radius: 10px;
            transform: translate(-50%, 0%);

            .body {
                width: 100%;
                height: 500px;
                padding: 40px 20px 0 20px;
                background-position: center;
                background-size: cover;

                .logo-wrapper {
                    height: 60px;
                    text-align: center;

                    .logo {
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        vertical-align: top;
                        background-position: center;
                        background-size: cover;
                    }
                }
                .name-wrapper {
                    margin-top: 13px;
                    text-align: center;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 500;
                }
                .ratings-wrapper {
                    margin-top: 6px;
                    height: 15px;
                    line-height: 15px;
                    text-align: center;
                    // background: blanchedalmond;

                    .ratings {
                        display: inline-block;
                        vertical-align: top;
                        span {
                            color: #ffbb22;
                            font-size: 12px;
                        }
                    }

                    .score {
                        color: #fff;
                        font-size: 12px;
                    }
                }
                .shipping-wrapper {
                    margin-top: 13px;
                    height: 39px;
                    color: #fff;

                    .shipping-info,
                    .shipping-schedule {
                        text-align: center;
                        height: 12px;
                        line-height: 12px;

                        span {
                            display: inline-block;
                            position: relative;
                            vertical-align: top;
                            height: 12px;
                            font-size: 12px;  
                            font-weight: 300;
                        }

                        .divider {
                            width: 6px;
                            
                            &::after {
                                content: "";
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                width: 1px;
                                height: 6px;
                                transform: translate(-50%, -50%);
                                background: #bababc;
                            }
                        }
                    }

                    .shipping-schedule {
                        margin-top: 13px;
                    }
                }
                .info-box-wrapper {
                    margin-top: 21px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(140, 140, 140, 0.3);

                    .info {
                        height: 16px;
                        margin-bottom: 10px;
                        line-height: 16px;
                        font-size: 11px;
                        font-weight: 400;
                        color: #fff;

                        .icon {
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            margin-right: 5px;
                            vertical-align: top;
                        }
                    }
                }
            }

            .toggle {
                position: absolute;
                top: 520px;
                left: 50%;
                width: 40px;
                height: 40px;
                bottom: 65px;
                transform: translateX(-50%);
                background: rgba(118, 118, 118, 0.7);
                border: 1px solid rgba(140, 140, 140, 0.9);
                border-radius: 50%;

                span {
                    display: inline-block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    font-size: 2rem;
                    transform: translate(-50%, -50%);
                    color: #fff;
                }
            }
        }
    }


    // Transition effects
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

</style>
