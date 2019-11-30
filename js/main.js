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
      var duration = xmlDoc.getElementsByTagName("LengthInMinutes")
      for(var i = 0; i < titles.length; i++) {
        var imageURL = '<img class="images" src="' + imageURLs[i].innerHTML + '">';
        //elokuvan nimi
        var title = titles[i].innerHTML;
        //elokuvan aikataulu
        var xmlSchedule = timeTable[i].innerHTML;
        //haetaan leffan rating
        var ratingIMG = '<img src="' + rating[i].innerHTML + '">';
       //elokuvan kesto
        var xmlDuration = duration[i].innerHTML;

        //parsitaan xml:stä vain tarvittavat aikataulutiedot
        var time = xmlSchedule.slice(11, 16);
        var date = xmlSchedule.slice(8, 10);
        var month = xmlSchedule.slice(5,7);
        var year = xmlSchedule.slice(0,4);

        //elokuvan varoitukset(niitä voi mahdollisesti olla monta joten käytetään looppia)
        var contentDescriptor = contentDescriptors[i].getElementsByTagName("ContentDescriptor");
        var descriptionImages = "";
        for(var j = 0; j < contentDescriptor.length; j++) {
          descriptionImages += '<img src="' + contentDescriptor[j].getElementsByTagName("ImageURL")[0].innerHTML + '">';
        }
        $("#list").hide();
        document.getElementById("list").innerHTML += '<tr><td>'+ imageURL + '</td><td>' + title + '<br/>' + date + "."+ month+ "." + year + " " + time + '<br/>' + "Kesto: " + xmlDuration + " minuuttia <br/> <br/>" + ratingIMG + descriptionImages + '</td>';
        $("#list").fadeIn(500);
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
      //tr[i].style.display = "";
      $("#list").find('tr').eq(i).fadeIn(1000);
    } else {
      //tr[i].style.display = "none";
      $("#list").find('tr').eq(i).fadeOut(1000);
    }
  }
}
