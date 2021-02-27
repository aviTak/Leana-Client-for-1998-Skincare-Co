import React from 'react';
import {flowRight as compose} from 'lodash';

import AddProduct from './addProduct';

import { graphql } from 'react-apollo';
import { updateProductMutation } from '../queries/mutations';
import { getProductQuery } from '../queries/queries';

class ReadProduct extends React.Component{
    
    render(){

        return(
            <AddProduct 
                updateProductMutation = {this.props.updateProductMutation} 
                getProductQuery = {this.props.getProductQuery}
            />
        );
    
    }
}

export default compose(
    
    graphql(getProductQuery, {
        name: 'getProductQuery',
        options: (props) => ({
            variables: {
                id: props.match.params.id
            },
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateProductMutation, {name: 'updateProductMutation'})

)

(ReadProduct);