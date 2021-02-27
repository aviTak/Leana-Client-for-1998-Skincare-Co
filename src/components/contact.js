import React from 'react';
import {flowRight as compose} from 'lodash';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { updateContactMutation } from '../queries/mutations';
import { getContactQuery } from '../queries/queries';

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

class Contact extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: '',
            block: false,
            done: false,

            heading: '',
            info: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('contact').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('contact').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getContactQuery;

        if(data.error) {

            this.setState({
                heading: data.error.message,
                info: data.error.message,
    
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
                heading: 'Loading...',
                info: 'Loading...',
    
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

        const mat = data.contact;
    
        if(mat === null){
            this.setState({
                heading: '',
                info: '',
    
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
            heading: mat.heading || '',
            info: mat.info || '',

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
            alert(this.state.heading);
            return;
        }

        if(this.state.block)
            return;


        this.setState({
            error: 'Saving...',
            block: true
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = true;
        });


        this.props.updateContactMutation({

            variables: {
                heading: this.state.heading,
                info: this.state.info
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
                        <label style = {label}>Heading</label>
                        <input value={this.state.heading} className="blog__work" type = "text" placeholder = "Contact heading" onChange = { (e) => this.setState({heading: e.target.value}) } />
                    </div>
                    

                    <div className = "home__field">
                        <label style = {label}>Info</label>
                        <textarea value={this.state.info} className="blog__work" onChange = { (e) => this.setState({info: e.target.value}) } placeholder = "Add your contact info here...">

                        </textarea>
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
    
    graphql(getContactQuery, {
        name: 'getContactQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateContactMutation, {name: 'updateContactMutation'})

)

(Contact);
