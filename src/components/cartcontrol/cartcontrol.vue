<template>
  <div class="control-wrapper" @click.stop.prevent>
    <div class="decrease" v-show="selectedFood.count > 0" @click="subQuan">
      <span class="mt-remove_circle_outline"></span>
    </div>
    <div class="quantity" v-show="selectedFood.count > 0">
      <span>{{ selectedFood.count }}</span>
    </div>
    <div class="increase" @click="addQuan">
      <span class="mt-add_circle"></span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    food: {
      type: Object
    }
  },

  data() {
    return {
      selectedFood: this.food
    };
  },

  methods: {
    addQuan() {
      if (this.selectedFood.count) {
        this.selectedFood.count++;
      } else {
        Vue.set(this.selectedFood, "count", 1);
      }
    },
    subQuan() {
      this.selectedFood.count--;
    }
  }
};
</script>

<style lang="scss">
  .control-wrapper {
    width: 80px;
    .increase,
    .quantity,
    .decrease {
      position: relative;
      span {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 26px;
        color: #b4b4b4;
      }
    }
    .decrease {
      float: left;
      width: 26px;
      height: 26px;
    }
    .quantity {
      float: left;
      width: 28px;
      height: 26px;
      span {
        font-size: 15px;
        font-weight: 500;
        color: #333333;
      }
    }
    .increase {
      float: right;
      width: 26px;
      height: 26px;
      span {
        color: #ffbb22;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #333333;
          border-radius: 50%;
          z-index: -1;
        }
      }
    }
  }
</style>
