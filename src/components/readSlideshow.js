import React from 'react';
import {flowRight as compose} from 'lodash';

import AddSlideshow from './addSlideshow';

import { graphql } from 'react-apollo';
import { updateSlideMutation } from '../queries/mutations';
import { getSlideQuery } from '../queries/queries';

class ReadSlideshow extends React.Component{
    
    render(){

        return(
            <AddSlideshow 
                updateSlideMutation = {this.props.updateSlideMutation} 
                getSlideQuery = {this.props.getSlideQuery}
            />
        );
    
    }
}

export default compose(
    
    graphql(getSlideQuery, {
        name: 'getSlideQuery',
        options: (props) => ({
            variables: {
                id: props.match.params.id
            },
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateSlideMutation, {name: 'updateSlideMutation'})

)

(ReadSlideshow);