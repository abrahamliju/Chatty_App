import React, { Component } from 'react';

class MessageList extends Component {

  render() {
    return(
      <div className='main-body'>
        {
          this.props.messages.map((chatInfo) => {
            console.log("ChatINfo",chatInfo);
            if(chatInfo.type === "incomingNotification") {
              return (
                <div key={chatInfo.id}>
                  <p className="notification">{chatInfo.content}</p>
                </div>
              )
            }
            return (
              <div key={chatInfo.id}>
                <p >{chatInfo.name}: {chatInfo.content}</p>
              </div>
            );
          })
        }
      </div>

    )
  }

}

export default MessageList;
