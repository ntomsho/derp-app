import React from 'react';
import Alert from 'react-bootstrap/Alert';

const Errors = (props) => {

    if (props.errors.length > 0) {
        return (
            <>
                {props.errors.map((error, i) => {
                    return (
                        <Alert key={i} variant="danger">
                            -{error}
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