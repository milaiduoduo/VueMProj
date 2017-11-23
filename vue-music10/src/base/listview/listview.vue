<template>
  <scroll class="listview"
          :data='data'
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          @scroll="scroll"
          ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item,index) in shortcutList" :data-index="index"
            :class="{'current':currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {getAndSetAttributeData} from 'common/js/dom';
  const ANCHOR_HEIGHT = 18;

  export default{
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },
    computed: {
      shortcutList(){
        return this.data.map((item) => {
          return item.title.substr(0, 1);
        })
      }
    },
    created(){
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
      this.listHeight = [];
    },
    methods: {
      onShortcutTouchStart(e){
        this.touch.y1 = e.touches[0].pageY;
        let anchorIndex = parseInt(getAndSetAttributeData(e.target, 'data-index'));
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e){
        this.touch.y2 = e.touches[0].pageY;
        let gap = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
        let nowAnchorIndex = this.touch.anchorIndex + gap;
        this._scrollTo(nowAnchorIndex);
      },
      scroll(pos){
        this.scrollY = pos.y;
//        this._getNewIndexInMainList();
      },
      _scrollTo(index){
        if (!index && index !== 0) return;
        if (index < 0) index = 0;
        if (index > this.listHeight.length - 2) index = this.listHeight.length - 2;
        console.log('index:', index);
        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight(){
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(0);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _getNewIndexInMainList(){
        const listHeight = this.listHeight;
        let newY = this.scrollY;
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            return;
          }
        }
        this.currentIndex = listHeight.length - 2;
      }
    },
    watch: {
      data(){
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY(newY){
        //  发现lazyload组件，只会通过scrollY的变化来触发图片加载？
        this._getNewIndexInMainList();
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
