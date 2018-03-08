<template>
  <div class="shopcart" :class="selectedCount !== 0 ? 'highlight' : ''">
      <div class="left-wrapper">
          <div class="icon-wrapper" :class="selectedCount !== 0 ? 'highlight' : ''">
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
  </div>
</template>


<script>
export default {
    props: {
        poi: {
            type: Object
        },
        selectedItems: {
            type: Array
        }
  },
  data() {
      return {
        //   
      }
  },
  computed: {
      selectedTotal() {
          let total = 0;
          if(this.selectedItems.length) {
            this.selectedItems.forEach(item => {
                total += item.min_price * item.count;
            });
          }
          return total;
      },
      selectedCount() {
          let count = 0;
          if(this.selectedItems.length) {
            this.selectedItems.forEach(item => {
                count += item.count;
            });              
          }
          return count;
      }
  }
}
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
    }
</style>
