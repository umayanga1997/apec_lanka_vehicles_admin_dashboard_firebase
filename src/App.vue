<template>
  <v-app v-if="isLogin">
    <SideBar />

    <v-main >
      <router-view  />
      
    </v-main>
  </v-app>
  <LoginPage v-else />
</template>

<script>
import SideBar from "./components/SideBar.vue";
import LoginPage  from "./views/Login/login_screen.vue"
export default {
  name: "App",
  components: { SideBar ,LoginPage},
  data: () => ({
    isLogin:false,
    //
  }),
};
</script>
