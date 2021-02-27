import React from 'react';

import AddCoupon from './addCoupon';

import { graphql } from 'react-apollo';
import { addCouponMutation } from '../queries/mutations';

class NewCoupon extends React.Component{
    
    render(){

        return(
            <AddCoupon addCouponMutation = {this.props.addCouponMutation} />
        );
    
    }
}

export default graphql(addCouponMutation, {name: 'addCouponMutation'})(NewCoupon);