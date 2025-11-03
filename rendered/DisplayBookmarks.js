let pageBTv = 1;
let pageBmov = 1;
function TVPag(str){
paginationtv.innerHTML = str;
  paginationtv.querySelectorAll('.pag').forEach((item,index)=>{
    item.addEventListener("click",function(){
        
        pageBTv = item.dataset.page;
        bookmarkedTVShows.innerHTML = "";
        paginationtv.innerHTML = "";
        
        DisplayTv();
        
    });
  });
}
function MovVPag(str){
paginationmov.innerHTML = str;
  paginationmov.querySelectorAll('.pag').forEach((item,index)=>{
    item.addEventListener("click",function(){
        pageBmov = item.dataset.page;
        bookmarkedMovies.innerHTML = "";
        paginationmov.innerHTML = "";
      
        DisplayM();
      
    });
  });
}
function AddPaginationBTV(type,length){
  let str = ``;
  var add = Number((type == "tv"?pageBTv:pageBmov)) + 3;
  const minnum = clamp((type == "tv"?pageBTv:pageBmov)-3,1,Math.ceil(length/10));
  const maxnum = clamp((type == "tv"?pageBTv:pageBmov)+3,1,Math.ceil(length/10));
  //console.log("Min page: "+minnum+" Max page: "+maxnum);
  if(minnum == maxnum)
    return;
  if((type == "tv"?pageBTv:pageBmov) > 1){
    str += `<a  data-page="1"  class="fisrtpag pag"> << </a>`
    str += `<a  data-page="`+(Number((type == "tv"?pageBTv:pageBmov))-1)+`"  class="pag"> < </a>`
  }
  if(minnum > 1){
    str += `<span style='float:left'> ... </span>`
  }
  for (let index = minnum; index <= maxnum; index++) {
    str += `<a  data-page="`+index+`"  class="pag `+(index == (type == "tv"?pageBTv:pageBmov)? 'active':"")+`">`+index+`</a>`;
  }
  if(maxnum*10 < length){
    str += `<span style='float:left'> ... </span>`
  }
  if((type == "tv"?pageBTv:pageBmov)*10 < length){
    str += `<a  data-page="`+(Number((type == "tv"?pageBTv:pageBmov))+1)+`"  class="pag"> > </a>`
    str += `<a  data-page="`+Math.ceil(length/10)+`"  class="lastpag pag"> >> </a>`
  }
  if(type == "tv"){
    TVPag(str);
  }else if(type == "mov"){
    MovVPag(str);
  }
}

async function DisplayM(){
    for (let i = (pageBmov-1)*10; i < (pageBmov-1)*10+10; i++) {
        if(i >= bookmarkes.movies_id.length){
            break;
        }
    url = 'https://api.themoviedb.org/3/movie/'+bookmarkes.movies_id[i].id+'?language=en-US';
    await  fetch(url,options)
        .then(res => res.json())
        .then(data => {
            bookmarkedMovies.innerHTML += DisplayMovieTvItem(
                bookmarkes.movies_id[i].id,
                "movie",
                'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data.poster_path,
                data.release_date?.split('-')[0],
                "Movie",
                data.runtime+" min",
                data.title,
                "",
                "HD",
                "bookmark"
            );
        });
    }
    AddOnClickEvent(".link-item");
              document.querySelectorAll(".bookmark").forEach((item,index)=>{
              item.addEventListener("click",function(){
                console.log("Adding removing bookmarks");
                AddToBookmarks(item.dataset.id,item,"movie");
                bookmarkedMovies.innerHTML = "";
                
                alerte.style.display = "block";
                if(item.innerText == "bookmark_add")
                alerte.innerText = "Added to bookmarks";
                else
                alerte.innerText = "Removed from bookmarks";
                setTimeout(function(){
                alerte.style.display = "none";
                },2000);
                DisplayM();
                paginationmov.innerHTML = "";
              });
               CheckForBookmarks(".bookmark",item);
            });
            AddPaginationBTV("mov",bookmarkes.movies_id.length);
}
async function DisplayTv(){
    for (let i = (pageBTv-1)*10; i < (pageBTv-1)*10+10; i++) {
        if(i >= bookmarkes.tv_id.length){
            break;
        }
        url = 'https://api.themoviedb.org/3/tv/'+bookmarkes.tv_id[i].id+'?language=en-US';
           await fetch(url,options)
                .then(res => res.json())
                .then(data => {
                  let ls = (data.last_episode_to_air ? data.last_episode_to_air.season_number : 1);
                  let le = (data.last_episode_to_air ? data.last_episode_to_air.episode_number : 1);
                    bookmarkedTVShows.innerHTML += DisplayMovieTvItem(
                        bookmarkes.tv_id[i].id,
                        "tv",
                        'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data.poster_path,
                        data.first_air_date?.split('-')[0],
                        "SS "+ls,
                        "EP "+le,
                        data.name,
                        "link-tv",
                        "TV",
                        "bookmarktv"
                    );
                });
        }
        AddOnClickEvent(".link-tv",true)
        document.querySelectorAll(".bookmarktv").forEach((item,index)=>{
        item.addEventListener("click",function(){
            AddToBookmarks(item.dataset.id,item,"tv");
            
            bookmarkedTVShows.innerHTML ="";
            alerte.style.display = "block";
            if(item.innerText == "bookmark_add")
            alerte.innerText = "Added to bookmarks";
            else
            alerte.innerText = "Removed from bookmarks";
            setTimeout(function(){
            alerte.style.display = "none";
            },2000);
            DisplayTv();
            paginationtv.innerHTML = "";
        });
        CheckForBookmarks(".bookmarktv",item);
        });
        AddPaginationBTV("tv",bookmarkes.tv_id.length);
}

function DisplayBookmarks(){
    console.log(ep);
    pageBTv = 1;
    mainbody.scrollTo(0, 0)
    if(bookmarkes.hasOwnProperty('movies_id')){
        
        DisplayM();
        
        
    }
    if(bookmarkes.hasOwnProperty('tv_id')){
        DisplayTv();
    }
    
}