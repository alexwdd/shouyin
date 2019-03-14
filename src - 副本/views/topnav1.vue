<template>	
    <el-row>
        <el-col :span="8"><div class="logo">AGS收银台</div></el-col>
        <el-col :span="8">
            <div class="topMenu">
                <li>
                    <router-link to="/">
                    <el-button type="warning" v-if="index==1">商品结算</el-button>
                    <el-button v-else="">商品结算</el-button>
                    </router-link>
                </li>
                <li>
                    <router-link to="/kuaidi">
                    <el-button type="warning" v-if="index==2">发快递</el-button>
                    <el-button v-else="">发快递</el-button>
                    </router-link>
                </li>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="topBar">
                <li>用户名：{{username}}</li>
                <li><el-button @click="signout" size="mini">退出</el-button></li>
            </div>  
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "topnav",
    props: {
        'username':String,
        'index':String
    },
    methods:{
        signout(){
            this.$store.commit('SIGN_OUT');
            this.$router.push({ path:'/login'});
        }
    }
};
</script>
<style scoped>
.el-header{background: #99a9bf}
.logo{font-size: 30px; color: #fff; line-height: 60px;}
.topBar{text-align: right; color: #fff; padding-top: 15px}
.topBar li{padding-right: 20px; display: inline-block; list-style:none;}
.topMenu{clear: both; text-align: left; margin-top:10px; text-align: center;}
.topMenu li{list-style: none;display: inline-block; margin:0 10px;}
</style>