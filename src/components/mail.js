import React from 'react';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { sendMailMutation } from '../queries/mutations';

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

class Mail extends React.Component{

    constructor(props){
        super(props);
        this.state = {

            error: '',
            block: false,

            subject: '',
            message: ''
        };

        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('mail').classList.add('selected');
        } catch(e){}     

    }

    componentWillUnmount(){
        try{
            document.getElementById('mail').classList.remove('selected');
        } catch(e){}
    }

    submitForm(e){

        e.preventDefault();

        if(this.state.block)
            return;


        this.setState({
            error: 'Sending...',
            block: true
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = true;
        });


        this.props.sendMailMutation({

            variables: {
                subject: this.state.subject, 
                message: this.state.message
            }

        }).then(({ data })=>{

            let { email, message } = data.sendMail;

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = false;
            });

            if(email){

                this.setState({
                    error: '',
                    block: false,
    
                    subject: '',
                    message: ''
                });

                alert('Yahoooo! Mails sent :)');

            } else {

                this.setState({
                    error: '',
                    block: false
                });
                
                alert(message);
            }

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
                <div className='addBlog__main'>

                <form id = "home-form" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Subject <sup>*</sup></label>
                        <input value={this.state.subject} required className="blog__work" type = "text" placeholder = "Subject of your mail" onChange = { (e) => this.setState({subject: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Message <sup>*</sup></label>
                        <textarea value={this.state.message} required className="blog__work" type = "text" placeholder = "Compose an epic..." onChange = { (e) => this.setState({message: e.target.value}) } >

                        </textarea>
                    </div>

                    <button className='submitButton'>Send</button>

                    <div id = 'home__error'>{this.state.error}</div>

                </form>

                </div>
            </div>
        );
    }

}

export default graphql(sendMailMutation, {name: 'sendMailMutation'})(Mail);
