const config = {
    apiKey: "AIzaSyDvOguuJdYL3OvCUmdOpsx3gBrbmBu5BqI",
    authDomain: "regeneration-7591b.firebaseapp.com",
    projectId: "regeneration-7591b",
    storageBucket: "regeneration-7591b.appspot.com",
    messagingSenderId: "339496937991",
    appId: "1:339496937991:web:8816b3b3d1b1846d1e58a2",
    measurementId: "G-181WX67L18"
};

firebase.initializeApp(config);
alert("successful");
var database = firebase.database();
var db_ref = database.ref();

function adder() {
    alert("successful");
    /*
    var nickname = document.getElementById("nickname");
    
    var year = document.getElementById("year");
   
    addToLeaderboard(nickname, year);
    */
}

function addToLeaderboard(nickname, year) {
    db_ref.push({
        nick_name: nickname;
        survival_length: year
    });
}

function retrieveFromLeaderboard() {
    alert("successful");
    database.ref().orderByChild("survival_years").limitToLast(10).on("survival_years", (snapshot) => {
        snapshot.forEach((data) => {
            alert(data.val());
        })
    });
}