const app = Vue.createApp({
    data() {
        return {
            inputEmail: '',
            inputPassword:'',
            users: [],
            accountemail:'',
            accountID:'',
            accountUsername:'',
            currChatTarget:'',
            currChatTargetID:'',
            messages: [],
            newMessage :'',
            currLoginToken:'',
            isLoggedIn:false
        }
    },
    methods: {
        login(){
            $.ajax({
                url: 'http://localhost:3000/api/Users/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "email" : this.inputEmail,
                    "password" : this.inputPassword
                }),
                success: (response) =>{
                    this.accountemail=response.user.email;
                    this.accountID=response.user.id;
                    this.accountUsername=response.user.Username;
                    this.currLoginToken=response.token;
                    this.userListUpdate();
                    this.inputEmail='';
                    this.inputPassword='';
                    this.isLoggedIn=true;
                    alert("Login Sucessful");
                },
                error: function(error) {
                    alert("Wrong Email / Password");
                }
            });
        },
        logout(){
            $.ajax({
                url: 'http://localhost:3000/api/Users/logout',
                method: 'POST',
                contentType: 'application/json',
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.currLoginToken);
                },
                success: (response) =>{
                    this.inputEmail= '';
                    this.inputPassword='';
                    this.accountemail='';
                    this.accountID='';
                    this.accountUsername='';
                    this.messages= [];
                    this.newMessage ='';
                    this.currLoginToken='';
                    this.isLoggedIn=false;
                    this.users=[];
                    alert("Logout Sucessful");
                },
                error: function(error) {
                    alert("Logout Error");
                }
            });
        },
        updatemessage(){
            this.messages=[];
            $.ajax({
                url: 'http://localhost:3000/api/chat',
                method: 'GET',
                contentType: 'application/json',
                data: {
                    limit: 100
                },
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.currLoginToken);
                },
                success: (response) =>{
                    response.docs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));                
                    response.docs.forEach(element => {               
                        if (element.SentBy.id==this.accountID&&element.ReceivedBy.id==this.currChatTargetID) {
                            this.messages.push({sender:this.accountUsername,text:element.Message})
                        }
                        else if(element.SentBy.id==this.currChatTargetID&&element.ReceivedBy.id==this.accountID){
                            this.messages.push({sender:this.currChatTarget,text:element.Message})
                        }
                    });
                    
                },
                error: function(error) {
                    alert("Error getting messages");
                }
            });
        },
        userListUpdate(){
            this.channels=[];
            $.ajax({
                url: 'http://localhost:3000/api/users',
                method: 'GET',
                contentType: 'application/json',
                data: {
                    limit: 100
                },
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.currLoginToken);
                },
                success: (response) => {
                    response.docs.forEach(element => {
                        if (element.id!=this.accountID) {
                            this.users.push({id:element.id,username:element.Username})
                        }
                    });
                },
                error: function(error) {
                    console.log(error);
                }
            });
        },
        setCurrentUser(){
            $.ajax({
                url: 'http://localhost:3000/api/users/'+this.accountID,
                method: 'GET',
                contentType: 'application/json',
                data: {
                    limit: 100
                },
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + this.currLoginToken);
                },
                success: (response) => {
                    this.users.forEach(element => {
                        if (element.username==this.currChatTarget) {
                            this.currChatTargetID=element.id;
                        }
                    });
                    this.updatemessage();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        },
        sendMessage(){
            if (this.newMessage=='') {
                alert("Enter a message to send!")
            } else {
                $.ajax({
                    url: 'http://localhost:3000/api/chat',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "Message" : this.newMessage,
                        "SentBy" : this.accountID,
                        "ReceivedBy" : this.currChatTargetID
                    }),
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + this.currLoginToken);
                    },
                    success: (response) =>{
                        this.updatemessage();
                        this.newMessage=''
                    },
                    error: function(error) {
                        alert("you done goofed up");
                    }
                });
            }
        }
              
    }
})
app.mount('#app')