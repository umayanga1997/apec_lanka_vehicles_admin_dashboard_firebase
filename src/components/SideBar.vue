<template>
  <nav>
    <v-app-bar elevation="10" app dense dark fixed color="#1E1E1E">
      <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen" />
      <v-app-bar-title>
        <span class="font_size welcomeTag">{{ welcomeTag }}</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <p class="userTag">{{ userName }}</p>
      <ActionButton
        class="ma-1"
        icon="mdi-logout"
        color="green lighten-2"
        @click="signOut()"
      />
    </v-app-bar>
    <v-navigation-drawer
      fixed
      :mini-variant="$vuetify.breakpoint.lgOnly ? isDrawerOpen : A"
      :permanent="$vuetify.breakpoint.lgOnly"
      :temporary="$vuetify.breakpoint.smOnly"
      v-model="isDrawerOpen"
      app
      dark
      color="#1E1E1E"
    >
      <v-layout v-if="!isDrawerOpen" column align-center>
        <v-flex class="mt-7">
          <!-- <v-avatar  size="100"> -->
          <v-img width="120" min-width="120" contain src="/logo.png"></v-img>
          <!-- </v-avatar> -->
        </v-flex>
      </v-layout>
      <v-list class="mt-5" nav dense flat>
        <v-list-item
          active-class="deep-orange accent-4 white--text"
          ripple
          @click="cleanSelect"
          route
          :to="isDashBoard ? '/' : null"
        >
          <v-list-item-icon class="mr-4">
            <!-- <v-icon>mdi-account</v-icon> -->
            <v-icon>dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-model="linkItem.active"
          v-for="linkItem in links"
          :key="linkItem.title"
          :prepend-icon="linkItem.icon"
          no-action
          active-class="deep-orange accent-4 white--text"
          @click="isDashBoard = false"
        >
          <v-list-item slot="activator">
            <v-list-tile-content>
              <v-list-item-title>{{ linkItem.title }}</v-list-item-title>
            </v-list-tile-content>
          </v-list-item>
          <v-list class="ml-8" flat>
            <v-list-item
              v-for="subLink in linkItem.subLinks"
              :key="subLink.subTitle"
              translate="none"
              route
              :to="subLink.suRoute"
              active-class="subLinkColor"
              @click="setWelcomeTag(linkItem.title + ' \\ ' + subLink.subTitle)"
            >
              <v-list-item-title>{{ subLink.subTitle }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import ActionButton from "./ActionButton.vue";
import { firebase } from "@/firebaseConfig";

const STORAGE_KEY = "auth-storage";
export default {
  name: "sidebar",
  props: ["userName"],
  components: {
    ActionButton,
  },
  created(){
    this.cleanSelect()
  },
  data: () => ({
    welcomeTag: "Welcome...!",
    isDrawerOpen: true,
    isDashBoard: true,
    links: [
      {
        title: "App Mangement",
        icon: "apps",
        active: false,
        Route: "/",
        subLinks: [
          {
            subTitle: "Ads",
            suRoute: "/app_manage/ads_conf_",
            active: false,
          },
          {
            subTitle: "Special Notes",
            suRoute: "/app_manage/special_notes_",
            active: false,
          },
          {
            subTitle: "Additional Packages",
            suRoute: "/app_manage/additional_packages_",
            active: false,
          },
          {
            subTitle: "What is new details",
            suRoute: "/app_manage/what_is_new_details_",
            active: false,
          },
          {
            subTitle: "Helps",
            suRoute: "/app_manage/helps_",
            active: false,
          },
          {
            subTitle: "Instructions",
            suRoute: "/app_manage/instructions_",
            active: false,
          },
          {
            subTitle: "About Us",
            suRoute: "/app_manage/about_us_details_",
            active: false,
          },
          {
            subTitle: "Our Products",
            suRoute: "/app_manage/our_products_",
            active: false,
          },
          {
            subTitle: "Other Configurations",
            suRoute: "/app_manage/other_config_",
            active: false,
          },
        ],
      },
      {
        title: "Finding Options",
        icon: "search",
        active: false,
        Route: "/",
        subLinks: [
          {
            subTitle: "Locations",
            suRoute: "/find_options/locations_",
            active: false,
          },
          {
            subTitle: "Vehicles Types",
            suRoute: "/find_options/vehicles_types_",
            active: false,
          },
        ],
      },
      {
        title: "Accounts",
        icon: "person",
        active: false,
        Route: "/",
        subLinks: [
          {
            subTitle: "Owners",
            suRoute: "/accounts/owners_acc_",
            active: false,
          },
          {
            subTitle: "Admins",
            suRoute: "/accounts/admin_acc_",
            active: false,
          },
        ],
      },
      {
        title: "Reports",
        icon: "assessment",
        active: false,
        Route: "/",
        subLinks: [
          {
            subTitle: "Owner's Report",
            suRoute: "/owners_report",
            active: false,
          },
          {
            subTitle: "Vehicles Report",
            suRoute: "/vehicles_report",
            active: false,
          },
        ],
      },
    ],
  }),

  // computed:{
  //   welcomeTag(){
  //     return this.$store.state.welcomeTag;
  //   }
  // },
  methods: {
    setWelcomeTag(tag) {
      // this.$store.commit("setWelcomeTag", tag)
      this.welcomeTag = tag;
    },
    cleanSelect() {
      this.links.forEach((link) => {
        if (link.active) {
          link.active = false;

          return false;
        }
      });
      this.isDashBoard = true;
      this.$router.push('/');
      this.setWelcomeTag("Welcome...!");
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then((_) => {
          console.log(_);
          localStorage.removeItem(STORAGE_KEY);
          this.$router.go();
        });
    },
  },
};
</script>

<style scoped>
.font_size {
  font-size: 16px;
}
.subLinkColor {
  border-left: 5px solid rgb(8, 239, 255);
  background-color: rgb(0, 141, 134);
  /* border-right: 5px solid rgb(6, 252, 190); */
}
.v-list-group {
  overflow-y: visible;
}
.v-list-group__header__prepend-icon {
  margin-right: 10px !important;
}
.welcomeTag {
  /* margin-bottom: 2px; */
  color: #46f9ff;
  /* background-color: rgb(0, 105, 100); */
  /* color: rgb(254, 254, 255); */
  /* border-bottom-left-radius: 4px; */
  /* border-bottom-right-radius: 4px; */
  font-size: 18px;
  font-weight: 500;
  padding: 5px;
  justify-content: center;
}
.userTag {
  margin: 0 10px 0 0;
}
</style>