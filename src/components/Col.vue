<template>
  <div class="demo-app">
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
    <div class="demo-app-top">
      Start
      <datetime type="datetime" v-model="startDate"></datetime>
      <br />End
      <datetime type="datetime" v-model="endDate"></datetime>
      <br />Title
      <br />
      <input id="dateTitle" type="text" v-model="titleDate" />
      <!-- <br />Start
      <input id="dateStart" type="date" v-model="startDate" />
      <br />End
      <input id="dateEnd" type="date" v-model="endDate" />-->
      <br />
      <button @click="addEvent">送出</button>
    </div>
    <FullCalendar
      v-if="despatchDataFilter"
      locale="zh-tw"
      defaultView="resourceTimelineDay"
      datesAboveResources="true"
      :views="this.views"
      slotDuration="00:05"
      minTime="05:00:00"
      maxTime="24:00:00"
      :allDaySlot="this.allDay"
      schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
      class="demo-app-calendar"
      ref="fullCalendar"
      :header="{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek'
        }"
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      @eventRender="eventRender"
      :editable="this.editable"
      @eventDrop="eventDrop"
      @drop="drop"
      :events="this.despatchDataFilter"
      :resources="this.driverDataFilter"
    />
  </div>
</template>

<script>
// import orderData from "../assets/years.json";
import { Calendar } from "@fullcalendar/core";
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
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
  components: {
    FullCalendar,
    Datetime // make the <FullCalendar> tag available
  },
  // mounted() {
  //   this.setupDraggable();
  // },
  data: function() {
    return {
      addDespatchData: {
        DriverInfoId: "",
        CarId: "",
        StartDate: "",
        DespatchDetail: [{ OrderDetailId: "" }]
      },
      testToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi5ris6Kmm55SoQuWWruS9jSIsImp0aSI6IjEwODMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiMzQiLCIzNCJdLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDIwLzQvMjEg5LiK5Y2IIDEwOjU1OjE3IiwibmJmIjoxNTg3NDM0MTE3LCJleHAiOjE1ODc0Mzc3MTcsImlzcyI6IkFzby5Db3JlIiwiYXVkIjoid3IifQ.88SNsdG4xrustxva393PtSLERtv2NSJuyq0zSrGe3C8",
      editable: false,
      allDay: false,
      orderData: [],
      despatchData: [],
      driverData: [],
      views: {
        resourceTimeGridFourDay: {
          type: "resourceTimeGrid",
          duration: { days: 4 },
          buttonText: "4 days"
        }
      },
      date: "",
      titleDate: "",
      startDate: "2020-04-15",
      endDate: "",
      calendarPlugins: [
        resourceTimelinePlugin,
        resourceDayGridPlugin,
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        resourceTimeGridPlugin
      ],
      calendarWeekends: true
    };
  },
  methods: {
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
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends; // update a property
    },
    gotoPast() {
      let calendarApi = this.$refs.fullCalendar.getApi(); // from the ref="..."
      calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    },
    drop(info) {
      const vm = this;
      vm.addDespatchData.DriverInfoId = info.resource.extendedProps.driverId;
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
          // info.draggedEl.parentNode.removeChild(info.draggedEl);
          vm.getOrder();
          // vm.getDespatch();
        });
    },
    eventDrop(info) {
      console.log(info);
      // if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
      //   this.calendarEvents.push({
      //     // add new event data
      //     title: "New Event",
      //     start: arg.date,
      //     allDay: arg.allDay
      //   });
      // }
    },
    goToday() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.today();
    },
    addEvent() {
      this.calendarEvents.push({
        // add new event data
        title: this.titleDate,
        start: this.startDate,
        end: this.endDate
      });
    },
    eventRender(info) {
      const vm = this;
      info.el.addEventListener("click", function() {
        let orderId = info.event.extendedProps.orderId;
        vm.deleteDespatch(orderId);
        info.event.remove();
      });
      // info.el.appendChild(btn);
    },
    deleteDespatch(orderId) {
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
          vm.getOrder();
        });
    },
    setupDraggable() {
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
    }
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
  async mounted() {
    this.getDespatch();
    this.gerDriverInfo();
    await this.getOrder();
    this.setupDraggable();
  }
};
</script>

<style lang='scss' scoped>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
@import "~@fullcalendar/timeline/main.css";
@import "~@fullcalendar/resource-timeline/main.css";

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}
.demo-app-top {
  display: none;
}
.demo-app-calendar {
  max-width: 1240px;
}
#external-events {
  position: fixed;
  z-index: 2;
  top: 50%;
  left: 20px;
  width: 150px;
  padding: 0 10px;
  border: 1px solid #ccc;
  background: #eee;
}

.fc-resource-cell {
  font-size: 12px;
}

#external-events .fc-event {
  margin: 1em 0;
  cursor: move;
}

.fc-content .fc-widget-content {
  height: 100px;
}
</style>