let button = document.getElementById("searchBtn");
let input=document.getElementById("searchInput");
let container=document.getElementById("moviecontainer");
button.addEventListener("click",function()
{
    let moviename=input.value;
    let url="https://www.omdbapi.com/?apikey=95b2cc0d&s="+moviename;
    fetch(url)
    .then(response => response.json())
    .then(data=>{
        container.innerHTML="";
        if(data.Response==="False")
        {
            container.innerHTML="<h2> Oops! Couldn't find the movie... </h2>";
            return;
        }
        let movies=data.Search;
        for(let i=0;i<movies.length;i++){
            let movieCard=`
            <a href="movie.html?imdbID=${movies[i].imdbID}"> 
            <div class="movie">
                <img src="${movies[i].Poster}">
                <h3>${movies[i].Title}</h3>
                <p>${movies[i].Year}</p>
            </div>
            </a>
        `;
        container.innerHTML+=movieCard;
        }
    });
    console.log("Button clicked");
    console.log(moviename);
    console.log("Searching movie...");
});
