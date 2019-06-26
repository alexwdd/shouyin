<template>
    <div class="wrap">
        <div class="block" style="margin-bottom:10px">
            <el-date-picker
            v-model="dateStr"
            type="daterange"
            range-separator="至"
            @change="selectDate"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">            
            </el-date-picker>
        </div>
        <el-table :data="info" border>
            <el-table-column property="date" label="日期" width="200"></el-table-column>
            <el-table-column property="type.pay1" label="OMI支付" ></el-table-column>
            <el-table-column property="type.pay2" label="现金支付"></el-table-column>
            <el-table-column property="type.pay3" label="银行刷卡"></el-table-column>
            <el-table-column property="type.pay4" label="银行转账"></el-table-column>
            <el-table-column property="type.pay5" label="余额支付"></el-table-column>            
            <el-table-column property="total" label="合计"></el-table-column>            
        </el-table>
    </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from "element-ui";

export default {
    data() {
        return {
            dateStr:'',
            user:[],
            info:[],
            start:'',
            end:''
        };
    },
    watch:{
        $route(to,from){
		    if (to.path=='/log') {
                this.init();
                this.getInfo();
		    }
		}
    },
    created() {
        this.init();
        this.getInfo();
    },
    methods: {
        init(){
            this.user = JSON.parse(this.$store.state.user);
        },
        selectDate(value){
            this.start = value[0];
            this.end = value[1];
            this.getInfo();
        },
        getInfo(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
            let loadding = Loading.service();
            let data = {token:this.$store.state.token,start:this.start,end:this.end};
            this.$http.post('/log',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.info = res.body;
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
.wrap{padding: 20px;}

</style>