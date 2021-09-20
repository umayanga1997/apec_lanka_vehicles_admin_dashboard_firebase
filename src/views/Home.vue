<template>
  <v-container fluid>
    <div class="wrapper">
      <v-col
        cols="12"
       
        v-for="header in headers"
        :key="header.title"
      >
        <vs-card>
          <template #title>
            <h3>{{ header.title }}</h3>
          </template>
          <!-- <template #img>
            <img src="/foto5.png" alt="" />
          </template> -->

          <template #text>
            <p>All : {{ header.value }}</p>
            <p v-if="header.active != null">
              Account Active : {{ header.active }}
            </p>
            <p v-if="header.expired != null">Exp : {{ header.expired }}</p>

            <p v-if="header.free != null">Free : {{ header.free }}</p>
            <p v-if="header.basic != null">Basic : {{ header.basic }}</p>
            <p v-if="header.pro != null">Pro : {{ header.pro }}</p>
            <p v-if="header.premium != null">Premium : {{ header.premium }}</p>
          </template>
          <!-- <template #interactions>
            <vs-button danger icon>
              <i class="bx bx-heart"></i>
            </vs-button>
            <vs-button class="btn-chat" shadow primary>
              <i class="bx bx-chat"></i>
              <span class="span"> 54 </span>
            </vs-button>
          </template> -->
        </vs-card>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import { fireStore } from "@/firebaseConfig";

const usersFetchRef = fireStore.collection("users");
const locationsFetchRef = fireStore.collection("locations");
const vTypesFetchRef = fireStore.collection("vehicle_types");
const vehiclesFetchRef = fireStore.collectionGroup("vehicles");
const transactionsFetchRef = fireStore.collectionGroup("transactions");

export default {
  name: "home",
  created() {
    this.headers = [];
    this.getCountOfVehicles();
    this.getCountOfLocations();
    this.getCountOfVehiclesTypes();
    this.getCountOfOwnersAccounts();
    this.getTotalOfTransactions();
  },
  data: () => ({
    headers: [],
  }),
  components: {},
  methods: {
    async getCountOfVehicles() {
      await vehiclesFetchRef
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          var allCount = 0;
          var activeCount = 0;
          var expireCount = 0;

          snapshot.docs.forEach((element) => {
            if (element.data()["acc_status_active"] === true) activeCount++;
            
            if (element.data()["isExpired"] === true) expireCount++;
            
            allCount++;
            
          });

          for (let index = 0; index < this.headers.length; index++) {
            const element = this.headers[index];
            if (element.title === "Count of vehicles") {
              this.headers.splice(index, 1);
              index--;
            }
          }
          // let check = this.headers.splice(
          //   (item) => item.title === "Count of vehicles"
          // );

          this.headers.push({
            title: "Count of vehicles",
            value: allCount,
            active: activeCount,
            expired: expireCount,
          });
        })

        .catch((e) => {
          // this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    async getCountOfLocations() {
      await locationsFetchRef
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          let check = this.headers.filter(
            (item) => item.title === "Count of locations"
          );
          if (check.length === 0)
            this.headers.push({
              title: "Count of locations",
              value: snapshot.docs.length,
            });
        })
        .catch((e) => {
          // this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    async getCountOfVehiclesTypes() {
      await vTypesFetchRef
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          let check = this.headers.filter(
            (item) => item.title === "Count of vehicles types"
          );
          if (check.length === 0)
            this.headers.push({
              title: "Count of vehicles types",
              value: snapshot.docs.length,
            });
        })
        .catch((e) => {
          // this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    async getCountOfOwnersAccounts() {
      await usersFetchRef
        .where("user_type", "==", "owner")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          var allCount = 0;
          var activeCount = 0;
          var basic = 0;
          var pro = 0;
          var premium = 0;
          var free = 0;

          snapshot.docs.forEach((element) => {
            if (element.data()["accActive"] === true) {
              activeCount++;
            } 
              allCount++;
            
            switch (element.data()["account_type"]) {
              case "Free":
                free++;
                break;
              case "Basic":
                basic++;
                break;
              case "Pro":
                pro++;
                break;
              case "Premium":
                premium++;
                break;

              default:
                break;
            }
          });

          for (let index = 0; index < this.headers.length; index++) {
            const element = this.headers[index];
            if (element.title === "Count of owner accounts") {
              this.headers.splice(index, 1);
              index--;
            }
          }
          // let check = this.headers.splice(
          //   (item) => item.title === "Count of vehicles"
          // );

          this.headers.push({
            title: "Count of owner accounts",
            value: allCount,
            active: activeCount,
            basic: basic,
            pro: pro,
            premium: premium,
            free: free,
          });
        })
        .catch((e) => {
          // this.loading = false;
          this.alertMessage(e.message, "error");
        });
    },
    async getTotalOfTransactions() {
      await transactionsFetchRef
        .where("is_success", "==", true)
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          let check = this.headers.filter(
            (item) => item.title === "Total of earnings"
          );
          var amount = 0;
          snapshot.docs.forEach((element) => {
            amount += element.data()["pay_amount"];
          });
          if (check.length === 0)
            this.headers.push({
              title: "Total of earnings",
              value: amount,
            });
        })
        .catch((e) => {
          // this.loading = false;
          this.alertMessage(e.message, "error");
        });
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

<style >
.vs-card {
  background-color: rgb(28, 23, 43) !important;
  color: white !important;
}
.wrapper{
  display: grid;
  gap: 10px;
  grid-template-columns:repeat( auto-fit, minmax(300px, 1fr) );
  grid-auto-flow: dense;
}
</style>
