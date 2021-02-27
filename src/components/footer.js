import React from 'react';
import {flowRight as compose} from 'lodash';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { updateFooterMutation } from '../queries/mutations';
import { getFooterQuery } from '../queries/queries';

const validator = require("validator");
const { isURL } = validator;

const label = {
    color: '#000000',
    display: 'block',
    fontSize: '1.1rem',
    textAlign: 'left',
    position: 'relative',
    left: '6%',
    marginBottom: '5px',
    fontVariant: 'small-caps',
    fontWeight: '700'
};

var time;

class Footer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: '',
            block: false,
            done: false,

            privacy: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('footer').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('footer').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getFooterQuery;

        if(data.error) {

            this.setState({
                privacy: data.error.message,
    
                error: data.error.message,
                block: true,
                done: true
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = true;
            });

            return;
        }

        if(data.loading) {

            this.setState({
                privacy: 'Loading...',
    
                error: 'Loading...',
                block: true
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = true;
            });

            time = setTimeout(this.addData);

            return;
        }

        const mat = data.footer;
    
        if(mat === null){
            this.setState({
                privacy: '',
    
                error: '',
                block: false
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = false;
            });

            return;
        }

        this.setState({
            privacy: mat.privacy || '',

            error: '',
            block: false
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = false;
        });

    } 

    submitForm(e){

        e.preventDefault();

        if(this.state.done){
            alert(this.state.copyName);
            return;
        }

        if(this.state.block)
            return;


        if(this.state.privacy && !isURL(this.state.privacy)){
            alert('Enter a valid URL for privacy policy.');
            return;
        }

        this.setState({
            error: 'Saving...',
            block: true
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = true;
        });


        this.props.updateFooterMutation({

            variables: {
                privacy: this.state.privacy
            }

        }).then(()=>{

            this.setState({
                error: '',
                block: false
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = false;
            });

            alert('Saved changes :)');

        }).catch((err)=>{

            this.setState({
                error: '',
                block: false
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = false;
            });

            if(err.message === "GraphQL error: You ain't me, kid!")
                firebase.auth().signOut();
            else 
                alert(err.message);

        });
    }

    render(){
        return(
            <div className='main__show home__box all__box'>
                <div className='footer__main'>

                <form id = "home-form" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Privacy Policy</label>
                        <input value={this.state.privacy} inputMode="url" className="blog__work" type = "text" placeholder = "URL of privacy policy" onChange = { (e) => this.setState({privacy: e.target.value}) } />
                    </div>

                    <button className='submitButton'>Save</button>

                    <div id = 'home__error'>{this.state.error}</div>

                </form>

                </div>
            </div>
        );
    }

}

export default compose(
    
    graphql(getFooterQuery, {
        name: 'getFooterQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateFooterMutation, {name: 'updateFooterMutation'})

)

(Footer);