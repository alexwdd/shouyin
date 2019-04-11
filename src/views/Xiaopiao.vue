<template>
	<div class="box">
		<div class="title">Picking List</div>
		<p>备注小票号：{{info.No}}</p>
		<p>{{info.time | dateFormat("YYYY-MM-DD HH:mm:ss")}}</p>
		<div class="line"></div>
		<div class="list">
			<li class="col1">名称</li>
			<li class="col2">价格</li>
			<li class="col3">数量</li>
			<li class="col4">总计</li>
		</div>	
		<div class="list" v-for="item in info.goods">
			<li class="col1">{{item.short}}<span v-if="item.goodsNumber>1">*{{item.goodsNumber}}</span></li>
			<li class="col2">${{item.danjia}}</li>
			<li class="col3">{{item.number}}</li>
			<li class="col4">${{item.money}}</li>
		</div>

		<div class="line"></div>
		<div class="total">
			<div class="user">casher : {{user.username}}</div>
			<div class="money">${{info.total}}</div>	
		</div>
	</div>
</template>

<script>

import { Loading } from 'element-ui';

export default {
	data(){
		return {
			user:{},
			info:{}
		}
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/xiaopiao') {
		    	this.getOrderInfo();
		    }
		}
    },
	created(){
		this.user = JSON.parse(this.$store.state.user);
		this.getOrderInfo();
	},
	methods:{
		getOrderInfo(){
            var loadding = Loading.service();
            let data = {token:this.$store.state.token};
            this.$http.post('/getXiaopiaoNo',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    let No = res.body.No;
					this.info = this.$store.state.order;
					this.info.No = No;
					this.info.time = new Date();
					this.$store.commit('SET_ORDER_NO',No);
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

<style scoped>
.box{width: 400px; margin: auto; margin-top: 0; font-size:1.2em}
.title{text-align: center;font-size: 1.4em}
.list{clear: both; overflow: hidden; padding: 5px 0}
.list li{float: left; list-style: none;}
.col1{width: 40%}
.col2{width: 20%; text-align: right;}
.col3{width: 15%; text-align: right;}
.col4{width: 25%; text-align: right;word-wrap:break-word}
.line{border-bottom: 3px #000 dashed; font-size: 0; margin:10px 0;}
.total{text-align: right;}
.total .user{float: left;}
.total .money{float: right;}
</style>