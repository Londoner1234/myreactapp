import React, {Component} from 'react'

class Meeting extends Component{
    render(){
        const {user}  = this.props ; 

        return (
            <div className="text-center mt-4">
                    <h1 className="text-primary">Meetings</h1>
            </div>
        ) ; 
    }
}
export default Meeting;
