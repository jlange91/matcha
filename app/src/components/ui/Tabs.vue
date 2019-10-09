<template>
  <div>
    <div class="hidden md:block w-full bg-teal-600 text-white py-2 text-xs uppercase">
      <ul class="list-reset flex items-center text-xs">
        <li
          v-for="tab in tabs"
          :class="{ 'bg-white text-teal-600 rounded-full px-1 shadow-lg ': tab.isActive }"
          class="ml-2"
          :key="tab.name"
        >
          <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
        </li>
      </ul>
    </div>
    <div class="block md:hidden bg-teal-600 text-white py-2 text-xs uppercase flex-col">
      <div v-if="!show" @click="show = !show" class="mx-6 text-white cursor-pointer">+</div>
      <div v-else @click="show = !show" class="mx-6 text-white cursor-pointer">-</div>
    <ul v-if="show" class="list-reset flex-col items-center text-xs">
        <li
          v-for="tab in tabs"
          :class="{ '': tab.isActive }"
          class="ml-2 py-2"
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
      tabs: [],
      show: false
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
