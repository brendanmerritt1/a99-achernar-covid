import "./FeaturedStats.css";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { Component } from "react";
import axios from "axios";

const DataFormatter = (number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toFixed(2).toString() + "B";
  } else if (number > 1000000) {
    return (number / 1000000).toFixed(2).toString() + "M";
  } else {
    return number.toString();
  }
};

export default class FeaturedStats extends Component {
  constructor() {
    super();
    this.state = {
      caseData: [],
      hospitalData: [],
      waterData: [],
      finishedLoading: false,
    };
  }

  async componentDidMount() {
    await axios
      .get("secret-ridge-44451.herokuapp.com/api/state")
      .then((res) => {
        const data = res.data;
        this.setState({ caseData: data, finishedLoading: false }, () => {
          console.log(this.state.caseData);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    await axios
      .get("secret-ridge-44451.herokuapp.com/api/hospital")
      .then((res) => {
        const data = res.data;
        this.setState({ hospitalData: data, finishedLoading: false }, () => {
          console.log(this.state.hospitalData);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    await axios
      .get("https://secret-ridge-44451.herokuapp.com/api/wastewater-total")
      .then((res) => {
        const data = res.data;
        this.setState({ waterData: data, finishedLoading: true }, () => {
          console.log(this.state.waterData);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  render() {
    const { caseData, hospitalData, waterData, finishedLoading } = this.state;
    if (!finishedLoading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
    return (
      <div className="featured">
        <div className="featuredItem">
          <span className="featuredTitle">Reported Cases</span>
          <div className="featuredBoxContainer">
            <span className="featuredNum">{caseData[0].positive}</span>
            <span className="featuredRate">
              {Math.floor(
                (caseData[1].positive / caseData[0].positive - 1) * 100
              )}
              %
              {caseData[0].positive > caseData[1].positive ? (
                <ArrowDropUp />
              ) : (
                <ArrowDropDown />
              )}
            </span>
            <span className="featuredPrevious">{caseData[1].positive}</span>
          </div>
          <span className="featuredSubtitle">Updated: {caseData[0].date}</span>
          <span className="featuredSubPrev">
            Previously: {caseData[1].date}
          </span>
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">Hospital Visits</span>
          <div className="featuredBoxContainer">
            <span className="featuredNum">
              {hospitalData[0].hospitalizations}
            </span>
            <span className="featuredRate">
              {Math.abs(
                Math.floor(
                  (hospitalData[1].hospitalizations /
                    hospitalData[0].hospitalizations -
                    1) *
                    100
                )
              )}
              %
              {hospitalData[0].hospitalizations >
              hospitalData[1].hospitalizations ? (
                <ArrowDropUp />
              ) : (
                <ArrowDropDown />
              )}
            </span>
            <span className="featuredPrevious">
              {hospitalData[1].hospitalizations}
            </span>
          </div>
          <span className="featuredSubtitle">
            Updated: {hospitalData[0].date}
          </span>
          <span className="featuredSubPrev">
            Previously: {hospitalData[1].date}
          </span>
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">
            COVID-19 Particles in Wastewater
          </span>
          <div className="featuredBoxContainer">
            <span className="featuredNumMillion">
              {
                //hard coded for now, need to fetch last object entry of json somehow
                DataFormatter(waterData[359].average)
              }
            </span>
            <span className="featuredRate">
              50% <ArrowDropUp />
            </span>
            <span className="featuredPreviousMillion">
              {DataFormatter(waterData[358].average)}
            </span>
          </div>
          <span className="featuredSubtitle">
            Updated: {waterData[359].date}
          </span>
          <span className="featuredSubPrev">
            Previously: {waterData[358].date}
          </span>
        </div>
      </div>
    );
  }
}
