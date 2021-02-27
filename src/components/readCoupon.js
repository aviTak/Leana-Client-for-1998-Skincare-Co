import React from 'react';
import {flowRight as compose} from 'lodash';

import AddCoupon from './addCoupon';

import { graphql } from 'react-apollo';
import { updateCouponMutation } from '../queries/mutations';
import { getCouponQuery } from '../queries/queries';

class ReadCoupon extends React.Component{
    
    render(){

        return(
            <AddCoupon 
                updateCouponMutation = {this.props.updateCouponMutation} 
                getCouponQuery = {this.props.getCouponQuery}
            />
        );
    
    }
}

export default compose(
    
    graphql(getCouponQuery, {
        name: 'getCouponQuery',
        options: (props) => ({
            variables: {
                id: props.match.params.id
            },
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateCouponMutation, {name: 'updateCouponMutation'})

)

(ReadCoupon);