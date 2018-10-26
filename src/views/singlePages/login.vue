<template>
  <div class="login">
    <div class="content">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm">
        <h1 class="title">XXX管理平台</h1>
        <el-form-item prop="theKey">
          <el-input name="name" v-model="loginForm.theKey" placeholder="请输入用户名" clearable>
            <svg-icon slot="prefix" icon-class="user2"></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item prop="theValue">
          <el-input type="password" name="psw" @keyup.enter.native="handleLogin" v-model="loginForm.theValue"
                    placeholder="请输入密码"
                    clearable>
            <svg-icon slot="prefix" icon-class="mima"></svg-icon>
          </el-input>
        </el-form-item>
        <el-button class="btn-login" :loading="loading" @click="handleLogin">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          theKey: this.$globalApi.getLocalStorage('AccountNumber1'), // 读取用户账号
          theValue: this.$globalApi.getLocalStorage('Accountpsw1') // 读取用户账号,
        },
        loginRules: {
          theKey: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          theValue: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        },
        loading: false,
        showDialog: false
      }
    },
    methods: {
      handleLogin () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$globalApi.setLocalStorage('AccountNumber1', this.loginForm.theKey) // 储存用户账号
            this.$globalApi.setLocalStorage('Accountpsw1', this.loginForm.theValue) // 储存3用户密码
            this.loading = true
            this.$store.dispatch('login', this.loginForm).then(res => {
              this.loading = false
              if (res.status) {
                this.$router.push('/')
              }
            }).catch(() => {
              this.loading = false
              console.log('catch')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("~@/assets/img/login_bg.png") no-repeat;
    background-size: 100% 100%;
  }

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    border-radius: 5px;
    width: 1200px;
    height: 610px;
    background: url("~@/assets/img/login-img.png") no-repeat 0 center;
    background-size: auto 80%;
    .el-form {
      margin-top: 50px;
      width: 460px;
      float: right;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      background-color: #fff;
      .el-form-item {
        margin-top: 40px;
        border-bottom: 1px solid #dedede;
      }
      .el-input{
        font-size: 16px;
      }
      .svg-icon {
        color: #888;
        font-size: 16px;
      }
    }
    .title {
      padding: 30px 0 0 0;
      font-size: 30px;
      color: #666;
      font-weight: bold;
    }
    .btn-login {
      width: 420px;
      height: 64px;
      margin-top: 60px;
      margin-bottom: 30px;
      background: linear-gradient(to right, #a8acf9, #80befe);
      border-radius: 32px;
      font-size: 20px;
      color: #fff;
    }
  }
</style>
<style lang="scss">
  .login {
    .el-form-item__content {
      margin-bottom: 16px;
    }
    .el-input__inner {
      border: none
    }
  }
</style>
