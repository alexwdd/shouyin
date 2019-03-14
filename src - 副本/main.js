import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import config from "./config";
import axios from 'axios';
import moment from 'moment';
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(elementUI);

Vue.config.productionTip = false

//全局守卫
router.beforeEach((to,from,next)=>{
	const token = store.state.token ? store.state.token : window.sessionStorage.getItem('token');
	if (token){
		next();
	}else if(to.path=='/login'){
		next();
	}else{
		next('login');
	}
});

Vue.filter("dateFormat",function(dateStr,pattern){
	return moment(dateStr).format(pattern);
})

new Vue({
		data:{
		},
		router,
		store,
		render: h => h(App),
		created:function(){
		},		
		methods:{			
		}
	}
).$mount("#app");