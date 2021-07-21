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
        <span>Transactions Details</span>
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
            <td class="d-block d-sm-table-cell">{{ item.transaction_id }}</td>
            <td class="d-block d-sm-table-cell">{{ item.reference_id }}</td>

            <td class="d-block d-sm-table-cell truncate">
              {{ item.pay_amount }}
            </td>

            <td class="d-block d-sm-table-cell truncate">
              {{ item.is_success }}
            </td>
            <td class="d-block d-sm-table-cell truncate">
              {{ item.date_time }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { fireStore } from "@/firebaseConfig";

const transactionRef = fireStore.collection("users");

export default {
  name: "user_transactions",
  created() {
    this.getHelpDetails();
  },
  
  // computed: {
  //   id() {
  //     return this.$route.params.id;
  //   },
  // },
  props:['userId'],
  data: () => ({
    //Other
    search: "",
    // Table
    loading: true,
    headers: [
      {
        text: "TR.ID",
        value: "transaction_id",
        align: "center",
        width: "150px",
      },
      { text: "Ref.ID", value: "reference_id" },
      { text: "Pay Amount", value: "pay_amount" },
      { text: "Is Success", value: "is_success" },
      { text: "TR Date", value: "date_time" },
    ],
    dataRows: [],
  }),
  methods: {
    getHelpDetails() {
      transactionRef
        .doc(this.userId)
        .collection("transactions")
        .orderBy("dateForOrderBy")
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
</style>
