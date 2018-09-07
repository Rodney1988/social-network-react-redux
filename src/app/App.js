import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "../axios";
import Profile from "./Profile";
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = { bioInputFieldCheck: false };
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
        this.submit = this.submit.bind(this);
        this.exitModal = this.exitModal.bind(this);
        this.toggleBioInputField = this.toggleBioInputField.bind(this);
        this.postBio = this.postBio.bind(this);
    }

    async componentDidMount() {
        const { data } = await axios.get("/user-data");
        this.setState(data);

        //close modal on Esc key
        window.addEventListener("keydown", e => {
            if (e.keyCode == 27) {
                this.setState({ modalVisible: false });
            }
        });
    }

    makeUploaderVisible() {
        this.setState({ modalVisible: true });
    }

    exitModal() {
        this.setState({ modalVisible: false });
    }

    handleModalClick(e) {
        e.stopPropagation();
    }
    //////////////////////////////////
    toggleBioInputField() {
        this.setState({ bioInputFieldCheck: !this.state.bioInputFieldCheck });
    }

    async postBio(e) {
        if (e.keyCode == 13) {
            let bioObject = { user_bio: e.target.value };
            const { data } = await axios.post("/post-bio", bioObject);
            console.log("AXIOS POSTBIO RESPONSE (destructured as data):", data);
            this.setState(data);
        }
    }

    /////////////////////////////////
    updateAvatarInstantly(argument) {
        this.setState({ modalVisible: false });
        this.setState(argument);
    }

    submit(e) {
        const file = e.target.files[0];
        console.log("FILE variable:", file);
        const fd = new FormData();
        fd.append("file", file);

        axios.post("/avatar-uploads", fd).then(res => {
            console.log("RESPONSE IN POST/UPLOAD IMAGE ajax", res.data.avatar);
            this.updateAvatarInstantly(res.data);
        });
    }

    render() {
        if (!this.state.firstname) {
            return (
                <div className="errorTemplate">
                    <img src="./loading.gif" />
                </div>
            );
        }
        return (
            <BrowserRouter>
                <div className="appContainer">
                    <header>
                        <nav>
                            <img
                                id="logo"
                                src="./sesame_logo_white.png"
                                alt="sesame logo"
                            />
                            <div className="headerLinks">
                                <a href="/sign-out">Sign Out</a>
                            </div>
                        </nav>
                    </header>
                    <section>
                        <div className="centerHolder">
                            <Route
                                path="/"
                                render={() => (
                                    <Profile
                                        rootState={this.state}
                                        clickHandler={this.makeUploaderVisible}
                                        toggleBioInputField={
                                            this.toggleBioInputField
                                        }
                                        postBio={this.postBio}
                                    />
                                )}
                            />

                            {this.state.modalVisible && (
                                <Uploader
                                    handleModalClick={this.handleModalClick}
                                    submit={this.submit}
                                    exitModal={this.exitModal}
                                />
                            )}
                        </div>
                    </section>
                    <footer>
                        <div className="footerCenterHolder">
                            <img
                                id="logo"
                                src="./sesame_logo.png"
                                alt="sesame logo"
                            />
                            <p>SpicedBook &copy;</p>
                        </div>
                    </footer>
                </div>
            </BrowserRouter>
        );
    }
}