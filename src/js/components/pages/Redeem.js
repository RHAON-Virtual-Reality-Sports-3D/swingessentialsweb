import React, { Component } from 'react';
import {connect} from 'react-redux';
import {replace, push} from 'react-router-redux';
import Footer from '../footer/Footer.js';
import Loader from '../loader/Loader.js';

import {setTargetRoute} from '../../actions/NavigationActions.js';
import {redeemCredit, getCredits} from '../../actions/LessonActions.js';
import '../../../css/Lessons.css';

const mapStateToProps = (state)=>{
  return {
    token: state.login.token,
    loading: state.packages.loading,
    credits: state.credits,
    packages: state.packages.list,
    redeemPending: state.lessons.redeemPending,
    redeemSuccess: state.lessons.redeemSuccess
  };
}
var mapDispatchToProps = function(dispatch){
  return {
    goToSignIn: () => {dispatch(replace('/signin'));},
    goToLessons: () => {dispatch(push('/lessons'))},
    setTargetRoute: (route) => {dispatch(setTargetRoute(route))},
    getCredits: (token) => {dispatch(getCredits(token))},
    redeemCredit: (data,token) => {dispatch(redeemCredit(data,token))}
  }
};

class RedeemPage extends Component {
  constructor(props){
    super(props);
    this.state={
      dtlsrc: null,
      fosrc: null,
      notes:'',
      error:'',
      videoError: '',
      role:'pending'
    };
    this.dtl = null;
    this.fo = null;
  }

  componentWillMount(){
    if(!this.props.token){
      this.props.setTargetRoute('/redeem');
      this.props.goToSignIn();
    }
    //TODO: send away if no credits
    else{
      if(!this.props.credits.count && this.props.credits.unlimitedExpires < Date.now()/1000 && !this.props.credits.unlimited){
        this.props.getCredits(this.props.token);
      }
      const role = JSON.parse(window.atob(this.props.token.split('.')[1])).role;
      if(role === 'pending'){
        this.setState({error: 'You must validate your email address before you can submit lessons'});
      }
      else{
        this.setState({role: role});
      }
      window.scrollTo(0,0);
    }
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.token){
      this.props.goToSignIn();
    }
    if(nextProps.redeemSuccess){
      this.props.goToLessons();
    }
    if(!nextProps.credits.count && nextProps.credits.unlimitedExpires < Date.now()/1000){
      this.props.goToLessons();
    }
    if(this.props.redeemPending && !nextProps.redeemPending && !nextProps.redeemSuccess){
      this.setState({error: 'Failed to submit your lesson request. Check your video files and try again.'})
    }
  }

  _updateVideo(evt, type){
    if(!evt.target.files || !evt.target.files[0]){
      this.setState({videoError: ''});
      return;
    }
    else if(evt.target.files[0].size > 10*1024*1024){
      evt.target.files = null;
      this.setState({videoError: 'Video is too large - max size is 10MB'});
      return;
    }
    if(type === 'dtl'){
      if(!this.dtl){return;}
      URL.revokeObjectURL(this.dtl.src);
      this.dtl.src = URL.createObjectURL(evt.target.files[0]);
      this.dtl.controls = true;
      this.dtl.load();
      this.setState({dtlsrc: evt.target.files[0], videoError: ''});
    }
    else if(type === 'fo'){
      if(!this.fo){return;}
      URL.revokeObjectURL(this.fo.src);
      this.fo.src = URL.createObjectURL(evt.target.files[0]);
      this.fo.controls = true;
      this.fo.load();
      this.setState({fosrc: evt.target.files[0], videoError: ''});
    }
  }

  _redeemLesson(){
    //TODO: validate the inputs before sending and the user type
    if(!this.fo || !this.dtl){return;}
    if(!this.state.dtlsrc || !this.state.fosrc){
      this.setState({error: 'Missing Required Videos'});
      return;
    }
    if(this.state.role === 'pending'){
      return;
    }
    let data = new FormData();
    data.append('fo', this.state.fosrc);
    data.append('dtl', this.state.dtlsrc);
    data.append('notes', this.state.notes);

    this.props.redeemCredit(data, this.props.token);
  }

  render() {
    return (
      <div>
        <section className="landing_image image2">
          <main className="page_title">
            <h1>New Lesson</h1>
            <h3>Submit Your Swing</h3>
          </main>
        </section>
        <div>
          <section>
            <div className="structured_panel">
              <h1>{this.props.admin ? "Swing Videos" : "Your Swing Videos"}</h1>
              <div className="se_multi_video">
                <div className="se_video_flex">
                  <video style={{display:(this.state.fosrc) ? "block" : "none"}} ref={(ref)=>this.fo=ref} width="100%" height={9*parseFloat(getComputedStyle(document.documentElement).fontSize)} src="">
                    Your browser does not support the video tag.
                  </video>
                  {!this.state.fosrc ?
                    <div className={"swing_placeholder"}>
                      <div className="placeholder_image fo">
                        <input type="file"
                          accept=".mov,.mp4,.mpeg,.3gp" 
                          title="Select a new Face-On video"
                          onChange={(evt)=>{this._updateVideo(evt, 'fo')}}
                        />
                      </div>
                      <div className="icon_button">
                        <svg viewBox="0 0 24 24" className="icon camera">
                          <circle cx="12" cy="12" r="3.2"/>
                          <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                          <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                        <span>Face-On</span>
                        <input type="file" 
                          accept=".mov,.mp4,.mpeg,.3gp" 
                          title="Select a new Face-On video" 
                          onChange={(evt)=>this._updateVideo(evt, 'fo')}
                        />
                      </div>
                    </div>:
                    <div className="icon_button">
                      <svg viewBox="0 0 24 24" className="icon camera">
                        <circle cx="12" cy="12" r="3.2"/>
                        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                      </svg>
                      <span>Face-On</span>
                      <input type="file" 
                        accept=".mov,.mp4,.mpeg,.3gp" 
                        title="Select a new Face-On video" 
                        onChange={(evt)=>this._updateVideo(evt, 'fo')}
                      />
                    </div>
                  }
                </div>
                <div className="se_video_flex">
                  <video style={{display:(this.state.dtlsrc) ? "block" : "none"}} ref={(ref)=>this.dtl=ref} width="100%" height={9*parseFloat(getComputedStyle(document.documentElement).fontSize)} src="">
                    Your browser does not support the video tag.
                  </video>
                  {!this.state.dtlsrc ?
                    <div className={"swing_placeholder"}>
                      <div className="placeholder_image dtl">
                        <input type="file" 
                          accept=".mov,.mp4,.mpeg,.3gp" 
                          title="Select a new Down-the-Line video" 
                          onChange={(evt)=>this._updateVideo(evt, 'dtl')}
                        />
                      </div>
                      <div className="icon_button">
                        <svg viewBox="0 0 24 24" className="icon camera">
                          <circle cx="12" cy="12" r="3.2"/>
                          <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                          <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                        <span>Down-the-Line</span>
                        <input type="file" 
                          accept=".mov,.mp4,.mpeg,.3gp" 
                          title="Select a new Down-the-Line video" 
                          onChange={(evt)=>this._updateVideo(evt, 'dtl')}
                        />
                      </div>
                    </div>:
                    <div className="icon_button">
                      <svg viewBox="0 0 24 24" className="icon camera">
                        <circle cx="12" cy="12" r="3.2"/>
                        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                      </svg>
                      <span>Down-the-Line</span>
                      <input type="file" 
                        accept=".mov,.mp4,.mpeg,.3gp" 
                        title="Select a new Down-the-Line video" 
                        onChange={(evt)=>this._updateVideo(evt, 'dtl')}
                      />
                    </div>
                  }
                </div>
              </div>
              {this.state.videoError && <span className="validation_error">{this.state.videoError}</span>}
              <h1 style={{marginTop: '2rem'}}>Comments / Special Requests</h1>
              <textarea 
                placeholder="Add any comments here..."
                value={this.state.notes} 
                onChange={(evt)=>this.setState({notes:evt.target.value})} 
              />
              {this.props.redeemPending && 
                <Loader/>
              }
              {this.state.error && <span className="validation_error">{this.state.error}</span>}
              <div className="button se_button" 
                style={{marginTop:'2rem'}} 
                disabled={!this.state.dtlsrc || !this.state.fosrc || this.state.role === 'pending'}
                onClick={()=>this._redeemLesson()}
              >
                <span>SUBMIT</span>
              </div>
            </div>
          </section>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RedeemPage);