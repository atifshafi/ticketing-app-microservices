import {useState} from "react";
import axios from 'axios';


// Note that the following hook is called from the browser
export default ({url, method, body, onSuccess}) => {
    // Adding 'useState' hook to track state of variables used. It returns a pair of values: the current state and a function that updates it.
    const [errors, setErrors] = useState(null);

    // Define a 'doRequest' function
    const doRequest = async () => {
        setErrors(null)
        // Make a req
        try {
            const response = await axios[method](url, body);
            // Invoke 'onSuccess' callback
            onSuccess(response.data);
            return response.data;
        } catch (err) {
            console.log(err.response.data.errors)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>
                        )}
                    </ul>
                </div>
            );
        }
    }

    return [doRequest, errors]
};
