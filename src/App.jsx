import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state =
      {
        currentUser: "Anonymous",
        messages: [],
        usersConnected: ""
      }

      this.handleDisplayMessages = this.handleDisplayMessages.bind(this)
    }

    //Establishing connection to the Web Socket Server and getting messages
    //back frm the server

    componentDidMount() {
      this.webSocket = new WebSocket("ws://0.0.0.0:3001");
      console.log("DID mount");
      this.webSocket.onmessage = this.handleWSMessage;
    }

    //function to handle message that come from the server

    handleWSMessage = (event) => {
      var newMessage = JSON.parse(event.data);
      if(newMessage.type === 'onlineClients') {
        this.setState({usersConnected: newMessage.content})
      } else {
          var messages = [...this.state.messages, newMessage];
          this.setState({messages});
      }
    }

    //Function to send notifications to the server

    handleNotifications = (newNotification) => {
      let msgNotification =
          {
            type: "postNotification",
            content: `${this.state.currentUser} changed the name to ${newNotification}`
          }
      this.webSocket.send(JSON.stringify(msgNotification))
    }

    //function to sort between Message or Notification and act accordingly

    handleDisplayMessages(newMessage) {
      let newUser = newMessage.name;
      if (newUser !== this.state.currentUser ) {
        let newNotification = newUser;
        this.handleNotifications(newNotification)
      }
      this.setState({currentUser: newUser});
      const message = newMessage;
      const messages = this.state.messages.concat(newMessage);
      this.webSocket.send(JSON.stringify(message));
    }

  render() {
    console.log("Rendering <App/>")
    return (
      <div>
        <header>
          <div className="navbar">
            <a href="/" className='navbar-brand'>Chatty</a>
            <div className="Clients"> {this.state.usersConnected} </div>
          </div>

        </header>

        <MessageList messages={this.state.messages}/>

        <ChatBar user={this.state.currentUser}
                 displayUser={this.handleDisplayUser}
                 displayMessage={this.handleDisplayMessages}
        />
    </div>
    );
  }
}

export default App;
