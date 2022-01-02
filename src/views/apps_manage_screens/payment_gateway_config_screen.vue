<template>
  <v-container
    fill-height
    fluid
    justify-center
    style="height: 75rem; align-content: flex-start"
    v-if="this.loading"
  >
    <v-progress-circular
      :size="30"
      :width="3"
      color="purple"
      style="margin-top: 100px"
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
    <!-- Data Table -->
    <!-- <v-card class="mt-5 mb-5"> -->
    <!-- <v-card-title>
        <span>Payment Gateway Configurations</span>
      </v-card-title> -->

    <v-container class="pa-2 content-center">
      <ValidationObserver ref="observer" v-slot="{}">
        <v-col cols="12" sm="4" md="6" lg="6">
          <v-form ref="form" v-model="valid" lazy-validation>
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              name="Gateway Live ID"
            >
              <v-text-field
                v-model="details[0].gateway_id_LIVE"
                :error-messages="errors"
                label="Gateway Live ID"
                required
              ></v-text-field>
            </validation-provider>
            <br />
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              name="Gateway Sandbox ID"
            >
              <v-text-field
                v-model="details[0].gateway_id_SANDBOX"
                label="Gateway Sandbox ID"
                required
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
            <br />
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              name="Is Live data"
            >
              <v-select
                v-model="details[0].gateway_is_live"
                :items="items"
                :error-messages="errors"
                label="Is Live"
                required
              ></v-select>
            </validation-provider>
            <br />
            <v-btn
              class="mx-2"
              @click="updateData()"
              color="green darken-2 white--text"
              outlined
              :loading="loadingBtn"
              :disabled="loadingBtn ? loadingBtn : invalid"
            >
              <v-icon dark left>mdi-update</v-icon>

              <span style="font-size: 12px" lowercase>Update</span>
            </v-btn>
          </v-form>
        </v-col>
      </ValidationObserver>
    </v-container>
    <!-- </v-card> -->
  </v-container>
</template>

<script>
import { fireStore } from "@/firebaseConfig";
import "vue-advanced-cropper/dist/style.css";
//Validator Configurations
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} does not match {regex}",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

const PaymentsFetchRef = fireStore.collectionGroup("payment_gateway_config");
const PaymentssRef = fireStore
  .collection("apps_management")
  .doc("FU0U4I2n3PuXmL4LWtIy")
  .collection("payment_gateway_config");

export default {
  name: "gateway",
  components: {
    ValidationObserver,
    ValidationProvider,
  },

  created() {
    this.getPayCoinfigDetails();
  },

  data: () => ({
    items: [true, false],
    loading: true,
    //Other
    details: [],
    loadingBtn: false,
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),
  methods: {
    getPayCoinfigDetails() {
      try {
        PaymentsFetchRef.onSnapshot(
          { includeMetadataChanges: true },
          (snapshot) => {
            this.details = [];
            snapshot.docs.forEach((element) => {
              this.details.push({ ...element.data() });
              this.loading = false;
            });
          }
        );
      } catch (error) {
        this.loading = false;
        this.alertMessage(error, "error");
      }
    },

    async updateData() {
      try {
        this.loadingBtn = true;
        this.$refs.observer.validate().then((event) => {
          if (event == true) {
            //Delete previous image from storage
            PaymentssRef.doc(this.details[0]["config_id"])
              .update({ ...this.details[0] })
              .then(() => {
                this.loadingBtn = !this.loadingBtn;
                this.alertMessage("Data updated successfully.", "success");
              })
              .catch((e) => {
                this.loadingBtn = !this.loadingBtn;
                this.alertMessage(e.message, "error");
              });
          } else {
            this.loadingBtn = !this.loadingBtn;
          }
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
};
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>