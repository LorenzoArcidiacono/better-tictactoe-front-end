import {
	Component,
	MouseEventHandler,
	ReactNode,
	useEffect,
	useState,
} from "react";
import { BaseResponse, BaseInformation } from "../interfaces";

export function CheckInfo() {
	const [status, setStatus] = useState< | "INITIAL" | "SEND_DATA" | "SENDING_DATA" | "DATA_SENDED" | "ERROR_SENDING_DATA" >();
	const [value, setValue] = useState<BaseInformation>({ name: "", age: null, married: null, birthdate: "", });
	const [data, setData] = useState<BaseResponse>();
	const [btnDisabled, setBtnDisabled] = useState(true);

	const handleSelect = (value: string) => {
		if (value === "married") {
			setValue((curr) => { let newStatus={...curr, married: true}; checkEnableBtn(newStatus); return newStatus; });
		} else if (value === "celibe") {
			setValue((curr) => {  let newStatus={...curr, married: false}; checkEnableBtn(newStatus); return newStatus; });
		}
	};

	const checkEnableBtn = (status: BaseInformation) => {
		if ( status.name !== "" && status.age !== null && status.birthdate !== "" ) {
      if(status.age >= 18 && status.married===null){
        setBtnDisabled(true);
      }else{
        setBtnDisabled(false);
      }
		} else {
			setBtnDisabled(true);
		}
	};

	useEffect(() => {
		if (status === "SEND_DATA") {
			setStatus("SENDING_DATA");
			fetch("http://localhost:3001/info/validate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: value.name,
					age: value.age,
					married: value.married,
					birthdate: new Date(value.birthdate),
				}),
			})
      .then((rawResponse) => {
        if ([200, 201].includes(rawResponse.status)) {
          return rawResponse.json();
        } else {
          throw new Error();
        }
      })
      .then((response: BaseResponse) => {
        setStatus("DATA_SENDED");
        setValue({ name: "", age: null, married: null, birthdate: "", });
        setBtnDisabled(true);
        setData(response);
      })
      .catch((e) => {
        setStatus("ERROR_SENDING_DATA");
      });
		}
	}, [status, value]);

	if (status === "ERROR_SENDING_DATA") {
		return (
      <Form
				header={<h1>Errore invio dati</h1>}
				footer={ <Button label="Riprova" onClick={() => setStatus("INITIAL")} /> }
			/>
		);
	}

	if (status === "SEND_DATA" || status === "SENDING_DATA") {
		return (
			<Form
				header={<h1>Invio in corso</h1>}
				footer={ <Button label="Annulla" onClick={() => setStatus("INITIAL")} /> }
			/>
		);
	}

	if (status === "DATA_SENDED") {
		return (
      <Form
				header={
          <>
            {data?.success === true && <h1>Dati inviati validi</h1>}
            {data?.success === false && ( <h1>Dati inviati non validi</h1> )}
          </>
        }
				footer={ <Button label="Invia un altro valore" onClick={() => setStatus("INITIAL")} />}
			/>
		);
	}

	return (
    <Form
				header={<h1>Informazioni</h1>}
        main={
          <ul className="my-list">
            <li>
              <p className="input_label">Nome</p>
              <input
                placeholder="Lorenzo"
                type="text"
                value={value.name}
                onChange={
                  (e) => { 
                    setValue((curr) => { 
                      let newStatus = { ...curr, name: e.target.value, };
                      checkEnableBtn(newStatus);
                      return newStatus; 
                    }); 
                  }
                }
              ></input>
            </li>
            <li>
              <p className="input_label">Et&agrave;</p>
              <input
                placeholder="0"
                type="number"
                value={value.age?.toString() || "" }
                onChange={
                  (e) => { 
                    setValue((curr) => { 
                      let newStatus = { ...curr, age: (e.target.value ? parseInt(e.target.value) : null), };
                      checkEnableBtn(newStatus); 
                      return newStatus; 
                    }); 
                  }
                }
              ></input>
            </li>
            <li>
              <p className="input_label">Stato civile</p>
              <select name="status" className="my-select" defaultValue="" onChange={(e) => handleSelect(e.target.value)} >
                <option value="" disabled> Scegli </option>
                <option value="married">Sposato</option>
                <option value="celibe">Celibe</option>
              </select>
            </li>
            <li>
              <p className="input_label">Data di nascita</p>
              <input
                type="date"
                value={value.birthdate}
                onChange={
                  (e) => {
                    setValue((curr) => { 
                      let newStatus = { ...curr, birthdate: e.target.value, };
                      checkEnableBtn(newStatus); 
                      return newStatus; 
                    }); 
                  }
                }
              ></input>
            </li>
          </ul>
        }
				footer={<Button label="Valida" disabled={btnDisabled} onClick={() => setStatus("SEND_DATA")} />}
    />
	);
}

function Form({ header, main, footer, }: { header?: ReactNode; main?: ReactNode; footer?: ReactNode; }) {
	return (
		<div className="my-form">
			{header && <header className="header">{header}</header>}
			{main && <main className="body">{main}</main>}
			{footer && <footer className="footer">{footer}</footer>}
		</div>
	);
}

function Button({ label, disabled, onClick, }: { label: string; disabled?: boolean; onClick: MouseEventHandler; }) {
	return (
		<button className="my-btn" disabled={disabled || false} onClick={onClick} > {label} </button>
	);
}
