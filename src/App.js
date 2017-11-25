import React from 'react';
import './App.css';
import Lab1 from './components/lab1';
import Lab2 from './components/lab2';
import Lab3 from './components/lab3';

import { Tab } from 'semantic-ui-react';

const panes = [
  { menuItem: 'Лаб 1', render: () => <Tab.Pane attached={false}> <Lab1 /> </Tab.Pane> },
  { menuItem: 'Лаб 2', render: () => <Tab.Pane attached={false}> <Lab2 /> </Tab.Pane> },
  { menuItem: 'Лаб 3', render: () => <Tab.Pane attached={false}> <Lab3 /> </Tab.Pane> },
]


const App = () => (
  <Tab menu={{ secondary: true, pointing: true }} 
        panes={panes}
        defaultActiveIndex={2}/>
)

export default App;
