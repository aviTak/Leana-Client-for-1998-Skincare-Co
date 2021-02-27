import React from 'react';
import '../css/navbar.css';
import { Link } from 'react-router-dom';

const style = {
    color: '#ffffff',
    textDecoration: 'none'
};

class Navbar extends React.Component{
    
    render(){
        return(
            <div className='main__show navbar__photo' id="navbar">
                <div className='navbar__box'>                
                    <ul>                        
                        <Link to='/' style={style}><li id='home'>Order</li></Link>
                        <Link to='/coupon' style={style}><li id='coupon'>Coupon</li></Link>
                        <Link to='/slideshow' style={style}><li id='slideshow'>Slideshow</li></Link>
                        <Link to='/about' style={style}><li id='about'>About</li></Link>
                        <Link to='/contact' style={style}><li id='contact'>Contact</li></Link>
                        <Link to='/social' style={style}><li id='social'>Social</li></Link>
                        <Link to='/footer' style={style}><li id='footer'>Footer</li></Link>
                        <Link to='/testimonials' style={style}><li id='testimonials'>Testimonials</li></Link>
                        <Link to='/products' style={style}><li id='products'>Products</li></Link>
                        <Link to='/feedback' style={style}><li id='feedback'>Feedback</li></Link>
                        <Link to='/subscribers' style={style}><li id='subscribers'>Subscribers</li></Link>
                        <Link to='/send-mail' style={style}><li id='mail'>Send Mail</li></Link>
                        <Link to='/assets' style={style}><li id='assets'>Assets</li></Link>
                    </ul>
                </div>
            </div>
        )
    }

}

export default Navbar;
