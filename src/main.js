import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import config from "./config";
import axios from './httpConfig/http.js'
import moment from 'moment';
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(elementUI);
Vue.config.productionTip = false
Vue.prototype.config = config
Vue.prototype.$http = axios

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

Vue.filter("empty",function(value,str){
	if(value=='' || value==undefined){
		return str;
	}else{
		return value;
	}
})

new Vue({
    data: {
        
	},
	router,
	store,
    render: h => h(App),
}).$mount('#app')