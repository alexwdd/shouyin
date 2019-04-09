<template>
	<div class="box">
		<div class="title">
            <p>TAX INVOICE</p>
            <p>AGS Picking Packing</p>
            <p>ABN:71623342432</p>
            <p>80 King William St Adelaide 5000</p>
        </div>
		<div class="line"></div>
		<div class="list">
			<li class="col5">Item</li>
			<li class="col6">Qty</li>
			<li class="col3">Price</li>
			<li class="col4">Total</li>
		</div>	
		<div class="list" v-for="item in info.goods">
			<li class="col1">{{item.en}}<span v-if="item.gst==0">*</span></li>
			<li class="col5">&nbsp;</li>
			<li class="col6">{{item.number}}</li>
			<li class="col3">${{item.danjia}}</li>
			<li class="col4">${{item.money}}</li>
		</div>

        <div class="tongji">Total Number of Items: {{num}}</div>

		<div class="line"></div>

        <div class="total">
            <li>
                <p>Total Amount</p>
                <span>${{info.total}}</span>
            </li>
            <li>
                <p>*Indicates GST Free Items</p>
            </li>
            <li>
                <p>Include GST</p>
                <span>${{info.gst}}</span>
            </li>
        </div>
        <div class="line"></div>
        <div class="total">
            <li>
                <p>Customer Name</p>
                <span><input type="text" class="text"></span>
            </li>
            <li>
                <p>Invoice Number</p>
                <span>{{info.No}}</span>
            </li>
            <li>
                <p>Date</p>
                <span>{{info.time | dateFormat("YYYY/MM/DD HH:mm")}}</span>
            </li>
        </div>
	</div>
</template>

<script>
export default {
	name: "dapiao",
	data(){
		return {
			info:{},
            invoiced:[],
            num:0
		}
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/formal') {
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
            this.num = 0;
			let goods = this.info.goods;
            let gst = 0;
			for(var i in goods){
                this.num++;
				if(goods[i]['gst']==1){
					gst += goods[i]['number']*(goods[i]['danjia'] - goods[i]['danjia']/1.1);
				}
			}
			this.info.gst = gst.toFixed(2);
			this.invoiced = this.$store.state.invoiced;
			let str = '';
			if(this.invoiced.name!="" && this.invoiced.name!=undefined){
				str += this.invoiced.name+'\n';
			}
			if(this.invoiced.tel!="" && this.invoiced.tel!=undefined){
				str += this.invoiced.tel+'\n';
			}
			if(this.invoiced.company!="" && this.invoiced.company!=undefined){
				str += this.invoiced.company+'\n';
			}
			if(this.invoiced.abn!="" && this.invoiced.abn!=undefined){
				str += this.invoiced.abn+'\n';
			}
			if(this.invoiced.address!="" && this.invoiced.address!=undefined){
				str += this.invoiced.address+'\n';
			}
			this.kaipiao = str;	
		}
	}
};
</script>

<style scoped>
.box{width: 400px; margin: auto; margin-top: 0; font-size:1.2em}
.text{font-size: 1.2em; border: 0; width: 240px; text-align: right}
.title{text-align: center;font-size: 1.2em}
.list{clear: both; overflow: hidden; padding: 5px 0}
.list li{float: left; list-style: none;}
.col1{width: 100%; clear: both; overflow: hidden;}
.col2{width: 60%; text-align: right;}
.col3{width: 15%; text-align: right;}
.col4{width: 25%; text-align: right;word-wrap:break-word}
.col5{width: 40%;}
.col6{width: 20%;}
.line{border-bottom: 3px #000 dashed; font-size: 0; margin:10px 0;}
.tongji{margin-top: 2em; clear: both; overflow: hidden;}
.total{clear: both; overflow: hidden;}
.total li{clear: both; overflow: hidden;}
.total p{float: left;}
.total span{float: right; text-align: right}
</style>