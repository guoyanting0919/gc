<template>
  <div class="gc">
    <button @click="signIn">signIn</button>
    <button @click="signOut">signOut</button>
    <button @click="postEvent">post</button>
    <button @click="aa">aa</button>
    1212
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
      console.log(gapi);
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
      const config = {
        headers: {
          Authorization: ` Bearer ${vm.testToken}`,
          Accept: "application/json"
        }
      };
      let data = {
        end: {
          date: "2020-04-20"
        },
        start: {
          date: "2020-04-18"
        }
      };
      this.$http
        .post(
          "https://content.googleapis.com/calendar/v3/calendars/primary/events?alt=json&key=AIzaSyCbZCjWSLPL3Vb_fd4ADMwVMpPhu-SRz40",
          data,
          config
        )
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style>
</style>