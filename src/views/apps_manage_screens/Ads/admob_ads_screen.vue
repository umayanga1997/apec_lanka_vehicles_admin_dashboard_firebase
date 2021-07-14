<template>
  <v-container
    fill-height
    fluid
    justify-center
    style="height: 75rem"
    v-if="this.loading"
  >
    <v-progress-circular
      :size="30"
      :width="3"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </v-container>
  <v-container fluid v-else>
    <v-alert
      transition="scale-transition"
      dense
      :value="isMsg"
      :type="msgType"
      >{{ message }}</v-alert
    >
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="details[0].Banner"
              :items="items"
              :error-messages="errors"
              label="Banner"
              required
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="details[0].Interstitial"
              :items="items"
              :error-messages="errors"
              label="Interstitial"
              required
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="details[0].Rewarded"
              :items="items"
              :error-messages="errors"
              label="Rewarded"
              required
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="details[0].isShowCustomers"
              :items="items"
              :error-messages="errors"
              label="isShowCustomers"
              required
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="details[0].isShowOwner"
              :items="items"
              :error-messages="errors"
              label="isShowOwner"
              required
            >
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-spacer></v-spacer>
    <v-row justify="center">
      <v-btn
        class="ma-2"
        :loading="loadingBtn"
        :disabled="loadingBtn ? loadingBtn : invalid"
        color="green darken-2 white--text"
        outlined
        @click="updateData()"
        >Update</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
import db from "@/firebaseConfig";

const admobFetchRef = db.collectionGroup("admob_ads_config");
const admobRef = db
  .collection("apps_management")
  .doc("FU0U4I2n3PuXmL4LWtIy")
  .collection("admob_ads_config");

export default {
  name: "admob_ads",
  data: () => ({
    loading: true,
    items: [true, false],
    details: [],
    configID: null,
    loadingBtn: false,
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),
  methods: {
    getAdmobDetails() {
      admobFetchRef
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          this.details = [];
          snapshot.docs.forEach((element) => {
            this.configID = element.data().config_id;

            this.details.push({
              Banner: element.data().Banner,
              Interstitial: element.data().Interstitial,
              Rewarded: element.data().Rewarded,
              isShowCustomers: element.data().isShowCustomers,
              isShowOwner: element.data().isShowOwner,
            });
            this.loading = false;
          });
        })
        .catch((e) => {
          this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    updateData() {
      try {
        this.loadingBtn = true;
        admobRef
          .doc(this.configID)
          .update({
            ...this.details[0],
          })
          .then(() => {
            this.loadingBtn = !this.loadingBtn;
            this.alertMessage("Data updated successfully.", "success");
          })
          .catch((e) => {
            this.loadingBtn = !this.loadingBtn;
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.loadingBtn = !this.loadingBtn;
        this.alertMessage(error.message, "error");
      }
    },
    alertMessage(message, msgType) {
      this.isMsg = true;
      this.message = message;
      this.msgType = msgType;
      setTimeout(() => {
        this.isMsg = false;
        this.message = null;
        this.msgType = null;
      }, 5000);
    },
  },

  created() {
    this.getAdmobDetails();
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>