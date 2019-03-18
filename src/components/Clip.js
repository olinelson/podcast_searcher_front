import React, { Component, Fragment } from 'react'
import ReactAudioPlayer from 'react-audio-player';
import Words from "./Words"






class Clip extends Component {
    constructor(props){
        super(props)
        this.audio = React.createRef();
      
    }


setPlayerPosition = (e) => {
    this.audio.current.audioEl.currentTime = e.start_time
  
}

    renderWords = () => {
        if (this.props.clip.words){
            return <Words setPlayerPosition={this.setPlayerPosition} words={this.props.clip.words} /> 
            }else {
                return <p>processing clip...</p>
            }
        
    }

    ifClipSelected = () => {
        if (this.props.clip) {
            return(
                <Fragment>
                <ReactAudioPlayer
                    ref={this.audio}
                    src={this.props.clip.gcloud_media_link}
                    autoPlay
                    controls
                />

                    {this.renderWords()}
                </Fragment>
            )
            
        } else {
            return(
                <p>choose an clip to play</p>
            )
            
        }
    }





render(){
    
    return (

        <Fragment>
            {console.log(this.props.clip)}
        
            <div className="player-container">
                
                

                {this.ifClipSelected()}
         

               
                
            </div>
            
            
           
        </Fragment>

    )

}
    
    
    
}

export default Clip