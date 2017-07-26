<template lang="html">
  <div :style="{backgroundColor: skinColor}" class="header">
    <div class="tab">
      <div v-bind:class="{link: linkBorderIndex==1}" class="item">
        <router-link to="/music-list">我的</router-link>
      </div>
      <div v-bind:class="{link: linkBorderIndex==2}" class="item">
        <router-link to="/find">发现</router-link>
      </div>
      <div v-bind:class="{link: linkBorderIndex==3}" class="item">
        <router-link to="/Fm">Fm</router-link>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'header',

  data() {
    return {
      index: ''
    };
  },
  computed: {
    linkBorderIndex() {
      return this.$store.state.linkBorderIndex;
    },
    skinColor() {
      return this.$store.state.skinColor;
    }
  },
  methods: {
    toSearch() {
      this.$router.push('/find');
    },
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background-color: #ccc;
    color: white;
    flex: 1;
    width: 100%;
    .tab {
      display: flex;
      border-bottom: 1px solid #9E9E9E;

      a {
        display: inline-block;
        width: 10%;
      }
      a::after {
        background-color: rgba(255, 255, 255, .2);
        height: 1px;
        bottom: -2px;
      }

      .item {
        display: inline-block;
        flex: 1;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .link {
      font-weight: bold;
      color: #BDBDBD;
      border-bottom: 1px solid #E0F2F1;
    }

  }
</style>
