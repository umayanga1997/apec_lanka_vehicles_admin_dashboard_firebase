<template>
  <v-container fluid>
    <v-alert
      transition="scale-transition"
      dense
      :value="isMsg"
      :type="msgType"
      >{{ message }}</v-alert
    >
    <!-- Search Field -->
    <!-- <v-spacer ></v-spacer> -->
    <v-col cols="12" sm="4" class="pa-1">
      <v-text-field
        fixed
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        solo
        dense
        clearable
        dark
        hide-details
      ></v-text-field>
    </v-col>

    <!-- Data Table -->
    <v-card class="mt-5 mb-5">
      <v-card-title>
        <span>Owners Details</span>
      </v-card-title>

      <v-data-table
        dark
        style="background-color: #292929"
        :headers="headers"
        :items="dataRows"
        :search="search"
        fixed-tabs
        item-key="point"
        fixed-header
        :loading="loading"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="d-block d-sm-table-cell">{{ item.user_name }}</td>
            <td class="d-block d-sm-table-cell">{{ item.phone_no }}</td>
            <td class="d-block d-sm-table-cell">{{ item.user_qr_id }}</td>
            <td class="d-block d-sm-table-cell">
              {{ item.number_of_vehicles }}
            </td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.user_type }}
            </td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.account_type }}
            </td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.accActive }}
            </td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.reg_date }}
            </td>

            <td class="d-block d-sm-table-cell">
              <v-container fluid class="ActionButton__container pa-1">
                <ActionButton
                  class="ma-1"
                  @click="
                    isUpdateData = true;
                    dialog = !dialog;
                    editItem = item;
                  "
                  icon="mdi-pencil"
                  color="green lighten-2"
                />
              </v-container>
            </td>
            <td class="d-block d-sm-table-cell">
              <v-container fluid class="ActionButton__container pa-1">
                <ActionButton
                  class="ma-1"
                  @click="
                    route('user_vehicles',item.user_qr_id, item.user_id)
                  "
                  icon="mdi-taxi"
                  color="green lighten-1"
                />
                <ActionButton
                  class="ma-1"
                  @click="
                    route('user_transactions',item.user_qr_id, item.user_id)
                  "
                  icon="mdi-cash-multiple"
                  color="green lighten-1"
                />
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- Popup Form Create/Update-->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="300px">
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <v-card>
              <v-card-title fixed>
                <span class="headline">Owner Details</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row class="mt-4">
                    <v-col cols="12" md="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Is Active Account"
                      >
                        <v-select
                          v-model="editItem.accActive"
                          :items="items"
                          :error-messages="errors"
                          label="Is Active Account"
                          required
                        >
                        </v-select>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="ma-2"
                  color="red darken-2 white--text"
                  outlined
                  @click="
                    dialog = false;
                    editItem = {};
                  "
                  >Close</v-btn
                >

                <v-btn
                  class="ma-2"
                  :loading="loadingBtn"
                  :disabled="loadingBtn ? loadingBtn : invalid"
                  color="green darken-2 white--text"
                  outlined
                  @click="!isUpdateData ? insertData() : updateData()"
                  >{{ !isUpdateData ? "Add" : "Update" }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </ValidationObserver>
        </v-dialog>
      </v-row>
    </template>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialogDelete" max-width="290">
          <v-card>
            <v-card-title class="text-h5">
              Do you want to delete this data?
            </v-card-title>
            <v-card-text></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogDelete = false">
                No
              </v-btn>
              <v-btn
                :loading="loadingBtn"
                :disabled="loadingBtn ? loadingBtn : invalid"
                text
                color="error"
                @click="deleteData()"
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { fireStore } from "@/firebaseConfig";
//Validator Configurations
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import ActionButton from "../../components/ActionButton.vue";

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

const ownersAccountsRef = fireStore.collection("users");

export default {
  name: "owners_accounts",
  components: {
    ActionButton,
    ValidationObserver,
    ValidationProvider,
  },

  created() {
    this.getHelpDetails();
  },

  data: () => ({
    //Other
    search: "",
    // Table
    loading: true,
    headers: [
      {
        text: "User Name",
        value: "user_name",
        align: "center",
        width: "150px",
      },
      { text: "Phone No", value: "phone_no" },
      { text: "User QR", value: "user_qr_id" },
      { text: "Number of Vehicles", value: "number_of_vehicles" },
      { text: "User Type", value: "user_type" },
      { text: "Account Type", value: "account_type" },
      { text: "Is Account Active", value: "accActive" },
      { text: "Reg.Date", value: "reg_date" },
      { text: "User Actions", value: "u-actions", width: "190px" },
      { text: "User Activity", value: "o-actions", width: "190px" },
    ],
    dataRows: [],
    //Form
    items: [true, false],
    editItem: {},
    loadingBtn: false,
    isUpdateData: false,
    dialog: false,
    dialogDelete: false,
    deleteID: null,
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),
  methods: {
    getHelpDetails() {
      ownersAccountsRef
        .where("user_type", "==", "owner")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          this.dataRows = [];
          for (const key in snapshot.docs) {
            this.dataRows.push({ ...snapshot.docs[key].data() });
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    updateData() {
      try {
        this.loadingBtn = true;

        ownersAccountsRef
          .doc(this.editItem.user_id)
          .update({
            accActive: this.editItem.accActive,
          })
          .then(() => {
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.isUpdateData = !this.isUpdateData;
            this.editItem = {};
            this.alertMessage("Data updated successfully.", "success");
          })
          .catch((e) => {
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.isUpdateData = !this.isUpdateData;
            this.editItem = {};
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.dialog = !this.dialog;
        this.loadingBtn = !this.loadingBtn;
        this.isUpdateData = !this.isUpdateData;
        this.editItem = {};
        this.alertMessage(error.message, "error");
      }
    },
    
    route(name, qr, id) {
      this.$router.push({name:name,params:{id:qr, userId: id }});
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

<style>
.v-input {
  margin: 0px;
  padding: 0px;
}
.v-data-table {
  background-color: #1e1e1e;
  border-radius: 0px;
}
.v-card__title {
  /* margin-bottom: 2px; */
  background-color: #dd2c00;
  /* background-color: rgb(0, 105, 100); */
  color: rgb(254, 254, 255);
  /* border-bottom-left-radius: 4px; */
  /* border-bottom-right-radius: 4px; */
  font-size: 18px;
  font-weight: 500;
  padding: 5px;
  justify-content: center;
}
.expand__td {
  background-color: rgb(8, 239, 255);
  height: auto !important;
  color: black;
  border-bottom: none !important;
}
.expan_flex_header {
  background-color: #1e1e1e;
}
.row__color {
  background-color: #ffffff !important;
  border: none;
}
.ActionButton__container {
  text-align: center;
}
</style>