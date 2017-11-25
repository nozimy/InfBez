import React, { Component } from 'react';
import { Input , List, Grid} from 'semantic-ui-react';

let usersAmount = 4;        // по варианту
let objectsAmount = 4;      // по варианту
let A = [{val: 3, desc:"Совершенно секретно"}, {val:2, desc: "Секретно"}, {val: 1, desc:"Открытые данные"}]; //Множество атрибутов безопасности 
const userSet = ['Nozim',  'Alexey', 'Ivan', 'Sergey'];         //множество из 4 идентификаторов пользователей 
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

//вектор OV, задающий уровни конфиденциальности объектов, случайным образом.
function getRandomOV(objectsAmount){
    let OV = {};
    for(let i=0; i < objectsAmount; i++){
        let randomNum = Math.floor(Math.random()*3);
        OV[i] = A[randomNum];
    }
    return OV;
}
//вектор UV, задающий уровни допуска пользователей,случайным образом.
function getRandomUV(usersAmount){
    let UV = {};
    for(let i=0; i < usersAmount; i++){
        let randomNum = Math.floor(Math.random()*3);
        UV[userSet[i]] = A[randomNum];
    }
    return UV;
}

const OV = getRandomOV(objectsAmount)
    , UV = getRandomUV(usersAmount);

class Lab3 extends Component{
    constructor(props){
        super(props);
    
        this.state = {
           output: [],
           input: '',
           userID: '',
           error: false,
           label: 'Идентификатор пользователя',
           placeholder: 'Введите ID',
           action: {name: '', object: '', right: '', toUser: ''}
        };
        
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._login = this._login.bind(this);
        this._logout = this._logout.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this._operate = this._operate.bind(this);
        this._showUserRight = this._showUserRight.bind(this);
        
        
        
    }
    componentDidMount(){
        let output = ["0. Уровни конфиденциальности объектов (OV):↑↑↑"];
        for(let key in OV){
            output.splice(0, 0, output.length +". "+"Объект_"+key+": "+OV[key].desc);  
        }
        output.splice(0, 0,output.length +". "+"----------------------------------------------------------------------------");
        output.splice(0, 0,output.length +". "+"Уровни допуска пользователей (UV): ↑↑↑");
        for(let key in UV){
            output.splice(0, 0,output.length +". "+ key+": "+UV[key].desc);  
        }
        output.splice(0, 0,output.length +". "+"----------------------------------------------------------------------------");
        this.setState({output: output});
    }
    
    _operate(){
        let {label} = this.state;
        let {output} = this.state;
        // let arr = accessControlMatrix[this.state.userID];
        let input = this.state.input;
        let canGoOn = false;
        let {action} = this.state;
        switch (label) {
            case labels.waiting:
                this._startNewAction();
                break;
                
            case labels.whichObject:
                if (this.state.action.name === 'read'){
                    canGoOn = OV[input] && OV[input].val <= UV[this.state.userID].val;
                } else if(this.state.action.name === 'write'){
                    canGoOn = OV[input] && OV[input].val >= UV[this.state.userID].val;
                }
                
                if(canGoOn){
                    action.object = input;
                    output.splice(0, 0, output.length +". "+labels.success);  
                } else {
                    output.splice(0, 0, output.length +". "+labels.fail);
                }
                this.setState({input: '', label: labels.waiting, output: output, action: action});
                
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
                        
                    case 'quit':
                        this._logout();
                        break;
                        
                    default:
                        this.setState({error: true, input: ''});  
                }
    }
    
    _login(userID){
        if (UV.hasOwnProperty(userID)){
                let {output} = this.state;
                output.splice(0, 0, output.length +". "+'User: ' + userID);
                output.splice(0, 0, output.length +". "+'Идентификация прошла успешно, добро пожаловать в систему');
                this.setState({error: false, userID: userID, label: labels.waiting, input: '', placeholder: ''});
                this._showUserRight(userID);
            } else {
              this.setState({error: true, userID: '', placeholder: 'Неверный ID, пожалуйста, попробуйте еще раз', input: ''});
            }
    }
    _showUserRight(userID){
        let {output} = this.state;
        output.splice(0, 0, output.length +". "+userID+": "+UV[userID].desc);
        let toWriteStr= '';
        let toReadStr= '';
        
        for(let key in OV){
            if (OV[key].val <= UV[userID].val){
                toReadStr += "Объект_"+key+" ";
            }
            if(OV[key].val >= UV[userID].val){
                toWriteStr += "Объект_"+key+" ";
            }
        }
        output.splice(0, 0, output.length +". "+"Перечень доступных объектов для чтения: "+ toReadStr);
        output.splice(0, 0, output.length +". "+"Перечень доступных объектов для записи: "+ toWriteStr);
        
        this.setState({output: output});
    }
    
    _logout(){
        let {output, userID} = this.state;
        output.splice(0, 0, output.length +". "+'Пока ' + userID+"!");
        this.setState({error: false, userID: '', label: labels.login, input: '', output:output});
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
    _handleOnChange(e){
        let value = e.target.value.trim();
        this.setState({input: value});
    }
    
    render(){
        return (
            <div className="lab3">
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
                        {
                            <List items={this.state.output} />
                        }
                      </Grid.Column>
                      <Grid.Column>
                        <pre>
                            {
                                JSON.stringify(OV, null, 2)   
                            }
                            {             
                                JSON.stringify(UV, null, 2)
                            }
                        </pre>
                      </Grid.Column>
                    </Grid.Row>
            </Grid>
            </div>
            );
    }
}


export default Lab3;