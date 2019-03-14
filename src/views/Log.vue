<template>
    <div class="wrap">
        <el-table :data="info" border>
            <el-table-column property="start" label="登录时间" width="200"></el-table-column>
            <el-table-column property="end" label="退出时间" width="200"></el-table-column>
            <el-table-column property="pay1" label="OMI支付" ></el-table-column>
            <el-table-column property="pay2" label="现金支付"></el-table-column>
            <el-table-column property="pay3" label="银行刷卡"></el-table-column>
            <el-table-column property="pay4" label="银行转账"></el-table-column>
            <el-table-column property="pay5" label="余额支付"></el-table-column>            
        </el-table>
        <el-pagination
            style="margin-top:20px"
            background
            @current-change="changePage"
            layout="prev, pager, next"
            :page-size="pagesize"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from "element-ui";

export default {
    data() {
        return {
            user:[],
            total:0,
            pagesize:10,
            page:1,
            info:[]
        };
    },
    watch:{

    },
    created() {
        this.init();
        this.getInfo();
    },
    methods: {
        init(){
            this.user = JSON.parse(this.$store.state.user);
        },
        changePage(value){
			this.page = value;
			this.getInfo();
		},
        getInfo(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
            let loadding = Loading.service();
            let data = {token:this.$store.state.token,page:this.page};
            this.$http.post('/log',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.info = res.body.list;
                    this.total = 2;
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
        orderDelete(row){
            var that = this;
            this.$confirm('确定要这样做吗?', '提示', {
        		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
            }).then(() => {     
                if (this.$store.state.token=='' || this.$store.state.token==undefined){
                    return false;
                }
                let loadding = Loading.service();
                let data = {token:this.$store.state.token,id:row.id};
                this.$http.post('/delOrder',data).then((res)=>{
                　　loadding.close();
                    res = res.data;
                    if (res.code==1){
                        
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

                let list=[];			
                for(var i in that.order){
                    if(that.order[i]['id'] != row.id){
                        list.push(that.order[i]);
                    }
                }
                that.order = list;
            });
		}
    }
};
</script>
<style scoped>
.wrap{padding: 20px;}

</style>