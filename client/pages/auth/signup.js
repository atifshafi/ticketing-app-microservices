import {useState} from "react";
import axios from 'axios';

export default () => {
    // Adding 'useState' hook to track state of variables used. It returns a pair of values: the current state and a function that updates it.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);

    const onSubmit = async (event) => {
        // To make sure the form doesn't submit itself to the browser
        event.preventDefault();

        // Make a req to auth server
        try {
            const res = await axios.post(`/api/users/signup`, {
                email, password
            });

            console.log(res.data)
        } catch(err) {
            // Fix
            // setError(err.respo)
            console.log(err.res.data);
        }


    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign UP</h1>
            <div className="form-group">
                <label>email</label>
                <input type="email" className="form-control" onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <label>password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};
