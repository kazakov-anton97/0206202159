import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter3';
import CreateReactClass from 'create-react-class';
import './App.css';

window.ee = new EventEmitter();

let dateNow = new Date();
let comments = [
    {
        author: 'Самуил',
        date: '13 октября 2011',
        text: 'Привет, Верунь! ниче себе ты крутая. фотка класс!!!!'
    },
    {
        author: 'Лилия Семёновна',
        date: '14 октября 2011',
        text: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент, это и есть всемирно известный центр огранки алмазов и торговли бриллиантами?'
    },
    {
        author: 'Лилия Семёновна',
        date: '14 октября 2011',
        text: 'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент?'
    }
];

let Article = CreateReactClass({
    propTypes: {
        data: PropTypes.shape({
            author: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })
    },
    getInitialState:function(){
        return {
            visible: false
        }
    },
    readmoreClick: function(e){
        e.preventDefault();
        this.setState({visible:true});
    },
    render: function() {
        let author = this.props.data.author,
            date = this.props.data.date,
            text = this.props.data.text;
            
        return (
            <div className="reviews_item">
                <p className="reviews_item_author">{author} <span className="reviews_item_date"> {date}</span></p>
                <p className="reviews_item_text">{text}</p>
            </div>
        )
    }
});
let Add = CreateReactClass({
    onButtonClick: function(e){
        e.preventDefault();
        let textEl = ReactDOM.findDOMNode(this.refs.text);
        let author = "NewUser"
        let text = textEl.value;
        let date = `${dateNow.getDate()} июня ${dateNow.getFullYear()}`;

        let item = [{
            author: author,
            text: text,
            date: date
        }];
        window.ee.emit('News.add', item);
        textEl.value='';
        this.setState({textIsEmpty:true});
    },
    getInitialState: function () {
      return{
          
          textIsEmpty:true
      }
    },
    
    onTextChange: function(e){
        if(e.target.value.trim().length > 0){
            this.setState({textIsEmpty:false})
        }else{ this.setState({textIsEmpty:true})}
        },    
   
    

    render:function(){
        return(
            <div className='input_container'>
                <form className="add cf">
                    <input onChange={this.onTextChange} className="reviews_add_text" defaultValue='' ref='text'/>
                    <button disabled={this.state.textIsEmpty} className="reviews_add_btn" onClick={this.onButtonClick} ref="alert_button">Написать консультанту</button>
                </form>
            </div>
        )
    },
});

let News = CreateReactClass({
    getInitialState: function () {
        return{
            counter: 0
        }
    },

    propTypes: {
        data: PropTypes.array.isRequired
    },
    render: function() {
        var data = this.props.data;
        if(data.length){
            var newsTemplate = data.map(function(item, index){
                return (
                            <div key={index}>
                                <Article data={item}/>
                            </div>
                            )
            })
        }
        return(
            <div className="reviews_add">
                {newsTemplate}
               
            </div>
        )
    }
});

let App = CreateReactClass({
    getInitialState:function () {
        return{
            news: comments
        }
    },
    componentDidMount: function(){
        let self=this;
        window.ee.addListener('News.add', function(item){
          let nextNews=self.state.news.concat(item);
          self.setState({news:nextNews})
        })
    },
    componentWillUnmount:function () {
        window.ee.removeListener('News.add');
    },
    render: function(){
        return(
            <div className="app">
                
                <News data={this.state.news} />
                <Add/>
            </div>
        )
    }
});
ReactDOM.render(
    <App />,

   document.getElementsByClassName('reviews')[0]
);

export default App;