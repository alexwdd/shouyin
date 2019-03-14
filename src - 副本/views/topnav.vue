<template>	
    <el-row>
        <el-col :span="12"><div class="logo">AGS收银台</div></el-col>
        <el-col :span="6">
            <div class="topBar">
                <el-select v-model="stock" placeholder="请选择仓库" size="mini">
                    <el-option
                    v-for="item in stockOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </el-col>
        <el-col :span="6">
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
        'index':String,
        'stockOpt':[]
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