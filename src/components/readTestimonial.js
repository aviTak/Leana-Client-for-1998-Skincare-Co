import React from 'react';
import {flowRight as compose} from 'lodash';

import AddTestimonial from './addTestimonial';

import { graphql } from 'react-apollo';
import { updateTestimonialMutation } from '../queries/mutations';
import { getTestimonialQuery } from '../queries/queries';

class ReadTestimonial extends React.Component{
    
    render(){

        return(
            <AddTestimonial 
                updateTestimonialMutation = {this.props.updateTestimonialMutation} 
                getTestimonialQuery = {this.props.getTestimonialQuery}
            />
        );
    
    }
}

export default compose(
    
    graphql(getTestimonialQuery, {
        name: 'getTestimonialQuery',
        options: (props) => ({
            variables: {
                id: props.match.params.id
            },
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateTestimonialMutation, {name: 'updateTestimonialMutation'})

)

(ReadTestimonial);