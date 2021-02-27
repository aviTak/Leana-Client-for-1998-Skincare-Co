import React from 'react';

import AddProduct from './addProduct';

import { graphql } from 'react-apollo';
import { addProductMutation } from '../queries/mutations';

class NewProduct extends React.Component{
    
    render(){

        return(
            <AddProduct addProductMutation = {this.props.addProductMutation} />
        );
    
    }
}

export default graphql(addProductMutation, {name: 'addProductMutation'})(NewProduct);