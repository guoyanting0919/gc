<template>
  <div class="wzContainer">
    <div class="btnGroup">
      <button v-if="!isLogIn" @click="authenticate">login</button>
      <!-- <button @click="loadClient">clientCheck</button> -->
      <button @click="post">post</button>
    </div>
    <div class="checkBoxGroup">
      <label for="All">
        <input value="All" type="radio" name="All" id="All" v-model="checkedNames" />All
      </label>
      <label for="TypeA">
        <input value="TypeA" type="radio" name="TypeA" id="TypeA" v-model="checkedNames" />TypeA
      </label>
      <label for="TypeB">
        <input value="TypeB" type="radio" name="TypeA" id="TypeB" v-model="checkedNames" />TypeB
      </label>
      <label for="TypeC">
        <input value="TypeC" type="radio" name="TypeA" id="TypeC" v-model="checkedNames" />TypeC
      </label>
      <label for="TypeD">
        <input value="TypeD" type="radio" name="TypeA" id="TypeD" v-model="checkedNames" />TypeD
      </label>
    </div>
    <div class="wz">
      <FullCalendar
        v-if="eventsFilter"
        defaultDate="2020-04-21"
        locale="zh-tw"
        defaultView="dayGridMonth"
        datesAboveResources="true"
        :allDaySlot="this.allDay"
        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        class="demo-app-calendar"
        ref="fullCalendar"
        :header="{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }"
        :plugins="calendarPlugins"
        :weekends="calendarWeekends"
        :editable="this.editable"
        :events="this.eventsFilter"
        :eventColor="this.eventColor"
        @eventRender="this.eventRender"
        aspectRatio="2.2"
      />
    </div>
  </div>
</template>

<script>
import events from "../assets/years.json";
import { Calendar } from "@fullcalendar/core";
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Draggable } from "@fullcalendar/interaction";
import { formatRange } from "@fullcalendar/core";
import moment from "moment";
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: function() {
    return {
      isLogIn: false,
      start: "",
      end: "",
      summary: "",
      checkedNames: "All",
      eventColor: "#378006",
      editable: false,
      allDay: true,
      events: events,
      date: "",
      calendarPlugins: [
        resourceDayGridPlugin,
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        resourceTimeGridPlugin
      ],
      calendarWeekends: true
    };
  },
  mounted() {
    gapi.load("client:auth2", function() {
      gapi.auth2.init({
        client_id:
          "1029849860188-2p6ecjh0egiiukqcn6cvesanckp4iqg0.apps.googleusercontent.com"
      });

      console.log(gapi.client.hasOwnProperty("calendar"));
    });
    this.logInCheck();
  },
  methods: {
    eventRender(info) {
      const vm = this;
      info.el.addEventListener("click", function() {
        console.log(info, vm.start);
        if (vm.isLogIn) {
          vm.start = moment(info.event.start).format();
          vm.end = moment(info.event.end).format();
          vm.summary = info.event.title;
          vm.post();
        } else {
          vm.authenticate();
        }
      });
    },
    authenticate() {
      const vm = this;
      return gapi.auth2
        .getAuthInstance()
        .signIn({
          scope:
            "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
        })
        .then(
          function() {
            console.log("Sign-in successful");
            console.log(gapi.client.hasOwnProperty("calendar"));
            vm.loadClient();
          },
          function(err) {
            console.error("Error signing in", err);
          }
        );
    },
    loadClient() {
      const vm = this;
      gapi.client.setApiKey("AIzaSyByY5wMUZ35A9lpgZqlLVJNSC3OFauCOEU");
      return gapi.client
        .load(
          "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
        )
        .then(
          function() {
            console.log("GAPI client loaded for API");
            console.log(gapi.client.hasOwnProperty("calendar"));
            vm.logInCheck();
          },
          function(err) {
            console.error("Error loading GAPI client for API", err);
          }
        );
    },
    post() {
      const vm = this;
      return gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: {
            end: { dateTime: vm.end },
            start: { dateTime: vm.start },
            summary: vm.summary
          }
        })
        .then(
          function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
          },
          function(err) {
            console.error("Execute error", err);
          }
        );
    },
    logInCheck() {
      let check = gapi.hasOwnProperty("client");
      check ? (this.isLogIn = true) : (this.isLogIn = false);
    }
  },

  computed: {
    eventColorFilter() {
      const vm = this;
      let arr = [];
      vm.events.forEach(item => {
        if (item.category === "TypeA") {
          item.color = "#ff8787";
          arr.push(item);
        } else if (item.category === "TypeB") {
          item.color = "#108003";
          arr.push(item);
        } else if (item.category === "TypeC") {
          item.color = "#8790ff";
          arr.push(item);
        } else {
          item.color = "#cb87ff";
          arr.push(item);
        }
      });
      return arr;
    },
    eventsFilter() {
      const vm = this;
      if (vm.checkedNames === "All") {
        return vm.eventColorFilter;
      } else {
        let arr = vm.eventColorFilter.filter(item => {
          return item.category === vm.checkedNames;
        });
        return arr;
      }
    }
  }
};
</script>

<style lang='scss'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";

body {
  margin: 0;
}
.wz {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  width: 80%;
  margin: 30px auto;
}
</style>