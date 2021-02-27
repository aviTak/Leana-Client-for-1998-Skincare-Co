import React from 'react';

import AddTestimonial from './addTestimonial';

import { graphql } from 'react-apollo';
import { addTestimonialMutation } from '../queries/mutations';

class NewTestimonial extends React.Component{
    
    render(){

        return(
            <AddTestimonial addTestimonialMutation = {this.props.addTestimonialMutation} />
        );
    
    }
}

export default graphql(addTestimonialMutation, {name: 'addTestimonialMutation'})(NewTestimonial);
