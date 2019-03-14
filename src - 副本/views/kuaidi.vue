<template>
	<el-container>
		<el-header>
			<topnav :username="user.username" index="2"/>			
		</el-header>

		<el-container>
			<el-aside width="30%">
			</el-aside>
			<el-container>
				<el-main>
			  		<div class="bar">
			  			<el-row :gutter="20">
							<el-col :span="24">
								<div class="barAction">
									<el-button type="danger" @click="clearCart">清空</el-button>
								</div>
							</el-col>
						</el-row>
			  		</div>
		  		</el-main>
			  	<el-footer height="100px">
			  		<el-row :gutter="20">
						<el-col :span="12">
							<div class="moneyBox">
								<label>应收金额</label>
								<span class="money">100</span>
							</div>						
						</el-col>	
				
						<el-col :span="3">
							<div class="action">
								<el-button type="primary" @click="doSubmit" :disabled="isDisabled">结算</el-button>
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
	name: "kuaidi",
	data(){
		return {
			user : {},
			isDisabled:false
		}
	},
	components:{topnav},
	created(){
		this.user = JSON.parse(this.$store.state.user);
	},
	methods:{
		doSubmit(){

		},
		clearCart(){

		},
		signout(){

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
.money{font-size: 40px;}
.action{text-align: right; margin-top: 30px;}
.bar{margin-bottom: 20px;}
.barAction{text-align: right;}
.logo{font-size: 30px; color: #fff; line-height: 60px;}
.topBar{text-align: right; color: #fff; padding-top: 15px}
.topBar li{padding-right: 20px; display: inline-block; list-style:none;}
.topMenu{clear: both; text-align: left; margin-top:10px; text-align: center;}
.topMenu li{list-style: none;display: inline-block; margin:0 10px;}
</style>