import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import '../css/custom.css';

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

class AddProduct extends React.Component{

    constructor(props){
        super(props);
        this.state = {

            error: '',
            block: false,
            done: false,

            name: '',
            itemA: { price: '', size: '' },
            itemB: { price: '', size: '' },
            photo: [''],
            gender: 'unisex',
            summary: '',
            available: 'yes',
            productId: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.delete = this.delete.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('products').classList.add('selected');
        } catch(e){}    
        
        let a = document.getElementById('readOnly');
        Array.from(a).readOnly = true;

        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('products').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getProductQuery;
        
        if(data === undefined){
            return;
        }

        if(data.error) {

            this.setState({
                name: data.error.message,
                itemA: { price: 210561, size: 210561 },
                itemB: { price: 210561, size: 210561 },
                photo: [ data.error.message ], 
                summary: data.error.message,
                productId: data.error.message,
    
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
                itemA: { price: 210561, size: 210561 },
                itemB: { price: 210561, size: 210561 },
                photo: [ 'Loading...' ], 
                summary: 'Loading...',
                productId: 'Loading...',
    
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

        const mat = data.product;
    
        if(mat === null){
            this.setState({
                name: 'No such post exists.',
                itemA: { price: 210561, size: 210561 },
                itemB: { price: 210561, size: 210561 },
                photo: [ 'No such post exists.' ], 
                summary: 'No such post exists.',
                productId: 'No such post exists.',
    
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

        let g = mat.available? 'yes' : 'no';

        this.setState({
            name: mat.name || '',
            itemA: mat.item[0] || { price: '', size: '' },
            itemB: mat.item[1] || { price: '', size: '' },
            photo: mat.photo || [],
            gender: mat.gender || 'unisex',
            summary: mat.summary || '',
            available: g,
            productId: mat.id || '', 

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
            alert(this.state.name);
            return;
        }

        if(this.state.block)
            return;



        this.state.photo.forEach(v => {
            if (!isURL(v)) {
                alert('Enter a valid URL for photo.');
                return;
            }
        });


        this.setState({
            error: 'Saving...',
            block: true
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = true;
        });


        if(this.state.productId){ // Update post

            let g = (this.state.available === 'yes')? true: false; 

            let d = [ this.state.itemA, this.state.itemB ]; 

            if(this.state.itemB.price === '' || this.state.itemB.size === ''){
                d = [ this.state.itemA ];
            }

            this.props.updateProductMutation({

                variables: {
                    id: this.state.productId,
                    name: this.state.name,
                    item: d,
                    photo: this.state.photo,
                    gender: this.state.gender,
                    summary: this.state.summary,
                    available: g
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

            let g = (this.state.available === 'yes')? true: false; 

            let d = [ this.state.itemA, this.state.itemB ]; 

            if(this.state.itemB.price === '' || this.state.itemB.size === ''){
                d = [ this.state.itemA ];
            }

            this.props.addProductMutation({

                variables: { 
                    name: this.state.name,
                    item: d,
                    photo: this.state.photo,
                    gender: this.state.gender,
                    summary: this.state.summary,
                    available: g
                }
    
            }).then(()=>{

                this.setState({
                    error: '',
                    block: false,

                    name: '',
                    itemA: { price: '', size: '' },
                    itemB: { price: '', size: '' },
                    photo: [''],
                    gender: 'unisex',
                    summary: '',
                    available: 'yes',
                    productId: ''
                });

                let a = document.getElementsByClassName('blog__work');
                Array.from(a).forEach(e => {
                    e.readOnly = false;
                });

                alert('Added a new product :) Stay here to add more products!');

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
            itemA: { price: '', size: '' },
            itemB: { price: '', size: '' },
            photo: [''],
            gender: 'unisex',
            summary: '',
            available: 'yes'
        });
    }

    render(){

        return(
            <div className='main__show home__box all__box'>
                <div className='addBlog__main'>

                <Link to='/products' style={style}><div className = 'back'><div className="set">&larr;</div></div></Link>
                <div className = 'delete' onClick = {this.delete}><div className="set">Reset</div></div>

                <form id = "home-form" className="special" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Product ID</label>
                        <input readOnly id="readOnly" value={this.state.productId} type = "text" placeholder = "Auto-generated unique ID" onChange = { (e) => this.setState({productId: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Name <sup>*</sup></label>
                        <input value={this.state.name} required className="blog__work" type = "text" placeholder = "Name" onChange = { (e) => this.setState({name: e.target.value}) } />
                    </div>

                    <div className = "custom-select">
                        <span style = {label}>Product Availability <sup>*</sup></span>
                    
                        <div className = "custom-center">
                            <div className = "custom-play">

                                <input onChange = { (e) => this.setState({available: e.target.checked? 'yes' : 'yes'}) } checked = {this.state.available === 'yes' ? true : false} type="radio" id="yes" name="available" value="yes" />&nbsp;
                                <label htmlFor="yes">Available</label>                              
                                
                                
                                <input onChange = { (e) => this.setState({available: e.target.checked? 'no' : 'yes'}) } checked = {this.state.available === 'no' ? true : false} type="radio" id="no" name="available" value="no" />&nbsp;
                                <label className="nes" htmlFor="no">Out of stock</label><br/><br/>

                            </div>
                        </div>
                        
                    </div>

                    <div className = "custom-select">
                        <span style = {label}>Category <sup>*</sup></span>
                    
                        <div className = "custom-center">
                            <div className = "custom-play">

                                <input onChange = { (e) => this.setState({gender: e.target.checked? 'men' : 'unisex'}) } checked = {this.state.gender === 'men' ? true : false} type="radio" id="male" name="gender" value="male" />&nbsp;
                                <label htmlFor="male">Men</label>                                
                               
                                
                                <input onChange = { (e) => this.setState({gender: e.target.checked? 'women' : 'unisex'}) } checked = {this.state.gender === 'women' ? true : false} type="radio" id="female" name="gender" value="female" />&nbsp;
                                <label htmlFor="female">Women</label>
                           
                                
                                <input onChange = { (e) => this.setState({gender: e.target.checked? 'unisex' : 'unisex'}) } checked = {this.state.gender === 'unisex' ? true : false} type="radio" id="unisex" name="gender" value="unisex" />&nbsp;
                                <label className="nes" htmlFor="unisex">Unisex</label><br/><br/>

                            </div>
                        </div>
                        
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Photo <sup>*</sup></label>
                        <input value={this.state.photo[0]} required className="blog__work" type = "text" placeholder = "URL of photo" onChange = { (e) => { let q = this.state.photo.slice(); q[0] = e.target.value; this.setState({photo: q }) } } />
                    </div>




                    <div className = "home__field">
                        <label style = {label}>Price 1 <sup>*</sup></label>
                        <input min="0" value={this.state.itemA.price} required className="blog__work" type = "number" inputMode="decimal" step=".01" placeholder = {"Enter price " + (1) + " in dollars ($)"} onChange = { (e) => { let q = this.state.itemA; q.price = e.target.value; this.setState({itemA: q }) } } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Quantity 1 <sup>*</sup></label>
                        <input min="0" value={this.state.itemA.size} required className="blog__work" type = "number" inputMode="decimal" step=".01" placeholder = {"Enter quantity " + (1) + " in ounce (oz)"} onChange = { (e) => { let q = this.state.itemA; q.size = e.target.value; this.setState({itemA: q }) } } />
                    </div>




                    <div className = "home__field">
                        <label style = {label}>Price 2</label>
                        <input min="0" value={this.state.itemB.price} className="blog__work" type = "number" inputMode="decimal" step=".01" placeholder = {"Enter price " + (2) + " in dollars ($)"} onChange = { (e) => { let q = this.state.itemB; q.price = e.target.value; this.setState({itemB: q }) } } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Quantity 2</label>
                        <input min="0" value={this.state.itemB.size} className="blog__work" type = "number" inputMode="decimal" step=".01" placeholder = {"Enter quantity " + (2) + " in ounce (oz)"} onChange = { (e) => { let q = this.state.itemB; q.size = e.target.value; this.setState({itemB: q }) } } />
                    </div>



                    <div className = "home__field">
                        <label style = {label}>Product Info</label>
                        <textarea value={this.state.summary} className="blog__work" onChange = { (e) => this.setState({summary: e.target.value}) } placeholder = "Add your product info here...">

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

export default AddProduct;
