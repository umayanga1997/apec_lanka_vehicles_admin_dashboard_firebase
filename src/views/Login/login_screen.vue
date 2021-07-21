<template>
  <v-container fluid class="flexible">
    <v-alert
      transition="scale-transition"
      dense
      :value="isMsg"
      :type="msgType"
      >{{ message }}</v-alert
    >
    <v-col cols="4">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <validation-provider
            v-if="!isOtpField"
            v-slot="{ errors }"
            rules="required"
            name="Mobile No"
          >
            <v-textarea
              v-model="phoneNumber"
              :counter="10"
              :error-messages="errors"
              required
              auto-grow
              rows="1"
              label="Mobile No *"
              hint="Enter mobile no"
            ></v-textarea>
          </validation-provider>
          <validation-provider v-else v-slot="{ errors }" name="otp">
            <v-text-field
              v-model="otp"
              :error-messages="errors"
              label="OTP"
              required
            ></v-text-field>
          </validation-provider>
<div id="recaptcha-container"></div><br>
          <v-btn class="mr-4" @click="sendOtp()" :disabled="invalid"> submit </v-btn>
          <v-btn @click="clear"> clear </v-btn>
        </form>
      </validation-observer>
    </v-col>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
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

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    phoneNumber: "",
    otp: null,
     appVerifier : '',
    isOtpField: false,
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
      this.appVerifier='';
    
      this.$refs.observer.reset();
    },

    sendOtp() {
      if (this.phoneNumber.length != 12) {
        this.alertMessage("Invalid Phone Number Format !", "error");
      } else {
        //   this.initReCaptcha();
        //
        // let countryCode = "+91"; //india
        // let phoneNumber = countryCode + this.phNo;
        //
        let appVerifier = this.appVerifier;
        //
        console.log(firebase.auth());
        firebase.auth()
          .signInWithPhoneNumber(this.phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            //
            alert("SMS sent");
          })
          .catch((e) =>{
           this.alertMessage(e.message, "error");
          });
      }
    },
    //
    verifyOtp() {
      if (this.phoneNumber.length != 12 || this.otp.length != 6) {
        this.alertMessage("Invalid Phone Number Format !", "error");
      } else {
        //
        // let vm = this;
        let code = this.otp;
        //
        window.confirmationResult
          .confirm(code)
          .then(function (result) {
            // User signed in successfully.
            var user = result.user;
            console.log(user)
            // ...
            //route to set password !
            // vm.$router.push({ path: "/setPassword" });
          })
          .catch((e)=> {
            this.alertMessage(e.message, "error");
          });
      }
    },
    initReCaptcha() {
        
      setTimeout(() => {
         
        // let vm = this;
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function (response) {
                console.log(response)
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            "expired-callback": function () {
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
}
</style>