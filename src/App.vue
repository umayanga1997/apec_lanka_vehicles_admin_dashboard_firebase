<template>
  <v-app v-if="isLogin">
    <SideBar :userName="userName" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
  <v-app v-else>
    <v-main>
      <LoginPage />
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "./components/SideBar.vue";
import LoginPage from "./views/Login/login_screen.vue";

const STORAGE_KEY = "auth-storage";

export default {
  name: "App",
  components: { SideBar, LoginPage },
  data: () => ({
    isLogin: false,
    userData: null,
    userDetails: null,
    userName: "",
    //
  }),
  created() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      this.userData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (this.userData != null && this.userData.length != 0) {
        this.userName = this.userData.user_name;
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
  },
};
</script>
