import React from 'react';

import AddSlideshow from './addSlideshow';

import { graphql } from 'react-apollo';
import { addSlideMutation } from '../queries/mutations';

class NewSlideshow extends React.Component{
    
    render(){

        return(
            <AddSlideshow addSlideMutation = {this.props.addSlideMutation} />
        );
    
    }
}

export default graphql(addSlideMutation, {name: 'addSlideMutation'})(NewSlideshow);
