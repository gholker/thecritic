 function getGenreID(genre_name) {
 	 var local_genres = require('./genres.json');
      console.log(local_genres);
      var genre_id =  -1;
      for (var i in local_genres.genres) {
      	var genreDictionary =  local_genres.genres[i];
        if (genreDictionary.name === genre_name) {
            genre_id = genreDictionary.id;
            break;
        }
      }

      return genre_id;
 }
