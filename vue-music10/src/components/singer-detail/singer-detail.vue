<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script type='text/ecmascript-6'>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex';
  import {getSongListOfSinger} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import {createSong} from 'common/js/song'
  export default{
    components: {
      MusicList
    },
    data(){
      return {
        songs: []
      }
    },
    computed: {
      title(){
        return this.singer.name;
      },
      bgImage(){
        return this.singer.avatar;
      },
      ...mapGetters(['singer'])
    },
    created(){
      this._getSongList();
    },
    methods: {
      _getSongList(){
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSongListOfSinger(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        })
      },
      _normalizeSongs(list){
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            let song = createSong(musicData);
            ret.push(song);
          }
        })
        return ret;
      }
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
