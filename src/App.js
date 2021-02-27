import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './css/add.css';
import './css/search.css';
import './css/table.css';

import './config/firebase';
import firebase from 'firebase/app';

import Login from './components/login';
import Start from './components/start';
import Navbar from './components/navbar';
import Header from './components/header';
import Home from './components/home';
import Footer from './components/footer';
import Social from './components/social';
import About from './components/about';
import Contact from './components/contact';

import ReadCoupon from './components/readCoupon';
import NewCoupon from './components/newCoupon';

import ReadProduct from './components/readProduct';
import NewProduct from './components/newProduct';

import ReadTestimonial from './components/readTestimonial';
import NewTestimonial from './components/newTestimonial';

import ReadSlideshow from './components/readSlideshow';
import NewSlideshow from './components/newSlideshow';

import AddFeedback from './components/addFeedback';

import Assets from './components/assets';
import Coupon from './components/coupon';
import Product from './components/product';
import Testimonial from './components/testimonial';
import Slideshow from './components/slideshow';
import Feedback from './components/feedback';
import Subscriber from './components/subscriber';
import Mail from './components/mail';

import './css/App.css';
import './css/post.css';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      login: null
    };
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            this.setState({
                login: true
            });
        } else {
          this.setState({
            login: false
          });
        }
    });
  }

  render(){
    
    if(this.state.login === false){
      return (
        <div>
          <div className="main__hide"><Start name="Leàna" /></div>
          <Login />
        </div>
      );
    }  

    if(this.state.login === null){
      return <Start name="Leàna" />
    }

    return(
      <Router>

        <Header />
        <Navbar />

        <Switch>

          <Route exact path = '/slideshow/add' component = {NewSlideshow} />

          <Route exact path = '/slideshow/title/:id' component = {ReadSlideshow} />

          <Route exact path = '/slideshow' component = {Slideshow} />



          <Route exact path = '/coupon/add' component = {NewCoupon} />

          <Route exact path = '/coupon/title/:id' component = {ReadCoupon} />

          <Route exact path = '/coupon' component = {Coupon} />



          <Route exact path = '/about' component = {About} />
          <Route exact path = '/contact' component = {Contact} />



          <Route path = '/social' component = {Social} />
          <Route path = '/footer' component = {Footer} />



          <Route path = '/feedback/title/:id' component = {AddFeedback} />

          <Route exact path = '/feedback' component = {Feedback} />



          <Route exact path = '/testimonials/add' component = {NewTestimonial} />

          <Route exact path = '/testimonials/title/:id' component = {ReadTestimonial} />

          <Route path = '/testimonials' component = {Testimonial} />



          <Route exact path = '/products/add' component = {NewProduct} />

          <Route exact path = '/products/title/:id' component = {ReadProduct} />

          <Route exact path = '/products' component = {Product} />



          <Route exact path = '/subscribers' component = {Subscriber} />

          <Route exact path = '/send-mail' component = {Mail} />

          <Route exact path = '/assets' component = {Assets} />


          <Route path = '/' component = {Home} />

        </Switch>

      </Router>
    );
  }

}

export default App;
