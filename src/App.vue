<template>
    <div :class="$route.meta.top ? 'app' : 'print'">
        <el-container style="flex:1">
            <el-header v-if="$route.meta.top">
                <el-row>
                    <el-col :span="6">
                        <div class="logo">{{appName}}</div>
                    </el-col>
                    <el-col :span="12">
                        <el-menu
                            :default-active="activeIndex"
                            background-color="#409EFF"
                            text-color="#ffffff"
                            active-text-color="#ffffff"
                            class="el-menu-demo"
                            mode="horizontal"
                            router
                        >
                            <el-menu-item index="/">下单</el-menu-item>
                            <el-menu-item index="/history">历史</el-menu-item>
                            <el-menu-item index="/log">日志</el-menu-item> 
                        </el-menu>
                    </el-col>
                    <el-col :span="6">
                        <div class="topBar">
                            <li>用户名：{{user.username}}</li>
                            <li>
                                <el-button @click="getComein" size="mini">退出</el-button>
                            </li>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main style="padding:0; height:100%">
                <transition :name="transitionName">
                    <keep-alive>
                        <router-view/>
                    </keep-alive>
                </transition>
            </el-main>
        </el-container>

        <el-dialog title="收款记录" :visible.sync="dialogTableVisible">
            <el-table :data="info">
            <el-table-column property="name" label="收款方式"></el-table-column>
            <el-table-column property="money" label="金额"></el-table-column>
            </el-table>

            <p style="text-align:center;margin-top:20px"><el-button @click="signout" type="primary">确认&退出</el-button></p>
        </el-dialog>
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    name: "app",
    data() {
        return {
            appName : this.config.APP_NAME,
            user: [],
            info:[],
            dialogTableVisible:false,
            activeIndex: "/",
            transitionName: ""
        };
    },
    watch: {
        //使用watch 监听$router的变化
        $route(to, from) {
            //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
            if (to.meta.index > 0) {
                if (to.meta.index < from.meta.index) {
                    this.transitionName = "slide-right";
                } else {
                    this.transitionName = "slide-left";
                }
            } else if (to.meta.index == 0 && from.meta.index > 0) {
                this.transitionName = "slide-right";
            }
        }
    },
    created() {
        this.user = JSON.parse(this.$store.state.user);
    },
    mounted() {},
    methods: {
        getComein() {
            var loadding = Loading.service();
            let data = {token:this.$store.state.token};
            this.$http.post('/getComein',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.info = res.body;
                    this.dialogTableVisible = true;
                }else if(res.code==9001){
					this.$alert(res.desc,{
						type:'error',
						callback: action => {
				            this.$store.commit('SIGN_OUT');
							this.$router.push({ path:'/login'});
				        }
					});										
				}else if(res.code==0){
					this.$alert(res.desc,{type:'error'});
				}
            })          
        },
        signout() {
            this.dialogTableVisible = false;
            var loadding = Loading.service();
            let data = {token:this.$store.state.token};
            this.$http.post('/endShouyin',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.$store.commit("SIGN_OUT");
                    this.$router.push({ path: "/login" });
                }else if(res.code==9001){
					this.$alert(res.desc,{
						type:'error',
						callback: action => {
				            this.$store.commit('SIGN_OUT');
							this.$router.push({ path:'/login'});
				        }
					});										
				}else if(res.code==0){
					this.$alert(res.desc,{type:'error'});
				}
            })         
        }
    }
};
</script>

<style>
body,
html {
    width: 100%;
    height: 100%;
}
li{list-style: none;}
* {
    margin: 0;
    padding: 0;
    font-family:"Microsoft YaHei","微软雅黑","Microsoft JhengHei"
}
.app {
    display: flex;
    height: 100%;
    flex: 1;
    flex-direction: column;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all 0.3s;
    position: absolute;
    width: 100%;
    left: 0;
}
.slide-right-enter {
    transform: translateX(-100%);
}
.slide-right-leave-active {
    transform: translateX(100%);
}
.slide-left-enter {
    transform: translateX(100%);
}
.slide-left-leave-active {
    transform: translateX(-100%);
}
.el-header {
    background: #409eff;
}
.logo {
    font-size: 20px;
    color: #fff;
    line-height: 60px;
}
.topBar {
    text-align: right;
    color: #fff;
    padding-top: 15px;
}
.topBar li {
    padding-right: 20px;
    display: inline-block;
    list-style: none;
}
</style>
