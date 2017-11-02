$(document).ready(function() {

      //=====Initialize firebase====

      var config = {
        apiKey: "AIzaSyD0OXrcSbLhuGr6E6p6UZucmPf0eVEfXsQ",
        authDomain: "trainscheduler-b3365.firebaseapp.com",
        databaseURL: "https://trainscheduler-b3365.firebaseio.com",
        projectId: "trainscheduler-b3365",
        storageBucket: "trainscheduler-b3365.appspot.com",
        messagingSenderId: "297514355696"
      };
      firebase.initializeApp(config);

      var database = firebase.database();

      //===on click function to save user submissions on firebase database===

      $("#submit").on("click", function(event) {

        //===prevents page from refershing when form tries to submit itself====
        event.preventDefault();

        //===capture user inputs and store them into variables===

        var trainName = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var trainTime = $("#train-time").val().trim();
        var frequency = $("#frequency").val().trim();

        //====verify on click function works====
        console.log(trainName);
        console.log(destination);
        console.log(trainTime);
        console.log(frequency);

        //=====stores variables/user inputs into firebase database====
        database.ref().push({
          trainName: trainName,
          destination: destination,
          trainTime: trainTime,
          frequency: frequency

        });

        //=====Time calculations======


        database.ref().on("child_added", function(childSnapshot) {
          // console.log(childSnapshot.val());
          var trainName = childSnapshot.val().trainName;
          var destination = childSnapshot.val().destination;
          var trainTime = childSnapshot.val().trainTime;
          var frequency = childSnapshot.val().frequency;


          var freq = parseInt(frequency);
          //current time
          var currentTime = moment();

         
          var dConverted = moment(childSnapshot.val().trainTime, 'HH:mm').subtract(1, 'years');

          var trainTime = moment(dConverted).format('HH:mm');


          //time differences
          var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
          var tDifference = moment().diff(moment(tConverted), 'minutes');

          //REMAINDER
          var tRemainder = tDifference % freq;

          //minutes until next train
          var minsAway = freq - tRemainder;

          //next train time
          var nextTrain = moment().add(minsAway, 'minutes');




          //=====append inputs to table=====
          database.ref().on("child_added", function(snapshot) {
            console.log(snapshot);
            $("#add-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
              "<td>" + snapshot.val().destination + "</td>" +
              "<td>" + "Every" + " " + snapshot.val().frequency + " " + "mins" + "</td>" +
              "<td>" + snapshot.val().nextArrival + "</td>" +
              "<td>" + snapshot.val().minsAway + " " + "mins until arrival" + "</td>" +
              "</td></tr>");


          });

        });

      });

    });
