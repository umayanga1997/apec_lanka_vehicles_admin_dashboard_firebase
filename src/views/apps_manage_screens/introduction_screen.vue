<template>
  <v-container fluid>
    <v-alert
      transition="scale-transition"
      dense
      :value="isMsg"
      :type="msgType"
      >{{ message }}</v-alert
    >
    <v-row no-gutters class="mt-2 justify-center">
      <!-- Bottom sheet Toggle ActionButton -->
      <v-col cols="12" sm="4" class="pa-1 content-center">
        <v-btn
          class="mx-2"
          @click="
            dialog = !dialog;
            isUpdateData = false;
            editItem = {};
          "
          dark
          elevation="10"
          color="primary"
        >
          <v-icon dark left>mdi-plus</v-icon>

          <span style="font-size: 12px" lowercase>Create new</span>
        </v-btn>
      </v-col>

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
        <span>Introductions Details</span>
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
            <td class="d-block d-sm-table-cell">{{ item.point }}</td>
            <td class="d-block d-sm-table-cell">{{ item.app_name }}</td>
            <td class="d-block d-sm-table-cell">{{ item.title }}</td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.description }}
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
                <ActionButton
                  class="ma-1"
                  @click="
                    dialogDelete = !dialogDelete;
                    deleteID = item.intro_id;
                  "
                  icon="mdi-delete"
                  color="red lighten-1"
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
        <v-dialog v-model="dialog" max-width="600px">
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <v-card>
              <v-card-title fixed>
                <span class="headline">Introduction Details</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Point"
                      >
                        <v-text-field
                          v-model="editItem.point"
                          :error-messages="errors"
                          label="Point *"
                          hint="Enter introduction point"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="App Name"
                      >
                        <v-text-field
                          v-model="editItem.app_name"
                          :error-messages="errors"
                          label="App Name *"
                          hint="Enter app name"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Title"
                      >
                        <v-text-field
                          v-model="editItem.title"
                          :error-messages="errors"
                          required
                          label="Title *"
                          hint="Enter title of introduction"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Description"
                      >
                        <v-textarea
                          v-model="editItem.description"
                          :error-messages="errors"
                          required
                          auto-grow
                          rows="1"
                          label="Description *"
                          hint="Enter description of introduction"
                        ></v-textarea>
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
import {fireStore} from "@/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
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

const IntroductionsFetchRef = fireStore.collectionGroup("introductions");
const IntroductionsRef = fireStore
  .collection("apps_management")
  .doc("FU0U4I2n3PuXmL4LWtIy")
  .collection("introductions");

export default {
  name: "instructions",
  components: {
    ActionButton,
    ValidationObserver,
    ValidationProvider,
  },

  created() {
    this.getSpNoteDetails();
  },

  data: () => ({
    //Other
    search: "",
    // Table
    loading: true,
    headers: [
      { text: "Point", value: "point" },
      { text: "App Name", value: "app_name" },
      { text: "Title", value: "title" },
      { text: "Note Description", value: "description", width: "300px" },
      { text: "Actions", value: "u-actions", width: "190px" },
    ],
    dataRows: [],
    //Form
    selectItems: [true, false],
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
    getSpNoteDetails() {
      IntroductionsFetchRef.orderBy("point")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          this.dataRows = [];
          snapshot.docs.forEach((element) => {
            this.dataRows.push({ ...element.data() });
            this.loading = false;
          });
        })
        .catch((e) => {
          this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    insertData() {
      try {
        this.loadingBtn = true;
        const id = uuidv4();
        IntroductionsRef.doc(id)
          .set({
            intro_id: id,
            point: parseInt(this.editItem.point),
            app_name: this.editItem.app_name,
            title: this.editItem.title,
            description: this.editItem.description,
          })
          .then(() => {
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.editItem = {};
            this.alertMessage("Data inserted successfully.", "success");
          })
          .catch((e) => {
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.editItem = {};
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.dialog = !this.dialog;
        this.loadingBtn = !this.loadingBtn;
        this.editItem = {};
        this.alertMessage(error.message, "error");
      }
    },

    updateData() {
      try {
        this.loadingBtn = true;

        IntroductionsRef.doc(this.editItem.intro_id)
          .update({
            point: parseInt(this.editItem.point),
            app_name: this.editItem.app_name,
            title: this.editItem.title,
            description: this.editItem.description,
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
    deleteData() {
      try {
        this.loadingBtn = true;

        IntroductionsRef.doc(this.deleteID)
          .delete()
          .then(() => {
            this.dialogDelete = !this.dialogDelete;
            this.loadingBtn = !this.loadingBtn;
            this.deleteID = null;
            this.alertMessage("Data deleted successfully.", "success");
          })
          .catch((e) => {
            this.dialogDelete = !this.dialogDelete;
            this.loadingBtn = !this.loadingBtn;
            this.deleteID = null;
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.dialogDelete = !this.dialogDelete;
        this.loadingBtn = !this.loadingBtn;
        this.deleteID = null;
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
.truncate {
  max-width: 300px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
