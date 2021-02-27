import React from 'react';

class Start extends React.Component{
    render(){
        return (
            <div className='main__align'>
              <div className='main__center'>
                {this.props.name}
              </div>
            </div>
          );
    }
}

export default Start;