chrome.runtime.onInstalled.addListener(async () => {
    let url = 'https://demo.extension.encrypta.in/Release/V1.1.2'
    let tab = await chrome.tabs.create({
        url
    })
})

function LogHistory(url, Tab) {
    var time = new Date().getTime()
    chrome.storage.local.get(["History"], function (result) {
        if (!chrome.runtime.lastError) {
            Log = {
                'URL': url,
                'TIME': time,
                'ID': Tab
            }
            if (result.History == undefined) {
                history = []
            } else {
                history = result.History
            }
            if (history[history.length - 1]['ID'] == Tab && history[history.length - 1]['URL'] == url) {
                history[history.length - 1]['TIME'] = time
            }
            else {
                history.push(Log)
            }
            if (history.length > 1000) {
                history = history.slice(1000)
            }
            chrome.storage.local.set({
                History: history,
            }).then(() => { });
        }
    })
}


function ManageAuthenticationState() {
    sessionStorage.setItem('k', 'li')
    setTimeout(() => {
        var AuthState = sessionStorage.getItem('k')
        console.log(AuthState)
    }, 1000);
}


var CredBuffer = {}

let UserAuthentication = false

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action.Direction === "UP") {
        if (message.action.Request === "UserProfile") {
            if (message.Sync) {
                EstablishGatewayConnection((session) => {
                    if (session) {
                        UserProfile((User) => {
                            chrome.tabs.sendMessage(sender.tab.id, {
                                action: {
                                    Response: "UserProfile",
                                    Direction: "DOWN"
                                },
                                data: { 'Profile': User, 'Session': Session }
                            });
                        })
                    }
                    else {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: {
                                Response: "UserProfile",
                                Direction: "DOWN"
                            },
                            data: { 'Profile': null, 'Session': session }
                        });
                    }
                })
            }
            else {
                EstablishGatewayConnection((session) => {
                    chrome.storage.local.get(["UserProfile"], function (result) {
                        if (!chrome.runtime.lastError) {
                            chrome.tabs.sendMessage(sender.tab.id, {
                                action: {
                                    Response: "UserProfile",
                                    Direction: "DOWN"
                                },
                                data: { 'Profile': result.UserProfile, 'Session': session }
                            });
                        }
                    });
                })
            }
        } else if (message.action.Request === "UserCredentials") {
            if (message.Sync) {
                UserCredentials((credentials) => {
                    const data = []
                    for (i of credentials) {
                        if (i['Domain'].includes(message.domain)) {
                            data.push(i)
                        }
                    }
                    chrome.tabs.sendMessage(sender.tab.id, {
                        action: {
                            Response: "UserCredentials",
                            Direction: "DOWN"
                        },
                        data: data
                    });
                })
            }
            else {
                chrome.storage.local.get(["UserCredentials"], function (result) {
                    if (!chrome.runtime.lastError) {
                        const data = []
                        for (i of result.UserCredentials) {
                            if (i['Domain'].includes(message.domain)) {
                                data.push(i)
                            }
                        }
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: {
                                Response: "UserCredentials",
                                Direction: "DOWN"
                            },
                            data: data
                        });
                    }
                });
            }
        } else if (message.action.Request === 'CredentialNewAdd') {
            AddCredential(message.Credential, sender)
        } else if (message.action.Request === 'CredentialUpdate') {
            UpdateCredential(message.Credential, sender)
        } else if (message.action.Request === 'LogHistory') {
            LogHistory(message.URL, sender.tab.id)
        } else if (message.action.Request === 'PendingCredentialBuffer') {
            chrome.tabs.sendMessage(sender.tab.id, {
                action: {
                    Response: "PendingCredentialBuffer",
                    Direction: "DOWN"
                },
                data: CredBuffer
            });
        } else if (message.action.Request === 'SetCredentialBuffer') {
            CredBuffer = message.Credential
        } else if (message.action.Request === 'GeneratePassword') {
            GenerateCredential(sender, message.Parameters)
        }
        else if (message.action.Request === 'UserSession') {
            EstablishGatewayConnection((session) => {
                if (session) {
                    UserProfile((User) => {
                        chrome.runtime.sendMessage({
                            action: {
                                Response: 'UserSession',
                                Direction: 'DOWN'
                            },
                            data: { 'Session': session, 'User': User }
                        });
                    })
                }
                else {
                    chrome.runtime.sendMessage({
                        action: {
                            Response: 'UserSession',
                            Direction: 'DOWN'
                        },
                        data: { 'Session': session, 'User': null }
                    })
                }
            })
        }
        else if (message.action.Request === 'SecureSession') {
            chrome.storage.local.get(["AuthenticationExpiry"], (expiry) => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: {
                        Response: 'SecureSession',
                        Direction: 'DOWN'
                    },
                    data: { 'Secure': (expiry.AuthenticationExpiry - new Date().getTime()) > 0 }
                })
            })
        }
        else if (message.action.Request === 'RiskAnalysis') {
            EstablishGatewayConnection((session) => {
                if (session) {
                    RiskAnalysis(message.data['URL'], (type) => {
                        chrome.runtime.sendMessage({
                            action: {
                                Response: 'RiskAnalysis',
                                Direction: 'DOWN'
                            },
                            data: {'TYPE': type, 'Element': message.data['Element'], 'Wrapper': message.data['Wrapper']}
                        })
                    })
                }
            })

        }
        else if (message.action.Request === 'SynchronizeCredentials') {
            UserCredentials(() => {
                chrome.runtime.sendMessage({
                    action: {
                        Response: 'SynchronizeCredentials',
                        Direction: 'DOWN'
                    },
                    data: { 'Credential': null }
                })
            })
        }
    } else if (message.action.Direction === "DOWN") {

    }
});

function EstablishGatewayConnection(callback) {
    var myHeaders = new Headers();
    var data = {}
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(
            data
        ),
    };
    fetch("https://www.demo.extension.encrypta.in/API/Authorization/SessionInitiate", requestOptions).then((promise) => {
        promise.json().then((response) => {
            chrome.storage.session.set({
                ExtensionAPIGatewayKeys: response['ServerResponse']['SessionKey'],
            }).then(() => { });
            callback(response['ServerResponse']['Session'])
        })
    })
}



function UserProfile(Callback) {
    chrome.storage.session.get(["ExtensionAPIGatewayKeys"], (key) => {
        var myHeaders = new Headers();
        var data = {}
        myHeaders.append("Content-Type", "application/json");
        data["SessionKey"] = key['ExtensionAPIGatewayKeys'];
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(
                data
            ),
        };
        fetch("https://www.demo.extension.encrypta.in/API/User/Profile", requestOptions).then((promise) => {
            promise.json().then((response) => {
                chrome.storage.local.set({
                    UserProfile: response['ServerResponse']['User'],
                }).then(() => { });
                Callback(response['ServerResponse']['User'])
            })
        })
    })
}



function UserCredentials(Callback) {
    chrome.storage.session.get(["ExtensionAPIGatewayKeys"], (key) => {
        var myHeaders = new Headers();
        var data = {}
        myHeaders.append("Content-Type", "application/json");
        data["SessionKey"] = key['ExtensionAPIGatewayKeys'];
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(
                data
            ),
        };
        fetch("https://www.demo.extension.encrypta.in/API/User/Credentials", requestOptions).then((promise) => {
            promise.json().then((response) => {
                chrome.storage.local.set({
                    UserCredentials: response['ServerResponse']['Credentials'],
                }).then(() => { });
                Callback(response['ServerResponse']['Credentials'])
            })
        })
    })
}


function RiskAnalysis(url, Callback) {
    chrome.storage.session.get(["ExtensionAPIGatewayKeys"], async (key) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let RequestBody = JSON.stringify({
            'URL': url,
            'SessionKey': key['ExtensionAPIGatewayKeys']
        });
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: RequestBody,
        };
        fetch("https://www.demo.extension.encrypta.in/RiskAnalysis", requestOptions).then((promise) => {
            promise.json().then((response) => {
                Callback(response['ServerResponse']['TYPE'])
            })
        })
    })
}



function UpdateCredential(Credential, sender) {
    delete Credential['ActionExpiry']
    delete Credential['State_Update']
    delete Credential['State_New']
    var myHeaders1 = new Headers();
    myHeaders1.append("Content-Type", "application/json");
    var requestOptions1 = {
        method: "POST",
        headers: myHeaders1,
        body: JSON.stringify(
            Credential
        ),
    };
    fetch("https://www.demo.extension.encrypta.in/Edit/Credential", requestOptions1).then((promise) => {
        promise.json().then((response) => {
            console.log(response['ServerResponse'])
            // update storage
            // reset buffer
            if (response['ServerResponse']) {
                CredBuffer = {}
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: {
                        Request: "ResetBuffer",
                        Direction: "DOWN"
                    },
                });
                SyncCredentials()
            }
        })
    })
}

function AddCredential(Credential, sender) {
    delete Credential['ActionExpiry']
    delete Credential['State_Update']
    delete Credential['State_New']

    var myHeaders1 = new Headers();
    myHeaders1.append("Content-Type", "application/json");
    var requestOptions1 = {
        method: "POST",
        headers: myHeaders1,
        body: JSON.stringify(
            Credential
        ),
    };
    fetch("https://www.demo.extension.encrypta.in/Add/Credential", requestOptions1).then((promise) => {
        promise.json().then((response) => {
            console.log(response['ServerResponse'])
            // update storage
            if (response['ServerResponse']) {
                // reset buffer
                CredBuffer = {}
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: {
                        Request: "ResetBuffer",
                        Direction: "DOWN"
                    },
                });
                SyncCredentials()
            }
        })
    })
}


function GenerateCredential(sender, PasswordParameters) {
    delete PasswordParameters['Password']
    delete PasswordParameters['PasswordViewer']

    console.log(PasswordParameters)

    chrome.storage.session.get(["ExtensionAPIGatewayKeys"], (key) => {
        var myHeaders1 = new Headers();
        myHeaders1.append("Content-Type", "application/json");
        PasswordParameters["SessionKey"] = key['ExtensionAPIGatewayKeys'];

        var requestOptions1 = {
            method: "POST",
            headers: myHeaders1,
            body: JSON.stringify(
                PasswordParameters
            ),
            // redirect: "follow",
        };
        console.log(requestOptions1)

        fetch("https://www.demo.extension.encrypta.in/API/Generator/Password", requestOptions1).then((promise) => {
            promise.json().then((response) => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: {
                        Response: "PasswordGenerate",
                        Direction: "DOWN"
                    },
                    data: response['Response']
                });
            })
        })
    })
}