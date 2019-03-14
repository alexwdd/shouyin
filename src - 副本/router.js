import Vue from "vue";
import Router from "vue-router";
import Home from "./views/home";
import Login from "./views/login";
import Search from "./views/search";
import Kuaidi from "./views/kuaidi";
import Xiaopiao from "./views/xiaopiao";
import Dapiao from "./views/dapiao";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            meta:{index:0},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component:Home
        },
        {
            path: "/login",
            name: "login",
            meta:{index:1},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component: Login
        },
        {
            path: "/search",
            name: "search",
            meta:{index:1},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component: Search
        },
        {
            path: "/kuaidi",
            name: "kuaidi",
            meta:{index:1},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component: Kuaidi
        },
        {
            path: "/xiaopiao",
            name: "xiaopiao",
            meta:{index:1},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component: Xiaopiao
        },
        {
            path: "/dapiao",
            name: "dapiao",
            meta:{index:1},//meta对象的index用来定义当前路由的层级,由小到大,由低到高
            component: Dapiao
        }
    ]
});
