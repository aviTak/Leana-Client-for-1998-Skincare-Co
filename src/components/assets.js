import React from 'react';
import '../css/assets.css';

import firebase from 'firebase/app';

const db = firebase.storage();

const count = 10;

var time;

const del = '<svg class="de" x="0px" y="0px" height="25" viewBox="0 0 473 473" style="enable-background:new 0 0 473 473;" xml:space="preserve"><g><path d="M324.285,215.015V128h20V38h-98.384V0H132.669v38H34.285v90h20v305h161.523c23.578,24.635,56.766,40,93.477,40 c71.368,0,129.43-58.062,129.43-129.43C438.715,277.276,388.612,222.474,324.285,215.015z M294.285,215.015 c-18.052,2.093-34.982,7.911-50,16.669V128h50V215.015z M162.669,30h53.232v8h-53.232V30z M64.285,68h250v30h-250V68z M84.285,128 h50v275h-50V128z M164.285,403V128h50v127.768c-21.356,23.089-34.429,53.946-34.429,87.802c0,21.411,5.231,41.622,14.475,59.43 H164.285z M309.285,443c-54.826,0-99.429-44.604-99.429-99.43s44.604-99.429,99.429-99.429s99.43,44.604,99.43,99.429 S364.111,443,309.285,443z"/><polygon points="342.248,289.395 309.285,322.358 276.323,289.395 255.11,310.608 288.073,343.571 255.11,376.533 276.323,397.746 309.285,364.783 342.248,397.746 363.461,376.533 330.498,343.571 363.461,310.608"/></g></svg>';

class Assets extends React.Component {

    constructor(props){
        super(props);
        this.state = {

            error: '',
            table: [],
            cursor: undefined,

            block: false,
            done: false
        };
        
        this.handleScroll = this.handleScroll.bind(this);
        this.deletePost = this.deletePost.bind(this)
        this.fileButton = this.fileButton.bind(this);
        this.pageToken = this.pageToken.bind(this);
    }

    componentDidMount(){
        try{
            document.getElementById('assets').classList.add('selected');
        } catch(e){}

       this.pageToken();
    }

    componentWillUnmount(){
        try{
            document.getElementById('assets').classList.remove('selected');
            clearTimeout(time);
        } catch(e){}
    }
    
    fileButton(e){

        var uploader = document.getElementById('uploader');

        var size = 0;
        var name = '';

        // Get file
        var file = e.target.files[0];

        // Create a storage ref
        name = file.name;
        var storageRef = db.ref(name);

        // Upload file
        var task = storageRef.put(file);

        var self = this;

        // Update progress bar
        task.on('state_changed', 
        
            function progress(snapshot){
                size = snapshot.totalBytes;
                var percentage = snapshot.bytesTransferred / size * 100;
                uploader.value = percentage;
            }, 

            function error(err){
                alert(err.message);
            },

            function complete(){

               if(self.state.block){
                    time = setTimeout(complete);
                    return;
               }

                self.setState({
                    done: false,
                    table: [],
                    cursor: undefined
                });

                self.pageToken();    
                
                uploader.value = 0;
                document.getElementById('fileButton').value = '';

                alert('File uploaded :)');
                
            }

        ).bind(this);

    }

    async pageToken(c = count){

        this.setState({
            error: 'Loading...',
            block: true
        });

        var listRef = db.ref();
    
        var firstPage = await listRef.list({ 
            maxResults: c,
            pageToken: this.state.cursor
        });        
        

        var items = firstPage.items;

        // let sum = [];


        for(let i=0; i<items.length; i++){            
           
            let name = items[i].name;
            let a = undefined;

            await db.ref(name).getDownloadURL().then(url => {

                a = (
                
                    <tr key = {url}>

                        <td className = 'hover one'><a target="_blank" rel="noopener noreferrer" href={url}><div id={url} style = {{width: '100%'}}>{name}</div></a></td>

                        <td title='Delete' onClick = { () => this.deletePost(url, name) } className = 'cross' style = {{ cursor: 'pointer' }}><div style = {{ textAlign: 'center' }}><div dangerouslySetInnerHTML={{__html: del}} /></div></td>
                
                    </tr> 
                );                
         
            });

           // sum = sum.concat(a);

           this.setState(prevState => ({
                table: prevState.table.concat(a)
            }));

        }

        let p = undefined, d = true, e = "That's all :)";

        if(firstPage.nextPageToken){
            p = firstPage.nextPageToken;
            d = false;
            e = '';
        }

        this.setState(prevState => ({
            error: e,
            cursor: p,
            block: false,
            done: d
        }));

      }

    deletePost(id, name){

        if(this.state.block)
            return;

        let d = document.getElementById(id).innerHTML;

        document.getElementById(id).innerHTML = 'Deleting...';


        this.setState({
            block: true
        });


        var storageRef = db.ref(name);


        storageRef.delete().then(()=>{

            this.setState(prevState => ({
                table: prevState.table.filter(e => e.key !== id ),
                block: false
            }));


            if(this.state.block)    
                return;

            if(this.state.done)
                return;

            // Fetch one result from Firebase

            this.pageToken(1);   

        }).catch((err)=>{

            document.getElementById(id).innerHTML = d;

            this.setState({
                error: '',
                block: false
            });
            
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
        

            // Fetch `count` (10) results from Firebase
            
            this.pageToken();
           
        }
    }

    render(){

        let empty = false;
        let nothing = <tr><td style={{textAlign: 'center'}}>Nothing here!</td><td></td></tr>;

        if(this.state.table.length === 0)
            empty = true;

        return(
            <div className='main__show home__box all__box' id='testScroll' onScroll = { this.handleScroll }>
                <div className='home__main'>


                    <div className="game__upload">
                        <progress value="0" max="100" id="uploader">0%</progress>   
                        <input required type="file" id="fileButton" onChange = {this.fileButton} />
                    </div>


                    <div className = 'grid'>

                        <table className = 'asset__grid'>

                            <thead>
                                <tr>
                                    <th className = 'one'>File Name</th>
                                    <th className = 'cross'></th>
                                </tr>
                            </thead>

                            <tbody>
                                {empty? nothing : this.state.table}                          
                            </tbody>

                        </table>

                    </div>

                    <div id = 'load--message' style = {{textAlign: "center", fontSize: "1.3rem", margin: "0 0 4% 0", color: "#000000"}}>{this.state.error}</div>

                </div>
            </div>
        );
    }

}

export default Assets;
