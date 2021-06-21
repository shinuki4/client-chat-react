import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
//import { ReactDom } from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Hashmap} from 'hashmap';


class ChatReact extends Component {

  constructor(props)
  {
    super(props);
    this.state =
    {
      webSocket:'',
      wsUri :"ws://localhost:1234",
      pseudo:'',
      id:'',
      conflist :[],
      userlist:[],
      newConf:'',
      message:'',
      selectedUser:[],
      allMessage:[],
      isConnected: false,
      isLeader:false
    };
  }

  onChatConnect = (event) =>
  {
    /*if (typeof MozWebSocket == 'function')
     {
         this.state.webSocket = MozWebSocket;
    }*/
    if(this.state.pseudo !== "")
    {
      if ( this.state.websocket && this.state.websocket.readyState === 1 )
       {
           this.state.websocket.close();
       }
       var websocket =new WebSocket( this.state.wsUri );
       websocket.onopen= this.onIdentification;
       websocket.onmessage = this.onMessageReceived;
       websocket.onclose = this.onClose;
       this.setState({ websocket: websocket });
       this.setState({ isConnected : true});
     }
  }

  onClose = (event) =>
  {
    this.setState(
      {
        webSocket:'',
        wsUri :"ws://localhost:1234",
        pseudo:'',
        id:'',
        conflist :[],
        userlist:[],
        newConf:'',
        message:'',
        selectedUser:[],
        allMessage:[],
        isConnected: false,
        isLeader:false
      }
    );
  }

  onIdentification = (event) =>
  {
    var websocket = this.state.websocket;
    this.generateIdUser();
    //console.log(this.getIndex(this.state,this.state.userlist,"pseudo"));
    var messageSend="SID "+this.state.id+this.state.pseudo;
    console.log("identification : "+messageSend );
    websocket.send(messageSend);
  }

  onDisconnection = (event) =>
  {
    var websocket = this.state.websocket;
    var messageSend="DECO"+this.state.id;
    console.log("deconnection : "+messageSend );
    websocket.send(messageSend);
    //websocket.close();
    this.setState({pseudo:'',websocket:'', isConnected:false});

  }

  onMessageSend = (conf) =>
  {
    return (event) =>
    {
      var websocket = this.state.websocket;
      var messageSend="MESS"+conf+this.state.message;
      var allMessage = this.state.allMessage;
      var message={};
      message.conferance=conf;
      message.pseudo=this.state.pseudo;
      message.content = this.state.message;
      allMessage.push(message);
      this.setState({allMessage:allMessage, message:''});
      console.log("messageSend : "+messageSend );
      websocket.send(messageSend);
    }
  }

  onAddUserConf = (conf) =>
  {
    return (event) =>
    {
      var websocket = this.state.websocket;
      var messageSend="ACON"+conf+this.state.selectedUser;
      console.log("ACON : "+messageSend );
      websocket.send(messageSend);
    }
  }

  onRemoveUserConf = (conf) =>
  {
    return (event) =>
    {
      var websocket = this.state.websocket;
      var messageSend="RCON"+conf+this.state.selectedUser;
      console.log("RCON : "+messageSend );
      websocket.send(messageSend);
    }
  }

  onNewConferanceSend = (event) =>
  {
    if(this.state.pseudo !== "")
    {
      var websocket = this.state.websocket;
      this.setState({isLeader:true});
      websocket.send("NCON "+this.state.newConf);
    }
  }

  onPromoteNewConfLeader = (conf) =>
  {
    return (event) =>
    {
      var websocket = this.state.websocket;
      var messageSend="SCL "+conf+this.state.selectedUser;
      console.log("SCL : "+messageSend );
      websocket.send(messageSend);
    }
  }

  onChange = (valueName) =>
  {
    return (event) =>
    {
        const {value} = event.target;
        this.setState({[valueName]: value});
    }
  }

  onMessageReceived = (event) =>
  {
    var type = event.data.substr(0,4);
	  var data = event.data.substr(4,event.length);
    switch(type){
      case "SLC ":
        this.receiveUserListFromServer(data);
        break;
      case "NCON":
       console.log("NCON "+data);
        break;
      case "RCON":
        this.receiveLeaveConferanceFromServer(data);
        break;
      case "MESS":
        this.receiveMessageFromServer(data);
        break;
      case "INFO":
        console.log("INFO "+data);
        break;
      case "OK  ":
        console.log("OK "+data);
        break;
      case "MCON":
        this.receiveConferanceFromServer(data);
        break;
      default:
        break;
    }
  }

  receiveUserListFromServer = (data) =>
  {
    console.log("SLC" +data);
    var parse = JSON.parse(data);
    this.setState({userlist : parse});
  }

  receiveLeaveConferanceFromServer = (data) =>
  {
    console.log("RCON "+data);
    var list= this.state.conflist;
    var i= this.getIndex(data,list,"conferance");
    list[i]="";
    this.setState({conflist : list});
  }

  receiveConferanceFromServer = (data) =>
  {
    console.log("MCON "+data);
    var parse = JSON.parse(data);
    var conflist = this.state.conflist;
    var index=this.getIndex(parse.conferance,conflist,'conferance');
    if(index === -1){
      conflist.push(parse);
    }else{
      conflist[index]=parse;
    }
    this.setState({conflist : conflist,isLeader: parse.leader});
  }

  receiveMessageFromServer = (data) =>
  {
    console.log("MESS "+data);
    var parse = JSON.parse(data);
    var allMessage = this.state.allMessage;
    var message={};
    message.conferance=parse.conferance;
    message.pseudo=parse.pseudo;
    message.content =parse.message;
    allMessage.push(message);
  }

  getIndex = (value, arr, prop) =>
  {
      for(var i = 0; i < arr.length; i++) {
          if(arr[i][prop] === value) {
              return i;
          }
      }
      return -1;
  }

  generateIdUser = _=>
  {
    var id = Math.random();
    this.setState({ id: id.toString().substr(2,8) });
  }

  generateAllTabPanelTab= (val)=>
  {
    return this.state.conflist.map(val);
  }

  generateTabChat = (tab) =>
  {
    return <Tab key={tab.conferance}>{tab.titre}</Tab>;
  }

  generateTabPanelChat = (tabPanel)=>
  {
    return <TabPanel key={tabPanel.conferance}>
              connected user: {this.generateSelectListUsers(tabPanel.utilisateur)}
              {this.state.isLeader && tabPanel.leader ?
                <div>
                  <button onClick={this.onRemoveUserConf(tabPanel.conferance)}> remove user </button>
                  <button onClick={this.onPromoteNewConfLeader(tabPanel.conferance)}> promote </button>
                  <p>
                    {this.generateSelectListUsers(this.state.userlist)}
                    <button onClick={this.onAddUserConf(tabPanel.conferance)}> Add users </button>
                  </p>
                </div>:<div/>
              }
              <Scrollbars style={{ height: 300 }}>
                {this.generateAllConfMessage(this.state.allMessage,tabPanel.conferance)}
              </Scrollbars>
              <input type="text" value={this.state.message} onChange={this.onChange("message")}/>
              <button onClick={this.onMessageSend(tabPanel.conferance)}>Send</button>
          </TabPanel>;
  }

  generateAllConfMessage = (messages, conferance) =>
  {
    var confmessage =[];
    confmessage = messages.filter(val => val.conferance === conferance);
    return confmessage.map(this.generateMessage);
  }

  generateMessage = (message, index) =>
  {
    return <p key={index}>{message.pseudo}: {message.content}</p>;
  }

  generateSelectListUsers = (users) =>
  {
    return <select value={this.state.value} onChange={this.onChange("selectedUser")}>{users.map(this.generateOptionUser)}</select>;
  }

  generateOptionUser =  (user) =>
  {
    return <option key={user.id} value={user.id}>{user.pseudo}</option>;
  }

  generateUlListUsers = (users) =>
  {
    return <ul>{users.map(this.generateLiUser)}</ul>;
  }

  generateLiUser =  (user) =>
  {
    return <li key={user.id}>{user.pseudo}</li>;
  }

  render()
  {
    return(
      <div>
        <input type="text" value={this.state.pseudo} onChange={this.onChange("pseudo")}/>
        <button onClick={this.onChatConnect}>Connect</button>
        {this.state.isConnected ?
          <div>
            <button onClick={this.onDisconnection}>Disconnect</button>
            <Scrollbars style={{ width: 500, height: 100 }}>
                {this.generateUlListUsers(this.state.userlist)}
            </Scrollbars>
            <input type="text" value={this.state.newConf} onChange={this.onChange("newConf")}/>
            <button onClick={this.onNewConferanceSend}>new conferance</button>
          <Tabs>
            <TabList>
                {this.generateAllTabPanelTab(this.generateTabChat)}
            </TabList>
            {this.generateAllTabPanelTab(this.generateTabPanelChat)}
          </Tabs>
          </div>:<div/>
        }
      </div>
    );
  }

}

export default ChatReact;
