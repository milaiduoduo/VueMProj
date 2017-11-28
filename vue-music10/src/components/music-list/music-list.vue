<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" :data="songs" ref="list"
            @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script type='text/ecmascript-6'>
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';

  const RESERVED_HEIGHT = 40;

  export default{
    data(){
      return {
        scrollY: 0
      }
    },
    components: {
      Scroll,
      SongList
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle(){
        return `background-image:url(${this.bgImage})`;
      }
    },
    created(){
      this.probeType = 3;
      this.listenScroll = true;
      this.maxTransalteY = 0;
      this.imgHeight = 0;
    },
    methods: {
      back(){
        this.$router.back();
      },
      scroll(pos){
        this.scrollY = pos.y;
      }
    },
    mounted() {
      this.imgHeight = this.$refs.bgImage.clientHeight;
      this.maxTransalteY = -this.imgHeight + RESERVED_HEIGHT;
      //  $el，获取vue dom的真实dom
      this.$refs.list.$el.style.top = `${this.imgHeight}px`;
    },
    watch: {
      scrollY(newScrollY){
        let zIndex = 0;
        let translateY = Math.max(this.maxTransalteY, newScrollY);

//        实现歌曲列表向上拖动到顶部的效果
//        [优化]
        if (newScrollY < 0) {
          this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
          this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`;
        }
//        解决歌曲列表拖到到最顶端，文字溢出的问题
//        [优化]
        if (newScrollY < this.maxTransalteY) {
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = '40px';
        } else {
          zIndex = 0;
          this.$refs.bgImage.style.paddingTop = '70%';
        }
//        实现向下拖动歌手歌曲列表时，歌手图片随之变大效果
        if (newScrollY > 0) {
          zIndex = 10;
          let scale = Math.abs(1 + newScrollY / this.imgHeight);
          this.$refs.bgImage.style['transform'] = `scale(${scale})`;
          this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`;
        }
        this.$refs.bgImage.style.zIndex = zIndex;
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

