var model = {
      login : function(email,password)
               {
                  if (!firebase.auth().currentUser)
                  {
                                  model.loginWithoutCheck(email,password);
                   }else{
                                  console.log('Already logged in : '+firebase.auth().currentUser);
                                  model.logout();
                                  model.loginWithoutCheck(email,password);
                   }
              },
      loginWithoutCheck : function(email,password){
                    firebase.auth().signInWithEmailAndPassword(email, password)
                         .then(function(firebaseUser)
                          {
                                console.log('Login successful'+firebaseUser.email);
                                presenter.loginSuccess(firebaseUser);
                          })
                         .catch(function(error) // Handle Errors here.
                         {
                                 console.log('login error'+error.message);
                                 presenter.loginError(error.message);
                         });
      },
      logout : function()
              {
                  console.log('User : '+firebase.auth().currentUser.email);
                  firebase.auth().signOut();
                  console.log('Successfully logged out');
              },
	  googleLogin : function()
			 {
					   var provider = new firebase.auth.GoogleAuthProvider();

					   firebase.auth().signInWithPopup(provider).then(function(result) {
								  // This gives you a Google Access Token. You can use it to access the Google API.
								 // var token = result.credential.accessToken;
								  // The signed-in user info.
								 // var user = result.user;
                                  console.log('Login successful'+user.email);
								  presenter.loginSuccess(firebaseUser);
						  // ...
						})
						.catch(function(error) {
								 console.log('login error'+error.message);
								 presenter.loginError(error.message);
						});

			 }
};

var presenter = {
    login : function(email,password){
                          if(email=="")
                          {
                              view.showError("Enter valid Email Id");
                              return;
                          }
                          else if(password=="")
                          {
                              view.showError("Enter valid Password");
                              return;
                          }
                          else
                          {

                              view.showProgress();
                              model.login(email,password);
                          }
                  },
    loginError    : function(error){
                          view.showError(error);
                  },
    loginSuccess  : function(firebaseUser){
                          localStorage.setItem('currentUserObject', JSON.stringify(firebaseUser));
                          window.location = "passages.html";
                  },
	googleLogin    : function(){
							console.log("sending login request");
							model.googleLogin();
				 }

};

var view = {
  init : function(){

           loginElements = document.getElementById('loginDiv');
           errorElements = document.getElementById('loginError');
           progressElement = document.getElementById('loading');
           emailBox = document.getElementById('email');
           passwordBox = document.getElementById('password');
           loginButton = document.getElementById('loginButton');
           loginForm = document.getElementById('loginForm');

		   googleSignInButton = document.getElementById('googleSignInButton');

		   googleSignInButton.onclick = function(){
				console.log("google sign in processing");
				presenter.googleLogin();
				var provider = new firebase.auth.GoogleAuthProvider();
			}

            loginForm.onsubmit = function(e){
                      e.preventDefault();
                      console.log(emailBox.value);
                      presenter.login(emailBox.value,passwordBox.value);
                      return false;
            };

  },
  showError  : function(error){
          loginElements.style.display = "block";
          progressElement.style.display = "none";
          errorElements.style.display = "block";
          errorElements.innerHTML = error;
  },
  showProgress : function(){
          console.log("Loading ...");
          loginElements.style.display = "none";
          progressElement.style.display = "block";
          errorElements.style.display = "none";
  }
};
firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log(user+' user logged in');
            window.location = "passages.html";
        }
        else{
            console.log('Sign in with your user email and password');
        }
});
view.init();
