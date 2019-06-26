<template>
	<div class="loginBox">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <h3 class="title">{{appName}}</h3>

            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>

            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>

            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    name: "login",
    data() {
        return {
            appName : this.config.APP_NAME,
            logining: false,
            ruleForm: {
                account: '',
                checkPass: ''
            },
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                checkPass: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            },
            checked: true
        };
    },
    created(){
      
	},
    methods: {
        handleSubmit(ev) {
            var _this = this;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.logining = true;
                    let data = {username:this.ruleForm.account,password:this.ruleForm.checkPass}
                    this.$http.post('/login',data).then((res)=>{
                    　　this.logining = false;
                        res = res.data;
                        if (res.code==1){
                            this.ruleForm.account='';
                            this.ruleForm.checkPass='';
                            this.$store.commit('SET_TOKEN',res.body.token);
                            this.$store.commit('SET_USER',JSON.stringify(res.body.userinfo));
                            window.location.href="/shouyin"
                        }else{
                            this.$message({
                                message: res.desc,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style scoped>
.loginBox{background:url(../assets/bg.jpg); width: 100%; height: 100vh; padding-top: 100px; box-sizing: border-box}
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin:auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.title{
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}
.remember {
    margin: 0px 0px 35px 0px;
}
</style>