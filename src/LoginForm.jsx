import React from "react";

const LoginForm = () => {
    return (
        <div className="form-container">
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <input type="email" placeholder="Enter your email"/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm your passw=ord"/>
                </div>
                <div className="form-group">
                    <label>
                        <input type="checkbox"/>
                        Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot Password</a>
                </div>
                <button type="submit" className="btn">Login Now</button>
                <p>
                    Don't have an account? <a href="#" className="signup">Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;