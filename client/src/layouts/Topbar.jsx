import {

    FiBell,

    FiSearch,

    FiUser

} from "react-icons/fi";

function Topbar() {

    return (

        <header className="topbar">

            <div className="search">

                <FiSearch />

                <input

                    type="text"

                    placeholder="Search anything..."

                />

            </div>

            <div className="topbar-right">

                <button className="notification">

                    <FiBell />

                </button>

                <div className="profile">

                    <div className="avatar">

                        <FiUser />

                    </div>

                    <div>

                        <strong>

                            Emmanuel

                        </strong>

                        <small>

                            Administrator

                        </small>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Topbar;