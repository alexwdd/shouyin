<template>
    <div class="wrap">
        <el-container style="height:100%">
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
						<el-table-column
                        prop="stock"					
                        label="库存"
                        width="60"
						v-if="stock=='web'"
                        >
                        </el-table-column>
						<el-table-column
                        prop="stock1"					
                        label="库存"
                        width="60"
						v-if="stock=='shop'"
                        >
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

					<el-dialog title="到店支付订单" :visible.sync="dialogTableVisible">
						<el-table :data="order">
						<el-table-column property="name" label="商品">
							<template slot-scope="scope">
							<p v-for="vo in scope.row.goods">{{vo.name}}</p>
							</template>
						</el-table-column>
						<el-table-column property="name" label="数量" width="100">
							<template slot-scope="scope">
							<p v-for="vo in scope.row.goods">{{vo.number}}</p>
							</template>
						</el-table-column>
						<el-table-column		
						label="操作"
						width="100">
						<template slot-scope="scope">
						<el-button @click="orderSelect(scope.row)" type="text" size="small">选择</el-button>
						<el-button @click="orderDelete(scope.row)" type="text" size="small">删除</el-button>
						</template>
						</el-table-column>
						</el-table>
					</el-dialog>

					<el-dialog title="付款人" size="mini" :visible.sync="dialogUserVisible">
						<el-row :gutter="20">
                            <el-col :span="12">
                                <el-input placeholder="姓名/电话" v-model="userParam.keyword">
                                    <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>								
                                </el-input>		
                            </el-col>
                        </el-row>
						<el-table :data="invoiceList">
						<el-table-column property="name" label="姓名"></el-table-column>
						<el-table-column property="tel" label="电话"></el-table-column>
						<el-table-column property="company" label="公司"></el-table-column>
						<el-table-column property="abn" label="ABN"></el-table-column>
						<el-table-column property="address" label="地址"></el-table-column>						
						<el-table-column		
						label="操作"
						width="100">
						<template slot-scope="scope">
						<el-button @click="selectUser(scope.row)" type="text" size="small">选择</el-button>
						</template>
						</el-table-column>
						</el-table>
						<el-pagination
							background
							@current-change="changePage"
							layout="prev, pager, next"
							:total="userParam.total">
						</el-pagination>
					</el-dialog>

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
                        <el-table-column
                        prop="danjia"					
                        label="带走价"
                        width="100"
                        >
                        </el-table-column>   
						<el-table-column
                        prop="money"					
                        label="小计"
                        width="100"
                        >
                        </el-table-column>                     						
                        <el-table-column label="商品数量" width="150">
                            <template scope="scope">
                                <el-input-number @blur="changeNumber(scope.row)" @change="changeNumber(scope.row)" size="mini" v-model="scope.row.number" :min="1" ></el-input-number>
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
                        <el-col :span="5">
                            <div class="moneyBox">
                                <li>
									<label>应收金额</label>
                                	<span class="money">{{total}}</span>
								</li>
                                <li>
									<label>商品金额</label>
                                	<span>{{goodsMoney}}</span>
								</li>
								<li>
									<label>总重量</label>
                                	<span>{{totalWeight}}</span>
								</li>
                                <li>
									<label>邮费</label>
                                	<span>{{yunfei}}</span>
								</li>			
                            </div>						
                        </el-col>
                        <el-col :span="11">
                            <div class="action" style="margin-top: 40px">
								<li>
                                会员价
                                <el-switch v-model="vip" on-value="1" off-value="0" @change="setVip"></el-switch>
								</li>

								<li>
								带走
                                <el-switch v-model="dai" on-value="1" off-value="0" @change="setDai"></el-switch>
								</li>

								<li>
								<el-select v-model="stock" placeholder="请选择仓库" size="mini" style="width:100px">
									<el-option
									v-for="item in stockOpt"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
								</el-select>
								</li>

								<li>
								<el-button size="mini" @click="selectInvoiced">{{invoiced.name|empty('选择付款人')}}</el-button>								
								</li>
                            </div>							
                        </el-col>
                        <el-col :span="8">
                            <div class="action">
                                <el-button plain type="primary" @click="printSmall" :disabled="isDisabled">打印小票</el-button>
                                <el-button plain type="primary" @click="printFormal" :disabled="isDisabled">正式票据</el-button>
                                <el-button plain type="primary" @click="printA4" :disabled="isDisabled">打印A4</el-button>
                                <el-button type="primary" @click="doSubmit" :disabled="isDisabled">保存</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from "element-ui";

export default {
    data() {
        return {
            user:{},
			keyword : '',
			orderKeyword:'',
			allGoods:[],//全部商品
			goods:[], 	//左侧商品列表
			cart:[],	//购物车
			order:[],
			total:0.00,
			totalWeight:0.00,
			goodsMoney:0.00,
			yunfei:0.00,
			dai:false,
			vip:false,
			dialogTableVisible:false,
			dialogUserVisible:false,
			isDisabled:true,
			payType:'',
			pay_opt: [], //支付方式选项
			invoiced:[],
			invoiceList:[],
			userParam:{page:1,keyword:'',total:0},
			stock:'shop',
			member:'',
			stockOpt: [{
              value: 'shop',
              label: '门店'
            }, {
              value: 'web',
              label: '仓库'
            }]
        };
    },
    watch:{
        keyword(newVal, oldVal){//普通的watch监听
            if (newVal!=''){
            	this.searchGoods(newVal);
            }else{
            	this.goods = [];
            }
		},
		$route(to,from){
			if(this.$store.state.flag){
				this.cart = this.$store.state.cart;
				this.getTotalPrice();
				this.$store.commit("CLEAR_CART");
			}			
		}
    },
    created() {
        this.init();
    },
    methods: {
        init(){			
            this.user = JSON.parse(this.$store.state.user);
            this.getAllInfo();
            let orderID = this.$route.query.orderID;
            if (orderID!='' && orderID!=undefined){
                this.orderID = orderID;
                this.createOrder(orderID);
            }
        },
        getAllInfo(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
            let loadding = Loading.service();
            let data = {token:this.$store.state.token};
            this.$http.post('/getAllInfo',data).then((res)=>{
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
        searchGoods(keyword){
			let that = this;
			let temp = [];
			for (var i = 0; i < that.allGoods.length; i++) {
				keyword = keyword.toLowerCase();
				let goodsName = that.allGoods[i]['name'].toLowerCase();
				let goodsShort = that.allGoods[i]['short'].toLowerCase();
				let goodsKeyword = that.allGoods[i]['keyword'].toLowerCase();
				if (keyword==that.allGoods[i]['id'] || goodsName.indexOf(keyword) != -1 || goodsShort.indexOf(keyword) != -1 || goodsKeyword.indexOf(keyword) != -1){
					temp.push(that.allGoods[i]);
				}
			}
			that.goods = temp;
		},
        insertGoods(row){	
			let that = this;
			let data = {};
			data.id = row.id;
			data.name = row.name;
			data.en = row.en;
			data.goodsID = row.goodsID;
			data.stock = row.stock;
			data.stock1 = row.stock1;
			data.goodsNumber = row.goodsNumber;
			data.short = row.short;
			data.wuliuWeight = row.wuliuWeight;
			data.price = row.price;
			data.price1 = row.price1;
			data.inprice = row.inprice;
			data.gst = row.gst;
			data.number = row.number;
			data.money = row.money;
			data.itemType = row.itemType;			
			that.cart.push(data);
			that.getTotalPrice();
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
		selectInvoiced(value){
	        for(var i in this.invoiced_opt){
	            if(this.invoiced_opt[i]['id']!=value.id){
					this.invoiced = this.invoiced_opt[i];
					this.$store.commit("SET_INVOICED",this.invoiced);
	            }
			}
		},
        changeWeight(){
			this.getTotalPrice();
		},
		changeNumber(row){
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
		setDai(status){
			if (status){
				this.dai = true;
			}else{
				this.dai = false;
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
			let totalWeight = 0;
			for(var i in that.cart){
				that.cart[i]['weight'] = (that.cart[i]['wuliuWeight']*that.cart[i]['number']).toFixed(2);
				totalWeight += that.cart[i]['wuliuWeight']*that.cart[i]['number'];
				if (this.vip==true){
					danjia = that.cart[i]['price1'];
				}else{
					danjia = that.cart[i]['price'];
				}
				if (this.dai==true && that.cart[i]['gst']==1){
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
					gst += that.cart[i]['danjia'] - that.cart[i]['danjia']/1.1;
				}
			}
	        total = money + yunfei;
			that.gst = gst.toFixed(2);
			that.totalWeight = totalWeight.toFixed(2);
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
					this.invoiced = [];
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
			this.$router.push({ path:'/xiaopiao'});
		},
		printFormal(){
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
			this.$router.push({ path:'/formal'});
		},
		printA4(){
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
            this.$http.post('/submit',{data:data}).then((res)=>{
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
        searchOrder(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined || this.orderKeyword==''){
				return false;
			}
			let loadding = Loading.service();
            let data = {token:this.$store.state.token,keyword:this.orderKeyword};
            this.$http.post('/searchOrder',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
					if(res.body.order.length>0){
						this.dialogTableVisible = true;
						this.order = res.body.order;
					}else{
						this.dialogTableVisible = false;
						this.order = '';
					}
                    
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
					this.$alert(res.desc,{type:'error'});
				}
			})
		},
		clearSearch(){
			this.member = '';
			this.order = [];
			this.orderKeyword = '';
			this.vip = false;
			this.pay_opt[4]['checked'] = true;
			this.getTotalPrice();			
		},
		orderDelete(row){
			let that = this;
			let list=[];			
	        for(var i in that.order){
	            if(that.order[i]['id'] != row.id){
	                list.push(that.order[i]);
	            }
	        }
	        that.order = list;	
		},
		orderSelect(row){
			let that = this;
			this.cart = row.goods;
			that.order = [];
			this.dialogTableVisible = false;
			this.getTotalPrice();
		},
		selectInvoiced(){
			this.dialogUserVisible = true;
			this.page = 1;
			this.getInvoicedUser();
		},
		searchUser(){
			this.page = 1;
			this.getInvoicedUser();
		},
		selectUser(row){
			this.invoiced = row;
			this.dialogUserVisible = false;
			this.$store.commit("SET_INVOICED",row);
		},
		changePage(value){
			this.page = value;
			this.getInvoicedUser();
		},
		getInvoicedUser(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
            let loadding = Loading.service();
            let data = {
				token:this.$store.state.token,
				keyword:this.userParam.keyword,
				page:this.userParam.page,
			};
            this.$http.post('/invoice',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.invoiceList = res.body.invoice;
                    this.userParam.total = res.body.total;
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
.wrap{height: 100%;}
.el-aside{box-sizing: border-box;background: #f7f7f7;}
.el-main{height: 100%; box-sizing: border-box;}
.el-footer{box-sizing: border-box; background: #f1f1f1}
.main{width: 100%; padding: 10px; box-sizing: border-box;}
.moneyBox{clear: both; padding-top: 5px}
.moneyBox li{clear: both; width: 100%; line-height: 23px}
.moneyBox li label{float: left; font-size: 12px; width: 80px; color: #666}

.action{text-align: right; margin-top: 30px;}
.action li{float: left; padding-right:20px;}
.bar{margin-bottom: 20px;}
.barAction{text-align: right;}
.logo{font-size: 30px; color: #fff; line-height: 60px;}
.topBar{text-align: right; color: #fff; padding-top: 15px}
.topBar li{padding-right: 20px; display: inline-block; list-style:none;}
.topMenu{clear: both; text-align: left; margin-top:10px; text-align: center;}
.topMenu li{list-style: none;display: inline-block; margin:0 10px;}
</style>