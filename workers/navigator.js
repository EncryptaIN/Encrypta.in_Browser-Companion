document.querySelectorAll('.nav-item').forEach((element) => {
    element.addEventListener('click', () => {
        ChangeView(element.getAttribute('data-nav-action'))
    })
})

function ChangeView(view) {
    var Canvas = document.getElementById('canvas')
    Canvas.innerHTML = ''
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var activeTab = tabs[0]
        if ('url' in activeTab && (activeTab.url.split('/')[0].includes('http') || activeTab.url.split('/')[0].includes('file'))) {
            Canvas.append(ContentDeployer(view))
        }
        else {
            Canvas.append(ContentDeployer('UnsupportedPage'))
        }
    })
}



var AuthenticatorSocket
var ClientID
var communicationKey

function EstablishSocket(callback) {
    function KeyGen() {
        const domain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        key = ''
        for (let i = 0; i < 28; i++) {
            key += domain.charAt(Math.floor(Math.random() * domain.length))
        }
        return key

    }
    communicationKey = KeyGen()
    AuthenticatorSocket = new WebSocket(`ws://127.0.0.1:17266/EncryptaBrowserCompanionCommunicationInterface`);
    App = { "Class": '<Encrypta Utility Framework>', 'Name': 'Encrypta_Browser_Companion <chromium_build>', 'Title': 'Encrypta Browser Companion <Browser_Extension> (Chromium Build)', 'Key': communicationKey }
    AuthenticatorSocket.onerror = ((e) => {
        AuthenticatorConnectionUpdate(false)
    })
    AuthenticatorSocket.onopen = (() => {
        chrome.storage.local.get(["Authenticator_AppID"], function (result) {
            if (!chrome.runtime.lastError) {
                AuthenticatorSocket.send(JSON.stringify({ 'Action': { 'Request': 'Initiate' }, 'Transfer': { ...App, 'APP_ID': result.Authenticator_AppID } }))
            }
        })
    })
    AuthenticatorSocket.onclose = (event) => {
        AuthenticatorConnectionUpdate(false)
        if (event.wasClean) {
        }
        else {
        }
    }
    AuthenticatorSocket.onmessage = ((event) => {
        chrome.storage.local.get(["Authenticator_AppID"], function (result) {
            if (!chrome.runtime.lastError) {
                const data = JSON.parse(event.data);
                if ('Response' in data['Action']) {
                    var transfer = data['Transfer']
                    if (data['Action']['Response'] == 'Acknowledgement') {
                        AuthenticatorConnectionUpdate(true)
                        ClientID = transfer['ClientId']
                        chrome.storage.local.set({
                            Authenticator_AppID: transfer['AppID'],
                        }).then(() => {
                            callback()
                        });
                    }
                }
                else if ('Command' in data['Action']) {
                    if (data['Action']['Command'] == 'CloseConnection') {
                        AuthenticatorSocket.close()
                        // BodyElement.innerHTML = 'Websocket Error Encountered'
                    }
                }
            }
        })
    })
}


function Communicate(action, data = {}) {
    return new Promise((resolve, reject) => {
        if (AuthenticatorSocket !== undefined) {
            AuthenticatorSocket.send(JSON.stringify({ 'Action': { 'Request': action }, 'Transfer': { 'ClientID': ClientID, 'Key': communicationKey, ...data } }))
            AuthenticatorSocket.onmessage = ((event) => {
                const data = JSON.parse(event.data);
                if ('Response' in data['Action']) {
                    var transfer = data['Transfer']
                    if (data['Action']['Response'] == action) {
                        resolve(transfer);
                    }
                }
                else if ('Command' in data['Action']) {
                    if (data['Action']['Command'] == 'CloseConnection') {
                        AuthenticatorSocket.close()
                    }
                }
            })
        }
        else {
            EstablishSocket(() => {
                AuthenticatorSocket.send(JSON.stringify({ 'Action': { 'Request': action }, 'Transfer': { 'ClientID': ClientID, 'Key': communicationKey, ...data } }))
                AuthenticatorSocket.onmessage = ((event) => {
                    const data = JSON.parse(event.data);
                    if ('Response' in data['Action']) {
                        var transfer = data['Transfer']
                        if (data['Action']['Response'] == action) {
                            resolve(transfer);

                        }
                    }
                    else if ('Command' in data['Action']) {
                        if (data['Action']['Command'] == 'CloseConnection') {
                            AuthenticatorSocket.close()
                        }
                    }
                })
            })
        }
    });
}

function ServerInitiatedCommunication(Callback) {
    if (AuthenticatorSocket == undefined) {
        EstablishSocket(() => {
            AuthenticatorSocket.onmessage = ((event) => {
                const data = JSON.parse(event.data);
                if ('Request' in data['Action']) {
                    let transfer = data['Transfer']
                    Callback(data['Action']['Request'], transfer);
                }
            })
        })
    }
    else {
        AuthenticatorSocket.onmessage = ((event) => {
            const data = JSON.parse(event.data);
            if ('Request' in data['Action']) {
                let transfer = data['Transfer']
                Callback(data['Action']['Request'], transfer);
            }
        })
    }
}




var AuthenticatorConnection = false
var SecureConnection = false
var UserAccountLogged = false

function UserAccount(state, username) {
    UserAccountLogged = state
    let UserWrap = document.getElementById('UserAccount')
    UserWrap.innerHTML = ''

    let Head = document.createElement('h4')
    Head.style.margin = '0.3rem 0'
    Head.innerText = 'Account'

    let UserContainer = document.createElement('div')
    UserContainer.className = 'Container'
    let UserAction = document.createElement('div')
    UserAction.className = 'Container'

    let UserFace = document.createElement('div')
    UserFace.className = 'Face'
    let UserBody = document.createElement('div')
    UserBody.className = 'Body'

    let ActionBody = document.createElement('div')
    ActionBody.className = 'Body'
    let ActionFace = document.createElement('div')
    ActionFace.className = 'Face'
    ActionFace.style.maxWidth = '70%'
    let Icon = document.createElement('i')
    Icon.className = 'fa'
    if (state) {

        UserContainer.style.color = '#5d5dff'
        UserAction.style.color = '#5d5dff'
        Icon.classList.add('fa-circle')
        ActionFace.innerText = username
        UserFace.innerText = 'Connected'
        UserBody.append(Icon)
        // UserBody.append(Icon.cloneNode())
    }
    else {
        UserContainer.style.color = '#f00'
        Icon.classList.add('fa-circle-o')
        UserFace.innerText = 'Disconnected'
        UserBody.append(Icon.cloneNode())

        let AuthenticateButton = document.createElement('div')
        AuthenticateButton.className = 'Clickable'
        AuthenticateButton.innerHTML = 'SignIn'
        AuthenticateButton.addEventListener('click', async () => {
            chrome.tabs.create({ url: 'http://www.accounts.encrypta.in/Account' });
        })
        ActionFace.append(AuthenticateButton)
    }


    UserAction.append(ActionFace)
    UserContainer.append(UserFace, UserBody)
    UserWrap.append(Head, UserContainer, UserAction)
}


function AuthenticatorConnectionUpdate(state) {
    AuthenticatorConnection = state
    let AuthWrap = document.getElementById('AuthenticatorConnection')
    AuthWrap.innerHTML = ''
    let Head = document.createElement('h3')
    Head.style.margin = '0.3rem 0'
    Head.innerText = 'Authenticator'
    let AuthContainer = document.createElement('div')
    AuthContainer.className = 'Container'

    let AuthFace = document.createElement('div')
    AuthFace.className = 'Face'
    let AuthBody = document.createElement('div')
    AuthBody.className = 'Body'
    let Icon = document.createElement('i')
    Icon.className = 'fa'
    if (state) {
        AuthContainer.style.color = '#5d5dff'
        Icon.classList.add('fa-circle')
        AuthFace.innerText = 'Connected'
        AuthBody.append(Icon)
    }
    else {
        AuthContainer.style.color = '#f00'
        Icon.classList.add('fa-circle-o')
        AuthFace.innerText = 'Disconnected'
        AuthBody.append(Icon)
    }
    AuthContainer.append(AuthFace, AuthBody)
    AuthWrap.append(Head, AuthContainer)
}


async function CheckSecureSession() {
    const result = await Communicate('Authentication_State');
    if (result['Authentication']['State']) {
        chrome.storage.local.set({
            AuthenticationExpiry: (result['Authentication']['Expiry'] * 1000),
        }).then(() => { });
    }
    else {
        chrome.storage.local.set({
            AuthenticationExpiry: new Date().getTime() - (2 * 1000),
        }).then(() => { });
    }
    SecureSessionUpdate(result['Authentication']['State'], result['Authentication']['Expiry'])
}

function SecureSessionUpdate(state, expiry) {
    SecureConnection = state
    let SessionWrap = document.getElementById('SessionSecure')
    SessionWrap.innerHTML = ''

    let Head = document.createElement('h4')
    Head.style.margin = '0.3rem 0'
    Head.innerText = 'Secured Session'

    let SessionContainer = document.createElement('div')
    SessionContainer.className = 'Container'
    let SessionAction = document.createElement('div')
    SessionAction.className = 'Container'

    let SessionFace = document.createElement('div')
    SessionFace.className = 'Face'
    let SessionBody = document.createElement('div')
    SessionBody.className = 'Body'

    let ActionBody = document.createElement('div')
    ActionBody.className = 'Body'
    let ActionFace = document.createElement('div')
    ActionFace.className = 'Face'
    ActionFace.style.maxWidth = '70%'
    let Icon = document.createElement('i')
    Icon.className = 'fa'
    if (state) {
        SessionContainer.style.color = '#5d5dff'
        SessionAction.style.color = '#5d5dff'
        Icon.classList.add('fa-lock')
        SessionFace.innerText = 'Secured'
        SessionBody.append(Icon.cloneNode())
        // ActionBody.append(Icon.cloneNode())
        var interval = setInterval(() => {
            var seconds = parseInt((expiry) - (new Date().getTime() / 1000))
            ActionFace.innerHTML = `${parseInt(seconds / 60) > 9 ? parseInt(seconds / 60) : '0' + parseInt(seconds / 60)}: ${seconds % 60 > 9 ? (seconds % 60) : '0' + (seconds % 60)}`
            if (seconds < 1) {
                clearInterval(interval)
                CheckSecureSession()
            }
        }, 1000);
    }
    else {
        SessionContainer.style.color = '#f00'
        Icon.classList.add('fa-unlock')
        SessionFace.innerText = 'Insecure'
        SessionBody.append(Icon.cloneNode())

        let AuthenticateButton = document.createElement('div')
        AuthenticateButton.className = 'Clickable'
        AuthenticateButton.innerHTML = 'Secure'
        AuthenticateButton.addEventListener('click', async () => {
            const result = await Communicate('Authenticate');
            ServerInitiatedCommunication((response, data) => {
                if (response == 'SecureSession') {
                    CheckSecureSession()
                }
            })

        })
        ActionFace.append(AuthenticateButton)
    }


    SessionAction.append(ActionFace)
    SessionContainer.append(SessionFace, SessionBody)
    SessionWrap.append(Head, SessionContainer, SessionAction)
}


var CurrentPageLocation

chrome.runtime.onMessage.addListener(function (message) {
    if (message.action.Direction === 'UP') {
        if (message.action.Response === "CurrentPage") {
            CurrentPageLocation = message.data
            ChangeView('Page')
        }
    }
    else if (message.action.Direction === "DOWN") {
        if (message.action.Response === "UserSession") {
            UserAccount(message.data['Session'], message.data['User']['UserName'])
            SynchronizeCredentials()
        }
        if (message.action.Response === "RiskAnalysis") {
            let wrapper = document.getElementById(message.data['Wrapper'])
            let element = document.getElementById(message.data['Element'])
            if (message.data['TYPE'] == 3) {
                wrapper.setAttribute('data-risk-level', 'high')
                element.innerHTML = 'Danger!'
            } else if (message.data['TYPE'] == 2) {
                wrapper.setAttribute('data-risk-level', 'moderate')
                element.innerHTML = 'Analysis in progress'
            } else if (message.data['TYPE'] == 1) {
                wrapper.setAttribute('data-risk-level', 'low')
                element.innerHTML = 'Encrypta Secured!'
            }

        }
        else if (message.action.Response === 'SynchronizeCredentials') {
        }
    }
})


function SynchronizeCredentials() {
    chrome.runtime.sendMessage({
        action: {
            Request: 'SynchronizeCredentials',
            Direction: 'UP'
        }
    });
}


chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {
    const activeTab = tabs[0];
    if (chrome.runtime.lastError) {
        return;
    } else {
        if ('url' in activeTab && (activeTab.url.split('/')[0].includes('http') || activeTab.url.split('/')[0].includes('file'))) {
            chrome.tabs.sendMessage(activeTab.id, {
                action: {
                    Request: "CurrentPage",
                    Direction: 'DOWN'
                },
            });
            chrome.runtime.sendMessage({
                action: {
                    Request: 'UserSession',
                    Direction: 'UP'
                }
            });
            CheckSecureSession()
        }
        else {
            ChangeView('UnsupportedPage')
        }
        AuthenticatorConnectionUpdate(false)
        UserAccount(false)
    }
})


async function CurrentPageCredentials(domain, element) {
    domain = DomainRetriever(domain)
    var data = 0
    chrome.storage.local.get(["UserCredentials"], function (result) {
        if (!chrome.runtime.lastError) {
            for (i of result.UserCredentials) {
                if (i['Domain'].includes(domain)) {
                    data++
                }
            }
        }
        return new Promise(response => {
            element.innerHTML = data.toString()
        });
    });
}


function GetTime(time) {
    time = parseInt(time)

    function GetMonth(n) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return month[n]
    }

    function AddLeadingZero(n) {
        if (n < 10) {
            return `0${n}`
        } else {
            return `${n}`
        }
    }

    function format(hour) {
        if (hour > 12) {
            return {
                'hour': hour - 12,
                'mer': 'PM'
            }
        } else {
            if (hour === 0) {
                return {
                    'hour': 12,
                    'mer': 'AM'
                }
            } else {
                return {
                    'hour': hour,
                    'mer': 'AM'
                }
            }
        }
    }

    var TimeObj = new Date(time)
    var hour_12 = format(TimeObj.getHours())
    return `${AddLeadingZero(TimeObj.getDate())} ${GetMonth(TimeObj.getMonth())} ${TimeObj.getFullYear()} ${AddLeadingZero(hour_12['hour'])}:${AddLeadingZero(TimeObj.getMinutes())} ${hour_12['mer']}`

}

async function GetHistory(domain, element1, element2) {
    var data = []
    chrome.storage.local.get(["History"], function (result) {
        if (!chrome.runtime.lastError) {
            for (i of result.History) {
                if (i['URL'].includes(domain)) {
                    data.push(i)
                }
            }
        }
        return new Promise(response => {
            element1.innerHTML = data.length
            // var time = new Date(data[data.length - 2]['TIME'])
            element1.innerHTML = data.length > 1 ? data.length - 1 : 'Never'
            element2.innerHTML = data.length > 1 ? GetTime(data[data.length - 2]['TIME']) : 'Never'
        })
    })
}

function DomainRetriever(url) {
    var result = {};
    var regexParse = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
    var urlParts = regexParse.exec(url);
    result.domain = urlParts[1];
    result.type = urlParts[2];
    result.subdomain = url.replace(result.domain + '.' + result.type, '').slice(0, -1);
    return result.domain + '.' + result.type;
}






function ContentDeployer(view) {
    var container = document.createElement('div')
    container.classList.add("container-main");
    let nav = document.querySelectorAll('div.nav-item')
    nav.forEach(element => {
        element.classList.remove('nav-selected')
    });
    if (view == undefined || view == 'Page') {
        let element = document.querySelector('div#Page.nav-item')
        element.classList.add('nav-selected')
        const HeadPage = document.createElement("div");
        HeadPage.classList.add('page-title')


        const contentWrapper1 = document.createElement("div");
        contentWrapper1.classList.add("content-wrapper");

        const contentLabel1 = document.createElement("div");
        contentLabel1.classList.add("content-label");

        const contentText1 = document.createElement("div");
        contentText1.classList.add("content-text");

        const contentWrapper2 = document.createElement("div");
        contentWrapper2.id = 'Analysis-Wrapper'
        contentWrapper2.classList.add("content-wrapper");
        contentWrapper2.setAttribute('data-wrapper-type', 'security-level');

        const contentLabel2 = document.createElement("div");
        contentLabel2.classList.add("content-label");
        contentLabel2.textContent = "Risk Factor";

        const contentText2 = document.createElement("div");
        contentText2.classList.add("content-text");


        const contentWrapper3 = document.createElement("div");
        contentWrapper3.classList.add("content-wrapper");

        const contentLabel3 = document.createElement("div");
        contentLabel3.classList.add("content-label");

        const contentText3 = document.createElement("div");
        contentText3.classList.add("content-text");

        var contentWrapper4 = document.createElement("div");
        contentWrapper4.classList.add("content-wrapper");

        var contentLabel4 = document.createElement("div");
        contentLabel4.classList.add("content-label");

        var contentText4 = document.createElement("div");
        contentText4.classList.add("content-text");

        var contentWrapper5
        // console.log(CurrentPageLocation)
        if (CurrentPageLocation.protocol.includes('file') || CurrentPageLocation.protocol.includes('http')) {

            if (CurrentPageLocation.protocol.includes('file')) {
                HeadPage.innerText = CurrentPageLocation.pathname
                HeadPage.title = CurrentPageLocation.pathname

                contentLabel1.textContent = "Type";
                contentText1.textContent = 'Local File';
                contentWrapper2.setAttribute('data-risk-level', 'null');
                contentText2.textContent = "Local Files are not applicable for Risk Analysis.";

                // contentLabel3.textContent = "Location";
                // contentText3.textContent = CurrentPageLocation.href;
                contentLabel3.textContent = "File Name";
                contentText3.textContent = CurrentPageLocation.href.split('/')[CurrentPageLocation.href.split('/').length - 1];
                contentText3.title = CurrentPageLocation.href.split('/')[CurrentPageLocation.href.split('/').length - 1];

                contentLabel4.textContent = "File Type";
                contentText4.textContent = ('.' + CurrentPageLocation.href.split('.')[CurrentPageLocation.href.split('.').length - 1]);
            } else {
                contentLabel1.textContent = "Location";
                HeadPage.innerText = CurrentPageLocation.hostname
                HeadPage.title = CurrentPageLocation.hostname

                contentText1.textContent = CurrentPageLocation.href;


                contentWrapper2.setAttribute('data-risk-level', 'null');

                contentText2.textContent = "Analyzing"; //dynamic
                contentText2.id = 'Analysis-element'

                chrome.runtime.sendMessage({
                    action: {
                        Request: 'RiskAnalysis',
                        Direction: 'UP'
                    },
                    data: { 'URL': CurrentPageLocation.href, 'Element': contentText2.id, 'Wrapper': contentWrapper2.id }
                });
                contentLabel3.textContent = "Accounts";
                async function credcount() {
                    CurrentPageCredentials(CurrentPageLocation.hostname, contentText3)
                };
                credcount()

                contentLabel4.textContent = "Visit Frequency";

                contentWrapper5 = document.createElement("div");
                contentWrapper5.classList.add("content-wrapper");


                contentLabel5 = document.createElement("div");
                contentLabel5.classList.add("content-label");
                contentText5 = document.createElement("div");
                contentText5.classList.add("content-text");

                contentLabel5.textContent = "Last Visited";

                async function visitcount() {
                    GetHistory(CurrentPageLocation.href, contentText4, contentText5)
                };
                visitcount()


            }
            contentWrapper1.appendChild(contentLabel1);
            contentWrapper1.appendChild(contentText1);

            contentWrapper2.appendChild(contentLabel2);
            contentWrapper2.appendChild(contentText2);

            contentWrapper3.appendChild(contentLabel3);
            contentWrapper3.appendChild(contentText3);

            contentWrapper4.appendChild(contentLabel4)
            contentWrapper4.appendChild(contentText4)


            container.appendChild(HeadPage)
            container.appendChild(contentWrapper1);
            container.appendChild(contentWrapper2);
            container.appendChild(contentWrapper3);
            container.appendChild(contentWrapper4);

            if (contentWrapper5 !== undefined) {
                contentWrapper5.appendChild(contentLabel5)
                contentWrapper5.appendChild(contentText5)
                container.appendChild(contentWrapper5);
            }
        } else {
            HeadPage.innerText = 'Application based Page.'
            container.appendChild(HeadPage)
        }
    } else if (view == 'Authenticator') {
        let element = document.querySelector('div#Authenticator.nav-item')
        element.classList.add('nav-selected')
        container.innerHTML = ''
        let wrap = document.createElement('div')
        if (AuthenticatorConnection) {
            let AuthenticatorViewInitiate = async () => {
                const result = await Communicate('Authenticator');
                let Authenticator = result
                wrap.style = 'align-items: center; width: 80%; height: calc(100% - 2rem); margin: 1rem auto; justify-content: space-evenly; flex-direction: column; overflow-y: auto'
                let ProfileWrap_Picture = document.createElement('div')
                let picture = document.createElement('img')
                picture.src = `data:image/jpeg;base64,${Authenticator.Profile['ProfileImage']}`
                picture.style.width = 'calc(100% - 8px)'
                picture.style.height = 'calc(100% - 8px)'
                picture.style.borderRadius = '100%'
                picture.style.border = 'solid 4px #5d5dff'

                ProfileWrap_Picture.append(picture)
                ProfileWrap_Picture.style = 'width: 8rem; height: 8rem; margin: 0.8rem auto 1.8rem auto;'

                let Label = document.createElement('div')
                Label.style.fontWeight = '600'
                Label.style.width = '35%'

                let Value = document.createElement('div')
                Value.style.maxWidth = '65%'
                Value.style.textOverflow = 'ellipsis'
                Value.style.textWrap = 'nowrap'
                Value.style.overflow = 'hidden'

                let ProfileWrap_Profile = document.createElement('div')
                ProfileWrap_Profile.style = 'width: 90%; display: flex; margin: 1rem auto; font-size: 0.8rem;'
                Label.innerText = 'Profile'
                Value.innerHTML = Authenticator.Profile.ProfileName
                ProfileWrap_Profile.append(Label.cloneNode(true), Value.cloneNode(true))

                let ProfileWrap_UserName = document.createElement('div')
                ProfileWrap_UserName.style = 'width: 90%; display: flex; margin: 1rem auto; font-size: 0.8rem;'
                Label.innerHTML = 'UserName'
                Value.innerHTML = Authenticator.Profile.UserName
                ProfileWrap_UserName.append(Label.cloneNode(true), Value.cloneNode(true))

                let ProfileWrap_Email = document.createElement('div')
                ProfileWrap_Email.style = 'width: 90%; display: flex; margin: 1rem auto; font-size: 0.8rem;'
                Label.innerHTML = 'Email ID'
                Value.innerHTML = Authenticator.Profile.EmailID
                ProfileWrap_Email.append(Label.cloneNode(true), Value.cloneNode(true))

                let ProfileWrap_Fingerprint = document.createElement('div')
                Label.innerHTML = 'Fingerprint'
                Value.innerHTML = Authenticator.Profile.Fingerprint
                ProfileWrap_Fingerprint.style = 'width: 90%; display: flex; margin: 1rem auto; font-size: 0.8rem;'
                ProfileWrap_Fingerprint.append(Label.cloneNode(true), Value.cloneNode(true))

                let AppWrap_Instance = document.createElement('div')
                Label.innerHTML = 'Authenticator ID'
                Value.innerHTML = Authenticator.App.InstanceID
                AppWrap_Instance.style = 'width: 90%; display: flex; margin: 1rem auto; font-size: 0.8rem;'
                AppWrap_Instance.append(Label.cloneNode(true), Value.cloneNode(true))

                wrap.append(ProfileWrap_Picture, ProfileWrap_Profile, ProfileWrap_UserName, ProfileWrap_Email, ProfileWrap_Fingerprint, AppWrap_Instance)
            }
            AuthenticatorViewInitiate()
        }
        else {
            wrap.style = 'display: flex; align-items: center; width: 80%; height: calc(100% - 4rem); margin: 2rem auto; justify-content: space-evenly; flex-direction: column;'
            let Head = document.createElement('h2')
            Head.innerHTML = 'Authenticator not connected'
            wrap.append(Head)
        }
        container.append(wrap)

    } else if (view == 'Profile') {
        let element = document.querySelector('div#Profile.nav-item')
        element.classList.add('nav-selected')
        var User = {}
        chrome.storage.local.get(["UserProfile", "UserCredentials"], (result) => {
            if (!chrome.runtime.lastError) {
                User = result['UserProfile']

                const header = document.createElement('h2')
                header.textContent = 'MY PROFILE'
                header.style.margin = '0.8rem 0'
                header.style.textAlign = 'center'
                header.style.padding = '0.6rem 0'

                const ContentWrapper_User = document.createElement('div')
                ContentWrapper_User.classList.add('content-wrapper')

                const ContentLabel_User = document.createElement("div");
                ContentLabel_User.classList.add("content-label");

                const ContentText_User = document.createElement("div");
                ContentText_User.classList.add("content-text");

                ContentLabel_User.textContent = 'User Name';
                ContentText_User.textContent = `${User['UserName']}`;

                ContentWrapper_User.appendChild(ContentLabel_User);
                ContentWrapper_User.appendChild(ContentText_User);

                const ContentWrapper_Email = document.createElement('div')
                ContentWrapper_Email.classList.add('content-wrapper')

                const ContentLabel_Email = document.createElement("div");
                ContentLabel_Email.classList.add("content-label");

                const ContentText_Email = document.createElement("div");
                ContentText_Email.classList.add("content-text");

                ContentLabel_Email.textContent = 'E Mail ID';
                ContentText_Email.textContent = `${User['EmailId']}`;

                ContentWrapper_Email.appendChild(ContentLabel_Email);
                ContentWrapper_Email.appendChild(ContentText_Email);

                const ContentWrapper_Name = document.createElement('div')
                ContentWrapper_Name.classList.add('content-wrapper')

                const ContentLabel_Name = document.createElement("div");
                ContentLabel_Name.classList.add("content-label");

                const ContentText_Name = document.createElement("div");
                ContentText_Name.classList.add("content-text");

                ContentLabel_Name.textContent = 'Name';
                ContentText_Name.textContent = `${User['FirstName']} ${User['LastName']}`;

                ContentWrapper_Name.appendChild(ContentLabel_Name);
                ContentWrapper_Name.appendChild(ContentText_Name);

                const ContentWrapper_Creds = document.createElement('div')
                ContentWrapper_Creds.classList.add('content-wrapper')

                const ContentLabel_Creds = document.createElement("div");
                ContentLabel_Creds.classList.add("content-label");

                const ContentText_Creds = document.createElement("div");
                ContentText_Creds.classList.add("content-text");

                ContentLabel_Creds.textContent = 'Owned Credentials';
                ContentText_Creds.textContent = `${result['UserCredentials'].filter((cred) => { return cred['CredentialType']['Owned'] }).length}`;

                ContentWrapper_Creds.appendChild(ContentLabel_Creds);
                ContentWrapper_Creds.appendChild(ContentText_Creds);

                const ContentWrapper_Vaults = document.createElement('div')
                ContentWrapper_Vaults.classList.add('content-wrapper')

                const ContentLabel_Vaults = document.createElement("div");
                ContentLabel_Vaults.classList.add("content-label");

                const ContentText_Vaults = document.createElement("div");
                ContentText_Vaults.classList.add("content-text");

                ContentLabel_Vaults.textContent = 'Shared Credentials';
                ContentText_Vaults.textContent = `${result['UserCredentials'].filter((cred) => { return cred['CredentialType']['Shared'] }).length}`;

                ContentWrapper_Vaults.appendChild(ContentLabel_Vaults);
                ContentWrapper_Vaults.appendChild(ContentText_Vaults);

                container.append(header)
                container.append(ContentWrapper_User)
                container.append(ContentWrapper_Email)
                container.append(ContentWrapper_Name)
                container.append(ContentWrapper_Creds)
                container.append(ContentWrapper_Vaults)
            }
        })
    } else if (view == 'UnsupportedPage') {
        let element = document.querySelector('div#Page.nav-item')
        element.classList.add('nav-selected')

        const contentWrapper1 = document.createElement("div");
        contentWrapper1.classList.add("content-wrapper");

        const contentLabel1 = document.createElement("div");
        contentLabel1.classList.add("content-label");

        const contentText1 = document.createElement("div");
        contentText1.classList.add("content-text");

        const contentWrapper2 = document.createElement("div");
        contentWrapper2.classList.add("content-wrapper");
        // contentWrapper2.setAttribute('data-wrapper-type', 'security-level');

        const contentLabel2 = document.createElement("div");
        contentLabel2.classList.add("content-label");
        contentLabel2.textContent = "Risk Factor";

        const contentText2 = document.createElement("div");
        contentText2.classList.add("content-text");


        const contentWrapper3 = document.createElement("div");
        contentWrapper3.classList.add("content-wrapper");

        // const contentLabel3 = document.createElement("div");
        // contentLabel3.classList.add("content-label");

        const contentText3 = document.createElement("div");
        contentText3.classList.add("content-text");

        // var contentWrapper4 = document.createElement("div");
        // contentWrapper4.classList.add("content-wrapper");

        // var contentLabel4 = document.createElement("div");
        // contentLabel4.classList.add("content-label");

        // var contentText4 = document.createElement("div");
        // contentText4.classList.add("content-text");

        contentLabel1.textContent = "Type";
        contentText1.textContent = 'Browser Native Document';
        contentWrapper2.setAttribute('data-risk-level', 'null');
        contentText2.textContent = "Browser Native Documents are Not applicable for Risk Analysis.";

        // contentText3.textContent = ''

        contentWrapper1.appendChild(contentLabel1);
        contentWrapper1.appendChild(contentText1);

        contentWrapper2.appendChild(contentLabel2);
        contentWrapper2.appendChild(contentText2);




        container.appendChild(contentWrapper1);
        container.appendChild(contentWrapper2);
    }
    return container
}