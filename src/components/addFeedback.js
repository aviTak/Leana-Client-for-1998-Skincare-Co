import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { getFeedbackQuery } from '../queries/queries';

const style = {
    color: '#ffffff',
    textDecoration: 'none'
};

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

class AddFeedback extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            feedbackId: '',

            error: '',
            block: false,
            done: false,

            name: '',
            email: '',
            message: '',
            date: ''
        };

        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('feedback').classList.add('selected');
        } catch(e){}

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('feedback').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }    

    addData(){

        const data = this.props.getFeedbackQuery;


        if(data.error) { 
            
            if(data.error.message === "GraphQL error: You ain't me, kid!")
                    firebase.auth().signOut();
            else {
                   
              this.setState({
                name: data.error.message,
                message: data.error.message,
                email: data.error.message,
                date: '1961-05-21',
    
                error: data.error.message,
                block: true,
                done: true
              });
            }

            return;
        }

        if(data.loading) {

            this.setState({
                name: 'Loading...',
                message: 'Loading...',
                email: 'Loading...',
                date: '1961-05-21',
    
                error: 'Loading...',
                block: true
            });

            time = setTimeout(this.addData);

            return;
        }

        const mat = data.feedback;
    
        if(mat === null){
            this.setState({
                name: 'No such post exists.',
                message: 'No such post exists.',
                email: 'No such post exists.',
                date: '1961-05-21',
    
                error: 'No such post exists.',
                block: true,
                done: true
            });

            return;
        }

        let date = '';

        if(mat.date){
 
            let g = mat.date.indexOf('T');
            date = mat.date.substr(0, g);   
  
         }

        this.setState({
            name: mat.name || '',
            message: mat.message || '',
            email: mat.email || '',
            date: date,

            error: '',
            block: false,
            feedbackId: mat.id
        });

    }    

    submitForm(e){
        e.preventDefault();
    }

    render(){
        return(
            <div className='main__show home__box all__box'>
                <div className='social__main'>

                <Link to='/feedback' style={style}><div className = 'back'><div className="set">&larr;</div></div></Link>

                <form id = "home-form" className="special" onSubmit = {this.submitForm} autoComplete="off">

                   <div className = "home__field">
                        <label style = {label}>Name <sup>*</sup></label>
                        <input value={this.state.name} readOnly className="blog__work" type = "text" placeholder = "Name" />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Date <sup>*</sup></label>
                        <input value={this.state.date} readOnly className="blog__work" type = "text" />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Email</label>
                        <input value={this.state.email} readOnly className="blog__work" type = "text" placeholder = "Email address" />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Message <sup>*</sup></label>
                        <textarea value={this.state.message} readOnly className="blog__work text__new" placeholder = "Message...">

                        </textarea>
                    </div>

                    <div id = 'home__error' className = 'new--set'>{this.state.error}</div>

                </form>

                </div>
            </div>
        );
    }

}

export default graphql(getFeedbackQuery, {

    name: 'getFeedbackQuery',
    options: (props) => ({
        variables: {
            id: props.match.params.id
        },
        fetchPolicy: 'network-only'
    })

})(AddFeedback);
