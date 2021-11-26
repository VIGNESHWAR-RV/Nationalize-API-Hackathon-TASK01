
document.body.innerHTML=` 
<div>
   <h2>Search the Name & Get the Nationality</h2>
   <input type="text" id="searchText" value="" placeholder="Enter the name" onkeyup="key()">
   <br>
   <label id="info">I'll show as you type...</label><br>
   <label id="noCountry" hidden>hmm...Seriously?? I don't think it's a name!!</label><hr>
</div>
<div id="result" hidden>
   <h2 id="resultHeader">So, The Top Two Countries with name</h2>
   <div id="searchResults"></div>
</div>`;

////////////////////////////////////////////////////////////////////////////////

    //variable declaration 
let searchText = document.querySelector("#searchText");
let searchResults = document.querySelector("#searchResults");
let info = document.querySelector("#info");
let noCountry = document.querySelector("#noCountry");
let resultHeader = document.querySelector("#resultHeader");
let result = document.querySelector("#result");

// reseting searchText to default after every refresh
document.addEventListener("DOMContentLoaded",function() {
    searchText.value = "";
})

 //function on every key released on Input
function key(){

//conditon to check whether searchText is empty ("") 
    if(searchText.value.length<1 || searchText.value===""){
        result.hidden = true;
        info.hidden  = false;
        noCountry.hidden = true;
    }


//condition to check whether the searchText has empty space
    else if( searchText.value.includes(" ")){
        result.hidden = true;
        info.hidden = false;
        noCountry.hidden = true;
        alert('searching two or more names? try using comma "," between names!');
    }


//condition when the searchText have multiple names with comma separation
 else if(searchText.value.includes(",")){
     let names = [];
      names = searchText.value.split(",");
      console.log(names);
        //joining every individual name for fetching api data
      let manyNames = "";
      for(let i of names){
          manyNames += `name[]=${i}&`;
      }
        //modified url for many names
     let url = "https://api.nationalize.io/?"+manyNames;
   
        //function to render every countries for each name if they have country
     function renderCountry(country){
        let count = document.createElement("div");
            count.className = "countries";
            count.innerHTML =`<p><b>Name - "${searchName}"</b></br>
            Citizenship - ${country.country_id}<br>
            Probability - ${(country.probability).toFixed(4)}</p>
            `;
         searchResults.appendChild(count);
   }

        //function to check every names &
           //to call renderCountry to render top two countries for every names
      let searchName = '';
    function renderAll(array){
        searchResults.innerHTML = "";
        for(let countries of array){
            searchName = countries.name;
            for(let i=0;i<2;i++){
                if(countries.country.length<1){
                    info.hidden = true;
                    continue;
                  }
                else{
                   info.hidden = true;
                   noCountry.hidden = true;
                   result.hidden = false;
                   resultHeader.textContent = `So,Top Two Countries with names '${searchText.value}' are`
                   renderCountry(countries.country[i]);  
                }
            }
        }
     }
         //name function to get countries of given names in searchText
          let name = async function(url){
              try{
                  const response = await fetch(url);
                  const array = await response.json();
                  renderAll(array);
                  console.log(array);
              }
              catch(error){
                   console.log(error.message);
              }
          }
        //calling the name function;
          name(url);

    }
//condition when search text have single name
    else{
    let url = "https://api.nationalize.io/?name[]="+`${searchText.value}`;

       //function to render countries for given name 
  function renderCountry(country){
      let count = document.createElement("div");
      count.className = "countries";
      count.innerHTML =`
      <p>Citizenship - ${country.country_id}</p>
      <p>Probability - ${(country.probability).toFixed(4)}</p>
      `;
      searchResults.appendChild(count);
}
        
       // function to render top two countries for given single name in searchText
   function renderAll(countries){
      searchResults.innerHTML = "";
      for(let i=0;i<2;i++){
        if(countries.country.length<1){
            info.hidden = true;
            result.hidden = true;
            noCountry.hidden = false;
            break;
          }
          else{
        info.hidden = true;
        noCountry.hidden = true;
        result.hidden = false;
        resultHeader.textContent = `So,Top Two Countries with name '${searchText.value}' are`
        renderCountry(countries.country[i]);
         }
      }
   }

       // name function to get details of the countries array
    let name = async function(url){
        try{
            const response = await fetch(url);
            const array = await response.json();
            renderAll(array[0]);
        }
        catch(error){
             console.log(error.message);
        }
    }
      // calling the name function
    name(url);
  }
};
