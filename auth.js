var GoogleAuth
var SCOPE = 'https://www.googleapis.com/auth/photoslibrary.readonly'
//var SCOPE = 'https://www.googleapis.com/auth/'
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient)
}
function initClient() {
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl =
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.load('client:auth2', () => {
    gapi.client
      .init({
        apiKey: 'AIzaSyA4nwbtxltI-UpHkugXVYv2nY-I7ElYCiE',
        clientId:
          '248651903228-u4bn4gn43cp113lmt14snavs0vptnq8s.apps.googleusercontent.com',
        discoveryDocs: [
          'https://photoslibrary.googleapis.com/$discovery/rest?version=v1'
        ],
        scope: SCOPE
      })
      .then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance()

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus)

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get()
        const startAuth = user.hasGrantedScopes(SCOPE)
        setSigninStatus()

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
          handleAuthClick()
        })
        $('#revoke-access-button').click(function () {
          revokeAccess()
        })
      })
  })
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked "Sign out" button.
    GoogleAuth.signOut()
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn()
  }
}

function revokeAccess() {
  GoogleAuth.disconnect()
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get()
  var isAuthorized = user.hasGrantedScopes(SCOPE)
  if (isAuthorized) {
    $('#sign-in-or-out-button').html('Sign out')
    $('#settings-panel').css('display', 'none')
    $('#sign-in-or-out-button').css('display', 'none')
    $('#revoke-access-button').css('display', 'none')
    $('#auth-status').html(
      'You are currently signed in and have granted ' + 'access to this app.'
    )
    window.photoFrame.init(gapi.client)
  } else {
    $('#sign-in-or-out-button').html('Sign In/Authorize')
    $('#revoke-access-button').css('display', 'none')
    $('#auth-status').html(
      'You have not authorized this app or you are ' + 'signed out.'
    )
  }
}

function updateSigninStatus() {
  setSigninStatus()
}
