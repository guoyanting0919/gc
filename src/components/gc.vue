<template>
  <div class="gc">
    <button @click="signIn">signIn</button>
    <button @click="signOut">signOut</button>
    <button @click="postEvent">post</button>
    <button @click="aa">aa</button>
    <button id="authorize_button">authorize_button</button>
    <button id="signout_button">signout_button</button>
  </div>
</template>

<script>
import gapi from "gapi-client";
export default {
  data() {
    return {
      isSignIn: this.$gAuth.isAuthorized,
      testToken: ""
    };
  },
  methods: {
    aa() {
      console.log(gapi.client.calendar);
    },
    signIn() {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
          console.log("user", GoogleUser);
          // GoogleUser.getId() : Get the user's unique ID string.
          // GoogleUser.getBasicProfile() : Get the user's basic profile information.
          // GoogleUser.getAuthResponse() : Get the response object from the user's auth session. access_token and so on
          this.isSignIn = this.$gAuth.isAuthorized;
          this.testToken = GoogleUser.tc.access_token;
        })
        .catch(error => {
          //on fail do something
        });
    },
    signOut() {
      //you can use promise from v1.1.0 also
      this.$gAuth
        .signOut()
        .then(() => {
          // things to do when sign-out succeeds
          this.isSignIn = this.$gAuth.isAuthorized;
        })
        .catch(error => {
          // things to do when sign-out fails
        });
    },
    postEvent() {
      const vm = this;
      let data = {
        end: {
          date: "2020-04-20"
        },
        start: {
          date: "2020-04-18"
        }
      };
      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: data
      });
      request.execute(function(event) {
        appendPre("Event created: " + event.htmlLink);
      });
    }
  }
};
</script>

<style>
</style>