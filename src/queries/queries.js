import { gql } from 'apollo-boost';

// Coupon

const getCouponsQuery = gql`
    query($search: String, $first: Int, $last: Int, $cursor: String){
        coupons(search: $search, first: $first, last: $last, cursor: $cursor){
            id
            code
        }
    }
`;

const getCouponQuery = gql`
    query($id: ID!){
        coupon(id: $id){
            id
            code
            discount
        }
    }
`;



// Product

const getProductsQuery = gql`
    query($search: String, $first: Int, $last: Int, $cursor: String){
        products(search: $search, first: $first, last: $last, cursor: $cursor){
            id
            name
        }
    }
`;

const getProductQuery = gql`
    query($id: ID!){
        product(id: $id){
            id
            name
            item {
                price
                size
            }
            photo
            gender
            summary
            available
        }
    }
`;



// Testimonial

const getTestimonialsQuery = gql`
    query($search: String, $first: Int, $last: Int, $cursor: String){
        testimonials(search: $search, first: $first, last: $last, cursor: $cursor){
            id
            name
        }
    }
`;

const getTestimonialQuery = gql`
    query($id: ID!){
        testimonial(id: $id){
            id
            name
            summary
        }
    }
`;



// Slide

const getSlidesQuery = gql`
    query($search: String, $first: Int, $last: Int, $cursor: String){
        slides(search: $search, first: $first, last: $last, cursor: $cursor){
            id
            heading
        }
    }
`;

const getSlideQuery = gql`
    query($id: ID!){
        slide(id: $id){
            id
            heading
            caption
            photo
        }
    }
`;



// Feedback

const getFeedbacksQuery = gql`
    query($search: String, $first: Int, $last: Int, $cursor: String){
        feedbacks(search: $search, first: $first, last: $last, cursor: $cursor){
            id
            name
        }
    }
`;

const getFeedbackQuery = gql`
    query($id: ID!){
        feedback(id: $id){
            id
            name
            message
            email
            date
        }
    }
`;




// User

const getUsersQuery = gql`
    query($first: Int, $last: Int, $cursor: String){
        users(first: $first, last: $last, cursor: $cursor){
            id
            email
        }
    }
`;



// Home

const getHomeQuery = gql`
    query{
        home{            
            tagline
            ship
            summary
        }
    }
`;



// Footer

const getFooterQuery = gql`
    query{
        footer{
            privacy
        }
    }
`;



// About

const getAboutQuery = gql`
    query{
        about{
            heading
            yourInfo
            disclaimerInfo
        }
    }
`;



// Contact

const getContactQuery = gql`
    query{
        contact{
            heading
            info   
        }
    }
`;



// Social

const getSocialQuery = gql`
    query{
        social{
            facebook
            instagram
            twitter
        }
    }
`;


export { 

    getCouponsQuery,
    getCouponQuery,

    getProductsQuery, 
    getProductQuery, 

    getTestimonialsQuery,
    getTestimonialQuery,

    getSlidesQuery,
    getSlideQuery,

    getFeedbacksQuery,
    getFeedbackQuery,

    getUsersQuery,

    getHomeQuery,
    getFooterQuery,
    getAboutQuery,
    getContactQuery,
    getSocialQuery
};

