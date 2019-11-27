/*
  MUITA IDEOITA/AJATUKSIA KUN MUUT TEHTY JOS ON MOTIVAATIOTA:
    -Yleisestikki vois suunnitella jonkinlaisen ulkoasun ja tehdä CSS paskat pois alta
    -Filtteröinti (esim hae vaikka elokuvan nimeä tai tietyn päivän elokuvat)
    -Joku favourites / movies to watch systeemi, johon voisi tallentaa elokuvia
     joista on kiinnostunut (voisi toimia jollain cookies / local storage systeemillä)
    -Random movie generator? Valitsee random elokuvan (idk?)
    -"hauska" itse tehty finnkinon logon tyylinen -juttu jossa vaikka joku oma nimi / kuva / muu juttu
*/

//Silloin kun body latautuu se hakee finnkinon teatterit ja laittaa ne select listaan
function loadAreas() {
  //Send request
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true);
  xmlhttp.send();



  xmlhttp.onreadystatechange=function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status==200) {
      //Save the response data in a  variable for easy processing
      var xmlDoc = xmlhttp.responseXML;
      //Use getElementsByTagName to dig out theatre names and Ids (it is in array)
      var theatreNames = xmlDoc.getElementsByTagName("Name");
      var theatreIDs = xmlDoc.getElementsByTagName("ID");

      //Loop through the whole array list
      for(var i = 0; i < theatreNames.length; i++) {
        //Gets the text from the XML files
        var theatreText = theatreNames[i].innerHTML;
        var theatreID = theatreIDs[i].innerHTML;

        //TODO: Vaihda tästä "testi" pois silloin kun keksit selectille hyvän id nimen
        //Creates new option for the select list and makes it's value theatreID(from xml file)
        document.getElementById("testi").innerHTML +=  '<option value = ' + theatreID + '>' + theatreText + '</option>';
      }
    }
  }
}
/* Kun käyttäjä valitsee teatterin ni se kutsuu tätä funktiota
   joka hakee finnkinon sivuilta kyseisen teatterin elokuva aikataulun */
function loadSchedule() {
  //Empty the list so it won't print new data on top of existing data
  document.getElementById("lista").innerHTML = "";
  //Gets the ID of the selected theatre/option
  var id = document.getElementById("testi").value;
  //Send request, uses the ID of the theatre to get data specific to that theatre
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + id, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange=function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status==200) {
      //Save the response data in a  variable for easy processing
      var xmlDoc = xmlhttp.responseXML;
      //Use getElementsByTagName to dig out title and other things(it is in array)

      //TODO: Lisää tähän muut tarvittavat asiat kuten aikataulut, kuvat, muuta infoa, osta lippu (linkki), jne

      var titles = xmlDoc.getElementsByTagName("Title");
      //Loops through the list
      for(var i = 0; i < titles.length; i++) {
        var titleText = titles[i].innerHTML;
        //Creates <li> elements to <ul id="lista"> with movie titles
        document.getElementById("lista").innerHTML +=  '<li>' + titleText + '</li>';
      }
    }
  }
}

 // Testataan saadaanko kuvat ladattua finnkinolta
function loadimages() {
    //hakee kuvat finnkinon sivulta
    var pictures = new XMLHttpRequest();
    pictures.open("GET", "https://www.finnkino.fi/xml/Events/", true );
    pictures.send();
    //send request
    pictures.onreadystatechange=function() {
      if (pictures.readyState == 4 && pictures.status==200) {
        var picDoc = pictures.responseXML;
        var picName = picDoc.getElementsByTagName("EventSmallImagePortrait")
  
        for(var i = 0; i < picName.length; i++) {
          //put pictures to array from xml 
          var image = picName[i].innerHTML;
          
          document.getElementById("kuvatesti").innerHTML += '<img src =' +image +'>';
        }
      }
    }
}