import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Login from "./views/Login";
import Xiaopiao from "./views/Xiaopiao";
import Dapiao from "./views/Dapiao";
import History from "./views/History";
import Log from "./views/Log";


Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            meta:{index:0,top:true},//meta对象的index用来定义当前路由的层级,由小到大,由低到高,top控制顶部header是否显示
            component:Home
        },
        {
            path: "/login",
            name: "login",
            meta:{index:1,top:false},
            component: Login
        },
        {
            path: "/xiaopiao",
            name: "xiaopiao",
            meta:{index:1,top:false},
            component: Xiaopiao
        },
        {
            path: "/dapiao",
            name: "dapiao",
            meta:{index:1,top:false},
            component: Dapiao
        },
        {
            path: "/history",
            name: "history",
            meta:{index:1,top:true},
            component: History
        },
        {
            path: "/log",
            name: "log",
            meta:{index:2,top:true},
            component: Log
        },
    ]
});
