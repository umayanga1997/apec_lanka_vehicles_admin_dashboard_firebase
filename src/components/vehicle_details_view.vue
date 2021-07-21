<template>
  <v-row justify="center">
    <v-dialog
    dark
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Open Dialog
        </v-btn>
      </template> -->

      <v-card>
        <v-toolbar dark class="headerStyle">
          <!-- <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-toolbar-title>'{{data.v_name}}' Vehicle Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row>
          <v-col cols="12" class="flexible">
            <v-col cols="12" sm="12" md="4" lg="4">
              <v-list-item-content>
                <v-list-item-title>Thumnail Image</v-list-item-title>
                <template>
                  <div class="d-flex">
                    <v-img
                      :src="data.v_profile_image_url"
                      contain
                      class="cropp"
                    ></v-img>
                  </div>
                </template>
              </v-list-item-content>
            </v-col>
          <v-col cols="12" sm="12" md="8" lg="8" class="flexible">
              <v-list-item-content>
                <v-list-item-title>Gallery Images</v-list-item-title>
                
                <template>
                  <div class="flexible">
                    <v-img
                      v-for="(value, index) in data.galleryURLs"
                      :key="index"
                      :src="value"
                      contain
                      class="cropp"
                    ></v-img>
                  </div>
                </template>
              </v-list-item-content>
            </v-col>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Owner Name</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.user_name}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Owner QR</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.user_qr_id}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Owner Mobile No</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.phone_no}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Optional Contact name</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.optional_contact_name}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Optional Contact No</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.optional_contact_no}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Is Account Active</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.acc_status_active}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Vehicle Name</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_name}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Vehicle Type</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_type_name}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Vehicle Description</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_description}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Vehicle Locations</v-list-item-title>
               <div class="flexible v-list-item__subtitle">
                    <span class="pl-2" v-for="(element, index) in data.locations" :key="index"
                    >{{element.location_name}},</span
                >
               </div>
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>V.N Letter</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_no_letter}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>V.N Number</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_no_number}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>V.Status Active</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.v_status}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Exp Date</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.exp_date}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Is Expire</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.isExpired}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-list-item>
                <v-list-item-content>
                <v-list-item-title>Package</v-list-item-title>
                <v-list-item-subtitle
                    >{{data.package}}</v-list-item-subtitle
                >
                </v-list-item-content>
            </v-list-item>
          </v-col>
     
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ["dialog", "data"],

  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
    };
  },
};
</script>

<style scoped>
.cropp {
  /* aspect-ratio: 16/9; */
  height: 250px !important;
  width: 250px !important;
  background: #ddd;
  margin-bottom: 10px;
}
.flexible{
    display: flex !important; flex-wrap: wrap !important;
}
.headerStyle{
    /* margin-bottom: 2px; */
  background-color: #dd2c00 !important;
  /* background-color: rgb(0, 105, 100); */
  color: rgb(254, 254, 255);
  /* border-bottom-left-radius: 4px; */
  /* border-bottom-right-radius: 4px; */
  font-size: 18px;
  font-weight: 500;
  justify-content: center;
}
.v-responsive{
    background-color: #1E1E1E !important;
}
.v-list-item__title{
    color: #2dff5b;
}
.v-list-item__subtitle{
    color: rgb(255, 255, 255) !important;
}
</style>