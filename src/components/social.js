import React from 'react';
import {flowRight as compose} from 'lodash';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { updateSocialMutation } from '../queries/mutations';
import { getSocialQuery } from '../queries/queries';

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

class Social extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: '',
            block: false,
            done: false,

            facebook: '',
            instagram: '',
            twitter: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('social').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('social').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getSocialQuery;

        if(data.error) {

            this.setState({
                facebook: data.error.message,
                instagram: data.error.message,
                twitter: data.error.message,
    
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
                facebook: 'Loading...',
                instagram: 'Loading...',
                twitter: 'Loading...',
    
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

        const mat = data.social;
    
        if(mat === null){
            this.setState({
                facebook: '',
                instagram: '',
                twitter: '',
    
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
            facebook: mat.facebook || '',
            instagram: mat.instagram || '',
            twitter: mat.twitter || '',

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
            alert(this.state.instagram);
            return;
        }

        if(this.state.block)
            return;

            
        if(this.state.facebook && !isURL(this.state.facebook)){
            alert('Enter a valid URL for Facebook.');
            return;
        }
        if(this.state.instagram && !isURL(this.state.instagram)){
            alert('Enter a valid URL for Instagram.');
            return;
        }
        if(this.state.twitter && !isURL(this.state.twitter)){
            alert('Enter a valid URL for Twitter.');
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


        this.props.updateSocialMutation({

            variables: {
                facebook: this.state.facebook,
                instagram: this.state.instagram,
                twitter: this.state.twitter
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
                <div className='social__main'>

                <form id = "home-form" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Facebook</label>
                        <input value={this.state.facebook} inputMode = "url" className="blog__work" type = "text" placeholder = "URL of your Facebook handle" onChange = { (e) => this.setState({facebook: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Instagram</label>
                        <input value={this.state.instagram} inputMode = "url" className="blog__work" type = "text" placeholder = "URL of your Instagram handle" onChange = { (e) => this.setState({instagram: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Twitter</label>
                        <input value={this.state.twitter} inputMode = "url" className="blog__work" type = "text" placeholder = "URL of your Twitter handle" onChange = { (e) => this.setState({twitter: e.target.value}) } />
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
    
    graphql(getSocialQuery, {
        name: 'getSocialQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateSocialMutation, {name: 'updateSocialMutation'})

)

(Social);