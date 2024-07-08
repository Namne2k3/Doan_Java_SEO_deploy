import React from 'react'
import "./Success.css"
const Success = () => {
    return (
        <div className="body">
            <div className="card">
                <div className='card-sub'>
                    <i className="checkmark">✓</i>
                </div>
                <h1>Success</h1>
                <p>We received your purchase request;<br /> we'll be in touch shortly!</p>
            </div>
        </div>
    )
}

export default Success