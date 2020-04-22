<template>
  <div>
    <div id="external-events">
      <p>
        <strong>Draggable Events</strong>
      </p>
      <div
        v-for="(order,i) in orderData"
        :key="i"
        :orderId="order.Id"
        class="fc-event"
        :title="order.CaseUserName"
        :expectedMinute="order.ExpectedMinute"
        :orderDetailId="order.Id"
      >{{order.CaseUserName}}</div>
      <p>
        <input type="checkbox" id="drop-remove" />
        <label for="drop-remove">remove after drop</label>
      </p>
    </div>

    <div id="calendar"></div>

    <button @click="createCalendar">creat</button>
    <button @click="eventRender">render</button>
  </div>
</template>

<script>
import orderData from "../assets/years.json";
import { Calendar } from "@fullcalendar/core";
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Draggable } from "@fullcalendar/interaction";
import { formatRange } from "@fullcalendar/core";
import { Datetime } from "vue-datetime";
import moment from "moment";

export default {
  data() {
    return {
      testToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi5ris6Kmm55SoQuWWruS9jSIsImp0aSI6IjEwODMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiMzQiLCIzNCJdLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDIwLzQvMjEg5LiK5Y2IIDEwOjU1OjE3IiwibmJmIjoxNTg3NDM0MTE3LCJleHAiOjE1ODc0Mzc3MTcsImlzcyI6IkFzby5Db3JlIiwiYXVkIjoid3IifQ.88SNsdG4xrustxva393PtSLERtv2NSJuyq0zSrGe3C8",
      despatchData: "",
      driverData: "",
      orderData: "",
      addDespatchData: {
        DriverInfoId: "",
        CarId: "",
        StartDate: "",
        DespatchDetail: [{ OrderDetailId: "" }]
      }
    };
  },
  computed: {
    despatchDataFilter() {
      let arr = [];
      this.despatchData.forEach(item => {
        let aa = item.DespatchDetails[0].Despatch.StartDate;
        let dur = item.DespatchDetails[0].OrderDetails.ExpectedMinute;
        let bb = moment(aa).format("YYYY-MM-DDTHH:mm:ss.SSS");
        let cc = moment(bb).add(dur, "minutes");
        let obj = {};
        obj.start = bb;
        obj.resourceId = item.DespatchDetails[0].Despatch.CarId;
        obj.duration = item.DespatchDetails[0].OrderDetails.ExpectedMinute;
        obj.end = cc._d;
        obj.orderId = item.DespatchDetails[0].OrderDetails.Id;
        arr.push(obj);
      });
      return arr;
    },
    driverDataFilter() {
      let arr = [];
      this.driverData.forEach(item => {
        let obj = {};
        obj.driverId = item.DriverId;
        obj.id = item.Id;
        obj.title = item.CarNo;
        arr.push(obj);
      });
      return arr;
    }
  },
  methods: {
    createCalendar() {
      let vm = this;
      console.log("createCalendar");
      var calendarEl = document.getElementById("calendar");
      let calendar = new Calendar(calendarEl, {
        // 語言包
        locale: "zh-tw",
        //左側時間單位
        slotDuration: "00:05",
        // 高度
        contentHeight: 800,
        // 左側時間欄是否顯示最小單位
        // slotLabelInterval: "00:01",
        // 拖曳事件最小高度 default:null
        // timeGridEventMinHeight: 550,
        // 設定最小起始時間與最大結束時間
        minTime: "05:00:00",
        maxTime: "24:00:00",
        // 是否顯示allDay欄位
        allDaySlot: false,
        // 專業版金鑰
        schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
        //欄位網格
        plugins: [
          resourceDayGridPlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimeGridPlugin
        ],
        // hover
        // eventMouseEnter: function(mouseEnterInfo) {
        //   console.log(mouseEnterInfo);
        // },
        // 派遣單內部拖曳完成後觸發
        eventDrop(info) {
          console.log("更新派遣單", info);
          // 更新派遣單
        },
        // 訂單拖曳至派遣單後觸發
        drop(info) {
          // console.log("drop", info);
          vm.addDespatchData.DriverInfoId =
            info.resource.extendedProps.driverId;
          vm.addDespatchData.CarId = info.resource.id;
          vm.addDespatchData.StartDate = info.dateStr;
          vm.addDespatchData.DespatchDetail[0].OrderDetailId =
            info.draggedEl.attributes.orderDetailId.value;
          let data = vm.addDespatchData;
          console.log(data);
          const config = {
            headers: {
              Authorization: ` Bearer ${vm.testToken}`
            }
          };
          // 新增派遣單
          vm.$http
            .post(
              `https://cors-anywhere.herokuapp.com/https://ntpcapi.1966.org.tw/api/Despatch/Post`,
              data,
              config
            )
            .then(res => {
              console.log(res);
              info.draggedEl.parentNode.removeChild(info.draggedEl);
            });
        },
        // 類似drop但有結束時間無resouse
        // eventReceive: function(info) {
        //   console.log("eventReceive", info);
        // },
        // 派遣單上點擊後觸發
        eventRender: this.eventRender,
        //
        views: {
          resourceTimeGridFourDay: {
            type: "resourceTimeGrid",
            duration: { days: 4 },
            buttonText: "4 days"
          }
        },
        defaultView: "resourceTimeGridDay",
        // editable: true,
        datesAboveResources: true,
        header: {
          left: "prev,next today",
          center: "title",
          right: "resourceTimeGridDay,resourceTimeGridFourDay"
        },
        resources: this.driverDataFilter,
        events: this.despatchDataFilter
      });

      calendar.render();
    },
    createDraggable() {
      new Draggable(document.getElementById("external-events"), {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          let expectedMinute = eventEl.getAttribute("expectedMinute") * 60000;
          let orderId = eventEl.getAttribute("orderId");
          let event = {
            title: eventEl.innerText,
            duration: expectedMinute,
            startEditable: true,
            durationEditable: false,
            extendedProps: {
              orderId: orderId
            }
          };
          // console.log(event);
          return event;
        }
      });
    },
    async getDespatch() {
      //派遣單
      const vm = this;
      await vm.$http
        .get(
          "https://ntpcapi.1966.org.tw/api/Despatch/GetAllGroup?CompanyId=97&key=2020-04-20"
        )
        .then(res => {
          console.log(res);
          vm.despatchData = res.data.response;
        })
        .catch(err => {
          console.log("getDespatch err");
        });
    },
    async gerDriverInfo() {
      const vm = this;
      await vm.$http
        .get(
          "https://ntpcapi.1966.org.tw/api/Cars/GetCarsWithCarTypeNoPage?compId=97&carType=0&isDescending=false"
        )
        .then(res => {
          vm.driverData = res.data.response;
          console.log(res);
        });
    },
    async getOrder() {
      const vm = this;
      const config = {
        headers: {
          Authorization: ` Bearer ${vm.testToken}`
        }
      };
      await vm.$http
        .get(
          "https://ntpcapi.1966.org.tw/api/OrderDetails/GeOrderDetailtForDespatch/2020-04-20",
          config
        )
        .then(res => {
          console.log("getOrder", res);
          vm.orderData = res.data.response;
        });
    },
    deleteDespatch(orderId) {
      // https://ntpcapi.1966.org.tw/api/Despatch/DeleteSubByODId?OrderDetailID=32087
      const vm = this;
      const config = {
        headers: {
          Authorization: ` Bearer ${vm.testToken}`
        }
      };
      vm.$http
        .delete(
          `https://cors-anywhere.herokuapp.com/https://ntpcapi.1966.org.tw/api/Despatch/DeleteSubByODId?OrderDetailID=${orderId}`,
          config
        )
        .then(res => {
          console.log(res);
        });
    },
    eventRender(info) {
      // var btn = document.createElement("button");
      // btn.appendChild(document.createTextNode("x"));
      const vm = this;
      info.el.addEventListener("click", function() {
        // info.el.remove();
        // console.log(info.event.id);
        // console.log(info.event.extendedProps.orderId);
        let orderId = info.event.extendedProps.orderId;
        // console.log(info);
        vm.deleteDespatch(orderId);
        info.event.remove();
        // info.draggedEl.parentNode.appendchild(info.draggedEl);
      });
      // info.el.appendChild(btn);
    }
  },
  async mounted() {
    const vm = this;
    // await vm.$http.interceptors.request.use(config => {
    //   if (vm.testToken) {
    //     config.headers.Authorization = "Bearer " + vm.testToken;
    //     console.log("token set");
    //   }
    //   return config;
    // });
    await this.gerDriverInfo();
    await this.getDespatch();
    await this.getOrder();
    vm.createCalendar();
    vm.createDraggable();
  }
};
</script>

<style scoped>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
html,
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

#calendar {
  max-width: 1240px;
  margin: 40px auto;
}
.fc-resource-cell {
  height: 90px;
  min-width: 150px;
}
</style>