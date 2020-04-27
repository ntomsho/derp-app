import React, {useState, useEffect} from 'react';
import Alert from 'react-bootstrap/Alert';

const Errors = (props) => {

    const [errorsList, setErrorsList] = useState(props.errors);

    useEffect(() => {
        setErrorsList(props.errors);
    }, [props.errors])

    const clearError = (ind) => {
        let newErrors = Object.assign([], errorsList);
        newErrors.splice(ind, 1);
        setErrorsList(newErrors);
    }

    if (errorsList.length > 0) {
        return (
            <>
                {errorsList.map((error, i) => {
                    return (
                        <Alert dismissible key={i} variant="danger" onClose={() => clearError(i)}>
                            {error}
                        </Alert>
                    )
                })}
            </>
        )
    } else {
        return null;
    }

}

export default Errors;