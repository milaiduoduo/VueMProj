<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';
  export default{
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 1000
      },
      snapSpeed: {
        type: Number,
        default: 400
      }
    },
    data(){
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted(){
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        this._regEvent();
        if (this.autoPlay) {
          this._play();
        }
      }, 20);
    },
    beforeDestroy(){
      console.log('beforeDestroy');
    },
    destroyed(){
      console.log('destroyed');
      this.slider.disable();
      clearTimeout(this.timer);
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');

          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: this.snapSpeed
          }
        });
//        注册事件
      },
      _initDots(){
        this.dots = new Array(this.children.length);
      },
      _onScrollEnd(){
        // 用来计算currentPageIndex
        console.log('_onScrollEnd');
        let pageIndex = this.slider.getCurrentPage().pageX;
//        console.log('pageIndex:', pageIndex);
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
//        console.log('this.currentPageIndex:', this.currentPageIndex);
        if (this.autoPlay) {
          this._play();
        }
      },
      _play(){
        let pageIndex = this.slider.getCurrentPage().pageX + 1;
        console.log('pageIndex:', pageIndex);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, this.snapSpeed);
        }, this.interval);
      },
      _regEvent(){
        this.slider.on('scrollEnd', this._onScrollEnd);

//        touchend没有触发
        this.slider.on('touchend', () => {
          console.log('in touchend');
          if (this.autoPlay) {
            this._play();
          }
        });

//        touch的时候，需要清除定时器
        this.slider.on('beforeScrollStart', () => {
          console.log('in beforeScrollStart');
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        });

//        屏幕尺寸大小变化的时候，需要出发该事件来让轮播图重新计算大小，自适应屏幕
        window.addEventListener('resize', () => {
          if (!this.slider || !this.slider.enabled) {
            return;
          }
          this._setSliderWidth(true);
          this.slider.refresh();
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    position: relative
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
