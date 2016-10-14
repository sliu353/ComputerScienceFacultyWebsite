function goToHome() {
    showRow(document.getElementById("row-1"), "home");
}


function goToCourses() {
    // If the data hasn't been loaded, we load it from the API.
    if (!document.getElementById("row-2").classList.contains("loaded")) {
        getJsonObject("http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/courses", 2);
    }
    else {
        showRow(document.getElementById("row-2"), "courses");
    }
}

function goToPeople() {
    if (!document.getElementById("row-3").classList.contains("loaded")) {
        getJsonObject("http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/people", 3);
    }
    else {
        showRow(document.getElementById("row-3"), "people");
    }
}

function goToNews() {
    if (!document.getElementById("row-4").classList.contains("loaded")) {
        getJsonObject("http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/newsfeed", 4);
    }
    else {
        showRow(document.getElementById("row-4"), "news");
    }
}

function goToNotices() {
    if (!document.getElementById("row-5").classList.contains("loaded")) {
        getJsonObject("http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/noticesfeed", 5);
    }
    else {
        showRow(document.getElementById("row-5"), "notices");
    }
}

function goToGuestBook() {
    getJsonObject("http://redsox.tcs.auckland.ac.nz/ups/UniProxService.svc/htmlcomments", 6);
}

function getJsonObject(uri, index) {
    var xhr = new XMLHttpRequest();
    var result;
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        switch (index) {
            case 2:
                result = JSON.parse(xhr.responseText);
                showCourses(result);
                break;
            case 3:
                result = JSON.parse(xhr.responseText);
				for (personNum in result.list)
					showPerson(result.list[personNum]);
                //showPeople(result);
                break;
            case 4:
                result = XMLToJavascriptObject(xhr.responseXML.documentElement);
                showNews(result);
                break;
            case 5:
                result = XMLToJavascriptObject(xhr.responseXML.documentElement);
                showNotices(result);
                break;
            case 6:
                result = xhr.responseText;
                showGuestBook(result);
        }
    }
    xhr.send(null);
}

function showPerson(personObject){
	var xhr = new XMLHttpRequest();
	var uri = "http:\/\/redsox.tcs.auckland.ac.nz\/ups\/UniProxService.svc\/person?u=" + personObject.profileUrl[1]
	xhr.open("GET", uri, true);
	xhr.onload = function(){
	var html = "";
    html += "<div class=\"lg-column-5 md-column-5 sm-column-5 sm-column-10\"><div class=\"wrapper\">";
    firstName = personObject.firstname;
    lastName = personObject.lastname;
    if (firstName != undefined && lastName != undefined)
        html += "<h3>" + firstName + " " + lastName + "</h3>";
    else
        html += "<h3> </h3>";
    html += "<div class=\"lg-column-3 md-column-3 sm-column-4 xs-column-4\">"
    if (personObject.imageId != undefined)
        html += "<h4 class=\"people-image-wrap\"><img src=\"https:\/\/unidirectory.auckland.ac.nz\/people\/imageraw\/" + personObject.profileUrl[1]
        + "\/" + personObject.imageId + "\/small\"></h4></div>";
    else
        html += "<h4 class=\"people-image-wrap\"><img src=\"https:\/\/unidirectory.auckland.ac.nz\/people\/imageraw\/" + personObject.profileUrl[1]
        + "\/1\/small\"></h4></div>";
    html += "<div class=\"lg-column-7 md-column-7 sm-column-6 xs-column-6\"><h4>Email<a class=\"email-symbol\" href=\"mailto:" + personObject.emailAddresses[0] + "\">📨</a>:</h4>";
    for (emailNum in personObject.emailAddresses) {
        html += "<p>" + personObject.emailAddresses[emailNum] + "</p>";
    }
	var thisPerson = JSON.parse(xhr.responseText);
	html += "<h4>Phone Number:</h4><p>" + (thisPerson.phoneNumbers[0].phone == undefined ? "Unknow" : thisPerson.phoneNumbers[0].phone) + "</p>";
	html += "<h4>Save this person:<a class=\"email-symbol\" href=\"http:\/\/redsox.tcs.auckland.ac.nz\/ups\/UniProxService.svc\/vcard?u=" + personObject.profileUrl[1] + "\">👤</a></h4>";
    html += "</div></div></div>";
    row3 = document.getElementById("row-3");
	//var initialHTML = row3.innerHTML;
	row3.innerHTML += html
    showRow(row3, "people");
	}
	xhr.send(null);
}

function showCourses(result) {
    var html = "";
    for (courseNum in result.courses.coursePaperSection) {
        //console.log(result.courses.coursePaperSection[courseNum]);
        html += "<div class=\"lg-column-5 md-column-5 sm-column-5 sm-column-10\"><div class=\"wrapper\">";
        var subject = result.courses.coursePaperSection[courseNum].subject;
        if (subject != undefined){
            html += "<h3>" + subject.courseA + "</h3>"
            + "<p><b>Points:</b>" + subject.points + "</p>";
        }
        var title = result.courses.coursePaperSection[courseNum].title;
        if (title != undefined)
            html += "<p><b>Title:</b> " + title + "</p>";
        var description = result.courses.coursePaperSection[courseNum].description;
        if (description != undefined)
            html += "<h4>Description:</h4><p>" + description + "</p>";
        var prerequisite = result.courses.coursePaperSection[courseNum].prerequisite;
        if (prerequisite != undefined) {
            if (prerequisite.constructor === Array) {
                for (var i = 0; i < prerequisite.length; i++)
                    html += "<p> ★ " + prerequisite[i] + "</p>";
            } else {
                html += "<p> ★ " + prerequisite;
            }
            html += "</p>";
        }
        html += "</div></div>";
    }
    row2 = document.getElementById("row-2");
    row2.innerHTML = html;
    showRow(row2, "courses");
}

function showNews(result) {
    var html = "";
    for (newsNum in result.channel.item) {
        html += "<div class=\"lg-column-5 md-column-5 sm-column-5 sm-column-10\"><div class=\"wrapper\">";
        var title = result.channel.item[newsNum].title;
        if (title != undefined)
            html += "<h3>" + title + "</h3>";
        var dateTime = result.channel.item[newsNum].pubDate;
        if (dateTime != undefined)
            html += "<p><b>Published Date: </b>" + dateTime.substr(0, 16) + "</p>";
        var description = result.channel.item[newsNum].description;
        if (description != undefined)
            html += "<h4>Description: </h4><p>" + description + "</p>";
        var link = result.channel.item[newsNum].link;
        if (link != undefined)
            html += "<div class=\"center-div\"><a href=\"" + link + "\" class=\"button\"><span>Veiw Detail</span></a></div>";
        html += "</div></div>";
    }
    row4 = document.getElementById("row-4");
    row4.innerHTML = html;
    showRow(row4, "news");
}


// Some changes
function showNotices(result) {
    var html = "";
    for (noticeNum in result.channel.item) {
        html += "<div class=\"lg-column-5 md-column-5 sm-column-5 sm-column-10\"><div class=\"wrapper\">";
        var title = result.channel.item[noticeNum].title;
        if (title != undefined)
            html += "<h3>" + title + "</h3>";
        var dateTime = result.channel.item[noticeNum].pubDate;
        if (dateTime != undefined)
            html += "<p><b>Published Date: </b>" + dateTime.substr(0, 16) + "</p>";
        var description = result.channel.item[noticeNum].description;
        if (description != undefined)
            html += "<h4>Description: </h4><p>" + description + "</p>";
        var link = result.channel.item[noticeNum].link;
        if (link != undefined)
            html += "<div class=\"center-div\"><a href=\"" + link + "\" class=\"button\"><span>Veiw Detail</span></a></div>";
        html += "</div></div>";
    }
    row5 = document.getElementById("row-5");
    row5.innerHTML = html;
    showRow(row5, "notices");
}

var row6InitialContent = document.getElementById("row-6").innerHTML;

function showGuestBook(result) {
    row6 = document.getElementById("row-6");
    row6.innerHTML = row6InitialContent + "<div class=\"lg-column-5 md-column-5 sm-column-5 xs-column-10\" ><div class=\"wrapper comments-wrapper\"><h3>Comments</h3>"
    + result + "</div></div>";
    showRow(row6, "guestbook");
}

function showRow(rowToBeShow, pageName) {
    document.getElementsByClassName("active-row")[0].classList.remove("active-row");
    rowToBeShow.classList.add("active-row");
    activetabs = document.getElementsByClassName("active");
    activetabs[0].classList.remove("active");
    activetabs[0].classList.remove("active");
    document.getElementById(pageName + "-tab").classList.add("active");
    document.getElementById(pageName + "-tab-mobile").classList.add("active");
    rowToBeShow.classList.add("loaded");
}

function submitComment() {
    var name = document.getElementById("visitorName").value;
    var content = document.getElementById("commentContent").value;
    var uri = "http:\/\/redsox.tcs.auckland.ac.nz\/ups\/UniProxService.svc\/comment?name=" + name;
	var xhr = new XMLHttpRequest();  
	xhr.open("POST", uri, true); 
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
	xhr.onload = function () {
		goToGuestBook();
	}
	xhr.send(JSON.stringify(content));
}

// This method convert XML to Javascript object.
function XMLToJavascriptObject(node) {
    var data = {};
    // append a value
    function Add(name, value) {
        if (data[name]) {
            if (data[name].constructor != Array) {
                data[name] = [data[name]];
            }
            data[name][data[name].length] = value;
        }
        else {
            data[name] = value;
        }
    };
    // element attributes
    var counter, currentNode;
    for (counter = 0; currentNode = node.attributes[counter]; counter++) {
        Add(currentNode.name, currentNode.value);
    }
    // child elements
    for (counter = 0; currentNode = node.childNodes[counter]; counter++) {
        if (currentNode.nodeType == 1) {
            if (currentNode.childNodes.length == 1 && currentNode.firstChild.nodeType == 3) {
                Add(currentNode.nodeName, currentNode.firstChild.nodeValue);
            }
            else {
                Add(currentNode.nodeName, XMLToJavascriptObject(currentNode));
            }
        }
    }
    return data;
}
