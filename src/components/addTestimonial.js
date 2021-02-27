import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

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

class AddTestimonial extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            testimonialId: '',

            error: '',
            block: false,
            done: false,

            name: '',
            summary: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.delete = this.delete.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('testimonials').classList.add('selected');
        } catch(e){}  
        
        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('testimonials').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getTestimonialQuery;
        
        if(data === undefined){
            return;
        }

        if(data.error) {

            this.setState({
                name: data.error.message,
                summary: data.error.message,
    
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
                name: 'Loading...',
                summary: 'Loading...',
    
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

        const mat = data.testimonial;
    
        if(mat === null){
            this.setState({
                name: 'No such post exists.',
                summary: 'No such post exists.',
    
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
            name: mat.name || '',
            summary: mat.summary || '',

            error: '',
            block: false,
            testimonialId: mat.id
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = false;
        });

    }    

    submitForm(e){

        e.preventDefault();

        if(this.state.done){
            alert(this.state.name);
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


        if(this.state.testimonialId){ // Update post

            this.props.updateTestimonialMutation({

                variables: {
                    id: this.state.testimonialId, 
                    name: this.state.name, 
                    summary: this.state.summary
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

            this.props.addTestimonialMutation({

                variables: { 
                    name: this.state.name, 
                    summary: this.state.summary
                }
    
            }).then(()=>{

                this.setState({
                    error: '',
                    block: false,

                    name: '', 
                    summary: ''
                });

                let a = document.getElementsByClassName('blog__work');
                Array.from(a).forEach(e => {
                    e.readOnly = false;
                });

                alert('Added a new testimonial :) Stay here to add more testimonials!');

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
            name: '',
            summary: ''
        });
    }

    render(){
        return(
            <div className='main__show home__box all__box'>
                <div className='addBlog__main'>

                <Link to='/testimonials' style={style}><div className = 'back'><div className="set">&larr;</div></div></Link>
                <div className = 'delete' onClick = {this.delete}><div className="set">Reset</div></div>

                <form id = "home-form" className="special" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Name <sup>*</sup></label>
                        <input value={this.state.name} required className="blog__work" type = "text" placeholder = "Name" onChange = { (e) => this.setState({name: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Info <sup>*</sup></label>
                        <textarea value={this.state.summary} required className="blog__work" onChange = { (e) => this.setState({summary: e.target.value}) } placeholder = "Add info here...">

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

    export default AddTestimonial;