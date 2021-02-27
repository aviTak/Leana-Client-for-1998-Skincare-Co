import React from 'react';
import '../css/login.css';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { adminLoginMutation } from '../queries/mutations';

const validator = require("validator");
const { isURL } = validator;

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '', 
            error: ''
        };
        
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(e){

        e.preventDefault();

        if(this.state.email === '' || this.state.password === ''){
            this.setState({
                error: 'Fill in the missing field(s).'
            });
            return;
        }

        if(!isURL(this.state.email)){
            this.setState({
                error: 'This isn\'t a valid email. Try again.'
            });
            return;
        }

        this.setState({
            error: 'Please wait...'
        });

        this.props.adminLoginMutation({

            variables: {
                email: (this.state.email).toLowerCase(),
                password: this.state.password
            }

        }).then(({data})=>{

            var token = data.adminLogin;
            var {created, message} = token;

            if(created){
                
                try{

                    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
                    
                } catch(e){

                    this.setState({
                        error: 'Network issue. Try again!'
                    });

                }
                
            } else {

                this.setState({
                    error: message
                });

            }        

        }).catch(()=>{

            this.setState({
               error: 'Network issue. Try again!'
            });

        });
    
    }

    render(){
        return(
            <div>
                <div className="login__back main__show">
                    <div className='login__box'>
                        <h1 className='heading__primary'>Leàna</h1>
                        <h2 className='heading__secondary'>Handcrafted by Avi Takiyar</h2>

                        <form id = "login" onSubmit = {this.submitForm} autoComplete="off">

                            <div className = "login__field">
                                <input type = "text" inputMode = "email" placeholder = "Email" onChange = { (e) => this.setState({email: e.target.value}) } />
                            </div>

                            <div className = "login__field">
                                <input type = "password" id="password" placeholder = "Password" onChange = { (e) => this.setState({password: e.target.value}) } />
                            </div>

                            <button>Enter</button>

                            <div id = 'login__error'>{this.state.error}</div>

                        </form>                    
                    </div>   
                </div>       
            </div>      
        );
    }

}

export default graphql(adminLoginMutation, {name: 'adminLoginMutation'})(Login);