<template>
  <div class="warpper">
    <img :src="ImgWelcome" alt="为屋帮帮欢迎你"/>
    <p class="text">很抱歉，页面不小心迷路了~</p>
    <el-button @click="$router.go(-1)" class="go-back">返回上层</el-button>
  </div>
</template>
<script>
  import ImgWelcome from '@/assets/img/img-404.png'

  export default {
    name: 'welcome',
    data () {
      return {
        ImgWelcome
      }
    },
    methods: {},
    beforeDestroy () {
    }
  }
</script>
<style lang="scss" scoped>
  .warpper {
    padding-top: 5vh;
    text-align: center;
    .text {
      font-size: 24px;
      color: #999;
    }
    .go-back {
      margin-top: 30px;
      width: 240px;
      height: 64px;
      border-radius: 32px;
      font-size: 23px;
      color: #fff;
      background: linear-gradient(left, #a8acf9, #80befe);
    }
  }
</style>
