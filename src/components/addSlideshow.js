import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

const validator = require("validator");
const { isURL } = validator;

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

class AddSlideshow extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            slideshowId: '',

            error: '',
            block: false,
            done: false,

            heading: '',
            caption: '',
            photo: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.delete = this.delete.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('slideshow').classList.add('selected');
        } catch(e){}     

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('slideshow').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getSlideQuery;
        
        if(data === undefined){
            return;
        }

        if(data.error) {

            this.setState({
                
                heading: data.error.message,
                caption: data.error.message,
                photo: data.error.message,
    
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
                caption: 'Loading...',
                photo: 'Loading...',
    
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

        const mat = data.slide;
    
        if(mat === null){
            this.setState({

                heading: 'No such post exists.',
                caption: 'No such post exists.',
                photo: 'No such post exists.',
    
                error: 'No such post exists.',
                block: true,
                done: true
            });

            let a = document.getElementsByClassName('blog__work');
            Array.from(a).forEach(e => {
                e.readOnly = true;
            });

            return;
        }

        this.setState({

            heading: mat.heading || '',
            caption: mat.caption || '',
            photo: mat.photo || '',

            error: '',
            block: false,
            slideshowId: mat.id
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = false;
        });

    }    

    submitForm(e){

        e.preventDefault();

        if(this.state.done){
            alert(this.state.caption);
            return;
        }

        if(this.state.block)
            return;


        if(!isURL(this.state.photo)){
            alert('Enter a valid URL for photo.');
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


        if(this.state.slideshowId){ // Update post

            this.props.updateSlideMutation({

                variables: {
                    id: this.state.slideshowId, 
                    heading: this.state.heading,
                    caption: this.state.caption, 
                    photo: this.state.photo
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


        } else { // Add post

            this.props.addSlideMutation({

                variables: { 
                    heading: this.state.heading,
                    caption: this.state.caption, 
                    photo: this.state.photo
                }
    
            }).then(()=>{

                this.setState({
                    error: '',
                    block: false,
                 
                    heading: '',
                    caption: '',
                    photo: ''
                });

                let a = document.getElementsByClassName('blog__work');
                Array.from(a).forEach(e => {
                    e.readOnly = false;
                });

                alert('Added a new slide :) Stay here to add more slides!');

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

    }

    delete(){

        if(this.state.block)
            return;

        this.setState({
            heading: '',
            caption: '',
            photo: ''
        });
    }

    render(){
        return(
            <div className='main__show home__box all__box'>
                <div className='addBlog__main'>

                <Link to='/slideshow' style={style}><div className = 'back'><div className="set">&larr;</div></div></Link>
                <div className = 'delete' onClick = {this.delete}><div className="set">Reset</div></div>

                <form id = "home-form" className="special" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Heading <sup>*</sup></label>
                        <input value={this.state.heading} required className="blog__work" type = "text" placeholder = "Heading of the slide" onChange = { (e) => this.setState({heading: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Caption <sup>*</sup></label>
                        <input value={this.state.caption} required className="blog__work" type = "text" placeholder = "Caption or info" onChange = { (e) => this.setState({caption: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Photo <sup>*</sup></label>
                        <input value={this.state.photo} inputMode = "url" required className="blog__work" type = "text" placeholder = "URL of photo" onChange = { (e) => this.setState({photo: e.target.value}) } />
                    </div>

                    <button className='submitButton'>Save</button>

                    <div id = 'home__error'>{this.state.error}</div>

                </form>

                </div>
            </div>
        );
    }

}

export default AddSlideshow;
