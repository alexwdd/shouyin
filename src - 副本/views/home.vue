<template>
	<el-container>
		<el-header>
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
		                <li>用户名：{{user.username}}</li>
						<li><el-button @click="handlerHistory" size="mini">历史订单</el-button></li>
		                <li><el-button @click="signout" size="mini">退出</el-button></li>
		            </div>  
		        </el-col>
		    </el-row>
		</el-header>	
		<el-container>
			<el-aside width="30%">
				<div class="main" style="padding-top: 20px">
					<el-input v-model="keyword" placeholder="请输入商品关键词或编号"></el-input>

					<el-table :data="goods" @row-click="insertGoods" style="width: 100%;margin-top: 20px">
						<el-table-column
						prop="id"
						label="编号"
						width="50"
						>
						</el-table-column>
						<el-table-column
						prop="name"
						label="名称"
						>
						</el-table-column>
						<el-table-column
						prop="price"
						label="价格"
						width="80">
						</el-table-column>
						<el-table-column
						prop="price1"
						label="会员价"
						width="80">
						</el-table-column>	
					</el-table>
				</div>
			</el-aside>
		<el-container>
		  	<el-main>
		  		<div class="bar">
		  			<el-row :gutter="20">
						<el-col :span="6">
							<el-input placeholder="会员账号/手机" v-model="orderKeyword">
								<el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>								
							</el-input>		
						</el-col>
						<el-col :span="12" style="height:40px">		
							<el-alert
							v-if="member"
							:title="'姓名【'+member.name+'】身份【'+member.group+'】余额【$'+member.money+'】'"
							type="warning" @close="clearSearch">
							</el-alert>
						</el-col>
						<el-col :span="6">
							<div class="barAction">								
								<el-button type="danger" @click="clearCart">清空</el-button>
							</div>
						</el-col>
					</el-row>
		  		</div>

				<el-card class="box-card" v-for="item in history" :key="item.id" style="margin-bottom: 20px">
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
					<p style="margin-top: 15px"><el-button type="primary" @click="historySelect(item.id)">编辑</el-button> <el-button type="primary" @click="historyDelete(item.id)">删除</el-button></p>			
				</el-card>

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
					<p style="margin-top: 15px"><el-button type="primary" @click="orderSelect(item.id)">选择</el-button> <el-button type="primary" @click="orderDelete(item.id)">删除</el-button></p>			
				</el-card>

				<el-table :data="cart" border style="width: 100%">
					<el-table-column
					prop="name"
					label="名称"
					>
					</el-table-column>
					<el-table-column
					prop="weight"			
					label="重量"
					width="100"
					>
					</el-table-column>
					<el-table-column
					prop="money"					
					label="带走价"
					width="100"
					>
					</el-table-column>
					<el-table-column
					label="价格"
					width="100">
					<template scope="scope">
	                    <el-input @blur="changePrice(scope.row)" v-model="scope.row.price" size="mini"></el-input>
	                </template>
					</el-table-column>
					<el-table-column					
					label="会员价"
					width="100">
					<template scope="scope">
	                    <el-input @blur="changePrice(scope.row)" v-model="scope.row.price1" size="mini"></el-input>
	                </template>
					</el-table-column>
					<el-table-column label="商品数量" width="150">
		                <template scope="scope">
							<el-input-number @blur="changeNumber(scope.row)" @change="changeNumber(scope.row)" size="mini" v-model="scope.row.number" :min="1" :max="100"></el-input-number>
						</template>
            		</el-table-column>
					<el-table-column		
						label="操作"
						width="50">
						<template slot-scope="scope">
						<el-button @click="delGoods(scope.$index)" type="text" size="small">删除</el-button>
						</template>
						</el-table-column>
				</el-table>

				<el-card class="box-card" style="margin-top: 15px">
					<div slot="header" class="clearfix">
						<span>支付方式</span>
					</div>
					<el-radio :disabled="item.checked" v-for="item in pay_opt" v-model="payType" @change="getTotalPrice" :label="item.name" :key="item.id">{{item.name}}</el-radio>
				</el-card>
		  	</el-main>
		  	<el-footer height="100px">
		  		<el-row :gutter="20">
					<el-col :span="9">
						<div class="moneyBox">
							<label>应收金额</label>
							<span class="money">{{total}}</span>
							<label>商品金额</label>
							<span>{{goodsMoney}}</span>
							<label>邮费</label>
							<span>{{yunfei}}</span>
						</div>						
					</el-col>
					<el-col :span="3">
						<div class="action" style="margin-top: 40px">
							会员价
							<el-switch v-model="vip" on-value="1" off-value="0" @change="setVip"></el-switch>
						</div>
					</el-col>
					<el-col :span="3">
						<div class="action" style="margin-top: 40px">							
							带走
							<el-switch v-model="gst" on-value="1" off-value="0" @change="setGst"></el-switch>
						</div>
					</el-col>
					<el-col :span="9">
						<div class="action">
							<el-button plain type="primary" @click="printSmall" :disabled="isDisabled">打印小票</el-button>
							<el-button plain type="primary" @click="printA4" :disabled="isDisabled">打印A4</el-button>
							<el-button type="primary" @click="doSubmit" :disabled="isDisabled">保存</el-button>
						</div>
					</el-col>
				</el-row>
		  	</el-footer>
		</el-container>
		</el-container>
	</el-container>	
</template>

<script>
import topnav from "./topnav";
import axios from 'axios';
import config from "../config";
import { Loading } from 'element-ui';

export default {
	name: "home",
	data(){
		return {
			user:{},
			keyword : '',
			orderKeyword:'',
			allGoods:[],//全部商品
			goods:[], 	//左侧商品列表
			cart:[],	//购物车
			order:[],
			history:[], //历史订单
			total:0.00,
			goodsMoney:0.00,
			yunfei:0.00,
			gst:false,
			vip:false,
			isDisabled:true,
			payType:'',
			pay_opt: [], //支付方式选项
			stock:'shop',
			member:'',
			stockOpt: [{
              value: 'shop',
              label: '店铺仓库'
            }, {
              value: 'web',
              label: '网站仓库'
            }]
		}
	},
	components:{topnav},
	watch:{
        keyword(newVal, oldVal){//普通的watch监听
            if (newVal!=''){
            	this.searchGoods(newVal);
            }else{
            	this.goods = [];
            }
		},
		$route(to,from){
		    // if (to.path=='/' && from.path!='/xiaopiao') {		    	
		    // 	this.getTotalPrice();
		    // }
		}
    },
	created(){
		this.user = JSON.parse(this.$store.state.user);
		this.getAllInfo();
		let orderID = this.$route.query.orderID;
		if (orderID!='' && orderID!=undefined){
			this.orderID = orderID;
			this.createOrder(orderID);
		}
	},
	methods:{
		getAllInfo(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
			let loadding = Loading.service();
			axios({
				method: 'post',
				url: config.getAllInfo,
				data: {token:this.$store.state.token},
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
	    			this.allGoods = res.body.goods;
	    			this.pay_opt = res.body.payType;
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
		handlerHistory(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
			let loadding = Loading.service();
			let params = new URLSearchParams();
			params.append('token', this.$store.state.token);
			axios({
				method: 'post',
				url: config.history,
				data: params
			})
			.then(res => {
				loadding.close();
				res = res.data;
	    		if (res.code==1){
	    			this.history = res.body.order;
				}else if(res.code==9001){
					this.$alert(res.desc,{
						type:'error',
						callback: action => {
				            this.$store.commit('SIGN_OUT');
							this.$router.push({ path:'/login'});
				        }
					});										
				}else if(res.code==0){
					this.$alert(res.desc);
				}			
			})
		},
		searchOrder(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined || this.orderKeyword==''){
				return false;
			}
			let loadding = Loading.service();
			let params = new URLSearchParams();
			params.append('token', this.$store.state.token);
			params.append('keyword', this.orderKeyword);
			axios({
				method: 'post',
				url: config.searchOrder,
				data: params
			})
			.then(res => {
				loadding.close();
				res = res.data;
	    		if (res.code==1){
	    			this.order = res.body.order;
					this.member = res.body.user;
					if(this.member.group=='会员用户'){
						this.vip = true;
					}else{
						this.vip = false;
					}
					if(this.member.money > 0){
						this.pay_opt[4]['checked'] = false;
					}else{
						this.pay_opt[4]['checked'] = true;
					}
					this.getTotalPrice();
				}else if(res.code==9001){
					this.$alert(res.desc,{
						type:'error',
						callback: action => {
				            this.$store.commit('SIGN_OUT');
							this.$router.push({ path:'/login'});
				        }
					});										
				}else if(res.code==0){
					this.$alert(res.desc);
				}			
			})
			//this.$router.push({ path:'/search',query:{keyword:this.orderKeyword}});
		},
		clearSearch(){
			this.member = '';
			this.order = [];
			this.orderKeyword = '';
			this.vip = false;
			this.getTotalPrice();
		},
		historyDelete(orderID){
			let that = this;
			let list=[];			
	        for(var i in that.history){
	            if(that.order[i]['id'] != orderID){
	                list.push(that.order[i]);
	            }
	        }
	        that.history = list;	
		},
		orderDelete(orderID){
			let that = this;
			let list=[];			
	        for(var i in that.order){
	            if(that.order[i]['id'] != orderID){
	                list.push(that.order[i]);
	            }
	        }
	        that.order = list;	
		},
		orderSelect(orderID){
			let that = this;
			for(var i in that.order){
	            if(that.order[i]['id'] == orderID){
					this.cart = that.order[i].goods;
					break;
	            }
	        }
			that.order = [];
			this.getTotalPrice();
		},
		searchGoods(keyword){
			let that = this;
			let temp = [];
			for (var i = 0; i < that.allGoods.length; i++) {
				if (keyword==that.allGoods[i]['id'] || that.allGoods[i]['name'].indexOf(keyword) != -1){
					temp.push(that.allGoods[i]);
				}
			}
			that.goods = temp;
		},	
		insertGoods(row){
			let that = this;
			let data = {};
			/*let flag = true;
			for (var i = 0; i < that.cart.length; i++) {
				if (row.id == that.cart[i]['id']){
					flag = false;
					break;
				}
			}
			if (flag){
				that.cart.push(row);
			}*/
			data.id = row.id;
			data.name = row.name;
			data.goodsID = row.goodsID;
			data.goodsNumber = row.goodsNumber;
			data.short = row.short;
			data.wuliuWeight = row.wuliuWeight;
			data.price = row.price;
			data.price1 = row.price1;
			data.gst = row.gst;
			data.number = row.number;
			data.money = row.money;
			data.itemType = row.itemType;
			that.cart.push(data);
			this.getTotalPrice();
		},
		delGoods(index){
			let that = this;
			let list=[];
	        for(var i in that.cart){
	            if(i!=index){
	                list.push(that.cart[i]);
	            }
	        }
	        that.cart = list;
	        this.getTotalPrice();			
		},
		changeWeight(){
			this.getTotalPrice();
		},
		changeNumber(row){
			//console.log(row);
            this.getTotalPrice();
		},
		changePrice(row){
			this.getTotalPrice();
		},
		setVip(status){
			if (status){
				this.vip = true;
			}else{
				this.vip = false;
			}
			this.getTotalPrice();
		},
		setGst(status){
			if (status){
				this.gst = true;
			}else{
				this.gst = false;
			}
			this.getTotalPrice();
		},
		getTotalPrice(){
			let that = this;
			let money = 0;
			let yunfei = 0;
			let total = 0;
			let danjia = 0;
			let tempMoney = 0;
			let gst = 0;			
			for(var i in that.cart){
				that.cart[i]['weight'] = (that.cart[i]['wuliuWeight']*that.cart[i]['number']).toFixed(2);
				if (this.vip==true){
					danjia = that.cart[i]['price1'];
				}else{
					danjia = that.cart[i]['price'];
				}
				if (this.gst==true){
					danjia = (danjia*1.1).toFixed(2);	
				}
				that.cart[i]['danjia'] = danjia;		
				tempMoney = danjia * that.cart[i]['number'];		
				that.cart[i]['money'] = tempMoney.toFixed(2);
				if(that.cart[i]['itemType']==2){//商品类型是物流
					yunfei += tempMoney;
				}else{
					money += tempMoney;
				}
				if(that.cart[i]['gst']==1){
					gst += goods[i]['danjia'] - goods[i]['danjia']/1.1;
				}
			}
	        total = money + yunfei;
	        that.gst = gst.toFixed(2);
	        that.yunfei = yunfei.toFixed(2);
	        that.goodsMoney = money.toFixed(2);
	        that.total = total.toFixed(2);
	        that.danjia = danjia;
	        if (that.cart.length>0){
	        	that.isDisabled = false;
	        }else{
	        	that.isDisabled = true;
			}
	        let data = {
	        	'goods':that.cart,
	        	'vip':that.vip,
	        	'payType':that.payType,
	        	'total':that.total,
	        	'yunfei':that.yunfei,
	        	'goodsMoney':that.goodsMoney,
	        	'gst':that.gst,
	        }
	        this.$store.commit('SET_ORDER',data);
		},
		clearCart(){
			this.$confirm('确定要这样做吗?', '提示', {
        		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
        		}).then(() => {
          			this.cart = [];
					this.total = 0;
					this.member = '';
					this.order = [];
					this.orderKeyword = '';
					this.getTotalPrice();
        		});
		},
		printSmall(){
			if (this.payType==''){
				this.$alert('请选择收款方式',{type:'error'});
				return false;
			}
			console.log(this.$store.state.order);
			this.$router.push({ path:'/xiaopiao'});
		},
		printA4(){
			if (this.payType==''){
				this.$alert('请选择收款方式',{type:'error'});
				return false;
			}
			console.log(this.$store.state.order);
			if (this.$store.state.order.No=='' || this.$store.state.order.No==undefined){
				this.$alert('请先打印小票',{
					type:'error'
				});
				return false;
			}
			this.$router.push({ path:'/dapiao'});
		},
		doSubmit(){
			if (this.payType==''){
				this.$alert('请选择收款方式',{type:'error'});
				return false;
			}
			if (this.$store.state.order.No=='' || this.$store.state.order.No==undefined){
				this.$alert('请先打印小票',{
					type:'error'
				});
				return false;
			}
			let loadding = Loading.service({text:'数据提交中...'});
			let data = this.$store.state.order;
			data.token = this.$store.state.token;
			data.stock = this.stock;
			if(this.member){
				data.member = this.member;
			}else{
				data.member = '';
			}			
			data.No = this.$store.state.order.No;
			data = JSON.stringify(data);
			axios({
				method: 'post',
				url: config.submit,
				data: {data:data},
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
	    			this.$alert(res.desc,{
						type:'success',
						callback: action => {
				            window.location.reload();
				        }
					});	
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
		signout(){
            this.$store.commit('SIGN_OUT');
            this.$router.push({ path:'/login'});
        }
	}
};
</script>

<style scoped>
.el-header{background: #99a9bf}
.el-aside{box-sizing: border-box;background: #f7f7f7;}
.el-main{height: 100%; box-sizing: border-box;}
.el-footer{box-sizing: border-box; background: #f1f1f1}
.main{width: 100%; padding: 10px; box-sizing: border-box;}
.moneyBox{line-height:100px;}
.moneyBox label,.moneyBox span{display: block; float: left; margin-right: 10px}
.money{font-size: 30px;}
.action{text-align: right; margin-top: 30px;}
.bar{margin-bottom: 20px;}
.barAction{text-align: right;}
.logo{font-size: 30px; color: #fff; line-height: 60px;}
.topBar{text-align: right; color: #fff; padding-top: 15px}
.topBar li{padding-right: 20px; display: inline-block; list-style:none;}
.topMenu{clear: both; text-align: left; margin-top:10px; text-align: center;}
.topMenu li{list-style: none;display: inline-block; margin:0 10px;}
.youji{clear: both;}
.youji li{list-style: none; float: left; width: 25%; padding-bottom:10px}
.youji li .el-input{width: 100px;}
</style>