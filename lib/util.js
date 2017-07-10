

var highscores = []

var scoresRef = database.ref('scores');

leadsRef.on('value', function(snapshot) {
	highscores = []
    snapshot.forEach(function(childSnapshot) {
      	highscores.push((childSnapshot.val()));
    });
});


 const getHighscores = (scoresRef, highscores) => {
  highscores = []
  scoresRef.orderByChild("score").limitToLast(5).on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        	highscores.push((childSnapshot.val()));
      });
  });
}
