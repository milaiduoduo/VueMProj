<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="this.singers"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import Singer from 'common/js/singer';
  import ListView from 'base/listview/listview'

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热点';

  export default{
    data(){
      return {
        singers: []
      }
    },
    created(){
      this._getSingerList();
    },
    components: {
      ListView
    },
    methods: {
      selectSinger(singer){
//        console.log('singer:', singer);
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
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
        };
//        构造热点歌手数据结构
        let i = 0;
        for (let item of list) {
          if (i < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
            i++;
          }
//            构造a-z歌手数据结构
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

//          序列化歌手列表，热点排前面，a-z歌手按顺序排列。
        let hot = [];
        let other = [];
        for (let key in map) {
          let val = map[key];
          if (key === 'hot') {
            hot.push(val)
          } else if (val.title.match(/[a-zA-Z]/)) {
            other.push(val);
          }
        }
        other.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(other);
      }
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>

