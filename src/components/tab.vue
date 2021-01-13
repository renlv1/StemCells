<template>
  <div class="tab">
    <div v-for="(item, index) in arr" class="item" @click="emit(index)" :key="index" :class="{'active': activeIndex === index}">
      {{item.fileName || item}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arr: Array,
    activeIndex: Number
  },
  computed: {
    tabIndex () {
      return this.$store.state.tabIndex
    }
  },
  methods: {
    emit (index) {
      // this.$store.commit('SET_TAB_INDEX', index)
      this.$emit('update:activeIndex', index)
    }
  }
};
</script>

<style lang="less" scoped>
.tab{
  .vCenter;
  display: inline-flex;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  font-size: 15px;
  &.folder-tab{
    margin-right: 30px;
    background: none;
    border-radius: 0;
    .item{
      width: 100px;
      border-radius: 2px;
      margin: 0 5px 5px 0;
      background: #fff;
      white-space: nowrap;
      box-shadow: 0 -1px 6px rgba(0,0,0,.1);
      // border-bottom: 1px solid #f0f0f0;
    }
  }
  .item{
    padding: 0 10px;
    width: 94px;
    height: 46px;
    .vCenter;
    justify-content: center;
    text-align: center;
    cursor: default;
    &.active{
      background: @blue;
      color: #fff;
    }
  }
  &.big{
    font-size: 16px;
    .item{
      width: 140px;
      line-height: 50px;
    }
  }
}
</style>


