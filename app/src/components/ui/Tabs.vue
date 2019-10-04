<template>
  <div>
    <div class="w-full bg-teal-600 text-white py-2 text-xs uppercase">
      <ul class="list-reset flex items-center text-xs">
        <li
          v-for="tab in tabs"
          :class="{ 'bg-white text-teal-600 rounded-full px-1 shadow-lg': tab.isActive }"
          class="ml-2"
          :key="tab.name"
        >
          <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
        </li>
      </ul>
    </div>

    <div class="tab">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: []
    };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = tab.name == selectedTab.name;
      });
    }
  }
};
</script>

<style>
</style>
