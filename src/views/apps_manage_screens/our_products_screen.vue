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
            selectedImageURL = null;
            croppedImage = null;
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
        <span>Our Products Details</span>
      </v-card-title>

      <v-data-table
        dark
        style="background-color: #292929"
        :headers="headers"
        :items="dataRows"
        :search="search"
        fixed-tabs
        item-key="app_name"
        fixed-header
        :loading="loading"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="d-block-flex d-sm-table-cell">
              <v-img
                :src="item.app_icon_url"
                :lazy-src="item.app_icon_url"
                contain
                width="50"
                height="50"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </td>
            <td class="d-block d-sm-table-cell">{{ item.app_name }}</td>
            <td class="d-block d-sm-table-cell">{{ item.app_title }}</td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.app_description }}
            </td>
            <td class="d-block d-sm-table-cell">{{ item.link_title }}</td>
            <td class="d-block d-sm-table-cell">{{ item.app_link }}</td>
            <td class="d-block d-sm-table-cell">{{ item.link_icon }}</td>
            <td class="d-block d-sm-table-cell">
              <v-container fluid class="ActionButton__container pa-1">
                <ActionButton
                  class="ma-1"
                  @click="
                    isUpdateData = true;
                    dialog = !dialog;
                    editItem = item;
                    selectedImageURL = null;
                    croppedImage = null;
                  "
                  icon="mdi-pencil"
                  color="green lighten-2"
                />
                <ActionButton
                  class="ma-1"
                  @click="
                    dialogDelete = !dialogDelete;
                    editItem = item;
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
                <span class="headline">Our Product Details</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row class="mt-4">
                    <v-row>
                      <v-col
                        cols="6"
                        sm="6"
                        md="6"
                        style="
                          justify-content: center;
                          display: grid;
                          margin-bottom: 15px;
                        "
                      >
                        <cropper
                          v-if="selectedImageURL !== null"
                          class="cropper"
                          :src="selectedImageURL"
                          @change="cropperChange"
                        ></cropper>
                        <v-img
                          v-else
                          contain
                          :src="editItem.app_icon_url"
                          class="cropper"
                        ></v-img>

                        <v-btn
                          class="primary"
                          style="width: 100px"
                          @click="onPickFile"
                        >
                          Pick Image
                        </v-btn>
                        <input
                          type="file"
                          style="display: none"
                          ref="fileInput"
                          accept="image/webp"
                          @change="onPickedFile"
                        />
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-col cols="12" sm="12" md="12">
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
                        <v-col cols="12" sm="12" md="12">
                          <validation-provider
                            v-slot="{ errors }"
                            rules="required"
                            name="Title"
                          >
                            <v-text-field
                              v-model="editItem.app_title"
                              :error-messages="errors"
                              required
                              label="Title *"
                              hint="Enter title of the app"
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-col>
                    </v-row>

                    <v-col cols="12" sm="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="App Description"
                      >
                        <v-textarea
                          v-model="editItem.app_description"
                          :error-messages="errors"
                          required
                          auto-grow
                          rows="1"
                          label="App Description *"
                          hint="Enter description of the app"
                        ></v-textarea>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Link Title"
                      >
                        <v-text-field
                          :error-messages="errors"
                          required
                          v-model="editItem.link_title"
                          label="Link Title"
                          hint="Enter link title of the app"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Link Icon"
                      >
                        <v-text-field
                          :error-messages="errors"
                          required
                          v-model="editItem.link_icon"
                          label="Link Icon"
                          hint="Enter link icon of the app"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="Link"
                      >
                        <v-text-field
                          :error-messages="errors"
                          required
                          v-model="editItem.app_link"
                          label="Link"
                          hint="Enter link of the app"
                        ></v-text-field>
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
import { fireStore, storage } from "@/firebaseConfig";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
//Validator Configurations
import { v4 as uuidv4 } from "uuid";
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

const ourProductsFetchRef = fireStore.collectionGroup("our_products");
const ourProductsRef = fireStore
  .collection("apps_management")
  .doc("FU0U4I2n3PuXmL4LWtIy")
  .collection("our_products");

export default {
  name: "our_products",
  components: {
    ActionButton,
    ValidationObserver,
    ValidationProvider,
    Cropper,
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
      { text: "App Icon", value: "app_icon_url", width: "100px" },
      { text: "App Name", value: "app_name", width: "120px" },
      { text: "App Title", value: "app_title" },
      { text: "App Description", value: "app_description", width: "300px" },
      { text: "Link Title", value: "link_title" },
      { text: "Link", value: "app_link", width: "100px" },
      { text: "Link Icon", value: "link_icon" },
      { text: "Actions", value: "u-actions", width: "190px" },
    ],
    dataRows: [],
    ////Form
    //Image
    selectedImageURL: null,
    isSelectNewImage: false,
    selectedImage: null,
    croppedImage: null,
    //Other
    editItem: {},
    loadingBtn: false,
    isUpdateData: false,
    dialog: false,
    dialogDelete: false,
    //message
    message: null,
    isMsg: false,
    msgType: null,
  }),
  methods: {
    getHelpDetails() {
      try {
        ourProductsFetchRef.onSnapshot(
          { includeMetadataChanges: true },
          (snapshot) => {
            this.dataRows = [];
            snapshot.docs.forEach((element) => {
              this.dataRows.push({ ...element.data() });
              this.loading = false;
            });
          }
        );
      } catch (error) {
        this.loading = false;
        this.alertMessage(error, "error");
      }
    },
    async insertData() {
      try {
        this.loadingBtn = true;
        const id = uuidv4();
        if (this.isSelectNewImage) {
          const value = await this.uploadImageToStorage(id);
          ourProductsRef
            .doc(id)
            .set({
              product_id: id,
              app_icon_url: value,
              app_name: this.editItem.app_name,
              app_title: this.editItem.app_title,
              app_description: this.editItem.app_description,
              link_title: this.editItem.link_title ?? "",
              app_link: this.editItem.app_link ?? "",
              link_icon: this.editItem.link_icon ?? "",
            })
            .then(() => {
              this.isSelectNewImage = false;
              this.dialog = !this.dialog;
              this.loadingBtn = !this.loadingBtn;
              this.editItem = {};
              this.alertMessage("Data inserted successfully.", "success");
            })
            .catch((e) => {
              this.isSelectNewImage = false;
              this.dialog = !this.dialog;
              this.loadingBtn = !this.loadingBtn;
              this.editItem = {};
              this.alertMessage(e.message, "error");
            });
        } else {
          this.alertMessage("Please select a app icon image.", "error");
        }
      } catch (error) {
        this.isSelectNewImage = false;
        this.dialog = !this.dialog;
        this.loadingBtn = !this.loadingBtn;
        this.editItem = {};
        this.alertMessage(error.message, "error");
      }
    },

    async updateData() {
      try {
        this.loadingBtn = true;
        //Delete previous image from storage
        var value;
        //Upload new image to storage and get url
        if (this.isSelectNewImage) {
          // console.log("New");
          await this.deleteImageFromStorage();
          value = await this.uploadImageToStorage(this.editItem.product_id);
        } else {
          value = this.editItem.app_icon_url;
          // console.log("Previous");
        }
        ourProductsRef
          .doc(this.editItem.product_id)
          .update({
            app_icon_url: value,
            app_name: this.editItem.app_name,
            app_title: this.editItem.app_title,
            app_description: this.editItem.app_description,
            link_title: this.editItem.link_title ?? "",
            app_link: this.editItem.app_link ?? "",
            link_icon: this.editItem.link_icon ?? "",
          })
          .then(() => {
            this.isSelectNewImage = false;
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.isUpdateData = !this.isUpdateData;
            this.editItem = {};
            this.alertMessage("Data updated successfully.", "success");
          })
          .catch((e) => {
            this.isSelectNewImage = false;
            this.dialog = !this.dialog;
            this.loadingBtn = !this.loadingBtn;
            this.isUpdateData = !this.isUpdateData;
            this.editItem = {};
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.isSelectNewImage = false;
        this.dialog = !this.dialog;
        this.loadingBtn = !this.loadingBtn;
        this.isUpdateData = !this.isUpdateData;
        this.editItem = {};
        this.alertMessage(error.message, "error");
      }
    },
    async deleteData() {
      try {
        this.loadingBtn = true;
        //Delete image from storage
        await this.deleteImageFromStorage();

        //Delete all the details of selected item
        ourProductsRef
          .doc(this.editItem.product_id)
          .delete()
          .then(() => {
            this.dialogDelete = !this.dialogDelete;
            this.loadingBtn = !this.loadingBtn;
            this.editItem = {};
            this.alertMessage("Data deleted successfully.", "success");
          })
          .catch((e) => {
            this.dialogDelete = !this.dialogDelete;
            this.loadingBtn = !this.loadingBtn;
            this.editItem = {};
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
        this.dialogDelete = !this.dialogDelete;
        this.loadingBtn = !this.loadingBtn;
        this.editItem = {};
        this.alertMessage(error.message, "error");
      }
    },
    onPickFile() {
      this.$refs.fileInput.click();
      this.isSelectNewImage = true;
    },
    onPickedFile(event) {
      const file = event.target.files;
      let fileName = file[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Please select a valid file!");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.selectedImageURL = fileReader.result;
      });
      fileReader.readAsDataURL(file[0]);
      this.selectedImage = file[0];
    },
    cropperChange({ canvas }) {
      this.croppedImage = canvas.toDataURL("image/webp");
    },
    async uploadImageToStorage(id) {
      const value = await storage
        .ref("products_images/")
        .child("product_" + id + "_" + this.selectedImage.name)
        .putString(this.croppedImage, "data_url")
        .then((value) => {
          return value.ref.getDownloadURL();
        });
      return value;
    },
    async deleteImageFromStorage() {
      try {
        await storage
          .refFromURL(this.editItem.app_icon_url)
          .delete()
          .catch((e) => {
            this.alertMessage(e.message, "error");
          });
      } catch (error) {
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
.cropper {
  /* aspect-ratio: 16/9; */
  height: 100px;
  width: 100px;
  background: #ddd;
  margin-bottom: 10px;
}
</style>
