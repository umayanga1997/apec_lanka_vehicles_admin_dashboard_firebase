<template>
  <v-container fluid>
    <v-alert
      transition="scale-transition"
      dense
      :value="isMsg"
      :type="msgType"
      >{{ message }}</v-alert
    >
    <v-container fluid class="flexible">
      <v-col cols="4">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-container>
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              name="Mobile No"
            >
              <v-textarea
                v-model="phoneNumber"
                :counter="9"
                :error-messages="errors"
                required
                auto-grow
                rows="1"
                label="Mobile No *"
                hint="Enter mobile no"
              ></v-textarea>
            </validation-provider>
          </v-container>
          <v-container class="" v-if="isOtpField">
            <validation-provider
              v-slot="{ errors }"
              name="OTP No"
              rules="required"
            >
              <v-text-field
                v-model="otp"
                :counter="6"
                :error-messages="errors"
                auto-grow
                rows="1"
                label="OTP No *"
                hint="Enter mobile no"
                required
              ></v-text-field>
            </validation-provider>
          </v-container>
          <div id="recaptcha-container"></div>

          <v-btn
            class="ma-2"
            :loading="loadingBtn"
            :disabled="loadingBtn ? loadingBtn : invalid"
            color="green darken-2 white--text"
            outlined
            @click="!isOtpField ? sendOtp() : verifyOtp()"
            >{{ !isOtpField ? "Send OTP" : "Login" }}</v-btn
          >
        </validation-observer>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
import { fireStore, firebase } from "@/firebaseConfig";
// import firebase from "firebase";
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

const STORAGE_KEY = "auth-storage";

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

const adminsAccountsRef = fireStore.collection("users");

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    phoneNumber: "",
    otp: null,
    appVerifier: "",
    reCapAgain: false,
    isOtpField: false,
    loadingBtn: false,
    checkItemList: [],
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
    },
    clear() {
      this.phoneNumber = "";
      this.otp = "";
      this.appVerifier = "";

      this.$refs.observer.reset();
    },

    sendOtp() {
      this.loadingBtn = true;
      if (this.phoneNumber.length != 9) {
        this.alertMessage("Invalid Phone Number Format !", "error");
        this.loadingBtn = false;
      } else {
        if (!this.reCapAgain) {
          //
          let editedPhoneNumber = "+94" + this.phoneNumber;
          //
          let appVerifier = this.appVerifier;
          //
          firebase
            .auth()
            .signInWithPhoneNumber(editedPhoneNumber, appVerifier)
            .then(function (confirmationResult) {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              return confirmationResult;
            })
            .then((value) => {
              this.isOtpField = true;
              this.loadingBtn = false;
              window.confirmationResult = value;
              //
              this.alertMessage("SMS sent!", "success");
            })
            .catch((e) => {
              this.loadingBtn = false;
              this.isOtpField = false;
              this.alertMessage(e.message, "error");
            });
        } else {
          this.alertMessage(
            "Please refresh page and get new reCaptcha.",
            "error"
          );
        }
      }
    },
    //
    async verifyOtp() {
      this.loadingBtn = true;

      if (this.phoneNumber.length != 9 || this.otp.length != 6) {
        this.alertMessage("Invalid Phone Number Format !", "error");
        this.loadingBtn = false;
      } else {
        window.confirmationResult
          .confirm(this.otp)
          .then(function (result) {
            // User signed in successfully.
            return result;
          })
          .then(async (result) => {
            await adminsAccountsRef
              .where("user_type", "==", "admin")
              .where("user_id", "==", result.user.uid)
              .get().then(snapshot => {
                for (const key in snapshot.docs) {
                  this.checkItemList.push({...snapshot.docs[key].data()});
                }

              }).then(()=>{
                
                if (this.checkItemList.length === 1) {
                  const userData = this.checkItemList[0];
                  console.log(userData);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                  this.$router.push({ name: "Home" });
                } else {
                  this.alertMessage(
                    "This account is not found, Please contact main admin.",
                    "error"
                  );
                }
                this.loadingBtn = false;
              });
            
          })
          .catch((e) => {
            firebase.auth().signOut();
            this.isOtpField = false;
            this.loadingBtn = false;
            this.alertMessage(e.message, "error");
          });
      }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function (response) {
              this.reCapAgain = false;
              return response;
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            "expired-callback": function () {
              this.reCapAgain = true;
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            },
          }
        );
        //
        this.appVerifier = window.recaptchaVerifier;
      }, 3000);
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
    this.initReCaptcha();
  },
};
</script>

<style scoped>
.flexible {
  margin: 100px 0 0 0;
  width: 100%;
  display: flex !important;
  justify-content: center !important;
  align-content: center !important;
  text-align: end;
}
</style>