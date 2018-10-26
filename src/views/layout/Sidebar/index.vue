<template>
  <scroll-bar style="background-color:#252c35">
    <div class="logo">
      <div class="logo-img">
        <img src="../../../assets/img/logo.png" alt="logo"/>
      </div>
      <div v-show="isCollapse" class="user-name">XXX</div>
      <div v-show="!isCollapse" class="user-name">XXX管理平台</div>
      <div class="line"></div>
    </div>
    <el-menu :default-active="$route.path" background-color="#252c35" :collapse="isCollapse"
             text-color="#bfcbd9" active-text-color="#999eff">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: { SidebarItem, ScrollBar },
    computed: {
      routes () {
        return this.$router.options.routes
      },
      isCollapse () {
        return this.$store.state.sidebar
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logo{
    position: relative;
    padding-top: 20px;
    color: #fff;
    text-align: center;
    height: 160px;
    .logo-img {
      width: 76px;
      height: 76px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .user-name{
      font-size: 18px;
      margin-top: 20px;
    }
    .line{
      position: absolute;
      bottom: 0;
      left: 5%;
      width: 90%;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
</style>
