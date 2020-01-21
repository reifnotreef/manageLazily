import React, { Component } from "react";
import { AuthContext } from "../../../services/Auth";
import "./Jobs.css";
import JobItem from "./JobItem";
import LogHours from "../../LogHours/LogHours";
import dbServices from "../../../services/dbServices";
import { faHollyBerry } from "@fortawesome/free-solid-svg-icons";

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      jobs: [],
      loading: true,
      showLogHours: false
    };
  }

  static contextType = AuthContext;

  onJobsUpdate = querySnapshot => {
    const jobs = [];

    if (this.context.currentUser.role === "project worker") {
      querySnapshot.forEach(doc => {
        if (
          doc.data().project_workers.includes(this.context.currentUser.name)
        ) {
          jobs.push(doc.data());
        }
      });
    } else if (this.context.currentUser.role === "project manager") {
      querySnapshot.forEach(doc => {
        if (doc.data().project_manager === this.context.currentUser.name) {
          jobs.push(doc.data());
        }
      });
    } else {
      querySnapshot.forEach(doc => {
        jobs.push(doc.data());
      });
    }

    this.setState({
      jobs,
      loading: false
    });

    this.grabProgress();
  };

  grabProgress = () => {
    let totalHours = 0;
    let totalProgress = 0;
    this.state.jobs.map(job => {
      totalHours = parseInt(job.total_hours) + totalHours;
      totalProgress = parseInt(job.hours_completed) + totalProgress;
      return null;
    });
    this.props.getProgress(totalProgress, totalHours);
  };

  componentDidMount() {
    this.unsubscribe = dbServices
      .jobsListener(this.context.currentUser.org, this.props.projectId)
      .onSnapshot(this.onJobsUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderLogHoursForm = () => {
    this.setState({
      showLogHours: !this.state.showLogHours
    });
  };

  render() {
    const { jobs } = this.state;
    const user = this.context.currentUser;

    if (this.state.loading) {
      return <div></div>;
    } else {
      return (
        <>
          <div>
            <h2>
              {user.role === "project worker" ? (
                <button onClick={this.renderLogHoursForm}>LOG HOURS</button>
              ) : (
                <></>
              )}
            </h2>
            {this.state.showLogHours ? (
              <LogHours
                jobs={jobs}
                renderLogHoursForm={this.renderLogHoursForm}
              />
            ) : (
              <></>
            )}
          </div>
          <ul>
            {jobs.length > 0 ? (
              jobs.map(job => <JobItem job={job} key={job.id} />)
            ) : (
              <h4>There are currently no tasks to display for this project.</h4>
            )}
          </ul>
        </>
      );
    }
  }
}