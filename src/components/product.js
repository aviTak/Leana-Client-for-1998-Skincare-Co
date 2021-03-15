import React from 'react';
import {flowRight as compose} from 'lodash';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

import { graphql } from 'react-apollo';
import { getProductsQuery } from '../queries/queries';
import { deleteProductMutation } from '../queries/mutations';

const style = {
    color: '#ffffff',
    textDecoration: 'none'
};

const count = 10;

var mainSearch = '';

var time;

const icon = '<svg class="se" x="0px" y="0px" height="20" viewBox="0 0 487.95 487.95" style="enable-background:new 0 0 487.95 487.95;"><g><g><path d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1 c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4 c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"/></g></g></svg>';

const del = '<svg class="de" x="0px" y="0px" height="25" viewBox="0 0 473 473" style="enable-background:new 0 0 473 473;" xml:space="preserve"><g><path d="M324.285,215.015V128h20V38h-98.384V0H132.669v38H34.285v90h20v305h161.523c23.578,24.635,56.766,40,93.477,40 c71.368,0,129.43-58.062,129.43-129.43C438.715,277.276,388.612,222.474,324.285,215.015z M294.285,215.015 c-18.052,2.093-34.982,7.911-50,16.669V128h50V215.015z M162.669,30h53.232v8h-53.232V30z M64.285,68h250v30h-250V68z M84.285,128 h50v275h-50V128z M164.285,403V128h50v127.768c-21.356,23.089-34.429,53.946-34.429,87.802c0,21.411,5.231,41.622,14.475,59.43 H164.285z M309.285,443c-54.826,0-99.429-44.604-99.429-99.43s44.604-99.429,99.429-99.429s99.43,44.604,99.43,99.429 S364.111,443,309.285,443z"/><polygon points="342.248,289.395 309.285,322.358 276.323,289.395 255.11,310.608 288.073,343.571 255.11,376.533 276.323,397.746 309.285,364.783 342.248,397.746 363.461,376.533 330.498,343.571 363.461,310.608"/></g></svg>';

const sort = '<svg class="sot" height="15" x="0px" y="0px" viewBox="0 0 489.389 489.389" style="enable-background:new 0 0 489.389 489.389;" xml:space="preserve"><g><g><path d="M261.294,326.102c-8.3-7.3-21.8-6.2-29.1,2.1l-77,86.8v-346.9c0-11.4-9.4-20.8-20.8-20.8s-20.8,9.4-20.8,20.8v346.9 l-77-86.8c-8.3-8.3-20.8-9.4-29.1-2.1c-8.3,8.3-9.4,20.8-2.1,29.1l113.4,126.9c8.5,10.5,23.5,8.9,30.2,0l114.4-126.9 C270.694,347.002,269.694,333.402,261.294,326.102z"/><path d="M483.994,134.702l-112.4-126.9c-10-10.1-22.5-10.7-31.2,0l-114.4,126.9c-7.3,8.3-6.2,21.8,2.1,29.1 c12.8,10.2,25.7,3.2,29.1-2.1l77-86.8v345.9c0,11.4,9.4,20.8,20.8,20.8s20.8-8.3,20.8-19.8v-346.8l77,86.8 c8.3,8.3,20.8,9.4,29.1,2.1C490.194,155.502,491.294,143.002,483.994,134.702z"/</g></g></svg>';

class Product extends React.Component {

    constructor(props){
        super(props);

       this.state = {
            error: '',
            search: '',
            table: [],

            order: 'last',
            cursor: undefined,

            block: false,
            searchMode: false,
            done: false
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.displayGrid = this.displayGrid.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.reset = this.reset.bind(this);
        this.sort = this.sort.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('products').classList.add('selected');
        } catch(e){}

        this.displayGrid();
    }

    componentWillUnmount(){
        try{
            document.getElementById('products').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }
    
    submitForm(e){ 
        e.preventDefault();

        if(this.state.block)
            return;
            
        mainSearch = this.state.search;

        this.setState({
            table: [],
            error: 'Loading...',

            order: 'last',
            cursor: undefined,
            block: true,
            searchMode: true,
            done: false
        });

        var data = this.props.getProductsQuery;

        data.refetch({

            search: mainSearch, 
            first: undefined, 
            last: count, 
            cursor: undefined

        }).then(()=>{

            this.displayGrid();

        }).catch((err)=>{

            this.setState({
                error: err.message
            });

        });

    }
    
    displayGrid(){ 

        // Fetch Query

        const data = this.props.getProductsQuery;

        if(data.error) {

            this.setState({
                error: data.error.message
            });

            return;
        }

        if(data.loading) {

            this.setState({
                error: 'Loading...',
                block: true
            });

            time = setTimeout(this.displayGrid);

            return;
        }

        const mat = data.products;

        if(mat.length !== 0){

            let a = mat.map(asset => (

                <tr key = {asset.id}>
    
                    <td className = 'hover one'><Link style={{textDecoration: 'none'}} to = {'/products/title/' + asset.id}><div id={asset.id} style = {{width: '100%'}}>{asset.name}</div></Link></td>
    
                    <td title='Delete' onClick = { () => this.deletePost(asset.id) } className = 'cross' style = {{ cursor: 'pointer' }}><div style = {{ textAlign: 'center' }}><div dangerouslySetInnerHTML={{__html: del}} /></div></td>
                
                </tr> 
    
            ));
    
            let p = mat[mat.length - 1].id;
    
            this.setState(prevState => ({
                table: prevState.table.concat(a),
                error: '',
                cursor: p,
                block: false
            }));
    
            return; 

        }
        
        this.setState({
            error: "That's all :)",
            block: false,
            done: true
        });

    }

    deletePost(id){

        if(this.state.block)
            return;

        let d = document.getElementById(id).innerHTML;

        document.getElementById(id).innerHTML = 'Deleting...';


        this.setState({
            block: true
        });


        // Delete from MongoDB

        this.props.deleteProductMutation({

            variables: {
                id: id
            }

        }).then(()=>{

            this.setState(prevState => ({
                table: prevState.table.filter(e => e.key !== id ),
                block: false
            }));


            if(this.state.block)
                return;

            if(this.state.done)
                return;


            let a = (this.state.order === 'last')? 'last' : 'first';
            let b = (a === 'first')? 'last' : 'first';

            this.setState({
                error: 'Loading...',
                block: true
            });

            var data = this.props.getProductsQuery;
            
            let searchValue = undefined;

            if(this.state.searchMode)
                searchValue = mainSearch;
            
            data.refetch({

                search: searchValue,
                [a]: 1,
                [b]: undefined, 
                cursor: this.state.cursor,          

            }).then(()=>{

                this.displayGrid();

            });

        }).catch((err)=>{

            document.getElementById(id).innerHTML = d;

            this.setState({
                error: '',
                block: false
            });
            
            if(err.message === "GraphQL error: You ain't me, kid!")
                firebase.auth().signOut();
            else 
                alert(err.message);

        });
    
    }

    handleScroll(){

        let e = document.getElementById('testScroll');
        if(Math.ceil(e.scrollTop + e.offsetHeight) >= Math.floor(e.scrollHeight - 100)){

            if(this.state.block)
                return;

            if(this.state.done)
                return;
        

            let a = (this.state.order === 'last')? 'last' : 'first';
            let b = (a === 'first')? 'last' : 'first';

            this.setState({
                error: 'Loading...',
                block: true
            });

            var data = this.props.getProductsQuery;
            
            let searchValue = undefined;

            if(this.state.searchMode)
                searchValue = mainSearch;
            
            data.refetch({

                search: searchValue,
                [a]: count,
                [b]: undefined, 
                cursor: this.state.cursor,          

            }).then(()=>{

                this.displayGrid();

            }).catch((err)=>{

                this.setState({
                    error: err.message
                });

            });
           
        }
    }

    reset(){

        if(this.state.block)
            return;

        mainSearch = '';

        this.setState({
            error: 'Loading...',
            search: '',
            table: [],

            order: 'last',
            cursor: undefined,
            block: true,
            done: false
        });

        var data = this.props.getProductsQuery;

        data.refetch({

            search: undefined, 
            first: undefined, 
            last: count, 
            cursor: undefined

        }).then(()=>{

            this.displayGrid();
            this.setState({
                searchMode: false
            });

        }).catch((err)=>{

            this.setState({
                error: err.message
            });

        });

    }

    sort(){

        if(this.state.block)
            return;

        let a = (this.state.order === 'last')? 'first' : 'last';
        let b = (a === 'first')? 'last' : 'first';

        this.setState({
            error: 'Loading...',
            table: [],

            cursor: null,
            block: true,
            done: false
        });

        var data = this.props.getProductsQuery;
        
        let searchValue = undefined;

        if(this.state.searchMode)
            searchValue = mainSearch;
        
        data.refetch({

            search: searchValue,
            [a]: count,
            [b]: undefined, 
            cursor: undefined,          

        }).then(()=>{

            this.displayGrid();
            this.setState({
                order: a
            });

        }).catch((err)=>{

            this.setState({
                error: err.message
            });

        });

    }

    render(){

        let empty = false;
        let nothing = <tr><td style={{textAlign: 'center'}}>Nothing here!</td><td></td></tr>;

        if(this.state.table.length === 0)
            empty = true;

        return(
            <div className='main__show home__box all__box' id='testScroll' onScroll = { this.handleScroll }>
                <div className='home__main'>

                    <Link to='/products/add' style={style}><div className = 'new__blog'>
                        <span className = 'blog__left'>+</span>
                        Add a new product
                    </div></Link>

                    <div className = 'search__bar'>
                        <div className = 'search__box'>
                            <form id = "search" onSubmit = { this.submitForm } autoComplete="off">

                                <span className = "search__field">
                                    <input value={this.state.search} required type = "text" placeholder = "Search..." onChange = { (e) => this.setState({search: e.target.value}) } />
                                </span>

                                <div className='reset'>

                                     
                                    <span className='reset--select' onClick={this.sort}>

                                        <span dangerouslySetInnerHTML={{__html: sort}} />
                                        
                                        &nbsp; &nbsp;

                                        <span className='reverse'>{(this.state.order === 'last')?'Latest':'Earliest'}</span>
                                                                                

                                    </span>

                                    <span  onClick={this.reset} className='reset--span'>Reset</span>
                                    
                                </div>

                                <button className = 'back search--button'><div dangerouslySetInnerHTML={{__html: icon}} /></button>

                            </form>   
                        </div>
                    </div>


                    <div className = 'grid'>

                        <table className = 'asset__grid'>

                            <thead>
                                <tr>
                                    <th className = 'one'>Name</th>
                                    <th className = 'cross'></th>
                                </tr>
                            </thead>

                            <tbody>
                                {empty? nothing : this.state.table}                          
                            </tbody>

                        </table>

                    </div>

                    <div id = 'load--message' style = {{textAlign: "center", fontSize: "1.3rem", margin: "0 0 20px 0", color: "#000000"}}>{this.state.error}</div>

                </div>
            </div>
        );
    }

}

export default compose(
    
    graphql(getProductsQuery, {
        name: 'getProductsQuery',
        options: () => ({
            variables: {
                search: undefined, 
                first: undefined, 
                last: count, 
                cursor: undefined
            },
            fetchPolicy: 'network-only',
        })
    }),

    graphql(deleteProductMutation, {name: 'deleteProductMutation'})

)

(Product);
