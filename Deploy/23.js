
(function(){var all=document.getElementsByTagName('*');for(var i=0;i<all.length;i++)if(typeof all[i].id!='undefined'&&typeof window[all[i].id]=='undefined')window[all[i].id]=all[i];})()
browserWarningMessage('Please use Google Chrome, Apple Safari or another supported browser.');
if (navigator.userAgent.indexOf('iPad') !== -1) {
  var splashscreen = document.createElement('link');
  splashscreen.rel = 'apple-touch-startup-image';
  splashscreen.href = '';
  document.getElementsByTagName('head')[0].appendChild(splashscreen);
}

function openDB() {
 var  sqlList;
  DB = SqlOpenDatabase("fnotes.db" ,"1.0" ,"FieldNotes Database");
  if(DB!=0) {
    sqlList=[];
    sqlList[0]=["CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT, dts TEXT, geo TEXT, data TEXT);" ,,skipError];
    Sql(DB, sqlList);
  }
}

function skipError(transaction, results) {
     _msgbox_confirm("DB Error: "  +  results.message  +  "("  +  results.code  +  ")");
}

function zapDB() {
 //This function drops & recreates the database.
 //We should warn the user all data will be lost
 var  sqlList;
  DB = SqlOpenDatabase("fnotes.db" ,"1.0" ,"FieldNotes Database");
  if(DB!=0) {
    sqlList=[];
    sqlList[0]=["DROP TABLE notes;" ,,skipError];
    sqlList[1]=["CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT, dts TEXT, geo TEXT, data TEXT);"];
 //Now, execute all the commands!
    Sql(DB, sqlList);
  }
}

function wrapData(t,g,d) {
 var  z;

  if(Trim(g) != "") {
    g = g + "<br>";
  }

  z = "<p class='a'>" + t + "<br/>" + g + "<b>" + d + "</b>";

 // add the formatted data
  HTMLview1.innerHTML = HTMLview1.innerHTML + z;
 // make sure view gets resized
  HTMLview1.refresh();
}

function insertData(sTime, sGeo, sData) {
 
   var  q;
   var  s;
   var  sqlList;
   var  tempTime;
   var  tempGeo;
   var  tempData;
    q = Chr(34);
    tempTime = q  +  sTime  +  q;
    tempGeo = q  +  sGeo  +  q;
    tempData = q  +  sData  +  q;
    s = "INSERT INTO notes(dts, geo, data) VALUES(" + tempTime + "," + tempGeo + "," + tempData + ");";
    sqlList=[];
    sqlList[0] = [s,dataHandler,skipError];

    Sql(DB, sqlList);
 }
 
function dataHandler(transaction, results) {
  DBRecords = results;
}

function readData() {
   var  q;
   var  s;
   var  sqlList;

    s = "SELECT dts, geo, data FROM notes;";
    sqlList=[];
    sqlList[0] = [s,dataLoader,skipError];
    Sql(DB, sqlList);
}

function dataLoader(transaction, results) {
 var  xDTS;
 var  xGeo;
 var  xDat;

  DBRecords = results;
   for   (iRec=0; iRec <= DBRecords.rows.length - 1; iRec++) {
    xDTS = DBRecords.rows.item(iRec)["dts"];
    xGeo = DBRecords.rows.item(iRec)["geo"];
    xDat = DBRecords.rows.item(iRec)["data"];
    wrapData(xDTS,xGeo,xDat);
  }

  HTMLview1_ref.scrollTo( 0, HTMLview1_ref.maxScrollY, 0 );
  HTMLview1.refresh();
}

function listData() {
   var  q;
   var  s;
   var  sqlList;


    s = "SELECT dts, geo, data FROM notes;";
    sqlList=[];
    sqlList[0] = [s,dataLister,skipError];
    Sql(DB, sqlList);
 }
 
function ReadLocalStorage() {

 // read saved settings from storage
  if(localStorage.showDate == "Y") {
    bShowDate = True;
 } else {
    bShowDate = False;
  }

  if(localStorage.autoClear == "Y") {
    bAutoClear = True;
 } else {
    bAutoClear = False;
  }

  if(localStorage.autoCap == "Y") {
    bAutoCapitalize = True;
 } else {
    bAutoCapitalize = False;
  }

  if(localStorage.autoComp == "Y") {
    bAutoComplete = True;
 } else {
    bAutoComplete = False;
  }

  if(localStorage.autoCorr == "Y") {
    bAutoCorrect = True;
 } else {
    bAutoCorrect = False;
  }

  if(localStorage.gpsCoords == "Y") {
    bGPSCoords = True;
 } else {
    bGPSCoords = False;
  }
}

function SaveLocalStorage() {
 // now save it for next invocation
  if(bShowDate == False) {
      localStorage.showDate = "N";
 } else {
      localStorage.showDate = "Y";
  }

  if(bAutoClear == False) {
      localStorage.autoClear = "N";
 } else {
      localStorage.autoClear = "Y";
  }

  if(bAutoCapitalize == False) {
      localStorage.autoCap = "N";
 } else {
      localStorage.autoCap = "Y";
  }

  if(bAutoComplete == False) {
      localStorage.autoComp = "N";
 } else {
      localStorage.autoComp = "Y";
  }

  if(bAutoCorrect == False) {
      localStorage.autoCorr = "N";
 } else {
      localStorage.autoCorr = "Y";
  }

  if(bGPSCoords == False) {
      localStorage.gpsCoords = "N";
 } else {
      localStorage.gpsCoords = "Y";
  }
}

function nextAction() {
 // called on timeout
 // send data via email
   var  qq;
   var  sTo;
   var  sSubj;

    qq = Chr(34);
    sTo = MultiInput1.getValue(1);
    sSubj = MultiInput1.getValue(2);

   var  sLink;
   var  sData;


      //alert("nextaction 1");

    document.body.style.cursor = '';

 // previous function has put data in global (bigString)
 // encode the data for sending per RFC 2368 
    sData = sendLogEmail(sTo, sSubj, bigString);

 //wrap it in a link
    sLink = "<h1><a href="  +  qq  +  sData  +  qq  +  ">Click here to activate your email client</a></h1>";

 // display it in HTMLview2
 // when the user clicks the link it will open their email
 // client and populate the fields accordingly
 // if they have a registered mailto protocol handler
    HTMLview2.innerHTML = sLink;

}

function sendLogEmail(strTo, strSubject, strBody){
    var mailto_link = "mailto:" + strTo + "?subject=" +
        encodeURIComponent(strSubject) +
        "&body=" + encodeURIComponent(strBody);
      
    return mailto_link;
}

function dataLister(transaction, results) {
   var  xDTS;
   var  xGeo;
   var  xDat;
   var  crlf;

    crlf = Chr(13)  +  Chr(10);
    bigString = "";

    DBRecords = results;
    for   (iRec=0; iRec <= DBRecords.rows.length - 1; iRec++) {
      xDTS = DBRecords.rows.item(iRec)["dts"];
      xGeo = DBRecords.rows.item(iRec)["geo"];
      xDat = DBRecords.rows.item(iRec)["data"];
      bigString = bigString  +  xDTS  +  crlf;

      if(Trim(xGeo) != "") {
        bigString = bigString  +  xGeo  +  crlf;
      }
      bigString = bigString  +  xDat   +  crlf;
    }
}
window.addEventListener('load', function() {
  Form2.style.display = 'block';
  NSB.Checkbox_init(CheckBox1,300);
  NSB.addProperties(CheckBox1);


  NSB.addProperties(Label2);
  NSB.addProperties(TitleBar2);
  NSB.addDisableProperty(TitleBar2);
  TitleBar2_left.onclick=function(){ChangeForm(Form1)};

  if(typeof(TitleBar2.onclick)=='function'){
    if(typeof(TitleBar2_left)!='undefined') TitleBar2_left.onclick=function() {TitleBar2.onclick(TitleBar2_left.getAttribute('nsbvalue'))};
    if(typeof(TitleBar2_right)!='undefined') TitleBar2_right.onclick=function() {TitleBar2.onclick(TitleBar2_right.getAttribute('nsbvalue'))}};
  NSB.ButtonBar_init(ButtonBar1,'Email, Imprimir');
  NSB.addProperties(ButtonBar1);
  Form2.style.display = 'none';
}, false);
Form2.onsubmit=function(event){window.event.stopPropagation();window.event.preventDefault()};
NSB.addProperties(Form2);

Form2.onhide = function() { savethefunction_rvar="";
  SaveLocalStorage();
return savethefunction_rvar; }

CheckBox1.onchange = function() { savethefunction_rvar="";
    bShowDate = CheckBox1.getValue(1);
  bAutoClear = CheckBox1.getValue(2);
  bAutoCapitalize = CheckBox1.getValue(3);
  bAutoComplete = CheckBox1.getValue(4);
  bAutoCorrect = CheckBox1.getValue(5);
  bGPSCoords = CheckBox1.getValue(6);
return savethefunction_rvar; }

Form2.onshow = function() { savethefunction_rvar="";
 // show the config settings
  if(bShowDate == [True]) {
	CheckBox1.setValue(1,[True]);
  }

  if(bAutoClear == [True]) {
	CheckBox1.setValue(2,[True]);
  }

  if(bAutoCapitalize == [True]) {
	CheckBox1.setValue(3,[True]);
  }

  if(bAutoComplete == [True]) {
	CheckBox1.setValue(4,[True]);
  }

  if(bAutoCorrect == [True]) {
	CheckBox1.setValue(5,[True]);
  }

  if(bGPSCoords == [True]) {
	CheckBox1.setValue(6,[True]);
  }
return savethefunction_rvar; }

ButtonBar1.onbuttonclick = function(item) { savethefunction_rvar="";
    if(item == "Email") {
 // export via email
	ChangeForm(Form3);
 } else {
 // Print the innerHTML of HTMLview1
	var  xobj;
	  xobj = HTMLview1.innerHTML;
	var  NewWin;
 // open a clean new window
	  NewWin = window.open("" , "Meu Notes Visualização de Impressão");
 // load in the HTML data
	  NewWin.document.write(xobj);
	  NewWin.document.close();
 // invoke the print routine - if they have a handler
	  NewWin.print();
	  NewWin.close();
 }
return savethefunction_rvar; }

window.addEventListener('load', function() {
  Form3.style.display = 'block';
  NSB.addProperties(TitleBar3);
  NSB.addDisableProperty(TitleBar3);
  TitleBar3_left.onclick=function(){ChangeForm(Form2)};

  if(typeof(TitleBar3.onclick)=='function'){
    if(typeof(TitleBar3_left)!='undefined') TitleBar3_left.onclick=function() {TitleBar3.onclick(TitleBar3_left.getAttribute('nsbvalue'))};
    if(typeof(TitleBar3_right)!='undefined') TitleBar3_right.onclick=function() {TitleBar3.onclick(TitleBar3_right.getAttribute('nsbvalue'))}};


  NSB.MultiInput_init('MultiInput1');

  NSB.addProperties(MultiInput1);
  NSB.addProperties(Button2);

  if (false) {HTMLview2_ref = new iScroll('HTMLview2_scroller',{ bounce: false, zoom:true });
    HTMLview2.refresh=function(){setTimeout(HTMLview2_ref.refresh(),100)}}
  NSB.addProperties(HTMLview2,HTMLview2_scroller);


  NSB.addProperties(Label3);
  Form3.style.display = 'none';
}, false);
Form3.onsubmit=function(event){window.event.stopPropagation();window.event.preventDefault()};
NSB.addProperties(Form3);

Form3.onshow = function() { savethefunction_rvar="";
  HTMLview2.innerHTML = "";
  Label3.textContent = "";
return savethefunction_rvar; }

Button2.onclick = function() { savethefunction_rvar="";
 // send data via email
  var  qq;
  var  sTo;
  var  sSubj;
  var  sBody;

	qq = Chr(34);
	sTo = MultiInput1.getValue(1);
	sSubj = MultiInput1.getValue(2);

	if(sTo == "") {
	  Label3.textContent = "Voce deve informar o destinatario do email";
	   Return;
	}

	if(sSubj == "") {
	  Label3.textContent = "Voce deve informar o assunto do email";
	   Return;
	}
 //MsgBox "button2 1"
 // list out the data from DB
	listData();

 // MsgBox "button2 2"
 // need to wait/sleep for several seconds
 // so db can gather & format data
  document.body.style.cursor = "wait";
  T=setTimeout(nextAction,2000);
 // nextAction function will take data
 // and format it into a mailto link
 // MsgBox "button2 3"
return savethefunction_rvar; }

window.addEventListener('load', function() {
  Form1.style.display = 'block';
  if (true) {HTMLview1_ref = new iScroll('HTMLview1_scroller',{ bounce: false, zoom:true });
    HTMLview1.refresh=function(){setTimeout(HTMLview1_ref.refresh(),100)}}
  NSB.addProperties(HTMLview1,HTMLview1_scroller);
  NSB.addProperties(Button1);

  TextArea1.ontouchmove=function(e){e.stopPropagation()};NSB.addProperties(TextArea1);
  NSB.addProperties(TitleBar1);
  NSB.addDisableProperty(TitleBar1);


  if(typeof(TitleBar1.onclick)=='function'){
    if(typeof(TitleBar1_left)!='undefined') TitleBar1_left.onclick=function() {TitleBar1.onclick(TitleBar1_left.getAttribute('nsbvalue'))};
    if(typeof(TitleBar1_right)!='undefined') TitleBar1_right.onclick=function() {TitleBar1.onclick(TitleBar1_right.getAttribute('nsbvalue'))}};


  NSB.addProperties(Label1);
  Form1.style.display = 'none';
}, false);
Form1.onsubmit=function(event){window.event.stopPropagation();window.event.preventDefault()};
NSB.addProperties(Form1);
var  DB;
var   DBRecords;
var   bShowDate;
var   bAutoClear;
var   bAutoCapitalize;
var   bAutoCorrect;
var   bAutoComplete;
var   bGPSCoords;
var   sHStyle;
var   pButton;
var   gps;
var   gLat;
var   gLon;
var   gAcc;
var   lastRefresh;
var   bFirstTime;
var   qq;
var   bigString;

qq = Chr(34);
gLat = -79.20989561;
gLon = 43.73768353;
gAcc = 0;
lastRefresh=0;
bFirstTime = True;

sHStyle = "<style type='text/css'>p.a{padding:0;margin:0;width:100%;text-align:Left;";
sHStyle = sHStyle + "line-height:20px;border-bottom:1px solid #ccc;border-top:1px solid #fff;";
sHStyle = sHStyle + "background-color:#fafafa;font-size:14px;}</style>";


function Main() { savethefunction_rvar="";
  ReadLocalStorage();
return savethefunction_rvar; }

Form1.onshow = function() { savethefunction_rvar="";
  	TextArea1.autocapitalize = bAutoCapitalize;
	TextArea1.autocomplete = bAutoComplete;
	TextArea1.autocorrect = bAutoCorrect;
 //	if bGPSCoords = [True] Then
 //	  GPSStart()
 //        else
 //	  GPSStop()
 //        End if

	if(bFirstTime) {

	  bFirstTime = False;

	  openDB();
	  HTMLview1.innerHTML = sHStyle;

	  readData();
	}
    Label1.textContent = "";
return savethefunction_rvar; }

Button1.onclick = function() { savethefunction_rvar="";
 var  dts, txt, dat, geo, geo2;

  if(TextArea1.value == "") {
	Label1.textContent = "Não ha dados informados para incluir";
	 Return;
 } else {
	Label1.textContent = "";
 }

  bShowDate = False;
  dts = CStr(FormatDateTime(dateadd("s",0,new Date())));

  txt = TextArea1.value;
 //
 //  if bGPSCoords = [True] Then
 //	  geo = gLat & ", " & gLon
 //	  geo2 = geo & "<br/>"
 // else
	  geo = "";
	  geo2 = "";
 // End if


  if(bAutoClear) {
	TextArea1.value = "";
  }

  dat = "<p class='a'>"  +  dts  +  "<br/>"  +  geo2  +  "<b>"  +  txt  +  "</b>";

 // add the formatted data
  HTMLview1.innerHTML = HTMLview1.innerHTML + dat;
 // make sure view gets resized
  HTMLview1.refresh();
 // scroll to the added data
  HTMLview1_ref.scrollTo(0, HTMLview1_ref.maxScrollY, 0);
  HTMLview1.refresh();

 // add to db (TODO: geo)
  insertData(dts, geo, txt);
return savethefunction_rvar; }

TitleBar1.onclick = function(choice) { savethefunction_rvar="";
  if(Trim(choice)==  "Opções") {
    ChangeForm(Form2);
  }

  if(Trim(choice) == "Novo") {
   var  warnmsg;
    warnmsg = "Apagar as anotações existente?"  +  '\n'  +  "Todos os dados serão apagados!";
    NSB.MsgBox(yesNoDone,warnmsg, 4+32, "Meu Notes");
  }

return savethefunction_rvar; }

function yesNoDone(result) { savethefunction_rvar="";
 // callback function for NSBmsgbox activated in "New" button
 // this is called when a user wnats
  if(result==6) {
	HTMLview1.innerHTML = sHStyle;
	TextArea1.value = "";
 // TODO: slick this up so we can have multiple logs
	zapDB();
  }
return savethefunction_rvar; }


window.addEventListener('load', function() {
  Form1.style.display = 'block';
  Main();
  if (typeof(Form1.onshow)=='function') Form1.onshow();
  
}, false);

var NSBCurrentForm = Form1;


