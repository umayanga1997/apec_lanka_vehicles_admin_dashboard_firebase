<template>
  <v-container fill-height fluid justify-center v-if="this.loading">
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
              v-model="details[0].isAccountUpgradeButton"
              :items="items"
              :error-messages="errors"
              label="Is Account Upgrade Button?"
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
import { fireStore } from "@/firebaseConfig";

const otherConfigFetchRef = fireStore.collectionGroup("other_configurations");
const otherConfigRef = fireStore
  .collection("apps_management")
  .doc("FU0U4I2n3PuXmL4LWtIy")
  .collection("other_configurations");

export default {
  name: "other_config",
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
      try {
        otherConfigFetchRef.onSnapshot(
          { includeMetadataChanges: true },
          (snapshot) => {
            this.details = [];
            snapshot.docs.forEach((element) => {
              this.configID = element.id;

              this.details.push({
                isAccountUpgradeButton: element.data().isAccountUpgradeButton,
              });
              this.loading = false;
            });
          }
        );
      } catch (error) {
        this.loading = false;
        this.alertMessage(error, "error");
      }
    },
    updateData() {
      try {
        this.loadingBtn = true;
        otherConfigRef
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
.container--fluid {
  height: 75rem;
  padding: 40px !important;
}
</style>