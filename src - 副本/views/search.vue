<template>
	<el-container>
		<el-aside width="30%">
			<div class="main" style="padding-top: 20px">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>会员信息</span>
					</div>
					<div class="userinfo">
						<li>
							<label>姓名</label>
							<p>{{member.name}}</p>
						</li>
						<li>
							<label>手机</label>
							<p>{{member.mobile}}</p>
						</li>
						<li>
							<label>身份</label>
							<p>{{member.group}}</p>
						</li>
						<li>
							<label>账户余额</label>
							<p>${{member.money}}</p>
						</li>
					</div>
				</el-card>
			</div>
		</el-aside>
		<el-main>
			<el-card class="box-card" v-for="item in order" style="margin-bottom: 20px">
				<div slot="header" class="clearfix">
					<span>订单号：{{item.order_no}}</span>
				</div>	
				<el-table :data="item.goods" style="width: 100%;">
					<el-table-column
					prop="name"
					label="商品"	
					>
					</el-table-column>
					<el-table-column
					prop="number"
					label="数量"
					width="100"
					>
					</el-table-column>
				</el-table>	
				<p style="margin-top: 15px"><el-button type="primary" @click="doSelect(item.id)">去结算</el-button></p>			
			</el-card>
		</el-main>

		<div class="back" @click="back()">返回</div>
	</el-container>
</template>

<script>
import axios from 'axios';
import config from "../config";
import { Loading } from 'element-ui';

export default {
	name: "search",
	data(){
		return {
			keyword : '',
			order:[],
			member:[]
		}
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/search') {		    	
		    	this.keyword = this.$route.query.keyword;
		    	this.searchGoods();
		    }
		}
    },
	created(){
		this.keyword = this.$route.query.keyword;
		if (this.keyword=='' || this.keyword==undefined){
			this.back();
		}else{
			this.searchGoods();
		}
	},
	methods:{
		doSelect(orderID){
			this.$router.push({ path:'/',query:{orderID:orderID}});
		},
		searchGoods(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
			let loadding = Loading.service();
			axios({
				method: 'post',
				url: config.searchOrder,
				data: {token:this.$store.state.token,keyword:this.keyword},
				transformRequest: [function (data) { 
					let ret = '' 
					for (let it in data) { 
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&' 
					} 
					return ret
				}],
				headers: {
		            'Content-Type': 'application/x-www-form-urlencoded'
		        }
			})
			.then(res => {
				loadding.close();
				res = res.data;
	    		if (res.code==1){
	    			this.order = res.body.order;
	    			this.member = res.body.user;
				}else if(res.code==9001){
					this.$alert(res.desc,{
						type:'error',
						callback: action => {
				            this.$store.commit('SIGN_OUT');
							this.$router.push({ path:'/login'});
				        }
					});										
				}else if(res.code==0){
					this.$alert(
						res.desc,
						{
							type:'error',
							callback: action => {
					            this.back();
					        }
						}
					);
				}			
			})
		},
		back(){
			this.$router.push({path:'/'});
		}
	}
};
</script>

<style>
.back{width: 80px; height: 80px; background: #3a8ee6; border-radius: 50%; cursor: pointer; color: #fff; position: fixed; right: 20px; bottom: 20px; text-align: center; font-size: 20px; line-height: 80px;}
.userinfo{clear: both; overflow: hidden;}
.userinfo li{list-style:none; padding: 10px 0; clear: both; overflow: hidden;}
.userinfo li label{display: block; float: left; width: 100px; color: #999}
.userinfo li p{float: left;margin: 0}
</style>