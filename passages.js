var model = {
      getAllPassages : function(){
                  var passagesQuery = firebase.database().ref('Passages');
                  passagesQuery.on('value',function(snapshot){

                   snapshot.forEach(function(childSnapshot)
                   {
                       console.log('Passage : '+childSnapshot.val().Code);
                       presenter.appendPassage(childSnapshot.val());
                   })
                 },function(error){
                      console.log("error while fetching passages "+error);
                      presenter.fetchPassagesError(error);
                 });
            },

    isPaid : function(passageString,passageStringId,passageType){
                  if(passageType=="paid"){
                    return true;
                    }
                    else {
                      return false;
                    }
    },

   hasExpired : function(passageString,passageStringId,btnid){
                  var user = firebase.auth().currentUser;
                  var uid = user.uid;
                  var database = firebase.database();
                  var expiryDateQuery = database.ref('Users/'+uid);

                  expiryDateQuery.on('value',function(snapshot)
                  {
                        if(snapshot.hasChild("expiryDate"))
                        {
                              var expiry = snapshot.val().expiryDate;
                              console.log("expiry date : "+expiry);
                              var expirydate = new Date(expiry).getTime();

                              var today = new Date().getTime();
                              if(today > expirydate) {
                                  console.log("expired");
                              }
                              else {
                                console.log("not expired");
                                presenter.passageClicked(passageString,passageStringId,btnid);
                              }
                        }
                        else {
                            console.log("not purchased");
                            presenter.passageClicked(passageString,passageStringId,btnid);
                        }
                  });
              }

};
var presenter = {

    fetchPassages : function(){
                    console.log("Passages requested");
                    view.showLoading();
                    model.getAllPassages();
    },
    fetchPassagesError : function(error){
                    view.showError(error);
    },
    appendPassage : function(passage){
                    console.log("Passage is being appended : "+passage.Code);
                    view.showPassages();
                    view.appendPassage(passage);
    },
    passageClicked : function(passageString,passageStringId,btnid){
                    sessionStorage.currentPassage = passageString;
                    sessionStorage.currentPassageId = passageStringId;
                    if(btnid=="start"){
                        window.location = "typing.html";
                    }
                    else {
                        window.location = "practice.html";
                    }
    },
    logout : function(){
                    logout();
    },
    getCurrentUser : function(){
                     console.log('Current user is : '+getCurrentUser());
                     view.setHeaderEmail(getCurrentUser());
    },
    isPaid : function(passageString,passageStringId,passageType,btnid){
                    console.log("passage type : "+passageType);
                    //model.isPaid(passageString,passageStringId,passageType);
                    if(model.isPaid(passageString,passageStringId,passageType)){
                          model.hasExpired(passageString,passageStringId,btnid);
                    }
                    else {
                           presenter.passageClicked(passageString,passageStringId,btnid);
                    }

    },

};
var view = {
    init : function(){
            passagesElement = document.getElementById('passages');
            passageLoaderElem = document.getElementById('loader');
            headerUserElem = document.getElementById('user_email');
            logOutButton = document.getElementById('signout');
            logOutButton.addEventListener('click',function(){
                          presenter.logout();
            });
            presenter.getCurrentUser();
            presenter.fetchPassages();
    },
    appendPassage : function(passage){
                    console.log('Passage : '+passage.Code);
                    var div = document.createElement('article');
                    div.className = 'module';
                    var passageString = passage.PassageString;
                    var passageStringId = passage.Code;
                    var passageType = passage.type;


                    var startbtn = "<button id='start'  class='button' onclick='view.createClickHandler(\""+passageString+"\",\""+passageStringId+"\",\""+passageType+"\",this.id)'>Start</button>";

                    var practicebtn = "<button id='practice' class='button' onclick='view.createClickHandler(\""+passageString+"\",\""+passageStringId+"\",\""+passageType+"\",this.id)'>Practice</button>";

                  //  div.onclick = view.createClickHandler(passageString,passageStringId,passageType);

                    var passageCode = passage.Code;
                    div.innerHTML= '<div class="inside-module"><div class="bar-full"><span class="bar"></span><div class="bar-box"><span class="bar-flip">'+passageStringId+'</span></div></div><div class="pad"><p>'+passageString+'</p><br><span style="width:30%;float:right">'+startbtn+'&nbsp;&nbsp;&nbsp;'+practicebtn+'</span></div></div>';
                    passagesElement.append(div);

                    (function($) {
                      $.fn.visible = function(partial) {
                          var $t            = $(this),
                              $w            = $(window),
                              viewTop       = $w.scrollTop(),
                              viewBottom    = viewTop + $w.height(),
                              _top          = $t.offset().top,
                              _bottom       = _top + $t.height(),
                              compareTop    = partial === true ? _bottom : _top,
                              compareBottom = partial === true ? _top : _bottom;
                        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
                      };
                    })(jQuery);

                    var win = $(window);
                    var allMods = $(".module");

                    allMods.each(function(i, el) {
                      var el = $(el);
                      if (el.visible(true)) {
                        el.addClass("already-visible");
                      }
                    });

                    var poz = $(window).scrollTop();

                    win.scroll(function(event) {

                      allMods.each(function(i, el) {
                        var el = $(el);
                        if (el.visible(true)) {

                          el.addClass("come-in");

                        }
                      });
                    });


    },

    showLoading : function(){
                  passageLoaderElem.style.display = "block";
                  passagesElement.style.display = 'none';
    },
    showPassages : function(){
                  passageLoaderElem.style.display = "none";
                  passagesElement.style.display = 'block';
    },
    showError : function(error){
            console.log("Error while fetching passages "+error);
    },
/*    createClickHandler : function(passageString,passageStringId,passageType)
    {
      alert("func called");
      return function()
      {
        console.log('Passage clicked'+passageString);
        presenter.isPaid(passageString,passageStringId,passageType);
    //    presenter.passageClicked(passageString,passageStringId);
      } ;
    }, */
    createClickHandler : function(passageString,passageStringId,passageType,btnid)
    {
        console.log('Passage clicked'+passageString);
        presenter.isPaid(passageString,passageStringId,passageType,btnid);
    },
    setHeaderEmail : function(currentUser){
          headerUserElem.innerText = currentUser.email;
    }
};

view.init();
