import React, { Component } from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import "./ProjectView.css";
import Loading from "../../Loading/Loading";
import { AuthContext } from "../../../services/Auth.js";
import Jobs from "../Jobs/Jobs";
import Statistics from "../../Statistics/Statistics";
import Sidebar from "../../Sidebar/Sidebar";
import JobForm from "../JobForm/JobForm";
import dbServices from "../../../services/dbServices";
import dateConversions from "../../../services/dateConversions";
import { CatchAll } from "../../CatchAll/CatchAll";

export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      project: null,
      showJobForm: false,
      loading: true,
      toggleState: false,
      progress: 0,
      total: 0
    };
  }

  static contextType = AuthContext;

  updateProject = data => {
    this.setState({
      project: data,
      loading: false
    });
  };

  getProgress = (jobProg, jobTotal, job) => {
    let currentProgress = 0;
    let currentTotal = 0;
    let newProject = this.state.project;

    currentProgress = currentProgress + jobProg;
    currentTotal = currentTotal + jobTotal;
    if (currentProgress === 0) {
      this.setState({
        progress: 0
      });
    } else {
      this.setState({
        progress: parseInt(currentProgress),
        total: currentTotal
      });

      newProject.progress = parseInt(
        ((currentProgress / currentTotal) * 100).toFixed(2)
      );
      dbServices.updateProject(newProject);
      this.setState({
        project: newProject
      });
    }
  };

  async componentDidMount() {
    this.unsubscribe = dbServices
      .projectsListener(this.context.currentUser.org, this.props.id)
      .onSnapshot(
        doc => {
          this.updateProject(doc.data());
        },
        error => console.error(error)
      );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  showJobForm = () => {
    this.setState({
      showJobForm: !this.state.showJobForm
    });
  };

  render() {
    const { project, showJobForm } = this.state;
    const user = this.context.currentUser;

    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <>
          <div>
            <header id="company_header">
              <h2 id="companyName">{this.context.currentUser.org}</h2>
              <span id="currentDate">{new Date().toDateString()}</span>
            </header>
            <header id="project_header">
              <div id="name_manager">
                <h3 id="projectName">{project.name}</h3>
                <h4 id="projectManager">Manager: {project.project_manager}</h4>
              </div>
              <div id="project_description">
                <span>{project.description}</span>
              </div>
              <div id="project_progress">
                <span>Est. Progress</span>
                <ProgressBar
                  percentage={parseInt(this.state.project.progress)}
                />
              </div>
              <div id="project_deadline">
                <span>
                  Deadline: {dateConversions.TStoDisplayDate(project.deadline)}
                </span>
              </div>
            </header>
          </div>
          <div id="projectView_main">
            <div id="jobs_stats_container">
              {user.role === "project worker" ? <></> : <Statistics />}
              <div id="jobs_container">
                {user.role === "project worker" ? (
                  <h3>Your Tasks</h3>
                ) : (
                  <h3>Tasks</h3>
                )}
                {user.role === "project worker" ? (
                  ""
                ) : (
                  <button onClick={this.showJobForm}>Add Task</button>
                )}
              </div>
              {showJobForm ? (
                <JobForm
                  {...this.props}
                  setJob={this.setJob}
                  project={project}
                  showJobForm={this.showJobForm}
                  projectId={this.props.id}
                />
              ) : (
                ""
              )}
              <Jobs projectId={this.props.id} getProgress={this.getProgress} />
            </div>
            <div id="sidebar_container">
              <Sidebar view="project" project={this.state.project} />
              <h1>Sidebar</h1>
            </div>
          </div>
        </>
      );
    }
  }
}