import React, {Component} from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);
    this.state =
      {
        name:"Anonymous"

      }
  }
// function to send messages to the main component

  handleMessage(event){
    if(event.which === 13){
    const  newMessage =
        {
          type: "postMessage",
          name: this.state.name,
          content: event.target.value
        }
      this.props.displayMessage(newMessage)
      event.target.value = "";
    }
  }

  handleUser = ({ target: { value } }) => {
    if(!(value === "")){
      this.setState({name: value})
    }
  }

  render(){
    return (
      <footer className ='chatbar'>
          <input

            value={this.props.value}
            onKeyUp={this.handleUser}
            className="chatbar-username"
            type="text"
          />

          <input
            value={this.props.value} onKeyUp={this.handleMessage.bind(this)}
            className='chatbar-message'
            type="text"
            placeholder='Your chat here'
          />
      </footer>
    );
  }
}


export default ChatBar;
