import { gql } from 'apollo-boost';


// Coupon

const deleteCouponMutation = gql`
    mutation($id: ID!){
        deleteCoupon(id: $id){
            id
        }
    }
`;

const addCouponMutation = gql`
    mutation($code: String!, $discount: String!){
        addCoupon(code: $code, discount: $discount){
            id
        }
    }
`;

const updateCouponMutation = gql`
    mutation($id: ID!, $code: String!, $discount: String!){
        updateCoupon(id: $id, code: $code, discount: $discount){
            id
        }
    }
`;




// Product

const deleteProductMutation = gql`
    mutation($id: ID!){
        deleteProduct(id: $id){
            id
        }
    }
`;

const addProductMutation = gql`
    mutation($name: String!, $gender: String!, $photo: [String]!, $item: [InputItem]!, $summary: String, $available: Boolean!){
        addProduct(name: $name, gender: $gender, photo: $photo, item: $item, summary: $summary, available: $available){
            id
        }
    }
`;

const updateProductMutation = gql`
    mutation($id: ID!, $name: String!, $gender: String!, $photo: [String]!, $item: [InputItem]!, $summary: String, $available: Boolean!){
        updateProduct(id: $id, name: $name, gender: $gender, photo: $photo, item: $item, summary: $summary, available: $available){
            id
        }
    }
`;



// Testimonial

const deleteTestimonialMutation = gql`
    mutation($id: ID!){
        deleteTestimonial(id: $id){
            id
        }
    }
`;

const addTestimonialMutation = gql`
    mutation($name: String!, $summary: String!){
        addTestimonial(name: $name, summary: $summary){
            id
        }
    }
`;

const updateTestimonialMutation = gql`
    mutation($id: ID!, $name: String!, $summary: String!){
        updateTestimonial(id: $id, name: $name, summary: $summary){
            id
        }
    }
`;



// Slide

const deleteSlideMutation = gql`
    mutation($id: ID!){
        deleteSlide(id: $id){
            id
        }
    }
`;

const addSlideMutation = gql`
    mutation($heading: String!, $caption: String!, $photo: String!){
        addSlide(heading: $heading, caption: $caption, photo: $photo){
            id
        }
    }
`;

const updateSlideMutation = gql`
    mutation($id: ID!, $heading: String!, $caption: String!, $photo: String!){
        updateSlide(id: $id, heading: $heading, caption: $caption, photo: $photo){
            id
        }
    }
`;



// Feedback

const deleteFeedbackMutation = gql`
    mutation($id: ID!){
        deleteFeedback(id: $id){
            id
        }
    }
`;




// User

const deleteUserMutation = gql`
    mutation($id: ID!){
        deleteUser(id: $id){
            id
        }
    }
`;



// Send Mail

const sendMailMutation = gql`
    mutation($subject: String!, $message: String!){
        sendMail(subject: $subject, message: $message){
            email
            message
        }
    }
`;



// Home

const updateHomeMutation = gql`
    mutation($tagline: String, $summary: String, $ship: String!){
        updateHome(tagline: $tagline, summary: $summary, ship: $ship){
            id
        }
    }
`;



// Footer

const updateFooterMutation = gql`
    mutation($privacy: String){
        updateFooter(privacy: $privacy){
            id
        }
    }
`;



// About

const updateAboutMutation = gql`
    mutation($heading: String, $yourInfo: String, $disclaimerInfo: String){
        updateAbout(heading: $heading, yourInfo: $yourInfo, disclaimerInfo: $disclaimerInfo){
            id
        }
    }
`;



// Contact

const updateContactMutation = gql`
    mutation($heading: String, $info: String){
        updateContact(heading: $heading, info: $info){
            id
        }
    }
`;



// Social

const updateSocialMutation = gql`
    mutation($facebook: String, $instagram: String, $twitter: String){
        updateSocial(facebook: $facebook, instagram: $instagram, twitter: $twitter){
            id
        }
    }
`;



// Login

const adminLoginMutation =gql`
    mutation($email: String!, $password: String!){
        adminLogin(email: $email, password: $password){
            created
            message
        }
    }
`;



// Logout

const adminLogoutMutation =gql`
    mutation{
        adminLogout{
            created
        }
    }
`;



export { 

    deleteCouponMutation, 
    addCouponMutation, 
    updateCouponMutation,
    
    deleteProductMutation, 
    addProductMutation, 
    updateProductMutation, 

    deleteTestimonialMutation,
    addTestimonialMutation,
    updateTestimonialMutation,

    deleteSlideMutation,
    addSlideMutation,
    updateSlideMutation,

    deleteFeedbackMutation,

    deleteUserMutation,

    updateHomeMutation,
    updateFooterMutation,
    updateAboutMutation,
    updateContactMutation,
    updateSocialMutation,

    adminLoginMutation,
    adminLogoutMutation,

    sendMailMutation
};

