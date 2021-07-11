<template>
  <v-btn @click="click" outlined dark elevation="2" height="30" :color="color">
    <v-icon v-if="text == null" class="pa-0 ma-0" dark left>{{icon}}</v-icon>
    <v-icon v-else class="pa-0" dark left>{{icon}}</v-icon>

    <span style="font-size: 12px" lowercase>{{text}}</span>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    text: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "black",
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>