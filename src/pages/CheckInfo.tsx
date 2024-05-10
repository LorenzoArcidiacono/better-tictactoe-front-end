import { MouseEventHandler, useEffect, useState } from 'react';
import { BaseResponse, BaseInformation } from '../interfaces';

export function CheckInfo() {
  // possibili stati
  const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA'>();
  // valore preso dalla form
  const [value, setValue] = useState<BaseInformation>({name: '', age: "", married: null, birthdate:""});
  // valore di ritorno della risposta
  const [data , setData] = useState<BaseResponse>()
  const [btnDisabled, setBtnDisabled] = useState(true);


  const handleSelect = (value : string) => {
    if(value === "married"){
        setValue(curr => {return {...curr, married: true}})
    }else if(value === "celibe"){
        setValue(curr => {return {...curr, married: false}})
    }
  }

  const checkEnableBtn = (status:BaseInformation)=>{
    if(status.name !== "" && status.age !== "" && status.birthdate !== ""){
        setBtnDisabled(false);
    }else{
        setBtnDisabled(true);
    }
  }

  useEffect(() => {
    if(status === 'SEND_DATA') {
      setStatus('SENDING_DATA');
      console.log({...value});
      /* // invio effettivo dei dati 
      fetch('http://localhost:3001/info/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: value,
        })
      })
      // controllo se risposta ok
      .then((rawResponse) => {
        if([200, 201].includes(rawResponse.status)) {
          return rawResponse.json();
        } else {
          throw new Error();
        }        
      })
      // se risposta ok mostro la risposta
      .then((response: BaseResponse) => {
        setStatus('DATA_SENDED');
        setData(response);
      })
      .catch(e => {
        setStatus('ERROR_SENDING_DATA');
      }) */
    }
  }, [status, value]);

  // errore durante l'invio
  if (status === 'ERROR_SENDING_DATA') {
    return (
      <div className='my-form'>
        <div className="header">
            <h1>Errore invio dati</h1>
        </div>
        <div className="footer">
            <Button label='Riprova' onClick={() => setStatus('INITIAL')}/>
        </div>
      </div>
    );
  }

  // momento in cui invio
  if(status === 'SEND_DATA' || status === 'SENDING_DATA') {
    return (
      <div className='my-form'>
        <div className="header">
            <h1>Invio in corso</h1>
        </div>
        <div className="footer">
            <Button label='Annulla' onClick={() => setStatus('INITIAL')}/>
        </div>
      </div>
    );
  }

  // risultato della api
  if(status === 'DATA_SENDED') {
    return (
        <div className='my-form'>
            <div className="header">
                {data?.success === true && <h1>Dati inviati validi</h1>}
                {data?.success === false && <h1>Dati inviati non validi</h1>}
            </div>
            <div className="footer">
                <Button label='Invia un altro valore' onClick={() => setStatus('INITIAL')}/>
            </div>
        </div>
    )
  }

  // stato iniziale
  return (
    <div className='my-form'>
        <div className="header">
            <h1>Informazioni</h1>
        </div>
        <div className="body">
            <ul className='my-list'>
                <li>
                    <p className='input_label'>Nome</p>
                    <input placeholder='Nome' type="text" value={value.name} onChange={(e) => {
                        setValue(curr =>{let newStatus = {...curr, name:e.target.value}; checkEnableBtn(newStatus); return newStatus;});
                        
                    }}></input>
                </li>
                <li>
                    <p className='input_label'>Et&agrave;</p>
                    <input placeholder='0' type="number" value={value.age} onChange={(e) => {
                        setValue(curr =>{let newStatus = {...curr, age:e.target.value}; checkEnableBtn(newStatus); return newStatus;});
                    }}></input>
                </li>
                <li>
                    <p className='input_label'>Stato civile</p>
                    <select name="status" className='my-select' defaultValue="" onChange={e => handleSelect(e.target.value)}>
                        <option value="" disabled>Scegli</option>
                        <option value="married" >Sposato</option>
                        <option value="celibe" >Celibe</option>
                    </select>
                </li>
                <li>
                    <p className='input_label'>Data di nascita</p>
                    <input type="date" value={value.birthdate} onChange={(e) => {
                        setValue(curr =>{ let newStatus = {...curr, birthdate:e.target.value}; checkEnableBtn(newStatus); return newStatus;});
                    }}></input>
                </li>
            </ul>
        </div>
      <div className="footer">
        <Button label='Valida' disabled={btnDisabled} onClick={() => setStatus('SEND_DATA')}/>
      </div>
    </div>
  );
}

function Button({label,disabled, onClick}:{label?:string,disabled?:boolean,onClick?:MouseEventHandler}){
    return <button className='my-btn' disabled={disabled || false} onClick={onClick}>{label}</button>
}