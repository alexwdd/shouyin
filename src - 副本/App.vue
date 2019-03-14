<template>
    <div id="app">
        <transition :name="transitionName">
            <keep-alive><router-view /></keep-alive>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app',
    data(){
        return {
            transitionName:''
        }
    },
    create(){
    },
    mounted(){        
    },
    methods: {
    },
    watch: {//使用watch 监听$router的变化
        $route(to, from) {
            //如果to的索引值为0，不添加任何动画；如果to索引大于from索引,判断为前进状态,反之则为后退状态
            if(to.meta.index > 0){
                if( to.meta.index < from.meta.index){
                    this.transitionName = 'slide-right';
                }else{
                    this.transitionName = 'slide-left';
                }
            }else if(to.meta.index == 0 && from.meta.index > 0){
                this.transitionName = 'slide-right';
            }
        }
    }
}
</script>

<style>
body,html{width: 100%; height: 100%;}
* {margin: 0;padding: 0;font-family:"Microsoft YaHei","微软雅黑","Microsoft JhengHei"}
#app{
  display: flex;
  height: 100%;
  flex:1;
  flex-direction: column;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all .3s;
  position: absolute;
  width:100%;
  left:0;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active {
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(-100%);
}
</style>
