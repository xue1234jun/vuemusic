<template lang="html">

  <transition name="showRouter">
    <div class="fm-list">

      <div v-for="(item, index) of channels" class="music-item">
       <img src="http://www.xjblog.win/images/avatar.png" class="music-img"></img>
        <span @click="toggleMusic(index)" class="music-name">{{item.name}}</span>
      </div>

      <div class="tips">没有更多了～</div>

    </div>
  </transition>

</template>

<script>

export default {
  name: 'Fm',
  beforeCreate() {
    this.$store.commit('showMiniMusic', true);
    this.$store.dispatch('getchannel');
  },
  mounted() {
    this.$store.commit('changeLinkBorderIndex', 3);
  },
  computed: {
    channels() {
      return this.$store.state.channels;
    },
    DOM() {
      return this.$store.state.DOM;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 点击切换电台
    toggleMusic(index) {
      this.$store.commit('play', true);
      this.$store.commit('togglechannel',index);

    }
  }
}
</script>

<style lang="scss">
.showRouter-enter-active {
  transition: all .4s ease;
}
.showRouter-leave-active {
  transition: all 0 ease;
}
.showRouter-enter, .showRouter-leave-active {
  transform: translateX(250px);
  opacity: 0;
}
  .fm-list {
    padding-top: 4px;
    padding-left: 4px;
    padding-right: 4px;
    // padding-bottom: 40px;
    flex:12;
    overflow: auto;
    .music-item + .music-item {
      border-top: 1px solid rgba(0, 0, 0, .1);
    }
    .music-img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    .music-item {
      // box-shadow: 0 0 1px #DD2C00;
      padding: 4px 6px 0 6px;
      position: relative;
      margin-bottom: 4px;
      border-radius: 5px;
      cursor: pointer;
      border: none;
      span.music-name {
        display: inline-block;
        width: 65%;
        vertical-align: top;
        margin-top: 15px;
        margin-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;

        padding-bottom: 20px;
      }
    }
    .tips {
      text-align: center;
      margin: 12px auto;
      width: 200px;
      font-size: 80%;
      color: gray;
    }
  }
</style>
