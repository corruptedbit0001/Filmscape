let page = 1;
let maxpage = 999;
let tvpage = 1;
let latesturl = "https://moviesapi.to/api/discover/tv?direction=desc&page="+page;
let tvlistener = false;
let tvsource = "source1";
//let apiUrl = "https://vidsrc.xyz/movies/latest/page-1.json";
function clamp(num, min, max) {
  //console.log("num "+num);
  const lower = Math.max(num, min);
 // console.log("lower "+num);
  return Math.min(lower, max);
}

function AddPagination(mv){
  let str = ``;
  var add = Number(page) + 3;
  const minnum = clamp(page-3,1,maxpage);
  const maxnum = clamp(add,1,Number(maxpage));
  console.log("Min page: "+minnum+" Max page: "+maxnum);
  if(page > 1){
    str += `<a  data-page="1"  class="fisrtpag pag"> << </a>`
    str += `<a  data-page="`+(Number(page)-1)+`"  class="pag"> < </a>`
  }
  if(minnum > 1){
    str += `<span style='float:left'> ... </span>`
  }
  for (let index = minnum; index <= maxnum; index++) {
    str += `<a  data-page="`+index+`"  class="pag `+(index == page? 'active':"")+`">`+index+`</a>`;
  }
  if(maxnum < maxpage){
    str += `<span style='float:left'> ... </span>`
  }
  if(page < maxpage){
    str += `<a  data-page="`+(Number(page)+1)+`"  class="pag"> > </a>`
    str += `<a  data-page="`+Math.ceil(maxpage)+`"  class="lastpag pag"> >> </a>`
  }
  pagination.innerHTML = str;
  pagination.querySelectorAll('.pag').forEach((item,index)=>{
    item.addEventListener("click",function(){
      page = item.dataset.page;
      container.innerHTML = '<div id="loader" class="loader"></div>';
      if(mv =="movie"){
        DisplayMoviesGrid();
      }else if(mv == "tv"){
        DisplayTvGrid();
      }else if(mv == "search"){
        DisplaySearch();
      }else if(mv == "filter"){
        ShowFilterSearch();
      }
    });
  });
}

function DisplayMoviesGrid(){
  apiUrl="https://moviesapi.to/api/discover/movie?direction=desc&page="+page;
  fetchAndParseJson(apiUrl)
      .then(data => {
        if (data) {
            
            DisplayGrid(data['data'],"movie");
            ismovie = "movie";
            vidsrc = "movies";
            maxpage = data.last_page;
            apiUrl="https://vidsrc.xyz/"+vidsrc+"/latest/page-1.json";
            AddPagination("movie");
            
        }
      });
}
function DisplayTvGrid(){
  sources.querySelectorAll('.source').forEach((item,index)=>{
    if (tvlistener) {
      return;
    }
    if(index == 1)
    tvlistener = true;

    item.addEventListener("click",function(){
      
      page = 1;
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      item.className = "source active";
      container.innerHTML = `<div id="loader" class="loader"></div>`;
      tvsource = item.dataset.source;
      
      DisplayTvGrid();
    });
  
  });
  if(tvsource == "source1"){
    latesturl = "https://moviesapi.to/api/discover/tv?direction=desc&page="+page;
  }else{
    latesturl = "https://vidsrc.xyz/tvshows/latest/page-"+page+".json";
  }
  
  fetchAndParseJson(latesturl)
      .then(data => {
        if (data) {
            //const url = 'https://api.themoviedb.org/3/tv/'+data['result'][i].tmdb_id+'?language=en-US';
            DisplayGrid((data.hasOwnProperty("data") ? data['data'] : data["result"]),"tv");
            ismovie = "tv";
            vidsrc = "tvshows";
            maxpage = (data.last_page ? data.last_page : data.pages);
            apiUrl="https://vidsrc.xyz/"+vidsrc+"/latest/page-1.json";
            AddPagination("tv");
            
        }
      });
      
}

async function DisplayGrid(data,type) {
    const f = document.getElementById('container');
    AddFilterEvents();
    //data["result"] = Grab20(data);
    for(let i= 0; i < data.length;i++){
        const url = 'https://api.themoviedb.org/3/'+type+'/'+(data[i].hasOwnProperty("tmdbid") ? data[i].tmdbid : data[i].tmdb_id )+'?language=en-US';
        await fetch(url, options)
          .then(res => res.json())
          .then(json =>{ 
            
            loader.style.display = "none";
            let ls = (json.last_episode_to_air ? json.last_episode_to_air.season_number : 1);
            let le = (json.last_episode_to_air ? json.last_episode_to_air.episode_number : 1);
            f.innerHTML += DisplayMovieTvItem(
                    json.id,
                    (json.hasOwnProperty('number_of_seasons') ? "tv":"movie"),
                    (json.poster_path == null? "./images/error-img.png" : 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+json.poster_path),
                    (json.hasOwnProperty('first_air_date') ? json.first_air_date?.split("-")[0] : json.release_date?.split("-")[0]),
                    (json.hasOwnProperty('number_of_seasons') ? 'SS '+ls : "Movie" ),
                    (json.hasOwnProperty('seasons') ? 'EP '+le : json.runtime+" min"),
                    (type == "tv" ?json.name :json.title),
                    "",
                    (type == "tv" ? "TV":data[i].quality),
                    (type == "tv" ? "bookmarktv":"bookmark"),
                    json.imdb_id

                  );
            
              
          })
          .catch(err => console.error(err));
        
    }
    if(type == "tv"){
      AddOnClickEvent(".link-item",true);
      AddOnClickBookmarkEvent(".bookmarktv","tv");
    }else{
      AddOnClickEvent(".link-item");
      AddOnClickBookmarkEvent(".bookmark","movie");
    }
    
}
