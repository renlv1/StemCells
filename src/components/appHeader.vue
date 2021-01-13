<template>
  <div class="app-header" :class="{diff: hideReturn !== undefined}">
    <div class="back" v-show="hideReturn === undefined" @click="goBack"></div>
    <div class="title">
      <template v-if="title">{{title}}</template>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    to: String,
    title: String,
    backFn: Function,
    hideReturn: String || Boolean
  },
  methods: {
    goBack() {
      if (this.backFn) {
        this.backFn()
      } else if (this.to) {
        this.$router.push(this.to)
      } else {
        this.$router.back()
      }
    }
  }
};
</script>
