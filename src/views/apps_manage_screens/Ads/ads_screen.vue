<template>
  <v-container fluid>
    <template>
      <v-tabs v-model="tab" align-with-title>
        <v-tabs-slider color="deep-orange"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item" class="accent-4--text">
          {{ item }}
        </v-tab>
      </v-tabs>
    </template>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <admobAds />
      </v-tab-item>
      <v-tab-item>
        <customAds />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import admobAds from "./admob_ads_screen.vue";
import customAds from "./custom_ads_screen.vue";
export default {
  name: "ads",
  data() {
    return {
      tab: 0,
      items: ["Admob Ads", "Custom Ads"],
    };
  },
  components: {
    admobAds,
    customAds,
  },
};
</script>