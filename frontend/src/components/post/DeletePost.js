import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function DeletePost(){
const { id } = useParams();
const navigate = useNavigate();

const handleDelete = async ()=> {
    try{ 
        const token = localStorage.getItem("token");
        await axios.delete(`/api/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        navigate("/posts");
    }catch (error) {
        console.error("Error deleteing post", error);
    }

    };

        
   
    return (
        <div>
            <h1>Delete Posts</h1>
            <p>Are you sure you want to delete?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={()=> navigate("/posts")}>Cancel</button>
        </div>
    );
}

export default DeletePost;