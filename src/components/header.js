import React from 'react';
import '../css/header.css';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { adminLogoutMutation } from '../queries/mutations';

const menu = '<svg class="header--svg-1" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve" width="40px" height="40px" fill="#ffffff" stroke="#ffffff" stroke-width="0"><g id="IconsRepo_bgCarrier"></g> <g id="IconsRepoEditor"> <path id="IconsRepoEditor" d="M135,90H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h120c8.284,0,15-6.716,15-15S143.284,90,135,90z"></path> <path id="IconsRepoEditor" d="M135,150H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h120c8.284,0,15-6.716,15-15 C150,156.716,143.284,150,135,150z"></path> <path id="IconsRepoEditor" d="M135,210H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h120c8.284,0,15-6.716,15-15 C150,216.716,143.284,210,135,210z"></path> <path id="IconsRepoEditor" d="M328.858,129.26c-2.322-5.605-7.791-9.26-13.858-9.26H195c-6.067,0-11.536,3.655-13.858,9.26 c-2.321,5.605-1.038,12.057,3.252,16.347l60,60C247.322,208.536,251.161,210,255,210s7.678-1.464,10.606-4.394l60-60 C329.897,141.317,331.18,134.865,328.858,129.26z"></path> </g></svg>';
const logout = '<svg class="header--svg-2" x="0px" y="0px" viewBox="0 0 384.971 384.971" style="enable-background:new 0 0 384.971 384.971;" xml:space="preserve" width="30px" height="30px" fill="#ffffff" stroke="#ffffff" stroke-width="0"><g id="IconsRepo_bgCarrier"></g> <g id="IconsRepoEditor"> <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path> <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path> </g></svg>';

var show = false;

class Header extends React.Component {

    constructor(props){
        super(props);        
        this.logoutNow = this.logoutNow.bind(this);
    }

    componentDidMount(){
        document.getElementById('header--menu').innerHTML = menu;
        document.getElementById('header--logout').innerHTML = logout;
    }

    logoutNow(){

        this.props.adminLogoutMutation().then(()=>{
            
            firebase.auth().signOut();                              

        });

    }

    showNow(){
        if(show){
            document.getElementById('navbar').style.transform = 'translateX(-100%)';
            show = false;                   
        } else {
            document.getElementById('navbar').style.transform = 'translateX(0)';
            show = true;                   
        }
    }

    render(){
        return(
            <div className='main__show header__box'>
                <div className='header--name'>Leàna</div>
                <div id='header--menu' onClick = {this.showNow}></div>
                <div title="Logout" id='header--logout' onClick = {this.logoutNow}></div>
            </div>
        );
    }

}

export default graphql(adminLogoutMutation, {name: 'adminLogoutMutation'})(Header);
