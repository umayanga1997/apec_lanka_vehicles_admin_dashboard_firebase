<template>
  <nav>
    <v-app-bar elevation="10" app dense dark fixed color="#1E1E1E">
      <v-app-bar-nav-icon @click="isDrawerOpen=!isDrawerOpen" />
      <v-app-bar-title>
        <span class="font_size">Welcome.!</span>
      </v-app-bar-title>
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
          :to="isDashBoard?'/':null"
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
          @click="isDashBoard =false"
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
export default {
  name: "sidebar",
  data: () => ({
    isDrawerOpen: true,
    isDashBoard: true,
    links: [
      {
        title: "App Mangement",
        icon: "apps",
        active: false,
        route: "/#/",
        subLinks: [
          {
            subTitle: "Ads",
            suRoute: "/ads_conf",
            active: false,
          },
          {
            subTitle: "Special Notes",
            suRoute: "/special_notes_",
            active: false,
          },
          {
            subTitle: "Additional Packages",
            suRoute: "/additional_packages_",
            active: false,
          },
          {
            subTitle: "What is new details",
            suRoute: "/what_is_new_details_",
            active: false,
          },
          {
            subTitle: "Helps",
            suRoute: "/helps_",
            active: false,
          },
          {
            subTitle: "Instructions",
            suRoute: "/instructions_",
            active: false,
          },
          {
            subTitle: "About Us",
            suRoute: "/about_us_details",
            active: false,
          },
          {
            subTitle: "Our Products",
            suRoute: "/our_products_",
            active: false,
          },
          {
            subTitle: "Other Configurations",
            suRoute: "/other_config_",
            active: false,
          },
        ],
      },
      {
        title: "Finding Options",
        icon: "search",
        active: false,
        route: "/#/",
        subLinks: [
          {
            subTitle: "Locations",
            suRoute: "/locations_",
            active: false,
          },
          {
            subTitle: "Vehicles Types",
            suRoute: "/vehicles_types_",
            active: false,
          },
        ],
      },
      {
        title: "Accounts",
        icon: "person",
        active: false,
        route: "/#/",
        subLinks: [
          {
            subTitle: "Admins",
            suRoute: "/admin_acc_",
            active: false,
          },
          {
            subTitle: "Owners",
            suRoute: "/owners_acc_",
            active: false,
          },
        ],
      },
      {
        title: "Reports",
        icon: "assessment",
        active: false,
        route: "/#/",
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
  methods: {
    cleanSelect() {
      this.isDashBoard = true;
      this.links.forEach((link) => {
        if (link.active) {
          link.active = false;

          return false;
        }
      });
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style>
.font_size {
  font-size: 16px;
}
.subLinkColor {
  border-left: 5px solid rgb(8, 239, 255);
  background-color: rgb(0, 141, 134);
  /* border-right: 5px solid rgb(6, 252, 190); */
}
.v-list-group{
  
  overflow-y:visible
}
.v-list-group__header__prepend-icon{
  margin-right: 10px !important
}
</style>