let params=new
URLSearchParams(window.location.search);

let imdbID= params.get("imdbID")
let url="https://www.omdbapi.com/?apikey=95b2cc0d&i="+imdbID;
fetch(url)
    .then(response => response.json())
    .then(data=>{
        let container=document.getElementById("movieDetails");
        let movieInfo=`
        <div class = "details">
          <img src="${data.Poster}">

          <div class="info">
          <h2>${data.Title}</h2>
          <p><b>Year:</b>${data.Year}</p>
          <p><b>&#11088; IMDB Rating:</b>${data.imdbRating} / 10</p>
          <button id="trailerBtn">🎬 Watch Trailer</button>
          <p><b>Actors:</b>${data.Actors}</p>
          <p><b>Plot:</b>${data.Plot}</p>
        </div>
        </div>
        `
        container.innerHTML=movieInfo;
        let trailerBtn = document.getElementById("trailerBtn");
        let closeBtn = document.getElementById("closeTrailer");
        trailerBtn.addEventListener("click", function(){
            let trailerSearch = data.Title + " official trailer";
            let youtubeURL ="https://www.youtube.com/results?search_query=" + encodeURIComponent(trailerSearch);
            window.open(youtubeURL,"_blank");
        });
        closeBtn.addEventListener("click", function(){
            modal.style.display = "none";
            frame.src = "";
        })
    });

;