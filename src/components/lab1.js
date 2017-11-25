import React, { Component } from 'react';


//https://htmler.ru/2014/02/13/generatsiya-parolya-javascript/
//https://habrahabr.ru/sandbox/59323/

class Lab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pswLength: 0,
      alphabet: {
        engCap: {checked: true, str: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"},
        engNotCap: {checked: false, str: "abcdefghijklmnopqrstuvwxyz"},
        rusCap: {checked: false, str: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"},
        rusNotCap: {checked: false, str: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"},
        symbols: {checked: false, str: "!@#$%^&*()_+-={}[]:;<>."},
        ints: {checked: false, str: "0123456789"}
      },
      p : 0.00001,
      v: 11,
      t: 28800,
      password: "",
      userID: ""
    };

    this.handleP = this.handleP.bind(this);
    this.calcPswLength = this.calcPswLength.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getAlphabetLength = this.getAlphabetLength.bind(this);
     this.handleGenerate = this.handleGenerate.bind(this);
  }
  
  generatePsw(pswLength, alphabet){
    console.log("run generatePsw");
    let alph = [];
    for(var key in alphabet) {
      if(alphabet.hasOwnProperty(key) && alphabet[key].checked === true) {
        alph.push(alphabet[key]);
      }
    }
    //alert(JSON.stringify(alph, null, 2) );
    let out = "";
    console.log("pswLength", pswLength);
    for(let i=0;i < pswLength;i++){
        let randAlphIndex = Math.ceil(Math.random()*alph.length-1);
        let ch = Math.ceil(Math.random()*alph[randAlphIndex].str.length);
        out += alph[randAlphIndex].str.charAt(ch);
    }
    
    return out;
  }
  
  generatePswForSecondTask(userID, ints , alph){
    
    let out = "";
    let Q = userID.length % 5; //по варианту задания
    
    for(let i=0; i < 9; i++){
        let chIndex = 0;
        let curAlph = "";
        if (i <= Q || i === 8){                          // по варианнту 9 (здесь получается 8 т. к. цикл начали с 0)
          curAlph = ints;
        } else {
          curAlph = alph;
        }
        chIndex = Math.ceil(Math.random()*curAlph.length-1);
        out += curAlph.charAt(chIndex);
    }
    
    return out;
  }
  
  calcPswLength(p, v, t, alphabetLength){
    console.log("run  calcPswLength");
    let s$ = Math.ceil((v*t)/p);
    let pswLength = Math.ceil(Math.log(s$)/Math.log(alphabetLength));
    return pswLength;
  }
  getAlphabetLength(alphObj){
    console.log("run  getAlphabetLength");
    let alphLength = Object.keys(alphObj).reduce(function (previous, key) {
      let len = alphObj[key].checked === true ? alphObj[key].str.length : 0;
      return previous + len;
    }, 0);
    return alphLength;
  }
  setPswLength(){
       console.log(" run setPswLength");
    const alphLength = this.getAlphabetLength(this.state.alphabet);
    let pswL = this.calcPswLength(this.state.p, this.state.v, this.state.t, alphLength);
    console.log("pswL= ",pswL)
    console.log("before setState this.state.pswLength= ",this.state.pswLength )
    this.setState({pswLength: pswL});
    console.log("after setState this.state.pswLength= ",this.state.pswLength )
  }
  
  
  handleGenerate(){
    let psw = "";
    console.log(" run handleGenerate");
    if (this.state.userID.length > 0){
      psw = this.generatePswForSecondTask(this.state.userID, this.state.alphabet.ints.str, this.state.alphabet.engNotCap.str);
    } else {
      this.setPswLength();  
      psw = this.generatePsw(this.state.pswLength, this.state.alphabet);
    }
    
    this.setState({password: psw});
    console.log("STATE  !! ",this.state.pswLength)
  }
  
  handleP(event) {
     console.log(" run handleP");
    const target = event.target;
    this.setState({[target.name]: target.value});
    this.setPswLength();
  }
  
  handleCheck(event) {
     console.log(" run handleCheck");
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let alphabet = this.state.alphabet;
    alphabet[name].checked = value
    this.setState({
      alphabet: alphabet
    });
    this.setPswLength();
  }

  render() {
    return (
      <div className="App">
      
        <div className="App-header">
        P (вероятность подбора пароля): <input type="number" name="p" value={this.state.p} onChange={this.handleP}/> <br/>
        V (скорость перебора паролей злоумышленником): <input type="number" name="v" value={this.state.v} onChange={this.handleP}/> <br/>
        T (максимальный срок действия пароля): <input type="number" name="t" value={this.state.t} onChange={this.handleP}/> <br/>
         <div className="alphabet"> <br/>
          ABC <input type="checkbox" name="engCap" checked={this.state.alphabet.engCap.checked} onChange={this.handleCheck}/> <br/>
          abc <input type="checkbox" name="engNotCap" checked={this.state.alphabet.engNotCap.checked} onChange={this.handleCheck}/> <br/>
          АБВГ <input type="checkbox" name="rusCap" checked={this.state.alphabet.rusCap.checked} onChange={this.handleCheck}/> <br/>
          абвг <input type="checkbox"  name="rusNotCap" checked={this.state.alphabet.rusNotCap.checked} onChange={this.handleCheck}/> <br/>
          0123 <input type="checkbox"  name="ints" checked={this.state.alphabet.ints.checked} onChange={this.handleCheck}/> <br/>
          #@_ (символы) <input type="checkbox" name="symbols" checked={this.state.alphabet.symbols.checked} onChange={this.handleCheck}/> <br/>
        </div>
        <div>
          Ваш ID: <input type="text" name="userID" value={this.state.userID} onChange={this.handleP}/> <br/>
        </div>
        
        <button onClick={this.handleGenerate}>Сгенерировать пароль</button>
        </div>
       
        
        <p className="App-intro">
          Сгенерированный пароль: <input  value={this.state.password} />
        </p>
      <pre>
        {JSON.stringify(this.state, null, 2) }
      </pre>
      </div>
      
    );
  }
}

export default Lab1;
