<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>
<script>
  export default {
    name: 'my-content',
    computed: {
      // key() {
      //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      // }
    }
  }
</script>
<style scoped lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .15s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
