import React from 'react';
import {flowRight as compose} from 'lodash';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { updateAboutMutation } from '../queries/mutations';
import { getAboutQuery } from '../queries/queries';

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

class About extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: '',
            block: false,
            done: false,

            heading: '',
            yourInfo: '',
            disclaimerInfo: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('about').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('about').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getAboutQuery;

        if(data.error) {

            this.setState({
                heading: data.error.message,
                yourInfo: data.error.message,
                disclaimerInfo: data.error.message,
    
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
                yourInfo: 'Loading...',
                disclaimerInfo: 'Loading...',
    
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

        const mat = data.about;
    
        if(mat === null){
            this.setState({
                heading: '',
                yourInfo: '',
                disclaimerInfo: '',
    
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
            yourInfo: mat.yourInfo || '',
            disclaimerInfo: mat.disclaimerInfo || '',

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


        this.props.updateAboutMutation({

            variables: {
                heading: this.state.heading,
                yourInfo: this.state.yourInfo,
                disclaimerInfo: this.state.disclaimerInfo
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
                <div className='about__main'>

                <form id = "home-form" onSubmit = {this.submitForm} autoComplete="off">


                    <div className = "home__field">
                        <label style = {label}>Heading</label>
                        <input value={this.state.heading} className="blog__work" type = "text" placeholder = "About heading" onChange = { (e) => this.setState({heading: e.target.value}) } />
                    </div>


                    <div className = "home__field">
                        <label style = {label}>Your Info</label>
                        <textarea value={this.state.yourInfo} className="blog__work" onChange = { (e) => this.setState({yourInfo: e.target.value}) } placeholder = "Add your about info here...">

                        </textarea>
                    </div>


                    <div className = "home__field">
                        <label style = {label}>Disclaimer Info</label>
                        <textarea value={this.state.disclaimerInfo} className="blog__work" onChange = { (e) => this.setState({disclaimerInfo: e.target.value}) } placeholder = "Add your disclaimer info here...">

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
    
    graphql(getAboutQuery, {
        name: 'getAboutQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateAboutMutation, {name: 'updateAboutMutation'})

)

(About);
