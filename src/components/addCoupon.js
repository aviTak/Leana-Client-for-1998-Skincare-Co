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

class AddCoupon extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            couponId: '',

            error: '',
            block: false,
            done: false,

            code: '',
            discount: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.delete = this.delete.bind(this);
        this.addData = this.addData.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('coupon').classList.add('selected');
        } catch(e){}  
        
        this.addData();
    }

    componentWillUnmount(){
        try{
            document.getElementById('coupon').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }

    addData(){

        const data = this.props.getCouponQuery;
        
        if(data === undefined){
            return;
        }

        if(data.error) {

            if(data.error.message === "GraphQL error: You ain't me, kid!")
                    firebase.auth().signOut();
            else {

                this.setState({
                    code: data.error.message,
                    discount: 210561,
        
                    error: data.error.message,
                    block: true,
                    done: true
                });

                let a = document.getElementsByClassName('blog__work');
                Array.from(a).forEach(e => {
                    e.readOnly = true;
                });
            }

            return;
        }

        if(data.loading) {

            this.setState({
                code: 'Loading...',
                discount: 210561,
    
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

        const mat = data.coupon;
    
        if(mat === null){
            this.setState({
                code: 'No such post exists.',
                discount: 210561,
    
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
            code: mat.code || '',
            discount: mat.discount || '',

            error: '',
            block: false,
            couponId: mat.id
        });

        let a = document.getElementsByClassName('blog__work');
        Array.from(a).forEach(e => {
            e.readOnly = false;
        });

    }    

    submitForm(e){

        e.preventDefault();

        if(this.state.done){
            alert(this.state.code);
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


        if(this.state.couponId){ // Update post

            this.props.updateCouponMutation({

                variables: {
                    id: this.state.couponId, 
                    code: this.state.code, 
                    discount: this.state.discount
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

            this.props.addCouponMutation({

                variables: { 
                    code: this.state.code, 
                    discount: this.state.discount
                }
    
            }).then(()=>{

                this.setState({
                    error: '',
                    block: false,

                    code: '', 
                    discount: ''
                });

                let a = document.getElementsByClassName('blog__work');
                Array.from(a).forEach(e => {
                    e.readOnly = false;
                });

                alert('Added a new coupon code :) Stay here to add more coupons!');

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
            code: '',
            discount: ''
        });
    }

    render(){
        return(
            <div className='main__show home__box all__box'>
                <div className='addBlog__main'>

                <Link to='/coupon' style={style}><div className = 'back'><div className="set">&larr;</div></div></Link>
                <div className = 'delete' onClick = {this.delete}><div className="set">Reset</div></div>

                <form id = "home-form" className="special" onSubmit = {this.submitForm} autoComplete="off">

                    <div className = "home__field">
                        <label style = {label}>Coupon Code <sup>*</sup></label>
                        <input value={this.state.code} required className="blog__work" type = "text" placeholder = "Turn any text into a coupon code" onChange = { (e) => this.setState({code: e.target.value}) } />
                    </div>

                    <div className = "home__field">
                        <label style = {label}>Discount Offer <sup>*</sup></label>
                        <input required value={this.state.discount} inputMode = "decimal" step=".01" min="0" max="100" className="blog__work" type = "number" placeholder = "Enter value in percents (%)" onChange = { (e) => this.setState({discount: e.target.value}) } />
                    </div>

                    <button className='submitButton'>Save</button>

                    <div id = 'home__error'>{this.state.error}</div>

                </form>

                </div>
            </div>
        );
    }

}

    export default AddCoupon;