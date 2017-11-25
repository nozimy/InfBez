import React, { Component } from 'react';
import { Input , List, Grid} from 'semantic-ui-react';

const S = {
    read: 'Доступ на чтение',
    write: 'Доступ на запись',
    grant: 'Передача прав',
    full: 'Полные права',
    ban: 'Запрет'
}; //Множество операций
const operations = ['read', 'write'];
const userSet = ['Nozim',  'Alexey', 'Ivan', 'Sergey'];
let usersAmount = 4;        // по варианту
let objectsAmount = 4;      // по варианту
let accessControlMatrix = new Object();

let labels = {
    login: 'Идентификатор пользователя',
    waiting: 'Жду ваших указаний >',
    whichObject: 'Над каким объектом производится операция?',
    success: 'Операция прошла успешно',
    fail: 'Отказ в выполнении операции. У Вас нет прав для ее осуществления',
    fromWhichObj: 'Право на какой объект передается?',
    whichRight: 'Какое право передается?',
    toWhom: 'Какому пользователю передается право?',
    Bye: 'До свидания.'
};



for (let i=0;i<usersAmount;i++) {
 accessControlMatrix[ userSet[i] ] = new Array();
 
 for (let j=0;j<objectsAmount;j++) {
     let opers = new Array();
     
     if (userSet[i] === 'Nozim'){ //Если это Nozim, то он админ
         opers.push('full');
     } else {
         
         let randomNum = Math.random();
         
         if(randomNum <= 0.2){              //20% вероятность того, что у пользователя будут полные права на данный объект
             opers.push('full');
         } else if (randomNum > 0.2 && randomNum <= 0.4){
             opers.push('ban');
             
         } else{                        //60% вероятность того, что у пользователя будут иные права
             let randNumberOfOperations = Math.ceil(Math.random()*operations.length); //Определяем кол-во допустимых операций к объекту для пользователя
                 let tempOpers = operations.slice(0);
                 
                 for(let o = 0; o <randNumberOfOperations; o++){
                     let randOperation = Math.floor(Math.random()*tempOpers.length);
                     opers.push(tempOpers[randOperation]);
                     tempOpers.splice(randOperation, 1); // Удаляем уже примененную операцию
                 }
                 
                 // Может ли юзер права ля передачи прав
                 let hasGrantRight = Math.random() <= 0.5;
                 if (hasGrantRight){ 
                     opers.push('grant');
                 }
         }
     }
    accessControlMatrix[ userSet[i] ][j] = opers;
 }
}

class Lab2 extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            userID: '',
            error: false,
            output: [],
            label: 'Идентификатор пользователя',
            input: '',
            placeholder: 'Введите ID',
            action: {name: '', object: '', right: '', toUser: ''}
        };
        
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._showObjectsAndRights = this._showObjectsAndRights.bind(this);
        this._login = this._login.bind(this);
        this._logout = this._logout.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this._operate = this._operate.bind(this);
        this._startNewAction = this._startNewAction.bind(this);
        
    }
    
    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            let value = e.target.value.trim();  
            
            if(this.state.userID){
                this._operate();
            } else {
                this._login(value);    
            }
        }
    }
    
    
    _operate(){
        let {label} = this.state;
        let {output} = this.state;
        let arr = accessControlMatrix[this.state.userID];
        let input = this.state.input;
        let canGoOn = false;
        let {action} = this.state;
        switch (label) {
            case labels.waiting:
                this._startNewAction();
                break;
                
            case labels.whichObject:
                canGoOn = input <= arr.length && input >= 0 && (arr[input].includes('full')  || arr[input].includes(this.state.action.name));
                if(canGoOn){
                    action.object = input;
                    output.splice(0, 0, labels.success);  
                } else {
                    output.splice(0, 0, labels.fail);
                }
                this.setState({input: '', label: labels.waiting, output: output, action: action});
                
                break;
                
            case labels.fromWhichObj:
                canGoOn = input <= arr.length && input >= 0 && (arr[input].includes('full')  || arr[input].includes(this.state.action.name));
                if(canGoOn){
                    action.object = input;
                    this.setState({input: '', label: labels.whichRight, action: action});
                } else {
                    output.splice(0, 0, labels.fail);
                    this.setState({input: '', label: labels.waiting, output: output});
                }
                
                break;
                
            case labels.whichRight:
                canGoOn = (arr[action.object].includes('full') && operations.includes(input)) || arr[action.object].includes(input);
                if(canGoOn){
                    action.right = input;
                    this.setState({input: '', label: labels.toWhom,  action: action});
                } else {
                    output.splice(0, 0, labels.fail);
                    this.setState({input: '', label: labels.waiting, output: output});
                }
                break;
                
            case labels.toWhom:
                canGoOn = accessControlMatrix.hasOwnProperty(input);
                if(canGoOn){
                    action.toUser = input;
                    if(!accessControlMatrix[action.toUser][action.object].includes(action.right) && !accessControlMatrix[action.toUser][action.object].includes('full')){
                        accessControlMatrix[action.toUser][action.object].push(action.right);    
                    }
                    
                    output.splice(0, 0, labels.success);
                } else {
                    output.splice(0, 0, labels.fail);
                }
                this.setState({input: '', label: labels.waiting,  action: action, output: output});
                break;
            
            default:
                this.setState({error: true, input: ''});  
                break;
        }
    }
    
    _startNewAction(){
        let {action} = this.state;
        switch(this.state.input){
                    case 'read':
                        action.name = 'read';
                        this.setState({action: action, input: '', label: labels.whichObject});
                        break;
                        
                    case 'write':
                        action.name = 'write';
                        this.setState({action: action, input: '', label: labels.whichObject});
                        break;
                        
                    case 'grant':
                        action.name = 'grant';
                        this.setState({action: action, input: '', label: labels.fromWhichObj});
                        break;
                        
                    case 'quit':
                        this._logout();
                        break;
                        
                    default:
                        this.setState({error: true, input: ''});  
                }
    }
      
      
    _login(userID){
        if (accessControlMatrix.hasOwnProperty(userID)){
                let {output} = this.state;
                output.splice(0, 0, 'User: ' + userID);
                output.splice(0, 0, 'Идентификация прошла успешно, добро пожаловать в систему');
                this.setState({error: false, userID: userID, label: labels.waiting, input: '', placeholder: ''});
                this._showObjectsAndRights(userID);
            } else {
              this.setState({error: true, userID: '', placeholder: 'Неверный ID, пожалуйста, попробуйте еще раз', input: ''});
            }
    }
    
    _logout(){
        this.setState({error: false, userID: '', label: labels.login, input: ''});
    }
    
    _showObjectsAndRights(user){
        let objArr = accessControlMatrix[user];
        let {output} = this.state;
        output.splice(0, 0, 'Перечень Ваших прав:');
        for(let i=0; i<objArr.length; i++){
            let str = objArr[i].map((elem)=>{
                return S[elem]
            });
            output.splice(0, 0, 'Объект ' + i + ': ' + str.join());
        }
        this.setState({output: output});
    }
    
    _handleOnChange(e){
        let value = e.target.value.trim();
        this.setState({input: value});
    }
    
    render(){
        return (
            <div className="lab2">
            <Grid>
            <Grid.Row>
            <Grid.Column width={16}>
              <Input 
                    onKeyPress={this._handleKeyPress}
                    value = {this.state.input}
                    onChange={this._handleOnChange}
                    //focus
                    //loading   
                    //iconPosition='left'
                    error={this.state.error}
                    //icon='chevron right'
                    label={this.state.label}
                    placeholder={this.state.placeholder}
                    //transparent
                    fluid
              />
              </Grid.Column>
            </Grid.Row>
              
                  <Grid.Row columns={2}>
                      <Grid.Column>
                        <List items={this.state.output} />
                      </Grid.Column>
                      <Grid.Column>
                        <pre>
                              {
                                //JSON.stringify(this.state.output, null, 2)   
                              }
                            {             
                                JSON.stringify(accessControlMatrix, null, 2)
                            }
                          </pre>
                      </Grid.Column>
                    </Grid.Row>
                </Grid>
              
              
              
    
            </div>
            );
    }
}


export default Lab2;