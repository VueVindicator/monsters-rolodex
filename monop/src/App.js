import React, { Component } from 'react';
import {CardList} from './components/card-list/card-list-component';
import {Search} from './components/search-box/search-box' 
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
     monsters: [],
     searchField: ''
    };
    
    //this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      return response.json();
    })
    .then(result => this.setState({monsters : result}))
  }

  handleChange = (e) => {
    this.setState({searchField: e.target.value})
  }

  render() {
    const {monsters, searchField} = this.state;
    const filteredMonsters = monsters.filter(monster => {
      return monster.name.toLowerCase().includes(searchField.toLowerCase())
    })
    return (
      <div className="App">
        <h1>Monsters Rolodex</h1>
        <Search placeholder="Search monsters" handleChange={this.handleChange}></Search>
        <CardList monsters={filteredMonsters}>
        </CardList>
      </div>
    )
  }
}

export default App;
