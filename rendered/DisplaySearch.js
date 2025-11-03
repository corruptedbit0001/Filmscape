
async function SearchMovie(){
  const url = 'https://api.themoviedb.org/3/search/movie?query='+searchname+'&include_adult=false&language=en-US&page='+page;
  let data;
  await fetch(url, options)
    .then(res => res.json())
    .then(json => {
      data = json;
    }).catch(err => console.error(err));;
    return data;
}

async function SearchTV() {
  const url2 = 'https://api.themoviedb.org/3/search/tv?query='+searchname+'&include_adult=false&language=en-US&page='+page;
  let data;
  await fetch(url2, options)
        .then(res => res.json())
        .then(json2 => {
          data = json2;
        }).catch(err => console.error(err));;
  return data;
}

async function GetMoviDetails(json) {
  let data = [];
  for(let i = 0; i < json["results"].length;i++){
    const url = "https://api.themoviedb.org/3/movie/"+json["results"][i].id+"?language=en-US";
    
    await fetch(url, options)
    .then(res => res.json())
    .then(json2 => {
      data.push(json2);
    }).catch(err => console.error(err));;
    
  }
  return data;
}

async function GetTVDetails(json) {
  let data = [];
  for(let i = 0; i < json["results"].length;i++){
    const url = "https://api.themoviedb.org/3/tv/"+json["results"][i].id+"?language=en-US";
    
    await fetch(url, options)
    .then(res => res.json())
    .then(json2 => {
      data.push(json2);
    }).catch(err => console.error(err));;
    
  }
  return data;
}

async function DisplaySearch(){
  searchtitle.innerText = "SEARCH: "+searchname;
  
      

            let data = [];
            let json = await SearchMovie();
            let json2 = await SearchTV();
            

            json['results'].forEach((element,index) => {
              element.name = element.title;
              element.first_air_date = element.release_date;
              // element.imdb_id = moviedata[index].imdb_id;
              // element.runtime = moviedata[index].runtime;
            });
            // json2['results'].forEach((element,index) => {
            //   element.number_of_seasons = tvdetails[index].number_of_seasons;
            //   element.episode_count = (tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.episode_number : 1 );
            // });
            data = json['results'].concat(json2['results']);
            //console.log(moviedata)
            data.sort((a, b)=>{ return b.popularity > a.popularity || b.first_air_date.localeCompare(a.first_air_date) || b.name.localeCompare(a.name) });
            //console.log(data);

            loader.style.display = "none";
            for(let i= 0; i < data.length;i++){
              
              container.innerHTML += DisplayMovieTvItem(
                data[i].id,
                (data[i].hasOwnProperty('original_name') ? "tv":"movie"),
                (data[i].poster_path == null? "./images/error-img.png" : 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data[i].poster_path),
                (data[i].hasOwnProperty('first_air_date') ? data[i].first_air_date.split("-")[0] : data[i].release_date.split("-")[0]),
                (data[i].hasOwnProperty('number_of_seasons') ? 'SS '+data[i].number_of_seasons : "Movie" ),
                (data[i].hasOwnProperty('episode_count') ? 'EP '+data[i].episode_count : data[i].runtime+" min"),
                (data[i].hasOwnProperty('name') ? data[i].name :data[i].title),
                (data[i].hasOwnProperty('original_name') ? "link-tv" :"link-mov"),
                (data[i].hasOwnProperty('original_name') ? `TV`:`HD`),
                (data[i].hasOwnProperty('original_name') ? "bookmarktv" :"bookmark"),
                data[i].imdb_id
              );
              
            }
            let moviedata = await GetMoviDetails(json);
            document.querySelectorAll(".link-mov").forEach((item,index)=>{
              item.dataset.imdbid = moviedata[index].imdb_id;
              item.parentElement.getElementsByClassName("epid")[0].innerText = moviedata[index].runtime+" min";

            });
            let tvdetails = await GetTVDetails(json2);
            document.querySelectorAll(".link-tv").forEach((item,index)=>{
              item.parentElement.getElementsByClassName("type")[0].innerText = "SS "+(tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.season_number : 1 );
              item.parentElement.getElementsByClassName("epid")[0].innerHTML = 'EP '+(tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.episode_number : 0 );
              item.dataset.ep = (tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.episode_number : 0 );
              item.dataset.season = (tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.season_number : 1 );
            });
            

            AddOnClickEvent(".link-item");
            AddOnClickBookmarkEvent(".bookmark","movie");
            document.querySelectorAll(".bookmarktv").forEach((item,index)=>{
              CheckForBookmarks(".bookmarktv",item);
              item.dataset.season = (tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.season_number : 1 );
              item.dataset.ep = (tvdetails[index].last_episode_to_air ? tvdetails[index].last_episode_to_air.episode_number : 0 );
              item.addEventListener("click",function(){
                alerte.style.display = "block";
                if(item.innerText == "bookmark_add")
                alerte.innerText = "Added to bookmarks";
                else
                  alerte.innerText = "Removed from bookmarks";
                setTimeout(function(){
                  alerte.style.display = "none";
                },2000);
                AddToBookmarks(item.dataset.id,item,"tv",item.dataset.season,item.dataset.ep);
              });
            });
            AddPagination("search");
            LoadQualitydata();
        
    

}