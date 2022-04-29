import "./FeaturedStats.css";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { Component } from "react";
import axios from "axios";

export default class FeaturedStats extends Component {
    constructor() {
        super();
        this.state = {
            caseData: [],
            hospitalData: [],
            waterData: [],
            finishedLoading: false
        };
    }

    async componentDidMount() {
        await axios.get("/api/state")
        .then(res => {
            const data = res.data;
            this.setState({caseData: data, finishedLoading: false}, () => {
                console.log(this.state.caseData);
            });
        })
        .catch(err => {
            console.log(err.message);
        })

        await axios.get("/api/hospital")
        .then(res => {
            const data = res.data;
            this.setState({hospitalData: data, finishedLoading: false}, () => {
                console.log(this.state.hospitalData);
            });
        })
        .catch(err => {
            console.log(err.message);
        })

        await axios.get("/api/wastewater")
        .then(res => {
            const data = res.data;
            this.setState({waterData: data, finishedLoading: true}, () => {
                console.log(this.state.waterData);
            });
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    render() {
        const {caseData, hospitalData, waterData, finishedLoading} = this.state;
        if (!finishedLoading) {
            return <div >
                <h1>Loading...</h1>
            </div>
        }
        return (
            <div className="featured">
                <div className="featuredItem">
                    <span className="featuredTitle">Reported Cases</span>
                    <div className="featuredBoxContainer">
                        <span className="featuredNum">
                            {caseData[0].positive}
                        </span>
                        <span className="featuredRate">
                            {Math.floor((caseData[1].positive / caseData[0].positive - 1) * 100)}%
                            {caseData[0].positive > caseData[1].positive ? <ArrowDropUp/> : <ArrowDropDown/>}
                        </span>
                        <span className="featuredPrevious">
                            {caseData[1].positive}
                        </span>
                    </div>
                    <span className="featuredSubtitle">Updated: {caseData[0].date}</span>
                    <span className="featuredSubPrev">Previously: {caseData[1].date}</span>
                </div>

                <div className="featuredItem">
                    <span className="featuredTitle">Hospital Visits</span>
                    <div className="featuredBoxContainer">
                        <span className="featuredNum">
                            {hospitalData[0].hospitalizations}
                        </span>
                        <span className="featuredRate">
                            {Math.abs(Math.floor((hospitalData[1].hospitalizations / hospitalData[0].hospitalizations - 1) * 100))}%
                            {hospitalData[0].hospitalizations > hospitalData[1].hospitalizations ? <ArrowDropUp/> : <ArrowDropDown/>}
                        </span>
                        <span className="featuredPrevious">
                            {hospitalData[1].hospitalizations}
                        </span>
                    </div>
                    <span className="featuredSubtitle">Updated: {hospitalData[0].date}</span>
                    <span className="featuredSubPrev">Previously: {hospitalData[1].date}</span>
                </div>

                <div className="featuredItem">
                    <span className="featuredTitle">
                        COVID-19 Particles in Wastewater
                    </span>
                    <div className="featuredBoxContainer">
                        <span className="featuredNumMillion">2.1 Million</span>
                        <span className="featuredRate">
                            50% <ArrowDropUp />
                        </span>
                        {/* <span className="featuredPreviousMillion">
                            1.4 Million
                        </span> */}
                    </div>
                    <span className="featuredSubtitle">Updated: {waterData[0].date}</span>
                    {/* <span className="featuredSubPrevMillion">Previously: {waterData[1].date}</span> */}
                </div>
            </div>
        );
    }
}
