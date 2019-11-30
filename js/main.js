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
        document.getElementById("theatreList").innerHTML +=  '<option value = ' + theatreID + '>' + theatreText + '</option>';
      }
    }
  }
}
/* Kun käyttäjä valitsee teatterin ni se kutsuu tätä funktiota
   joka hakee finnkinon sivuilta kyseisen teatterin elokuva aikataulun */
function loadSchedule() {
  //Shows search bar when user has chosen a theatre
  document.getElementById("userInput").style.display="block";
  //Empty the list so it won't print new data on top of existing data
  document.getElementById("list").innerHTML = "";
  //document.getElementById("lista").innerHTML = "";
  //Gets the ID of the selected theatre/option
  var id = document.getElementById("theatreList").value;
  //Send request, uses the ID of the theatre to get data specific to that theatre
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "https://www.finnkino.fi/xml/Schedule/?area=" + id, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange=function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status==200) {
      //Save the response data in a  variable for easy processing
      var xmlDoc = xmlhttp.responseXML;

      var titles = xmlDoc.getElementsByTagName("Title");
      var imageURLs = xmlDoc.getElementsByTagName("EventSmallImagePortrait");
      var timeTable = xmlDoc.getElementsByTagName("dttmShowStart");
      var rating = xmlDoc.getElementsByTagName("RatingImageUrl");
      var contentDescriptors = xmlDoc.getElementsByTagName("ContentDescriptors");
      for(var i = 0; i < titles.length; i++) {
        var imageURL = '<img src="' + imageURLs[i].innerHTML + '">';
        //elokuvan nimi
        var title = titles[i].innerHTML;
        //elokuvan aikataulu
        var time = timeTable[i].innerHTML;
        //haetaan leffan rating
        var ratingIMG = '<img src="' + rating[i].innerHTML + '">';
        //Korvataan ei toivotut merkit aikatauluun replace.functiolla
        
        
        var time = time.replace(/-/g,".");
        var time = time.replace(/T/g," ");
        /*
        var time = time.replace(/:00/g,"");
        var time = time.replace(/:00:00/g,":00");
        var time = time.replace(/0:00/g,"0");
        var time = time.replace(/5:00/g,"50"); */

        var time = time.slice(0, 16);
        
        
        
        //elokuvan varoitukset(niitä voi mahdollisesti olla monta joten käytetään looppia)
        var contentDescriptor = contentDescriptors[i].getElementsByTagName("ContentDescriptor");
        //oli jotain bugeja ni tällei onnistuin väliaikasesti kiertämään ne
        var descriptionImages = "";
        for(var j = 0; j < contentDescriptor.length; j++) {
          descriptionImages += '<img src="' + contentDescriptor[j].getElementsByTagName("ImageURL")[0].innerHTML + '">';
        }
        document.getElementById("list").innerHTML += '<tr><td>'+ imageURL + '</td><td>' + title + '<br/>' + time + '<br/>' + ratingIMG + descriptionImages + '</td>';
      }
    }
  }
}
function searchFunction() {
  //Declare variables
  var input = document.getElementById("userInput");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("list");
  var tr = table.getElementsByTagName("tr");

  // Loop through all list items, and hide those who don't match the search query
  for(var i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    txtValue = td.innerHTML;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }


}
/* Poistetaan turha funktio testinä
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
<<<<<<< HEAD
}
=======
} */
