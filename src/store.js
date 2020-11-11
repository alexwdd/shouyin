import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token:window.sessionStorage.getItem('token'),
		user:window.sessionStorage.getItem('userinfo'),
		member:'',
		order:{},
		invoiced:{},
		bankcard:{},
		flag:false,
		cart:[]
	},
	mutations: {
		SET_TOKEN(state,data) {
    		state.token = data;
    		window.sessionStorage.setItem('token', data);
		},
		SET_USER(state,data) {
			state.user = data;
			window.sessionStorage.setItem('userinfo', data);
		},
		SIGN_OUT(state){
			state.token = '';
			state.user = [];
			window.sessionStorage.removeItem('token');
			window.sessionStorage.removeItem('userinfo');    		
		},
		SET_MEMBER(state,data) {
			state.member = data;
		},
		CLEAR_MEMBER(state) {
			state.member = "";
		},
		SET_ORDER(state,data) {
			state.order = data;
		},
		SET_ORDER_NO(state,data) {
			state.order.No = data;
		},
		SET_INVOICED(state,data) {
			state.invoiced = data;
		},
		SET_BANKCARD(state,data) {
			state.bankcard = data;
			window.sessionStorage.setItem('bankcard', JSON.stringify(data));
		},
		SET_CART(state,data) {
			state.cart = data;
			state.flag = true;
		},
		CLEAR_CART(state) {
			state.cart = [];
			state.flag = false;
		},
	},
	actions: {}
});
