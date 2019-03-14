<template>
	<table class="myTable">
		<tr>
			<td style="width: 50%">
				<div class="company">Train Exporting Pty Ltd</div>
				<div class="info">Unit 1 140 Ashley St</div>
            	<div class="info">ABN:Underdale SA 5032</div>
			</td>
			<td>
				<div class="company text-right">TAX INVOICE</div>
	            <div class="info text-right">Invoice No: {{info.No}}</div>
            	<div class="info text-right">{{info.time | dateFormat("DD/MM/YYYY")}}</div>
			</td>
		</tr>
		<tr>
			<td style="width: 50%">Invoiced To</td>
			<td>Payment Amount:${{info.total}}</td>
		</tr>
		<tr>
			<td style="width: 50%"><el-input type="textarea" :rows="5"></el-input></td>
			<td>
				<p>Commonwealth Bank</p>
				<p>Name: Train Exporting</p>
				<p>BSB: 065 000</p>
				<p>Account Number: 12334607</p>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<div class="list">
					<li class="col1">No.</li>
					<li class="col2">Description</li>
					<li class="col3">Qty</li>
					<li class="col4">Price</li>
					<li class="col5">Tax</li>
					<li class="col6">Extension</li>
				</div>
				<div class="list" v-for="(item, key) in info.goods">
					<li class="col1">{{key+1}}</li>
					<li class="col2">{{item.name}}</li>
					<li class="col3">{{item.number}}</li>
					<li class="col4">${{item.money}}</li>
					<li class="col5" v-if="item.gst==1">GST</li>
					<li class="col5" v-else="">FRE</li>
					<li class="col6">${{item.danjia}}</li>
				</div> 
				<div class="line"></div> 
				<el-row :gutter="20">
					<el-col :span="6">
						Payment Details<br/>{{info.payType}}
					</el-col>
					<el-col :span="6">${{info.total}}</el-col>
					<el-col :span="12">
						<p style="text-align: right;">Sub Total:${{info.total}}</p>
						<p style="text-align: right;">Total Amount Including GST:${{info.gst}}</p>
						<p style="text-align: right;">GST Included:${{info.gst}}</p>
					</el-col>
				</el-row> 
			</td>
		</tr>
	</table>	
</template>

<script>
export default {
	name: "dapiao",
	data(){
		return {
			info:{}
		}
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/dapiao') {
		    	this.getOrderInfo();
		    }
		}
    },
	created(){
		this.getOrderInfo();
	},
	methods:{
		getOrderInfo(){
			this.info = this.$store.state.order;
			let goods = this.info.goods;
			let gst = 0;
			for(var i in goods){
				if(goods[i]['gst']==1){
					gst += goods[i]['danjia'] - goods[i]['danjia']/1.1;
				}
			}
			this.info.gst = gst.toFixed(2);
			console.log(gst);
		}
	}
};
</script>

<style scoped>
.myTable{border-collapse:collapse;border: 1px solid #000000; width: 800px; margin: 15px auto;}
.myTable td{border-collapse:collapse;border: 1px solid #000000; padding: 10px}
.company{font-size: 20px; font-weight: bold;}
.text-right{text-align: right;}
.list{clear: both; overflow: hidden; padding: 5px 0}
.list li{float: left; list-style: none;}
.col1{width: 5%;}
.col2{width: 40%;}
.col3{width: 20%; text-align: right;}
.col4{width: 10%; text-align: right;}
.col5{width: 10%; text-align: right;}
.col6{width: 15%; text-align: right;}
.line{border-bottom: 1px #000 dashed; font-size: 0; margin:10px 0;}
</style>