<template>
    <div class="wrap">
        <el-table :data="order" border>
            <el-table-column property="order_no" label="订单号" width="200"></el-table-column>
            <el-table-column property="No" label="小票号" width="100"></el-table-column>
            <el-table-column property="name" label="商品">
                <template slot-scope="scope">
                <p style="font-size:12px" v-for="vo in scope.row.goods">{{vo.name}} * {{vo.number}}</p>
                </template>
            </el-table-column>
            <el-table-column property="memberID" label="会员账号" width="100"></el-table-column>
            <el-table-column property="name" label="姓名" width="100"></el-table-column>
            <el-table-column property="mobile" label="手机号" width="150"></el-table-column>
            <el-table-column property="payType" label="支付方式" width="100"></el-table-column>
            <el-table-column property="total" label="总金额" width="100"></el-table-column>
            <el-table-column		
            label="操作"
            width="100">
            <template slot-scope="scope">
            <el-button @click="orderSelect(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="orderDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from "element-ui";

export default {
    data() {
        return {
            user:[],
            order:[]
        };
    },
    watch:{
        $route(to,from){
		    if (to.path=='/history') {
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
        getInfo(){
			if (this.$store.state.token=='' || this.$store.state.token==undefined){
				return false;
			}
            let loadding = Loading.service();
            let data = {token:this.$store.state.token};
            this.$http.post('/history',data).then((res)=>{
            　　loadding.close();
                res = res.data;
                if (res.code==1){
                    this.order = res.body.order;
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
        orderSelect(row){
            let data = {token:this.$store.state.token,id:row.id};
            this.$http.post('/delOrder',data).then((res)=>{
                res = res.data;
                if (res.code==1){
                    let cart = [];
                    for(var i=0; i<row.goods.length; i++){
                        cart.push(row.goods[i]);
                    }
                    this.$store.commit('SET_CART',cart);
                    this.$router.push({path:'/'});
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