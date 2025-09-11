import React from 'react';
import '../css/Form.css';
import {Link} from 'react-router-dom';
import  {useState} from 'react'
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Admin(props) {
    const[client, setClient] = useState({
        name:"",
        age:"",
        gender:""
    });

    const setAttribut = (e) => {
        const value = e.target.value;
        setClient({...client, [e.target.name]: value})

    }

    const navigate = useNavigate();

    const submitClient = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8888/addUser", client)
            .then(() =>{
                navigate("/")
            }).catch((error) =>{
            console.log(error);
        });

    }
    return (
        <div className='tout'>

        <form className="form" onSubmit={(e) => submitClient(e)} method="post">
            <p className="title">Ajout</p>

            <label>
                <input type="text"  className="input" name="name" id="name" placeholder="" required onChange={(e) => setAttribut(e)} value={client.name}/>
                <span>Name</span>
            </label>

            <label>
                <input type="text"  className="input" name="age" id="age" placeholder="" required onChange={(e) => setAttribut(e)} value={client.age}/>
                <span>Age</span>
            </label>

            <label>
                <input type="text"  className="input" name="gender" id="gender" placeholder="" required onChange={(e) => setAttribut(e)} value={client.gender}/>
                <span>Gender</span>
            </label>
           
           
           
                    
            
            <button type="submit" className="submit">Submit</button>
        </form>
        </div>

    );
}

export default Admin;