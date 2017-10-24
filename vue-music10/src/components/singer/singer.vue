<template>
  <div class="singer">
    <list-view :data="this.singers"></list-view>
  </div>
</template>
<script type='text/ecmascript-6'>
  import {ERR_OK} from 'api/config';
  import {getSingerList} from 'api/singer';
  import Singer from 'common/js/singer';
  import ListView from 'base/listview/listview';
  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;
  export default{
    data(){
      return {
        singers: []
      }
    },
    created(){
      this._getSingerList();
    },
    methods: {
      _getSingerList(){
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        })
      },
      _normalizeSinger(list){
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        let i = 0;
        for (let item of list) {
//            完成对hot数据的构造
          if (i < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
            i++;
          }
//          完成对a-z歌手数据的构造
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }

        //          对以上的无序数据，进行hot,a-z的序列构造
        let ret = [];
        let hot = [];
        for (let key in map) {
          // console.log('maps key:', key);
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        // 给a-z的数组排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(ret);
      }

    },
    components: {
      ListView
    }
  };
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
