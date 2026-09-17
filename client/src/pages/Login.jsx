import {
    useState
} from "react";

import {
    Navigate,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


function Login() {

    const navigate =
        useNavigate();

    const {
        login,
        isAuthenticated
    } = useAuth();


    const [form, setForm] =
        useState({
            storeCode: "",
            username: "",
            password: ""
        });


    const [error, setError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    if (isAuthenticated) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSubmitting(true);


        try {

            await login(
                form.storeCode,
                form.username,
                form.password
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to login"
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="logo-icon">
                        A
                    </div>

                    <h1>
                        ANNIRICH
                    </h1>

                    <p>
                        Hardware POS
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    <div className="form-group">

                        <label>
                            Store Code
                        </label>

                        <input
                            type="text"
                            name="storeCode"
                            value={form.storeCode}
                            onChange={handleChange}
                            placeholder="e.g. ANNIRICH-001"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={submitting}
                    >

                        {submitting
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}


export default Login;