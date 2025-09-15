import React from 'react';
import '../css/Form.css';
import {Link} from 'react-router-dom';
import  {useState} from 'react'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useEffect } from 'react';
 
function Admin(props) {
    const[client, setClient] = useState({
        name:"",
        age:"",
        gender:""
    });

    const [deleteId, setDeleteId] = useState("");

 
    const setAttribut = (e) => {
        const value = e.target.value;
        setClient({...client, [e.target.name]: value})
 
    }
 
    const navigate = useNavigate();
 
    const submitClient = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8888/people/addUser", client)
            .then(() =>{
                navigate("/")
            }).catch((error) =>{
            console.log(error);
        });
 
    }
    
 
    

    //const supprimerClient = async (id) => {
    //    try {
    //        await axios.delete(`http://localhost:8888/people/user/${id}`);
    //        await loadAllQuestions();
    //    } catch (error) {
    //        console.error("Erreur :", error);
    //    }
    //};

    const supprimerClient = async (e) => {
        e.preventDefault();        
        if (!deleteId) return;       
        try {
            await axios.delete(`http://localhost:8888/people/user/${deleteId}`);
            setDeleteId("");          
        } catch (error) {
            console.error("Erreur :", error);
        }
        };
        
 
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

         <form className="form" onSubmit={supprimerClient}>
                <p className="title">Suppression</p>

                <label>
                    <input
                        type="number"
                        className="input"
                        placeholder="ID du client"
                        required
                        onChange={(e) => setDeleteId(e.target.value)}
                        value={deleteId}
                    />
                   
                </label>

                <button type="submit" className="submit">Supprimer</button>
            </form>
 
     
       
        </div>
       
 
       
 
    );
}
 
export default Admin;