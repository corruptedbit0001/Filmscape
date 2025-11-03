let sort_display = [{name:"Name A-Z",data:"original_title.asc"},
    {name:"Name Z-A",data:"original_title.desc"},
    {name:"Relese Date Asc",data:"primary_release_date.asc"},
    {name:"Relese Date Desc",data:"primary_release_date.desc"},
    {name:"Popularity Asc",data:"popularity.asc"},
    {name:"Popularity Desc",data:"popularity.desc"},
    {name:"Vote Average Asc",data:"vote_average.asc"},
    {name:"Vote Average Desc",data:"vote_average.desc"},
    {name:"Vote Count Asc",data:"vote_count.asc"},
    {name:"Vote Count Desc",data:"vote_count.desc"},
]
let sort_display_tv = [{name:"Name A-Z",data:"original_name.asc"},
    {name:"Name Z-A",data:"original_name.desc"},
    {name:"Relese Date Asc",data:"first_air_date.asc"},
    {name:"Relese Date Desc",data:"first_air_date.desc"},
    {name:"Popularity Asc",data:"popularity.asc"},
    {name:"Popularity Desc",data:"popularity.desc"},
    {name:"Vote Average Asc",data:"vote_average.asc"},
    {name:"Vote Average Desc",data:"vote_average.desc"},
    {name:"Vote Count Asc",data:"vote_count.asc"},
    {name:"Vote Count Desc",data:"vote_count.desc"},
]
let genres_selected = [];
let countries_selected = [];
let years_selected = [];
let ratings_selected = [];
let vote_average_selected = [];
let sort_by_selected = 5;
let type_selected = "movie"
let filter_open = false;
content.addEventListener("click",()=>{
    if(filter_open){console.log('closing filter');
        document.querySelectorAll(".dropdown_filter").forEach((item,index)=>{
            item.style.display = "none";
        });
        filter_open = false;
    }
})

async function GetCountries() {
    const url = 'https://api.themoviedb.org/3/configuration/countries?language=en-US';
    let data;
    await fetch(url, options)
        .then(res => res.json())
        .then(json =>{
            data = json;
            })
        .catch(err => console.error(err));
        return data;
}
async function GetMoviesGenres() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
    let data;
    await fetch(url, options)
        .then(res => res.json())
        .then(json =>{
            data = json;
            })
        .catch(err => console.error(err));
        return data;
}
async function FetchDiscoverData(filterurl){
    let data;
    await fetch(filterurl, options)
        .then(res => res.json())
        .then(json =>{
            data = json;
        }).catch(err => console.error(err));
    return data;
}
async function ShowFilterSearch(){
    let today = new Date();
    let filterurl = 'https://api.themoviedb.org/3/discover/'+type_selected+'?include_adult=false&'+(type_selected =="movie" ?  'include_video=false' : 'include_null_first_air_dates=false')+'&language=en-US&page='+page+'&sort_by='+(type_selected == "movie" ? sort_display[sort_by_selected].data : sort_display_tv[sort_by_selected].data);
    filterurl += '&'+(type_selected == "movie"? 'primary_release_date' : 'first_air_date' )+'.lte='+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if(genres_selected && genres_selected.length > 0){
        filterurl += '&with_genres='
        for (let i = 0; i < genres_selected.length; i++) {
            filterurl += genres_selected[i]+'%2C';   
        }   
    }
    if(countries_selected && countries_selected.length > 0){
        filterurl += '&with_origin_country='
        for (let i = 0; i < countries_selected.length; i++) {
            filterurl += countries_selected[i]+'%2C';   
        }  
    }
    if(years_selected && years_selected.length > 0){
        if(years_selected.length > 1){
            let largers_year = Math.max(...years_selected);
            let lowest_year = Math.min(...years_selected);
            filterurl += '&'+(type_selected == "movie"? 'primary_release_date' : 'first_air_date' )+'.gte='+lowest_year+'-01-01&'+(type_selected == "movie"? 'primary_release_date' : 'first_air_date' )+'.lte='+largers_year+'-12-31';
        }else{
            filterurl += '&'+(type_selected == "movie"? 'primary_release_date' : 'first_air_date' )+'.gte='+years_selected[0]+'-01-01&'+(type_selected == "movie"? 'primary_release_date' : 'first_air_date' )+'.lte='+years_selected[0]+'-12-31';
        }
    }
    if(ratings_selected && ratings_selected.length > 0){
        filterurl += '&certification_country=US&'
        if(ratings_selected.length > 1){
            let largers_rating = ratings_selected.reduce(function(prev, current) {
                return (prev && prev.index > current.index) ? prev : current
                })
            let lowest_rating = ratings_selected.reduce(function(prev, current) {
                return (prev && prev.index < current.index) ? prev : current
                })
            filterurl += '&certification.gte='+lowest_rating.rating+'&certification.lte='+largers_rating.rating+'';
        }else{
            filterurl += '&certification.gte='+ratings_selected[0].rating+'&certification.lte='+ratings_selected[0].rating+'';
        }
    }
    if(vote_average_selected && vote_average_selected.length > 0){
        
        filterurl += '&vote_average.gte='+vote_average_selected[0]+'&vote_average.lte=10';
        
    }
    console.log(filterurl);
    document.querySelectorAll(".dropdown_filter").forEach((item,index)=>{
            item.style.display = "none";
        });
    
    let filter_data = await FetchDiscoverData(filterurl)
    
    container.innerHTML = ''; 
    for(let i= 0; i < filter_data.results.length;i++){
        const url = 'https://api.themoviedb.org/3/'+type_selected+'/'+filter_data.results[i].id+'?language=en-US';
        await fetch(url, options)
          .then(res => res.json())
          .then(data =>{ 
        let ls = (data.last_episode_to_air ? data.last_episode_to_air.season_number : 1);
        let le = (data.last_episode_to_air ? data.last_episode_to_air.episode_number : 1);
        container.innerHTML += DisplayMovieTvItem(
                data.id,
                (data.hasOwnProperty('original_name') ? "tv":"movie"),
                (data.poster_path == null? "./images/error-img.png" : 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/'+data.poster_path),
                (data.hasOwnProperty('first_air_date') ? data.first_air_date?.split("-")[0] : data.release_date?.split("-")[0]),
                (data.hasOwnProperty('original_name') ? 'SS '+ls : "Movie" ),
                (data.hasOwnProperty('seasons') ? 'EP '+le : data.runtime+" min"),
                (type_selected == "tv" ?data.name :data.title),
                "",
                (type_selected == "tv" ? "TV":"N/A"),
                (type_selected == "tv" ? "bookmarktv":"bookmark"),
                data.imdb_id
                

            );
        })
          .catch(err => console.error(err));
    }
    if(type_selected == "tv"){
        AddOnClickEvent(".link-item",true);
        AddOnClickBookmarkEvent(".bookmarktv","tv");
    }else{
        AddOnClickEvent(".link-item");
        AddOnClickBookmarkEvent(".bookmark","movie");
        LoadQualitydata();
    }
    maxpage = filter_data.total_pages
    console.log("Max pages: "+maxpage)
    AddPagination("filter");
            
}
function ShowHideFilterHolder(holder){
    if(holder.parentNode.children[1].style.display == "none"){
        document.querySelectorAll(".dropdown_filter").forEach((item,index)=>{
            item.style.display = "none";
        });
        holder.parentNode.children[1].style.display = "block";
        filter_open = true;
    }else{
        holder.parentNode.children[1].style.display = "none";
        filter_open = false;
    }
}
async function AddFilterEvents(){
    genres_selected = [];
    countries_selected = [];
    years_selected = [];
    ratings_selected = [];
    vote_average_selected = [];
    sort_by_selected = 5;
    document.querySelectorAll(".dropdown_filter").forEach((item,index)=>{
            item.style.display = "none";
        });
    // = await GetCountries();
    //console.log(countries);
    countries.sort((a, b)=>{ return a.english_name.localeCompare(b.english_name) });
    for (let i = 0; i < countries.length; i++) {
        filter_country_holder.innerHTML += `<li>`+countries[i].english_name+`</li>`;
    }
    let genres = await GetMoviesGenres();
    for (let i = 0; i < genres.genres.length; i++) {
        filter_genres_holder.innerHTML += `<li>`+genres.genres[i].name+`</li>`;
    }
    let today = new Date();
    for (let i = today.getFullYear(); i >= 1990; i--) {
        filter_year_holder.innerHTML += `<li>`+i+`</li>`;
    }
    for (let i = 0; i < sort_display.length; i++) {
        filter_sort_holder.innerHTML += `<li`+(i== 5 ? ' class="active_filter"' : ``)+`>`+sort_display[i].name+`</li>`;
    }
    document.querySelectorAll(".filter_btn").forEach((item,index)=>{
            item.addEventListener("click",(event)=>{
                ShowHideFilterHolder(item);
                event.stopPropagation();
            });
        });
    
    filter_type_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            for (let i = 0; i < filter_type_holder.children.length; i++) {
                filter_type_holder.children[i].classList.remove("active_filter");
                filter_type_holder.children[i].style.color = "var(--secTextCol)";
            }
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
            }else{
                item.classList.add('active_filter');
                filter_type.children[0].innerText = item.innerText;
                index == 0 ? type_selected = "movie" : type_selected = "tv"; 
            }
            ev.stopPropagation();
        });
    });
    filter_genres_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
                for(let i = 0; i < genres_selected.length;i++){
                    if(genres_selected[i] == genres.genres[index].id)
                        genres_selected.splice(i,1);
                }
                filter_genre.children[0].innerText =  (genres_selected.length > 1 ? genres_selected.length+" selected" : genres_selected.length == 0 ? "Genre" : item.innerText);
            }else{
                item.classList.add('active_filter');
                
                genres_selected.push(genres.genres[index].id);
                filter_genre.children[0].innerText = (genres_selected.length > 1 ? genres_selected.length+" selected" : item.innerText);
            }
            ev.stopPropagation();
        });
    });
    filter_country_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
                for(let i = 0; i < countries_selected.length;i++){
                    if(countries_selected[i] == countries[index].iso_3166_1)
                        countries_selected.splice(i,1);
                }
                filter_country.children[0].innerText =  (countries_selected.length > 1 ? countries_selected.length+" selected" : countries_selected.length == 0 ? "Genre" : item.innerText);
            }else{
                item.classList.add('active_filter');
                
                countries_selected.push(countries[index].iso_3166_1);
                filter_country.children[0].innerText = (countries_selected.length > 1 ? countries_selected.length+" selected" : item.innerText);
            }
            ev.stopPropagation();
        });
    });
    filter_year_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
                for(let i = 0; i < years_selected.length;i++){
                    if(years_selected[i] == item.innerHTML)
                        years_selected.splice(i,1);
                }
                filter_year.children[0].innerText =  (years_selected.length > 1 ? years_selected.length+" selected" : years_selected.length == 0 ? "Genre" : item.innerText);
            }else{
                item.classList.add('active_filter');
                
                years_selected.push(item.innerHTML);
                filter_year.children[0].innerText = (years_selected.length > 1 ? years_selected.length+" selected" : item.innerText);
            }
            ev.stopPropagation();
        });
    });
    filter_rating_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
                for(let i = 0; i < ratings_selected.length;i++){
                    if(ratings_selected[i].rating == item.innerHTML)
                        ratings_selected.splice(i,1);
                }
                filter_rating.children[0].innerText =  (ratings_selected.length > 1 ? ratings_selected.length+" selected" : ratings_selected.length == 0 ? "Genre" : item.innerText);
            }else{
                item.classList.add('active_filter');
                
                ratings_selected.push({ "rating": item.innerHTML, "index":index });
                filter_rating.children[0].innerText = (ratings_selected.length > 1 ? ratings_selected.length+" selected" : item.innerText);
            }
            ev.stopPropagation();
        });
    });
    filter_vote_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
             for (let i = 0; i < filter_vote_holder.children.length; i++) {
                filter_vote_holder.children[i].classList.remove("active_filter");
                filter_vote_holder.children[i].style.color = "var(--secTextCol)";
            }
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
                
            }else{
                item.classList.add('active_filter');
                
                vote_average_selected = [];
                vote_average_selected.push(index);
                filter_vote.children[0].innerText = item.innerText;
            }
            ev.stopPropagation();
        });
    });
    filter_sort_holder.querySelectorAll("li").forEach((item,index)=>{
        item.addEventListener("click",(ev)=>{
            for (let i = 0; i < filter_sort_holder.children.length; i++) {
                filter_sort_holder.children[i].classList.remove("active_filter");
                filter_sort_holder.children[i].style.color = "var(--secTextCol)";
            }
            if(item.classList.contains("active_filter")){
                item.classList.remove('active_filter');
                
            }else{
                item.classList.add('active_filter');
                
                sort_by_selected = index;
                filter_sort.children[0].innerText = item.innerText;
            }
            ev.stopPropagation();
        });
    });

    filter_search.addEventListener("click",()=>{page = 1; ShowFilterSearch();});
}
