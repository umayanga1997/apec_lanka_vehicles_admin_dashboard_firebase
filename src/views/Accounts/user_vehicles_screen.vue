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
    <v-row no-gutters class="mt-2 justify-center">
      

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
    </v-row>

    <!-- Data Table -->
    <v-card class="mt-5 mb-5">
      <v-card-title>
        <span>Vehicles Details</span>
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
            <td class="d-block d-sm-table-cell">{{ item.user_qr_id }}</td>
            <td class="d-block d-sm-table-cell">{{ item.phone_no }}</td>
            <td class="d-block d-sm-table-cell">{{ item.acc_status_active }}</td>
            <td class="d-block d-sm-table-cell">{{ item.v_name }}</td>
            <td class="d-block d-sm-table-cell truncate">{{ item.v_description }}</td>
            <td class="d-block d-sm-table-cell">{{ item.v_type_name }}</td>
            <td class="d-block d-sm-table-cell">{{ item.v_no_letter }}</td>
            <td class="d-block d-sm-table-cell">{{ item.v_no_number }}</td>
            <td class="d-block d-sm-table-cell">{{ item.v_status }}</td>
            <td class="d-block d-sm-table-cell">{{ item.exp_date }}</td>
            <td class="d-block d-sm-table-cell">{{ item.isExpired }}</td>
            <td class="d-block d-sm-table-cell">{{ item.package }}</td>
            <td class="d-block d-sm-table-cell">
              <v-container fluid class="ActionButton__container pa-1">
                <ActionButton
                  class="ma-1"
                  @click="
                    isUpdateData = true;
                    dialog = !dialog;
                    editItem = item;
                    VehicleViewerDialog = false;
                  "
                  icon="mdi-pencil"
                  color="green lighten-2"
                />
                <ActionButton
                  @click="editItem = item;VehicleViewerDialog = false; VehicleViewerDialog = true;"
                  class="ma-1"
                  icon="mdi-archive"
                  color="green lighten-2"
                />
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- Popup Form Create/Update-->
    <VehicleViewer :dialog="VehicleViewerDialog" :data="editItem"/>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="300px">
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <v-card>
              <v-card-title fixed>
                <span class="headline">Vehicle Details</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row class="mt-4">
                    <v-col cols="12" md="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Is Account Active"
                      >
                        <v-select
                          v-model="editItem.acc_status_active"
                          :items="items"
                          :error-messages="errors"
                          label="Is Account Active"
                          required
                        >
                        </v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Vehicle Status Active"
                      >
                        <v-select
                          v-model="editItem.v_status"
                          :items="items"
                          :error-messages="errors"
                          label="Vehicle Status Active"
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
import VehicleViewer from "../../components/vehicle_details_view.vue";
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

const vehiclesRef = fireStore.collection("users");

export default {
  name: "user_vehicles",
  components: {
    ActionButton,
    ValidationObserver,
    ValidationProvider,
    VehicleViewer,
  },

  created() {
    this.getHelpDetails();
  },
  //  computed: {
  //     id() {
  //       return this.$route.params.id;
  //     },
  //   },
  props:['userId'],
  data: () => ({
    //Other
    search: "",
    // Table
    loading: true,
    headers: [
      {
        text: "Owner Name",
        value: "user_name",
        align: "center",
        width: "150px",
      },
      { text: "Owner QR", value: "user_qr_id" },
      { text: "Owner Phone No", value: "phone_no" },
      { text: "Is Account Active", value: "acc_status_active" },
      { text: "Vehicle Name", value: "v_name" },
      { text: "Vehicle Description", value: "v_description" },
      { text: "Vehicle Type", value: "v_type_name" },
      { text: "V.N Letter", value: "v_no_letter" },
      { text: "V.N Number", value: "v_no_number" },
      { text: "V.Status Active", value: "v_status" },
      { text: "Exp Date", value: "exp_date" },
      { text: "Is Expire", value: "isExpired" },
      { text: "Package", value: "package" },
      { text: "User Actions", value: "u-actions", width: "190px" },
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
    VehicleViewerDialog :false,
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),
  methods: {
    getHelpDetails() {
      vehiclesRef
        .doc(this.userId)
        .collection("vehicles")
        .orderBy("v_id")
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
        vehiclesRef.doc(this.userId)
        .collection("vehicles")
          .doc(this.editItem.v_id)
          .update({
            acc_status_active: this.editItem.acc_status_active,
            v_status: this.editItem.v_status,
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
    // deleteData() {
    //   try {
    //     this.loadingBtn = true;

    //     vehiclesRef
    //       .doc(this.deleteID)
    //       .delete()
    //       .then(() => {
    //         this.dialogDelete = !this.dialogDelete;
    //         this.loadingBtn = !this.loadingBtn;
    //         this.deleteID = null;
    //         this.alertMessage("Data deleted successfully.", "success");
    //       })
    //       .catch((e) => {
    //         this.dialogDelete = !this.dialogDelete;
    //         this.loadingBtn = !this.loadingBtn;
    //         this.deleteID = null;
    //         this.alertMessage(e.message, "error");
    //       });
    //   } catch (error) {
    //     this.dialogDelete = !this.dialogDelete;
    //     this.loadingBtn = !this.loadingBtn;
    //     this.deleteID = null;
    //     this.alertMessage(error.message, "error");
    //   }
    // },
   
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
.truncate {
  max-width: 300px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
