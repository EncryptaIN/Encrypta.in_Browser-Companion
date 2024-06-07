var View = {
    'State': false,
    'Content': {
        'SignUp': {
            'State': false,
            'Fields': {},
            'SinglePage': false,
            'MultiPage': false
        },
        'SignIn': {
            'SinglePage': false,
            'MultiPage': false,
            'Fields': {
                'UserName': null,
                'Password': null
            },
            'Submit': false
        }
    }
}



var Session = false
var accounts = []
var User = {}
var SecureSession = false


function CheckException(exception, value) {
    value = DomainRetriever(value)
    var exceptions = {
        'URL_Unchange': ['www.facebook.com', 'www.nitrkl.ac.in', 'adobe.com', 'irctc.co.in/'],
        'AutoSubmit_NA': ['www.zoho.in', 'www.google.com'],
        'UserInputReq': ['www.encrypta.in'],
        'SamePageIUOper': ['www.facebook.com'],
        'DelayedRender': ['www.digitalocean.com', 'www.instagram.com'],
        'AutoFill_NA': ['www.instagram.com', 'www.digitalocean.com']
    }
    return exceptions[exception].filter((url) => {
        return url.includes(value)
    }).length != 0
}



function SetPageType(MultiPage_Setting = false) {
    var Forms = document.forms
    var validinputel = []
    Forms = [...Forms].filter((element) => {
        return element.length >= 2
    }).slice(0, 1)
    for (let i = 0; i < Forms.length; i++) {
        var form = Forms[i]
        var FormElements = form.querySelectorAll('input')
        FormElements.forEach((element) => {
            if (element.type != 'hidden' && (element.type == 'email' || element.type == 'text' || element.type == 'password') && element.type != 'submit' && getComputedStyle(element).display != 'none') {
                validinputel.push(element)
            }
        })
    }
    // console.log((((validinputel.filter((element) => {
    //     return element.type == 'password'
    // })).length < 2) && ((validinputel.filter((element) => {
    //     return element.type == 'password'
    // })).length > 0)))
    // console.log(validinputel.filter((element) => {
    //     return element.type == 'password'
    // }))

    // console.log(((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter((e) => {
    //     return e.toLowerCase().includes('login')
    // })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter((e) => {
    //     return e.toLowerCase().includes('signin')
    // })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter(e => {
    //     return e.toLowerCase().includes('session')
    // })).length != 0))

    // console.log(((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter((e) => {
    //     return e.toLowerCase().includes('create')
    // })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter((e) => {
    //     return e.toLowerCase().includes('signup')
    // })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
    //     return e != ''
    // }).slice(2).filter(e => {
    //     return e.toLowerCase().includes('register')
    // })).length != 0))

    // console.log(validinputel)

    if (((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter((e) => {
        return e.toLowerCase().includes('login')
    })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter((e) => {
        return e.toLowerCase().includes('signin')
    })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter((e) => {
        return e.toLowerCase().includes('auth')
    })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter(e => {
        return e.toLowerCase().includes('session')
    })).length != 0) || (CheckException('URL_Unchange', location.host) && (((validinputel.filter((element) => {
        return element.type == 'password'
    })).length < 2) && ((validinputel.filter((element) => {
        return element.type == 'password'
    })).length > 0)))) {
        if ((validinputel.map((element) => {
            return [...element.attributes].map((e) => {
                return e.nodeValue
            }).filter((attr) => {
                attr = attr.toLowerCase();
                return attr.includes('mail') || attr.includes('pass') || attr.includes('user') || attr.includes('number') || attr.includes('login') || attr.includes('name') || attr.includes('identif')
            })
        }).filter((attributeArray) => {
            return attributeArray.length > 0
        }).length >= 2)) {

            // ElementPopulate(true, false, accounts)
            validinputel.forEach(element => {
                if (element.type == 'password') {
                    View['Content']['SignIn']['Fields']['Password'] = element
                }
                if (([...element.attributes].map((e) => {
                    return e.nodeValue
                }).filter((attr) => {
                    attr = attr.toLowerCase();
                    return attr.includes('mail') || attr.includes('user') || attr.includes('number') || attr.includes('login') || attr.includes('name') || attr.includes('identif')
                }).length != 0) && (element.type == 'text' || element.type == 'email' || element.type == 'number')) {
                    if (View['Content']['SignIn']['Fields']['UserName'] == null) {
                        View['Content']['SignIn']['Fields']['UserName'] = element
                    }
                }
                if (validinputel.length > 2) {
                    View['Content']['SignIn']['Submit'] = false
                } else {
                    View['Content']['SignIn']['Submit'] = true
                }
            });
            if (View['Content']['SignIn']['Fields']['UserName'] != null && View['Content']['SignIn']['Fields']['Password'] != null) {
                View['Content']['SignIn']['SinglePage'] = true
            }
        } else {
            validinputel.forEach(element => {
                if (MultiPage_Setting && element.type == 'password') {
                    View['Content']['SignIn']['Fields']['Password'] = element
                } else {
                    if (([...element.attributes].map((e) => {
                        return e.nodeValue
                    }).filter((attr) => {
                        attr = attr.toLowerCase();
                        return attr.includes('mail') || attr.includes('user') || attr.includes('number') || attr.includes('login') || attr.includes('name') || attr.includes('identif')
                    }).length != 0) && (element.type == 'text' || element.type == 'email' || element.type == 'number')) {
                        // flag = true
                        if (View['Content']['SignIn']['Fields']['UserName'] == null) {
                            View['Content']['SignIn']['Fields']['UserName'] = element
                        }
                    }
                }
            });
            if (View['Content']['SignIn']['Fields']['UserName'] != null) {
                View['Content']['SignIn']['MultiPage'] = true
            }
        }
        ElementPopulate(true, false, accounts) // todo: check

    } else if (((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter((e) => {
        return e.toLowerCase().includes('create')
    })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter((e) => {
        return e.toLowerCase().includes('signup')
    })).length != 0) || ((location.href.split('?')[0].split('/').filter((e) => {
        return e != ''
    }).slice(1).filter(e => {
        return e.toLowerCase().includes('regist')
    })).length != 0) || (CheckException('URL_Unchange', location.host) && ((validinputel.filter((element) => {
        return ([...element.attributes].map((attribute) => {
            return attribute.nodeValue
        }).filter((attr) => {
            attr = attr.toLowerCase()
            return ((attr.includes('first') && attr.includes('last')) || (attr.includes('full')) || (attr.includes('firstname') || attr.includes('first')) || (attr.includes('lastname') || attr.includes('last')) || (attr.includes('mail') || attr.includes('email')))
        }).length != 0)
    })).length > 0))) {
        View['Content']['SignUp']['State'] = true
        View['Content']['SignUp']['Fields'] = {}
        validinputel.forEach((element) => {
            if ([...element.attributes].map((e) => {
                return e.nodeValue
            }).filter((attr) => {
                attr = attr.toLowerCase();
                return (attr.includes('first') && attr.includes('last')) || (attr.includes('full'))
            }).length != 0) {
                View['Content']['SignUp']['Fields']['Name'] = element
            } else {
                if ([...element.attributes].map((e) => {
                    return e.nodeValue
                }).filter((attr) => {
                    attr = attr.toLowerCase();
                    return attr.includes('firstname') || attr.includes('first')
                }).length != 0) {
                    View['Content']['SignUp']['Fields']['FirstName'] = element
                }
                if ([...element.attributes].map((e) => {
                    return e.nodeValue
                }).filter((attr) => {
                    attr = attr.toLowerCase();
                    return attr.includes('lastname') || attr.includes('last')
                }).length != 0) {
                    View['Content']['SignUp']['Fields']['LastName'] = element
                }
            }
            if ([...element.attributes].map((e) => {
                return e.nodeValue
            }).filter((attr) => {
                attr = attr.toLowerCase();
                return attr.includes('mail') || attr.includes('email')
            }).length != 0) {
                View['Content']['SignUp']['Fields']['Email'] = element
            }
            if ([...element.attributes].map((e) => {
                return e.nodeValue
            }).filter((attr) => {
                attr = attr.toLowerCase();
                return attr.includes('user') && attr.includes('name')
            }).length != 0) {
                View['Content']['SignUp']['Fields']['UserName'] = element
            }
            if (element.type == 'password' && View['Content']['SignUp']['Fields']['Password'] == undefined) {
                View['Content']['SignUp']['Fields']['Password'] = element
            }
        });
        if (View['Content']['SignUp']['Fields']['Password'] == undefined) {
            View['Content']['SignUp']['MultiPage'] = true
            document.querySelectorAll('button, a').forEach((element) => {
                element.addEventListener('click', () => {
                    SetPageType()
                })
            })
            ElementPopulate(false, true, {
                ...User
            })
        } else {
            View['Content']['SignUp']['SinglePage'] = true
            ElementPopulate(false, true, {
                ...User,
                'Name': `${User['First Name']} ${User['Last Name']}`
            })
        }

    }
    if (CheckException('SamePageIUOper', location.host)) {
        if (View['Content']['SignIn']['SinglePage']) {
            document.querySelectorAll('button, a').forEach((element) => {
                element.addEventListener('click', () => {
                    setTimeout(() => {
                        SetPageType()
                    }, 2000);
                })
            })
        }
    }
    if (View.Content.SignIn.Fields.UserName != null) {
        View.Content.SignIn.Fields.UserName.form.addEventListener('submit', () => {
            // check if values is not eq to existing account
            // set buffer
            if (View['Content']['SignIn']['Fields']['UserName'].value.length != 0 && View['Content']['SignIn']['Fields']['Password'].value.length != 0) {
                // console.log(accounts)
                var SecuredCredential = accounts.filter((cred) => {
                    return cred['UserName'].toLowerCase() == View.Content.SignIn.Fields.UserName.value.toLowerCase()
                })
                console.log(SecuredCredential)
                var expiry = new Date().getTime() + ((5) * (60 * 1000))
                if (SecuredCredential.length == 0) {
                    SetBufferCredential({
                        'UserName': View['Content']['SignIn']['Fields']['UserName'].value,
                        'Password': View['Content']['SignIn']['Fields']['Password'].value,
                        'PageURL': location.href,
                        'Domain': 'www.' + DomainRetriever(location.hostname),
                        'State_New': true,
                        'State_Update': false,
                        'ActionExpiry': expiry
                    })
                } else if (SecuredCredential.length == 1 && (SecuredCredential[0]['Password'] != View['Content']['SignIn']['Fields']['Password'].value)) {
                    SetBufferCredential({
                        'UserName': View['Content']['SignIn']['Fields']['UserName'].value,
                        'Password': View['Content']['SignIn']['Fields']['Password'].value,
                        'CredentialID': SecuredCredential[0]['CredentialID'],
                        'PageURL': location.href,
                        'Domain': 'www.' + DomainRetriever(location.hostname),
                        'State_New': false,
                        'State_Update': true,
                        'ActionExpiry': expiry
                    })
                } else {
                    // console.log('unused attempt')
                }
            } else { }
        })
    }
}

// draggable




function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function CredentialChange() {

}

chrome.runtime.sendMessage({
    action: {
        Request: "PendingCredentialBuffer",
        Direction: 'UP'
    }
});


function PopUpCredentialAction(Credential) {
    if (document.getElementById('Action-popup') != null) {
        document.body.removeChild(document.getElementById('Action-popup'))
    }
    var popup = document.createElement('div')
    popup.classList.add('popup')
    setTimeout(() => {
        popup.classList.add('visible')
    }, 100);
    popup.id = 'Action-popup'

    var title = document.createElement('div')
    title.classList.add('title')
    var subtitle = document.createElement('div')
    subtitle.classList.add('subtitle')
    if (Credential['State_Update'] && !Credential['State_New']) {
        // update cred
        title.innerHTML = '<h3>Changed Password?</h3>'
        // subtitle.innerHTML = '<h4>Do you want to Update your Credential in  <div>Encrypta Password Manager?</div></h4>'
        subtitle.innerHTML = '<h4>Update your Credential in <div>Encrypta Password Manager?</div></h4>'
    } else if (!Credential['State_Update'] && Credential['State_New']) {
        // new cred
        title.innerHTML = '<h3>New Account!</h3>'
        // subtitle.innerHTML = '<h4>Do you want to Save the Credential in <div>Encrypta Password Manager ?</div></h4>'
        subtitle.innerHTML = '<h4>Save the Credential in <div>Encrypta Password Manager?</div></h4>'
    }

    var Cred_wrapper_username = document.createElement('div')
    Cred_wrapper_username.classList.add('Credential-Wrapper')

    var CredLabel_Username = document.createElement('div')
    CredLabel_Username.classList.add('label')
    CredLabel_Username.innerHTML = `User Name`

    var CredItem_Username = document.createElement('div')
    CredItem_Username.classList.add('item-Wrapper')
    CredItem_Username.innerHTML = `<b>${Credential['UserName']}</b>`

    Cred_wrapper_username.append(CredLabel_Username)
    Cred_wrapper_username.append(CredItem_Username)

    var Cred_wrapper_password = document.createElement('div')
    Cred_wrapper_password.classList.add('Credential-Wrapper')

    // var CredItem_Password = document.createElement('div')
    var TextWrap = document.createElement('div')
    TextWrap.classList.add('item-Wrapper')

    var CredItem_Password = document.createElement('div')
    CredItem_Password.classList.add('text-wrap')

    // CredItem_Password.classList.add('Credential')
    CredItem_Password.innerHTML = 'Encrypta Secured'
    TextWrap.append(CredItem_Password)

    var CredLabel_Password = document.createElement('div')
    CredLabel_Password.classList.add('label')
    CredLabel_Password.innerHTML = 'Password'

    var ActionWrapper = document.createElement('div')
    ActionWrapper.classList.add('action-wrapper')
    var ActionBtn = document.createElement('div')
    ActionBtn.classList.add('action-text')
    ActionBtn.addEventListener('click', (e) => {
        ToggleVisibility(ActionBtn, CredItem_Password, Credential['Password'])
    })

    ActionBtn.innerText = 'Show'
    ActionWrapper.append(ActionBtn)
    TextWrap.append(ActionWrapper)
    // CredItem_Password.append(ActionWrapper)

    Cred_wrapper_password.append(CredLabel_Password)
    // Cred_wrapper_password.append(CredItem_Password)
    Cred_wrapper_password.append(TextWrap)

    var Buttonwrapper = document.createElement('div')
    Buttonwrapper.classList.add('Credential-Wrapper')
    Buttonwrapper.style.justifyContent = 'space-evenly'
    Buttonwrapper.style.margin = '0.8rem 0'
    var Confirm_Btn = document.createElement('button')
    Confirm_Btn.classList.add('btn', 'btn-1', 'btn-main')
    Confirm_Btn.innerText = 'Add'
    Confirm_Btn.addEventListener('click', () => {
        UpdateBufferCredential(Credential)
    })

    var Cancel_Btn = document.createElement('button')
    Cancel_Btn.classList.add('btn', 'btn-1', 'btn-main')
    Cancel_Btn.innerText = 'Cancel'
    Cancel_Btn.addEventListener('click', () => {
        ResetBufferCredential()
        popup.classList.remove('visible')
    })

    Buttonwrapper.append(Confirm_Btn, Cancel_Btn)

    popup.append(title)
    popup.append(subtitle)
    popup.append(Cred_wrapper_username)
    popup.append(Cred_wrapper_password)
    popup.append(Buttonwrapper)
    document.body.append(popup)
}

function ToggleVisibility(btn, element, text) {
    var Visibility = btn.innerText == 'Hide'
    if (Visibility) {
        btn.innerText = 'Show'
        element.innerHTML = 'Encrypta Secured'
    } else {
        btn.innerText = 'Hide'
        element.innerHTML = `<b>${text}</b>`
    }
}

function SetBufferCredential(Credential) {
    chrome.runtime.sendMessage({
        action: {
            Request: "SetCredentialBuffer",
            Direction: 'UP'
        },
        Credential: Credential
    });
}

function ResetBufferCredential() {
    chrome.runtime.sendMessage({
        action: {
            Request: "SetCredentialBuffer",
            Direction: 'UP'
        },
        Credential: {}
    });
}


function UpdateBufferCredential(credential) {
    if (credential['State_Update'] && !credential['State_New']) {
        // send request to encrypta modify

        chrome.runtime.sendMessage({
            action: {
                Request: "CredentialUpdate",
                Direction: 'UP'
            },
            Credential: credential
        });


    } else if (!credential['State_Update'] && credential['State_New']) {
        // send request to encrypta add
        chrome.runtime.sendMessage({
            action: {
                Request: "CredentialNewAdd",
                Direction: 'UP'
            },
            Credential: credential
        });
    }
    console.log(credential)
}

function DomainRetriever(url = '') {
    var result = {};
    if (/\d/.test(url.split('.')[url.split('.').length - 1])) {
        return url
    } else {

        var regexParse = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
        var urlParts = regexParse.exec(url);
        result.domain = urlParts[1];
        result.type = urlParts[2];
        result.subdomain = url.replace(result.domain + '.' + result.type, '').slice(0, -1);
        return result.domain + '.' + result.type;
    }
}




// Handle the retrieved data
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action.Direction === 'DOWN') {
        if ('Response' in message.action) {
            if (message.action.Response === "UserProfile") {
                Session = message.data['Session']
                GetUserCredential(Session)
                User = message.data['Profile']
                SetPageType()
                // console.log("Retrieved data:", data);
            } else if (message.action.Response === 'UserCredentials') {
                const data = message.data;
                accounts = data
                SetPageType()
                // console.log("Retrieved data:", data);
            } else if (message.action.Response === 'PasswordGenerate') {
                const data = message.data;
                UpdatePasswordGenerator(data)
                // console.log("Retrieved data:", data);
            } else if (message.action.Response == 'PendingCredentialBuffer') {
                const data = message.data;
                var time = new Date().getTime()
                if (Object.keys(data).length != 0 && time < data['ActionExpiry']) {
                    PopUpCredentialAction(data)
                } else {
                    ResetBufferCredential()
                }
                console.log("Retrieved data:", data);
            } else if (message.action.Response == 'SecureSession') {
                SecureSession = message.data['Secure']
            }
        }
        else if ('Request' in message.action) {
            if (message.action.Request === 'ResetBuffer') {
                var popup = document.getElementById('Action-popup')
                popup.classList.remove('visible')
            } else if (message.action.Request === 'CurrentPage') {
                chrome.runtime.sendMessage({
                    action: {
                        Response: "CurrentPage",
                        Direction: 'UP'
                    },
                    data: location
                });
            }

        }

    }
});



function GetUserCredential(Sync){
    chrome.runtime.sendMessage({
        action: {
            Request: "UserCredentials",
            Direction: 'UP'
        },
        domain: DomainRetriever(location.hostname),
        Sync: Sync
    });
}

function Initiator() {
    setTimeout(() => {
        if (CheckException('DelayedRender', location.host)) {
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    action: {
                        Request: "UserProfile",
                        Direction: 'UP'
                    },
                    Sync: false
                });
            }, 500);
        } else {
            chrome.runtime.sendMessage({
                action: {
                    Request: "UserProfile",
                    Direction: 'UP'
                },
                Sync: false
            });
        }

        chrome.runtime.sendMessage({
            action: {
                Request: "LogHistory",
                Direction: 'UP'
            },
            URL: location.href
        });

        chrome.runtime.sendMessage({
            action: {
                Request: "SecureSession",
                Direction: 'UP'
            },
        });
    }, 500);
}


Initiator()


setTimeout(() => {
    chrome.runtime.sendMessage({
        action: "SyncData"
    });
    setTimeout(() => {
        chrome.runtime.sendMessage({
            action: "retrieveData",
            domain: location.hostname.split('.')[location.hostname.split('.').length - 2] + '.' + location.hostname.split('.')[location.hostname.split('.').length - 1]
        });
    }, 1000);
}, 5000);


function AccountSelect(Account, Credential = true) {
    if (CheckException('AutoFill_NA', location.host)) {
        ManualAction_Assistance(Account, false, true)
    } else if (View['Content']['SignIn']['SinglePage']) {
        View['Content']['SignIn']['Fields']['UserName'].value = Account['UserName']
        View['Content']['SignIn']['Fields']['Password'].value = Account['Password']
    } else if (View['Content']['SignIn']['MultiPage']) {
        // get the password field
        if (CheckException('UserInputReq', location.host)) {
            View['Content']['SignIn']['Fields']['UserName'].value = Account['UserName'].slice(0, Account['UserName'].length - 1)
            ManualAction_Assistance(Account, true)
            View['Content']['SignIn']['Fields']['UserName'].focus()
        } else {
            View['Content']['SignIn']['Fields']['UserName'].value = Account['UserName']
            SetPageType(true)
        }
    }

    // console.log(Account)
    if (View['Content']['SignIn']['Submit'] || View['Content']['SignIn']['MultiPage']) {
        if (View['Content']['SignIn']['MultiPage']) {
            if (CheckException('AutoSubmit_NA', location.host)) {
                ManualAction_Assistance(Account)
            } else {
                View['Content']['SignIn']['Fields']['UserName'].form.querySelector("button[type='submit']").click()
            }
            // document.querySelector("button[type='submit']").click()
        } else {
            View['Content']['SignIn']['Fields']['UserName'].form.submit()
        }
    }

}

function ManualAction_Assistance(Account, UserInput = false, ManualOperation = false) {
    var assistant_wrapper = document.getElementById('Encrypta-Assistant-viewer-container')
    assistant_wrapper.innerHTML = ''

    var Wrapper = document.createElement('div')
    Wrapper.classList.add('exception-container')

    var head = document.createElement('div')
    head.classList.add('Header')
    head.innerHTML = `<h3>${Account['UserName']}</h3>`

    var Title = document.createElement('div')
    if (ManualOperation) {
        Title.innerHTML = '<h5>We aren\'t able to Perform Auto fill!</h5>'
    } else {
        Title.innerHTML = '<h5>We aren\'t able to Perform Auto Submit!</h5>'
    }
    Title.classList.add('title')

    var subtitle = document.createElement('div')
    subtitle.classList.add('subtitle')

    if (UserInput) {
        subtitle.innerHTML = `<h5>Enter '<b>${Account['UserName'].slice(Account['UserName'].length - 1)}</b>'. Click next and paste the password!</h5>`
    } else {
        if (ManualOperation) {
            subtitle.innerHTML = '<h5>Paste the username followed by copying and pasting the password password!</h5>'
        } else {
            subtitle.innerHTML = '<h5>Click next and paste the password!</h5>'
        }
    }


    // var CredentialWrap = document.createElement('div')
    // CredentialWrap.classList.add('Credential-Wrapper')
    // var Credentialitem = document.createElement('div')
    // Credentialitem.classList.add('Credential')
    // Credentialitem.innerHTML = `<b>Password: ${Account['Password']}</b>`
    // Credentialitem.innerHTML = `<b>Password: Encrypta Secured</b>`

    // var actionwrap = document.createElement('div')
    // actionwrap.classList.add('action-wrapper')

    // var actionbtn = document.createElement('div')
    // actionbtn.classList.add('action-text')
    // actionbtn.addEventListener('click', (e) => {
    //     Copy(e, Account['Password'])
    // })
    if (ManualOperation) {
        // pass
        var CredentialWrapPassword = document.createElement('div')
        CredentialWrapPassword.classList.add('Credential-Wrapper')
        var Credentialitem_Password = document.createElement('div')
        Credentialitem_Password.classList.add('Credential')
        Credentialitem_Password.innerHTML = `<b>Password: ${Account['Password']}</b>`
        Credentialitem_Password.innerHTML = `<b>Password: Encrypta Secured</b>`

        var actionwrap_password = document.createElement('div')
        actionwrap_password.classList.add('action-wrapper')

        var actionbtn_password = document.createElement('div')
        actionbtn_password.classList.add('action-text')
        actionbtn_password.addEventListener('click', (e) => {
            Copy(e, Account['Password'])
        })


        // username
        var CredentialWrapUserName = document.createElement('div')
        CredentialWrapUserName.classList.add('Credential-Wrapper')
        var Credentialitem_Username = document.createElement('div')
        Credentialitem_Username.classList.add('Credential')
        Credentialitem_Username.innerHTML = `<b>UserName: ${Account['UserName']}</b>`
        Credentialitem_Username.title = `${Account['UserName']}`

        var actionwrap_Username = document.createElement('div')
        actionwrap_Username.classList.add('action-wrapper')

        var actionbtn_Username = document.createElement('div')
        actionbtn_Username.classList.add('action-text')
        actionbtn_Username.addEventListener('click', (e) => {
            Copy(e, Account['UserName'])
        })

        setTimeout(() => {
            actionbtn_Username.click()
        }, 500);

        actionbtn_Username.innerText = 'Copy'
        actionwrap_Username.append(actionbtn_Username)

        actionbtn_password.innerText = 'Copy'
        actionwrap_password.append(actionbtn_password)

        CredentialWrapUserName.append(Credentialitem_Username)
        CredentialWrapUserName.append(actionwrap_Username)

        CredentialWrapPassword.append(Credentialitem_Password)
        CredentialWrapPassword.append(actionwrap_password)
    } else {
        // pass
        var CredentialWrapPassword = document.createElement('div')
        CredentialWrapPassword.classList.add('Credential-Wrapper')
        var Credentialitem_Password = document.createElement('div')
        Credentialitem_Password.classList.add('Credential')
        Credentialitem_Password.innerHTML = `<b>Password: ${Account['Password']}</b>`
        Credentialitem_Password.innerHTML = `<b>Password: Encrypta Secured</b>`

        var actionwrap_password = document.createElement('div')
        actionwrap_password.classList.add('action-wrapper')

        var actionbtn_password = document.createElement('div')
        actionbtn_password.classList.add('action-text')
        actionbtn_password.addEventListener('click', (e) => {
            Copy(e, Account['Password'])
        })

        setTimeout(() => {
            actionbtn_password.click()
        }, 500);

        actionbtn_password.innerText = 'Copy'
        actionwrap_password.append(actionbtn_password)


        CredentialWrapPassword.append(Credentialitem_Password)
        CredentialWrapPassword.append(actionwrap_password)

    }

    Wrapper.append(head)
    Wrapper.append(Title)
    Wrapper.append(subtitle)
    if (ManualOperation) {
        Wrapper.append(CredentialWrapUserName)
        Wrapper.append(CredentialWrapPassword)
    } else {
        Wrapper.append(CredentialWrapPassword)
    }


    assistant_wrapper.append(Wrapper)
}


function ProfileValueSelect(key, value) {
    View['Content']['SignUp']['Fields'][key].value = value
}






var GeneratorState = {
    'length': 12,
    'lowercase': true,
    'pronounceable': false,
    'ReplaceChar': false,
    'uppercase': true,
    'numeric': true,
    'symbols': false,
    'Password': '',
    "PasswordViewer": null,
    'UserCentric': false
}



function GetIndex(l, char) {
    var index = []
    for (var i = 0; i < l.length; i++) {
        if (char == l[i]) {
            index.push(i)
        }
    }
    return index
}


function OnChange(event) {
    var eventelement = event.target
    var formelement = document.getElementById('form-main')
    var d = {
        'lowercase': formelement.LCase.checked,
        'symbols': formelement.Symbols.checked,
        'numeric': formelement.Numeric.checked,
        'uppercase': formelement.UCase.checked
    }
    // this.GeneratorState['length'] = formelement.GenLength.value
    // this.GeneratorState['lowercase'] = formelement.LCase.checked
    // this.GeneratorState['uppercase'] = formelement.UCase.checked
    // this.GeneratorState['numeric'] = formelement.Numeric.checked
    // this.GeneratorState['symbols'] = formelement.Symbols.checked
    var keys = []
    var values = []
    Object.entries(d).forEach(val => {
        values.push(val[1])
        keys.push(val[0])
    })
    var rev_d = {}
    for (var i = 0; i < 5; i++) {
        rev_d[values[i]] = keys[i]
    }
    var k = values.filter((e) => {
        return e == true
    }).length
    if (k == 1) {
        var l = this.GetIndex(values, true)
        l.forEach(val => {
            if (keys[val] != eventelement.name) {
                switch (keys[val]) {
                    case 'lowercase': {
                        formelement.LCase.disabled = true
                        break
                    }
                    case 'uppercase': {
                        formelement.UCase.disabled = true
                        break
                    }
                    case 'symbols': {
                        formelement.Symbols.disabled = true
                        break
                    }
                    case 'numeric': {
                        formelement.Numeric.disabled = true
                        break
                    }
                    case 'RepChar': {
                        formelement.RepChar.disabled = true
                        break
                    }
                }
            }
        })
    } else {
        formelement.LCase.disabled = false
        formelement.UCase.disabled = false
        formelement.Symbols.disabled = false
        // formelement.WSpace.disabled = false
        formelement.Numeric.disabled = false
    }
    // if (this.GeneratorState['pronounceable']){


    if (this.GeneratorState['length'] < 8) {
        if (this.GeneratorState.pronounceable && this.GeneratorState.UserCentric) {
            if (eventelement.name == 'UserCentric') {
                this.GeneratorState.pronounceable = false
            } else {
                this.GeneratorState.UserCentric = false
            }
            // if (eventelement.name == 'Pron'){
            // }
        }

    }
    // if (this.GeneratorState['pronounceable'] && this.GeneratorState['length'] > 8){
    //   this.GeneratorState.UserCentric = false
    // }
    // else{
    //   if (this.GeneratorState.UserCentric && this.GeneratorState.pronounceable){
    //     this.GeneratorState.UserCentric = !this.GeneratorState.pronounceable
    //   }
    // }
    // console.log(GeneratorState)

    chrome.runtime.sendMessage({
        action: {
            Request: "GeneratePassword",
            Direction: 'UP'
        },
        Parameters: GeneratorState
    })
    //   this.SendServer()
}




function UpdatePasswordGenerator(password) {
    GeneratorState.Password = password
    GeneratorState.PasswordViewer.focus()
    GeneratorState.PasswordViewer.value = password
}


function PasswordGenerator() {
    if (document.getElementById('Encrypta-Assistant') != null) {
        document.body.removeChild(document.getElementById('Encrypta-Assistant'))
    }
    var assistantconatiner = document.createElement('div')
    assistantconatiner.classList.add('Assistant-container')
    assistantconatiner.id = 'Encrypta-Assistant'
    var TogglerIconEl = document.createElement('div')
    TogglerIconEl.classList.add('Assistant-Tray-icon')
    TogglerIconEl.innerHTML = 'E'

    ContextMenuPopulate(TogglerIconEl, { 'Generator': true })

    // dragElement(assistantconatiner)

    TogglerIconEl.addEventListener('click', (e) => {
        console.log(e.target)
    })

    var TrayContainer = document.createElement('div')
    TrayContainer.classList.add('Assistant-Tray-container')
    var HeaderContainer = document.createElement('div')
    var GeneratorContainer = document.createElement('div')
    GeneratorContainer.id = 'Encrypta-Assistant-viewer-container'
    HeaderContainer.classList.add('Assistant-Header')
    HeaderContainer.innerHTML = `<h4>Password Generator</h4><h6>by Encrypta</h6>`
    GeneratorContainer.classList.add('Account-Container')

    var PasswordWrap = document.createElement('div')
    PasswordWrap.classList.add('Generator-Face')

    // input container
    var InputContainer = document.createElement('div')
    InputContainer.classList.add('input-container')
    var PasswordViewer = document.createElement('input')
    PasswordViewer.addEventListener('focus', (e) => {
        OnFocus(e)
    })
    PasswordViewer.addEventListener('blur', (e) => {
        OnBlur(e)
    })
    PasswordViewer.classList.add('input-element')
    var placeholder = document.createElement('div')
    placeholder.innerText = 'Password'
    placeholder.classList.add('placeholder')
    GeneratorState.PasswordViewer = PasswordViewer
    InputContainer.append(PasswordViewer)
    InputContainer.append(placeholder)





    var actionwrap = document.createElement('div')
    actionwrap.classList.add('action-wrapper')

    var actionbtn = document.createElement('div')
    actionbtn.classList.add('action-text')
    actionbtn.addEventListener('click', (e) => {
        Copy(e, PasswordViewer.value)
    })

    actionbtn.innerText = 'Copy'
    actionwrap.append(actionbtn)

    PasswordWrap.append(InputContainer)
    PasswordWrap.append(actionwrap)






    // input container

    var LengthParameterWrap = document.createElement('div')
    LengthParameterWrap.classList.add('Parameter-Wrapper')


    var RangeWrap = document.createElement('div')
    RangeWrap.classList.add('Range-Wrapper')

    var RangeElement = document.createElement('input')
    RangeElement.type = 'range'
    RangeElement.value = GeneratorState['length']
    RangeElement.setAttribute('min', '4')
    RangeElement.setAttribute('max', '65')
    RangeElement.classList.add('range')
    RangeWrap.append(RangeElement)

    var LengthDisplay = document.createElement('div')
    LengthDisplay.classList.add('Length-Display')
    LengthDisplay.innerText = RangeElement.value


    // RangeElement.addEventListener('change', (e)=>{
    RangeElement.addEventListener('input', (e) => {
        LengthDisplay.innerText = e.target.value
        GeneratorState['length'] = parseInt(e.target.value)
        OnChange(e)
    })

    LengthParameterWrap.append(RangeWrap)
    LengthParameterWrap.append(LengthDisplay)


    var form = document.createElement('form')
    form.id = 'form-main'
    form.classList.add('Parameter-Wrap')

    // option 1 - uc
    var UC_ParameterWrap = document.createElement('div')
    UC_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var UC_Labelwrap = document.createElement('div')
    UC_Labelwrap.innerText = 'Include Uppercase'
    UC_Labelwrap.title = 'Include Uppercase Characters in password'
    UC_Labelwrap.classList.add('label-wrap')

    // toggler
    var UC_toggle_Wrapper = document.createElement('div')
    UC_toggle_Wrapper.classList.add('toggler-m')

    var UC_switch_label = document.createElement('label')
    UC_switch_label.classList.add('switch')

    var UC_toggle = document.createElement('input')
    UC_toggle.type = 'checkbox'
    UC_toggle.name = 'UCase'
    UC_toggle.checked = GeneratorState['uppercase']
    UC_toggle.addEventListener('change', (e) => {
        GeneratorState['uppercase'] = e.target.checked
        OnChange(e)
    })

    var UC_slider = document.createElement('span')
    UC_slider.classList.add('slider', 'round')

    UC_switch_label.append(UC_toggle)
    UC_switch_label.append(UC_slider)

    UC_toggle_Wrapper.append(UC_switch_label)


    UC_ParameterWrap.append(UC_Labelwrap)
    UC_ParameterWrap.append(UC_toggle_Wrapper)




    // option 1 - lc
    var LC_ParameterWrap = document.createElement('div')
    LC_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var LC_Labelwrap = document.createElement('div')
    LC_Labelwrap.innerText = 'Include Lowercase'
    LC_Labelwrap.title = 'Include Lowercase Characters in password'
    LC_Labelwrap.classList.add('label-wrap')

    // toggler
    var LC_toggle_Wrapper = document.createElement('div')
    LC_toggle_Wrapper.classList.add('toggler-m')

    var LC_switch_label = document.createElement('label')
    LC_switch_label.classList.add('switch')

    var LC_toggle = document.createElement('input')
    LC_toggle.type = 'checkbox'
    LC_toggle.name = 'LCase'
    LC_toggle.checked = GeneratorState['lowercase']
    LC_toggle.addEventListener('change', (e) => {
        GeneratorState['lowercase'] = e.target.checked
        OnChange(e)
    })

    var LC_slider = document.createElement('span')
    LC_slider.classList.add('slider', 'round')

    LC_switch_label.append(LC_toggle)
    LC_switch_label.append(LC_slider)

    LC_toggle_Wrapper.append(LC_switch_label)


    LC_ParameterWrap.append(LC_Labelwrap)
    LC_ParameterWrap.append(LC_toggle_Wrapper)




    // option 1 - num
    var NUM_ParameterWrap = document.createElement('div')
    NUM_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var NUM_Labelwrap = document.createElement('div')
    NUM_Labelwrap.innerText = 'Include Numbers'
    NUM_Labelwrap.title = 'Include Numeric Characters in password'
    NUM_Labelwrap.classList.add('label-wrap')

    // toggler
    var NUM_toggle_Wrapper = document.createElement('div')
    NUM_toggle_Wrapper.classList.add('toggler-m')

    var NUM_switch_label = document.createElement('label')
    NUM_switch_label.classList.add('switch')

    var NUM_toggle = document.createElement('input')
    NUM_toggle.type = 'checkbox'
    NUM_toggle.name = 'Numeric'
    NUM_toggle.checked = GeneratorState['numeric']
    NUM_toggle.addEventListener('change', (e) => {
        GeneratorState['numeric'] = e.target.checked
        OnChange(e)
    })

    var NUM_slider = document.createElement('span')
    NUM_slider.classList.add('slider', 'round')

    NUM_switch_label.append(NUM_toggle)
    NUM_switch_label.append(NUM_slider)

    NUM_toggle_Wrapper.append(NUM_switch_label)


    NUM_ParameterWrap.append(NUM_Labelwrap)
    NUM_ParameterWrap.append(NUM_toggle_Wrapper)




    // option 1 - s_char
    var S_CHAR_ParameterWrap = document.createElement('div')
    S_CHAR_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var S_CHAR_Labelwrap = document.createElement('div')
    S_CHAR_Labelwrap.innerText = 'Include Special Characters'
    S_CHAR_Labelwrap.title = 'Include Special Characters in password'
    S_CHAR_Labelwrap.classList.add('label-wrap')

    // toggler
    var S_CHAR_toggle_Wrapper = document.createElement('div')
    S_CHAR_toggle_Wrapper.classList.add('toggler-m')

    var S_CHAR_switch_label = document.createElement('label')
    S_CHAR_switch_label.classList.add('switch')

    var S_CHAR_toggle = document.createElement('input')
    S_CHAR_toggle.type = 'checkbox'
    S_CHAR_toggle.name = 'Symbols'
    S_CHAR_toggle.checked = GeneratorState['symbols']
    S_CHAR_toggle.addEventListener('change', (e) => {
        GeneratorState['symbols'] = e.target.checked
        OnChange(e)
    })

    var S_CHAR_slider = document.createElement('span')
    S_CHAR_slider.classList.add('slider', 'round')

    S_CHAR_switch_label.append(S_CHAR_toggle)
    S_CHAR_switch_label.append(S_CHAR_slider)

    S_CHAR_toggle_Wrapper.append(S_CHAR_switch_label)


    S_CHAR_ParameterWrap.append(S_CHAR_Labelwrap)
    S_CHAR_ParameterWrap.append(S_CHAR_toggle_Wrapper)




    // option 1 - pron
    var PRON_ParameterWrap = document.createElement('div')
    PRON_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var PRON_Labelwrap = document.createElement('div')
    PRON_Labelwrap.innerText = 'Pronounceable Phrases'
    PRON_Labelwrap.title = 'Password will Include Pronounceable phrases'
    PRON_Labelwrap.classList.add('label-wrap')

    // toggler
    var PRON_toggle_Wrapper = document.createElement('div')
    PRON_toggle_Wrapper.classList.add('toggler-m')

    var PRON_switch_label = document.createElement('label')
    PRON_switch_label.classList.add('switch')

    var PRON_toggle = document.createElement('input')
    PRON_toggle.type = 'checkbox'
    PRON_toggle.name = 'pronounceable'
    PRON_toggle.checked = GeneratorState['pronounceable']
    PRON_toggle.addEventListener('change', (e) => {
        GeneratorState['pronounceable'] = e.target.checked
        OnChange(e)
    })

    var PRON_slider = document.createElement('span')
    PRON_slider.classList.add('slider', 'round')

    PRON_switch_label.append(PRON_toggle)
    PRON_switch_label.append(PRON_slider)

    PRON_toggle_Wrapper.append(PRON_switch_label)


    PRON_ParameterWrap.append(PRON_Labelwrap)
    PRON_ParameterWrap.append(PRON_toggle_Wrapper)




    // option 1 - v_s_char
    var V_S_CHAR_ParameterWrap = document.createElement('div')
    V_S_CHAR_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var V_S_CHAR_Labelwrap = document.createElement('div')
    V_S_CHAR_Labelwrap.innerText = 'Replace Visually Similar Characters'
    V_S_CHAR_Labelwrap.title = 'Replace Visually Similar Characters'
    V_S_CHAR_Labelwrap.classList.add('label-wrap')

    // toggler
    var V_S_CHAR_toggle_Wrapper = document.createElement('div')
    V_S_CHAR_toggle_Wrapper.classList.add('toggler-m')

    var V_S_CHAR_switch_label = document.createElement('label')
    V_S_CHAR_switch_label.classList.add('switch')

    var V_S_CHAR_toggle = document.createElement('input')
    V_S_CHAR_toggle.type = 'checkbox'
    V_S_CHAR_toggle.name = 'RepChar'
    V_S_CHAR_toggle.checked = GeneratorState['ReplaceChar']
    V_S_CHAR_toggle.addEventListener('change', (e) => {
        GeneratorState['ReplaceChar'] = e.target.checked
        OnChange(e)
    })

    var V_S_CHAR_slider = document.createElement('span')
    V_S_CHAR_slider.classList.add('slider', 'round')

    V_S_CHAR_switch_label.append(V_S_CHAR_toggle)
    V_S_CHAR_switch_label.append(V_S_CHAR_slider)

    V_S_CHAR_toggle_Wrapper.append(V_S_CHAR_switch_label)


    V_S_CHAR_ParameterWrap.append(V_S_CHAR_Labelwrap)
    V_S_CHAR_ParameterWrap.append(V_S_CHAR_toggle_Wrapper)




    // option 1 - user_centric
    var USER_CENTRIC_ParameterWrap = document.createElement('div')
    USER_CENTRIC_ParameterWrap.classList.add('Parameter-Wrapper')

    // label
    var USER_CENTRIC_Labelwrap = document.createElement('div')
    USER_CENTRIC_Labelwrap.innerText = 'Include Personal Details'
    USER_CENTRIC_Labelwrap.title = 'Password will Include Phrases in relation to you.'
    USER_CENTRIC_Labelwrap.classList.add('label-wrap')

    // toggler
    var USER_CENTRIC_toggle_Wrapper = document.createElement('div')
    USER_CENTRIC_toggle_Wrapper.classList.add('toggler-m')

    var USER_CENTRIC_switch_label = document.createElement('label')
    USER_CENTRIC_switch_label.classList.add('switch')

    var USER_CENTRIC_toggle = document.createElement('input')
    USER_CENTRIC_toggle.type = 'checkbox'
    USER_CENTRIC_toggle.name = 'UserCentric'
    USER_CENTRIC_toggle.checked = GeneratorState['UserCentric']
    USER_CENTRIC_toggle.addEventListener('change', (e) => {
        GeneratorState['UserCentric'] = e.target.checked
        OnChange(e)
    })


    var USER_CENTRIC_slider = document.createElement('span')
    USER_CENTRIC_slider.classList.add('slider', 'round')

    USER_CENTRIC_switch_label.append(USER_CENTRIC_toggle)
    USER_CENTRIC_switch_label.append(USER_CENTRIC_slider)

    USER_CENTRIC_toggle_Wrapper.append(USER_CENTRIC_switch_label)


    USER_CENTRIC_ParameterWrap.append(USER_CENTRIC_Labelwrap)
    USER_CENTRIC_ParameterWrap.append(USER_CENTRIC_toggle_Wrapper)




    form.append(PRON_ParameterWrap)
    form.append(V_S_CHAR_ParameterWrap)
    form.append(USER_CENTRIC_ParameterWrap)
    form.append(LC_ParameterWrap)
    form.append(UC_ParameterWrap)
    form.append(NUM_ParameterWrap)
    form.append(S_CHAR_ParameterWrap)


    var BtnWrap = document.createElement('div')
    BtnWrap.classList.add('button-wrapper')
    var GenerateBtn = document.createElement('button')
    GenerateBtn.classList.add('btn-main', 'btn', 'btn-1')
    GenerateBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: {
                Request: "GeneratePassword",
                Direction: 'UP'
            },
            Parameters: GeneratorState
        })
    })
    GenerateBtn.innerText = 'Generate'

    var AddBtn = document.createElement('button')
    AddBtn.classList.add('btn-main', 'btn', 'btn-1')
    AddBtn.addEventListener('click', {
        // add to field
    })
    AddBtn.addEventListener('click', () => {
        // View['Content']['SignUp']['Fields'].forEach(element=>{
        //     console.log(element)
        // })
        for (i in View['Content']['SignUp']['Fields']) {
            if (View['Content']['SignUp']['Fields'][i].type == 'password') {
                View['Content']['SignUp']['Fields'][i].value = PasswordViewer.value
                console.log(GeneratorState['PasswordViewer'].value)
                console.log(GeneratorState['Password'])
            }
        }
    })
    AddBtn.innerText = 'Add'

    BtnWrap.append(GenerateBtn)
    BtnWrap.append(AddBtn)


    GeneratorContainer.append(PasswordWrap)
    GeneratorContainer.append(LengthParameterWrap)
    GeneratorContainer.append(form)
    GeneratorContainer.append(BtnWrap)


    TrayContainer.append(HeaderContainer)
    TrayContainer.append(GeneratorContainer)

    assistantconatiner.append(TogglerIconEl)
    // assistantconatiner.append(menuwrap)
    assistantconatiner.append(TrayContainer)
    document.body.appendChild(assistantconatiner)

}




function ContextMenuPopulate(parent, AssistantState) {
    var ContextMenu = document.createElement('div')
    ContextMenu.id = 'assistant-context-menu'
    ContextMenu.classList.add('menu-hidden')


    var CloseAssistant = document.createElement('div')
    CloseAssistant.classList.add('menu-item')
    CloseAssistant.innerHTML = 'Close'

    CloseAssistant.addEventListener('click', () => {
        ElementPopulate()
    })

    var GeneratorToggle = document.createElement('div')
    GeneratorToggle.classList.add('menu-item')
    GeneratorToggle.innerHTML = 'Password Generator'
    GeneratorToggle.addEventListener('click', () => {
        PasswordGenerator()
    })

    var SignUp = document.createElement('div')
    SignUp.classList.add('menu-item')
    SignUp.innerHTML = 'Sign Up Assistant'
    SignUp.addEventListener('click', () => {
        ElementPopulate(false, true, {
            ...User
        })
    })
    var SignIn = document.createElement('div')
    SignIn.classList.add('menu-item')
    SignIn.innerHTML = 'Sign In Assistant'
    SignIn.addEventListener('click', () => {
        ElementPopulate(true, false, accounts)
    })
    if (AssistantState['Signin'] || AssistantState['Signup'] || AssistantState['Generator']) {
        ContextMenu.appendChild(CloseAssistant)
    }
    ContextMenu.appendChild(GeneratorToggle)
    ContextMenu.appendChild(SignIn)
    ContextMenu.appendChild(SignUp)

    var events = ['contextmenu', 'touchstart']
    var timeout;
    var lastTap = 0;

    events.forEach((event) => {
        parent.addEventListener(event, (e) => {
            e.preventDefault()
            let mouseX = e.clientX || e.touches[0].clientX;
            let mouseY = e.clientY || e.touches[0].clientY;
            let menuHeight = ContextMenu.getBoundingClientRect().height;
            let menuWidth = ContextMenu.getBoundingClientRect().width;
            let width = parent.innerWidth;
            let height = parent.innerHeight;
            console.log(parent)
            console.log(width)
            console.log(height)
            console.log(menuHeight)
            console.log(menuWidth)
            console.log(mouseX)
            console.log(mouseY)

            if (width - mouseX <= 200) {
                ContextMenu.style.borderRadius = "5px 0 5px 5px";
                // ContextMenu.style.left = width - menuWidth + "px";
                // ContextMenu.style.top = mouseY + "px";
                console.log(width - menuWidth)
                console.log(mouseY)
                if (height - mouseY <= 200) {
                    // ContextMenu.style.top = mouseY - menuHeight + "px";
                    ContextMenu.style.borderRadius = "5px 5px 0 5px";
                    console.log(mouseY - menuHeight)
                }
            }
            else {
                ContextMenu.style.borderRadius = "0 5px 5px 5px";
                // ContextMenu.style.left = mouseX + "px";
                // ContextMenu.style.top = mouseY + "px";
                // console.log(mouseX)
                // console.log(mouseY)
                if (height - mouseY <= 200) {
                    // ContextMenu.style.top = mouseY - menuHeight + "px";
                    ContextMenu.style.borderRadius = "5px 5px 5px 0";
                    console.log(mouseY - menuHeight)
                }
            }

            if (ContextMenu.classList.contains('menu-hidden')) {
                ContextMenu.classList.replace('menu-hidden', 'menu-visible');
                // ContextMenu.classList.add('menu-visible')
            }
        },
            { passive: false }
        )
    })
    parent.addEventListener("touchend", function (e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        clearTimeout(timeout);
        if (tapLength < 500 && tapLength > 0) {
            if (ContextMenu.classList.contains('menu-visible')) {
                ContextMenu.classList.replace('menu-visible', 'menu-hidden');
            }
            e.preventDefault();
        } else {
            timeout = setTimeout(function () {
                clearTimeout(timeout);
            }, 500);
        }
        lastTap = currentTime;
    });
    document.addEventListener("click", function (e) {
        if (!ContextMenu.contains(e.target)) {
            if (ContextMenu.classList.contains('menu-visible')) {
                ContextMenu.classList.replace('menu-visible', 'menu-hidden');
            }
        }
    })
    parent.appendChild(ContextMenu)
}



function ElementPopulate(signin = false, signup = false, Data = []) {
    if (document.getElementById('Encrypta-Assistant') != null) {
        document.body.removeChild(document.getElementById('Encrypta-Assistant'))
    }
    var assistantconatiner = document.createElement('div')
    assistantconatiner.classList.add('Assistant-container')
    assistantconatiner.id = 'Encrypta-Assistant'
    var TogglerIconEl = document.createElement('button')
    TogglerIconEl.classList.add('Assistant-Tray-icon')
    TogglerIconEl.innerHTML = 'E'

    var menuwrap = document.createElement('div')
    menuwrap.classList.add('Menu-Wrap', 'menu-Hidden')

    TogglerIconEl.addEventListener('click', () => {
        if (menuwrap.classList.contains('menu-Hidden')) {
            menuwrap.classList.replace('menu-Hidden', 'menu-Visible')
        } else if (menuwrap.classList.contains('menu-Visible')) {
            menuwrap.classList.replace('menu-Visible', 'menu-Hidden')
        }

    })

    var Menu_Close = document.createElement('div')
    Menu_Close.classList.add('Menu-Item')
    Menu_Close.innerText = 'Close'
    Menu_Close.addEventListener('click', () => {
        ElementPopulate()
    })

    var GeneratorToggle = document.createElement('div')
    GeneratorToggle.classList.add('menu-item')
    GeneratorToggle.innerHTML = 'Password Generator'
    GeneratorToggle.addEventListener('click', () => {
        PasswordGenerator()
    })

    var SignUp = document.createElement('div')
    SignUp.classList.add('menu-item')
    SignUp.innerHTML = 'Sign Up Assistant'
    SignUp.addEventListener('click', () => {
        ElementPopulate(false, true, {
            ...User
        })
    })
    var SignIn = document.createElement('div')
    SignIn.classList.add('menu-item')
    SignIn.innerHTML = 'Sign In Assistant'
    SignIn.addEventListener('click', () => {
        ElementPopulate(true, false, accounts)
    })
    if (AssistantState['Signin'] || AssistantState['Signup'] || AssistantState['Generator']) {
        ContextMenu.appendChild(CloseAssistant)
    }
    ContextMenu.appendChild(GeneratorToggle)
    ContextMenu.appendChild(SignIn)
    ContextMenu.appendChild(SignUp)

    var events = ['contextmenu', 'touchstart']
    var timeout;
    var lastTap = 0;

    events.forEach((event) => {
        parent.addEventListener(event, (e) => {
            e.preventDefault()
            let mouseX = e.clientX || e.touches[0].clientX;
            let mouseY = e.clientY || e.touches[0].clientY;
            let menuHeight = ContextMenu.getBoundingClientRect().height;
            let menuWidth = ContextMenu.getBoundingClientRect().width;
            let width = parent.innerWidth;
            let height = parent.innerHeight;
            if (ContextMenu.classList.contains('menu-hidden')) {
                ContextMenu.classList.replace('menu-hidden', 'menu-visible');
                // ContextMenu.classList.add('menu-visible')
            }
        },
            { passive: false }
        )
    })
    parent.addEventListener("touchend", function (e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        clearTimeout(timeout);
        if (tapLength < 500 && tapLength > 0) {
            if (ContextMenu.classList.contains('menu-visible')) {
                ContextMenu.classList.replace('menu-visible', 'menu-hidden');
            }
            e.preventDefault();
        } else {
            timeout = setTimeout(function () {
                clearTimeout(timeout);
            }, 500);
        }
        lastTap = currentTime;
    });
    document.addEventListener("click", function (e) {
        if (!ContextMenu.contains(e.target)) {
            if (ContextMenu.classList.contains('menu-visible')) {
                ContextMenu.classList.replace('menu-visible', 'menu-hidden');
            }
        }
    })
    parent.appendChild(ContextMenu)
}



function ElementPopulate(signin = false, signup = false, Data = []) {
    if (document.getElementById('Encrypta-Assistant') != null) {
        document.body.removeChild(document.getElementById('Encrypta-Assistant'))
    }
    var assistantconatiner = document.createElement('div')
    assistantconatiner.classList.add('Assistant-container')
    assistantconatiner.id = 'Encrypta-Assistant'

    dragElement(assistantconatiner)



    // var TogglerIconEl = document.createElement('button')
    var TogglerIconEl = document.createElement('div')
    TogglerIconEl.classList.add('Assistant-Tray-icon')
    // TogglerIconEl.style.cursor = 'grab'
    TogglerIconEl.innerHTML = 'E'
    TogglerIconEl.style.cursor = 'grab'
    TogglerIconEl.addEventListener('mousedown', () => {
        TogglerIconEl.style.cursor = 'grabbing'
    })
    TogglerIconEl.addEventListener('mouseup', () => {
        TogglerIconEl.style.cursor = 'grab'
    })


    ContextMenuPopulate(TogglerIconEl, { 'Signin': signin, 'Signup': signup })

    var TrayContainer = document.createElement('div')

    var HeaderContainer = document.createElement('div')
    var AccountContainer = document.createElement('div')
    AccountContainer.id = 'Encrypta-Assistant-viewer-container'
    HeaderContainer.classList.add('Assistant-Header')
    if (signin) {
        // HeaderContainer.innerHTML = `<h3>${location.hostname.split('.')[location.hostname.split('.').length - 2] + '.' + location.hostname.split('.')[location.hostname.split('.').length - 1]}</h3>`
        HeaderContainer.innerHTML = `<h3>Accounts</h3><h4>${location.hostname}</h4>`
        AccountContainer.classList.add('Account-Container')
        for (let i = 0; i < Data.length; i++) {
            var AccountElement = document.createElement('div')
            AccountElement.classList.add('account-wrapper')
            const element = Data[i];

            var LabelElement = document.createElement('div')
            LabelElement.innerText = 'User Name'
            LabelElement.classList.add('label')
            var TextElement = document.createElement('div')
            TextElement.innerText = element['UserName']
            TextElement.title = element['UserName']
            TextElement.classList.add('text-wrap')
            AccountElement.append(LabelElement)
            AccountElement.append(TextElement)
            AccountElement.addEventListener('click', () => {
                AccountSelect(element)
            })
            AccountContainer.append(AccountElement)
        }

        if (AccountContainer.childElementCount == 0) {
            var AccountElement = document.createElement('div')
            AccountElement.style.margin = '2rem auto'
            AccountElement.style.textAlign = 'center'
            AccountElement.innerHTML = '<b>No Accounts Saved.</b>'
            AccountContainer.append(AccountElement)
        }
        TrayContainer.append(HeaderContainer)
        TrayContainer.append(AccountContainer)
    }
    if (signup) {
        // var HeaderContainer = document.createElement('div')
        // var AccountContainer = document.createElement('div')
        HeaderContainer.classList.add('Assistant-Header')
        HeaderContainer.innerHTML = `<h3>Personal Details</h3><h4>${User['UserName']}</h4>`
        AccountContainer.classList.add('Account-Container')

        if (View['Content']['SignUp']['MultiPage']) {
            var WarnElement = document.createElement('div')
            WarnElement.style.margin = '0.8rem auto'
            WarnElement.style.textAlign = 'center'
            WarnElement.innerHTML = '<b>Autofill might Not be Available.</b>'
            AccountContainer.append(WarnElement)
        }
        for (i in Data) {
            if (i in View['Content']['SignUp']['Fields'] || View['Content']['SignUp']['MultiPage']) {
                var AccountElement = document.createElement('div')
                AccountElement.classList.add('account-wrapper')
                const element = Data[i];
                const Field = i
                var LabelElement = document.createElement('div')
                LabelElement.innerText = Field
                LabelElement.classList.add('label')

                var TextWrap = document.createElement('div')
                TextWrap.classList.add('item-Wrapper')
                var TextElement = document.createElement('div')
                TextElement.innerText = element
                TextElement.title = element
                TextElement.classList.add('text-wrap')
                TextWrap.append(TextElement)
                AccountElement.append(LabelElement)
                AccountElement.append(TextWrap)
                if (View['Content']['SignUp']['MultiPage']) {
                    var actionwrap = document.createElement('div')
                    actionwrap.classList.add('action-wrapper')

                    var actionbtn = document.createElement('div')
                    actionbtn.classList.add('action-text')
                    actionbtn.addEventListener('click', (e) => {
                        Copy(e, element)
                    })

                    actionbtn.innerText = 'Copy'
                    actionwrap.append(actionbtn)

                    TextWrap.append(actionwrap)
                    AccountElement.style.cursor = 'default'
                    AccountElement.addEventListener('mouseover', (e) => {
                        e.target.style.transform = 'scale(1)'
                    })
                }
                AccountElement.addEventListener('click', () => {
                    // if (View['Content']['SignUp']['MultiPage']) {
                    //     actionbtn.click()
                    // }
                    if (View['Content']['SignUp']['SinglePage']) {
                        ProfileValueSelect(Field, element)
                    }
                })
                AccountContainer.append(AccountElement)
            }
        }
        if (AccountContainer.childElementCount == 0) {
            var AccountElement = document.createElement('div')
            AccountElement.style.margin = '2rem auto'
            AccountElement.style.textAlign = 'center'
            AccountElement.innerHTML = '<b>Suggestions Not Available.</b>'
            AccountContainer.append(AccountElement)
        }
        TrayContainer.append(HeaderContainer)
        TrayContainer.append(AccountContainer)
    }


    TrayContainer.classList.add('Assistant-Tray-container')
    assistantconatiner.append(TogglerIconEl)
    // assistantconatiner.append(menuwrap)
    if (signin || signup) {
        assistantconatiner.append(TrayContainer)
    }
    document.body.appendChild(assistantconatiner)
}



//+ Utilities +


function OnFocus(e) {
    var element = e.target
    element.classList.add('input-focused', 't-tip-show')
}

function OnBlur(e) {
    var element = e.target
    if (element.value.length == 0) {
        element.classList.remove('input-focused')
    }
}





function Copy(e, text) {
    var elem = e.target
    var EText = elem.innerText
    elem.innerText = 'Copied!'
    setTimeout(() => {
        elem.innerText = EText
    }, 2500)
    navigator.clipboard.writeText(text);
}

//- Utilities -