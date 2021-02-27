import React from 'react';
import {flowRight as compose} from 'lodash';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { updateHomeMutation } from '../queries/mutations';
import { getHomeQuery } from '../queries/queries';

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

class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            error: '',
            block: false,
            done: false,

            tagline: '',
            ship: '',
            summary: ''
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('home').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('home').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getHomeQuery;

        if(data.error) {

            this.setState({
                tagline: data.error.message,
                summary: data.error.message,
                ship: 210561,
    
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
                tagline: 'Loading...',
                summary: 'Loading...',
                ship: 210561,
    
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

        const mat = data.home;
    
        if(mat === null){
            this.setState({
                tagline: '',
                summary: '',
                ship: '',
    
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
            tagline: mat.tagline || '',
            summary: mat.summary || '',
            ship: mat.ship || '',

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
            alert(this.state.websiteName);
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


        this.props.updateHomeMutation({

            variables: {
                tagline: this.state.tagline,
                summary: this.state.summary,
                ship: this.state.ship
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
                <div className='home__main'>

                <form id = "home-form" onSubmit = {this.submitForm} autoComplete="off">                    

                    <div className = "home__field">
                        <label style = {label}>Shipping Amount <sup>*</sup></label>
                        <input required value={this.state.ship} inputMode = "decimal" step=".01" min="0" className="blog__work" type = "number" placeholder = "Enter amount in dollars ($)" onChange = { (e) => this.setState({ship: e.target.value}) } />
                    </div>

                    <div className = "home__field">                        
                        <label style = {label}>Heading</label>
                        <input value={this.state.tagline} className="blog__work" type = "text" placeholder = "Heading when order is confirmed" onChange = { (e) => this.setState({tagline: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Message</label>
                        <textarea value={this.state.summary} className="blog__work" onChange = { (e) => this.setState({summary: e.target.value}) } placeholder = "Message for customer when the order is confirmed">

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
    
    graphql(getHomeQuery, {
        name: 'getHomeQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        })
    }),

    graphql(updateHomeMutation, {name: 'updateHomeMutation'})

)

(Home);