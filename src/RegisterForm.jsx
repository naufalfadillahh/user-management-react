import React from "react";

const RegistrationForm = () => {
    return (
        <div className="form-container">
            <h2>Registration</h2>
            <form>
                <div className="form-group">
                    <input type="text" placeholder="Enter Your Name"  />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Enter Your Email"  />
                </div >
                <div className="form-group">
                    <input type="password" placeholder="Create a Password"  />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm a Password"  />
                </div>
                <div className="form-group">
                    <label className="ppp">
                        <input type="checkbox" />
                        I accept all terms and conditions
                    </label>
                </div>
                <button type="submit" className="btn">Login Now</button>
                <p>
                    Already have an account? <a href="#">Login now</a>
                </p>
            </form>
        </div>
    );
};

export default RegistrationForm;